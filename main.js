var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: new Cesium.createTileMapServiceImageryProvider({
        url: '/node_modules/cesium/Build/Cesium/Assets/Textures/NaturalEarthII'
    }),
    baseLayerPicker: false,
    animation: false,
    fullscreenButton: false,
    scene3DOnly: true,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    shadows: false,
    skyAtmosphere: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false
});


let czmlsource = Cesium.CzmlDataSource.load('example.czml')
let data;
czmlsource.then(function(dataSource){
    data = dataSource;
    viewer.dataSources.add(dataSource);
});