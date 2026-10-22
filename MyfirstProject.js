
/*
 LABORATORIO AMBIENTAL
 Ejemplo: comparar la vegetación en dos períodos.
 Área de demostración: sector de Posadas, Misiones.
*/

// 1. Delimitar el área de estudio.
// Luego pueden reemplazar estas coordenadas por las de su lugar.
var area = ee.Geometry.Rectangle([-56.05, -27.48, -55.85, -27.30]);

Map.centerObject(area, 12);
Map.addLayer(area, {color: 'yellow'}, 'Área de estudio');

// 2. Definir una función para obtener imágenes
// de Sentinel-2 y calcular el NDVI.
function obtenerNDVI(inicio, fin) {
  var coleccion = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(area)
    .filterDate(inicio, fin)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 40));

  print('Cantidad de imágenes: ' + inicio, coleccion.size());

  var imagen = coleccion.median();

  return imagen.normalizedDifference(['B8', 'B4'])
    .rename('NDVI')
    .clip(area);
}

// 3. Comparar dos períodos.
// Las fechas deben corresponder a la misma estación del año.
var ndviA = obtenerNDVI('2020-01-01', '2020-04-01');
var ndviB = obtenerNDVI('2025-01-01', '2025-04-01');

// 4. Visualizar ambos resultados.
var visualizacion = {
  min: -0.2,
  max: 0.8,
  palette: ['brown', 'beige', 'yellow', 'green', 'darkgreen']
};

Map.addLayer(ndviA, visualizacion, 'NDVI 2020');
Map.addLayer(ndviB, visualizacion, 'NDVI 2025');

// 5. Calcular la diferencia entre los períodos.
var diferencia = ndviB.subtract(ndviA);

Map.addLayer(
  diferencia,
  {min: -0.4, max: 0.4,
   palette: ['red', 'white', 'blue']},
  'Diferencia NDVI 2025 - 2020'
);
