document.body.style['background-color']='black'
// var c = document.createElement('canvas');
// c.width = 100;
// c.height = 100;
// // document.body.appendChild(c);
// var ctx=c.getContext("2d");

// var grd=ctx.createRadialGradient(c.width/2,c.width/2,10,c.width/2,c.width/2,40);
// grd.addColorStop(0,"white");
// grd.addColorStop(1, "rgba(255,255,255,0)");

// // Fill with gradient
// ctx.fillStyle=grd;
// ctx.fillRect(0,0,c.width,c.width);


var czml = [
    {
        "id": "document",
        "name": "CZML Point - Time Dynamic",
        "version": "1.0"
    }
];


var viewer = new Cesium.Viewer('cesiumContainer', {
    shouldAnimate: true,
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
    navigationInstructionsInitiallyVisible: false,
    skyBox: false,
    preserveDrawingBuffer:true
});
viewer.camera.rotateUp(0.5);
viewer.camera.zoomIn(8.5e6);

var layers = viewer.scene.imageryLayers;
layers.addImageryProvider(new Cesium.SingleTileImageryProvider({
    url : 'imagen.png',
    rectangle : Cesium.Rectangle.fromDegrees(-180.0, -90, 180, 90)
}));
// cameraPos = viewer.camera.positionCartographic;


rmax = 15;
Mwmax = 7;
var magnitudeToRadius = function(Mw){
    /* Returns the "relative" radius of a sphere
     such that its volume equals M0 and
     r=1 implies Mw = Mwmax*/
    var M0 =  Math.pow(10.0, 1.5*(Mw-Mwmax));
    return Math.pow(M0,1/3.)*rmax;
};

let mwToAxisSize = (mw)=>{
    return magnitudeToRadius(mw)*10000*0.5;
}

let addCircle = (pos, mw, lw)=>{
    var circle = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(pos[0],pos[1], 150000.0),
        name : 'Green circle at height with outline',
        ellipse : {
            semiMinorAxis : mwToAxisSize(mw),
            semiMajorAxis : mwToAxisSize(mw),
            height: 200000.0,
            material : new Cesium.Color(1.0, 1.0, 0.0, 0.0),
            outline : true, // height must be set for outline to display,
            outlineWidth: 1
        }
    });
}

// addCircle([-135, -4.8],5,1);
addCircle([-135, 0],6,1);
addCircle([-135, 0.3],7,2);
addCircle([-135, 1.76],8,2);
addCircle([-135, 6.2],9,2);

// layers.addImageryProvider(new Cesium.SingleTileImageryProvider({
//     url : '../images/Cesium_Logo_overlay.png',
//     rectangle : Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75)
// }));

// $.getJSON('output.json', function(data){
//     data.features.forEach(function(feature, index){
//         // if(index > 500){
//         //     return;
//         // }
//         let date = new Date(feature.time);
//         console.log(date);
//         let dateBlanco = new Date(date.getTime());
//         dateBlanco.setMonth(dateBlanco.getMonth()+10);

//         let dateEnd = new Date(date.getTime());
//         dateEnd.setMonth(dateEnd.getMonth()+35);
//         let coordinates = feature.coordinates;


//         let point = {
//             "id": "point"+index,
//             "availability": date.toISOString()+"/2019-08-04T16:00:40Z",
//             "position": {
//                 "cartographicDegrees": [
//                     date.toISOString(), coordinates[0], coordinates[1] , 150000+index,
//                     "2019-08-04T16:00:40Z", coordinates[0], coordinates[1], 150000+index
//                 ]
//             },
//             "ellipse": {
//                 "material": {
//                     "solidColor": {
//                         "color": {
//                          "rgba": [ date.toISOString(), 255, 255, 255, 255,
//                             dateBlanco.toISOString(), 164, 125, 64, 255,
//                             "2019-08-04T16:00:40Z", 128, 128, 0, 255]   
//                         }
//                     }
//                 },
//                 height: 2000.0,
//                 outline:true,
//                 "outlineColor": {
//                     "rgba" : [255, 255, 255, 255]
//                 },
//                 "outlineWidth": 2,
//                 semiMinorAxis :  mwToAxisSize(feature.mag),
                        
//                 semiMajorAxis : mwToAxisSize(feature.mag),
//             }
//         }

//         czml.push(point);
//     });

//     viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));
// });

// let dl = document.getElementById('dl');
let dl = document.createElement('a');
function dlCanvas() {
    var dt = viewer.canvas.toDataURL('image/png');
    this.href = dt;
};
dl.addEventListener('click', dlCanvas, false);

let i = 0;
viewer.clock.onTick.addEventListener(() => {
    i += 1;
    viewer.camera.rotateRight(-0.01/3);
    viewer.scene.postRender.addEventListener(takeScreenshot);
    // console.log(Cesium.JulianDate.toIso8601(viewer.clock.currentTime))
});

viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2000-01-01T00:00:01.0Z")


// solucion posible: https://groups.google.com/forum/#!topic/cesium-dev/FdQk03zgOMI
// // configure settings
var targetResolutionScale = 3.0; // for screenshots with higher resolution set to 2.0 or even 3.0r
var timeout = 3000; // in ms

viewer.resolutionScale = 2.0;
var scene = viewer.scene;
if (!scene) {
    console.error("No scene");
}

// scene.postRender.addEventListener(takeScreenshot);
var takeScreenshot = function(thisscene, time){ 
    // if (i%2 > 0 ) return;
    let filename = 'v'+(i+'').padStart(5,'0');
    thisscene.postRender.removeEventListener(takeScreenshot);
    // scene.preRender.addEventListener(prepareScreenshot);
    var canvas = thisscene.canvas;
    // canvas.toBlob(function(blob){
    //     var url = URL.createObjectURL(blob);

    //     // downloadURI(url, "./video/f"+ filename+  Cesium.JulianDate.toIso8601(time)+"_"+filename+".png");
    //     // reset resolutionScale
    // }); 
}


// ffmpeg -framerate 1/5 -i *%05d.png -c:v libx264 -r 30 -pix_fmt yuv420p out.mp4

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    // mimic click on "download button"
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}
// - mostrar texto citado -
 
