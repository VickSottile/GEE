
/*
 LABORATORIO AMBIENTAL
 Área de estudio dibujada por el grupo
 Cálculo de superficie y comparación de NDVI
*/

/*
Pasos para que funcione:
  1. Ubicá la zona que quieren investigar.
  2. Seleccioná la herramienta de dibujo de polígono, en la parte superior del mapa.
  3. Marcá los vértices del área y hacé doble clic para terminar.
  4. En la sección Imports, verificá que la geometría se llame geometry. Si tiene otro nombre, después reemplazá ese nombre en el código.

*/

// 1. Utilizar el polígono dibujado en el mapa.
// En Imports, la geometría debe llamarse "geometry".
var area = geometry;

// Mostrar y centrar el área de estudio.
Map.centerObject(area, 13);
Map.addLayer(area, {color: 'yellow'}, 'Área de estudio');

// 2. Calcular la superficie del polígono.
var superficieM2 = area.area(1);
var superficieHa = superficieM2.divide(10000);
var superficieKm2 = superficieM2.divide(1000000);

print('Superficie en metros cuadrados:', superficieM2);
print('Superficie en hectáreas:', superficieHa);
print('Superficie en kilómetros cuadrados:', superficieKm2);

// 3. Obtener imágenes y calcular NDVI.
function obtenerNDVI(inicio, fin) {
  var coleccion = ee.ImageCollection(
      'COPERNICUS/S2_SR_HARMONIZED'
    )
    .filterBounds(area)
    .filterDate(inicio, fin)
    .filter(
      ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 40)
    );

  print('Cantidad de imágenes ' + inicio, coleccion.size());

  var imagen = coleccion.median();

  return imagen.normalizedDifference(['B8', 'B4'])
    .rename('NDVI')
    .clip(area);
}

// 4. Comparar períodos equivalentes.
var ndviA = obtenerNDVI('2020-01-01', '2020-04-01');
var ndviB = obtenerNDVI('2025-01-01', '2025-04-01');

// 5. Mostrar los resultados.
var visualizacion = {
  min: -0.2,
  max: 0.8,
  palette: ['brown', 'beige', 'yellow', 'green', 'darkgreen']
};

Map.addLayer(ndviA, visualizacion, 'NDVI 2020');
Map.addLayer(ndviB, visualizacion, 'NDVI 2025');

var diferencia = ndviB.subtract(ndviA);

Map.addLayer(
  diferencia,
  {
    min: -0.4,
    max: 0.4,
    palette: ['red', 'white', 'blue']
  },
  'Diferencia NDVI 2025 - 2020'
);
