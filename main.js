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
    skyBox: false
});

    

var baseQueryString = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"
var startTime = "&starttime=1990-01-01"
var endTime = "&endtime=2116-12-31"
var minMagnitudeString = "&minmagnitude=6.0"
var productType = "&producttype=moment-tensor"
var qString = baseQueryString + startTime + endTime + minMagnitudeString

rmax = 15;
Mwmax = 7;
var magnitudeToRadius = function(Mw){
    /* Returns the "relative" radius of a sphere
     such that its volume equals M0 and
     r=1 implies Mw = Mwmax*/
    var M0 =  Math.pow(10.0, 1.5*(Mw-Mwmax));
    return Math.pow(M0,1/3.)*rmax;
  };
  


$.getJSON(qString, function(data){
    data.features.forEach(function(feature, index){
        let date = new Date(feature.properties.time);
        let dateBlanco = new Date(date.getTime());
        dateBlanco.setMonth(dateBlanco.getMonth()+1);

        let dateEnd = new Date(date.getTime());
        dateEnd.setMonth(dateEnd.getMonth()+15);
        let coordinates = feature.geometry.coordinates;


        // viewer.entities.add({
        //     show:true,
        //     position: Cesium.Cartesian3.fromDegrees( coordinates[0], coordinates[1] , 150000),
        //     ellipse : {
        //         semiMinorAxis : 300000.0,
        //         semiMajorAxis : 300000.0,
        //         height: 200000.0,
        //         material : Cesium.Color.GREEN,
        //         outline : true // height must be set for outline to display
        //     }
        // });
            
        let point = {
            "id": "point"+index,
            "availability": date.toISOString()+"/"+dateEnd.toISOString(),
            "position": {
                "cartographicDegrees": [
                    date.toISOString(), coordinates[0], coordinates[1] , 150000,
                    "2019-08-04T16:00:40Z", coordinates[0], coordinates[1], 150000
                ]
            },
            "ellipse": {
                "material": {
                    "solidColor": {
                        "color": {
                         "rgba": [ date.toISOString(), 255, 255, 255, 255,
                            dateBlanco.toISOString(), 164, 125, 64, 255,
                            "2019-08-04T16:00:40Z", 128, 128, 0, 255]   
                        }
                    }
                },
                height: 2000.0,
                outline:true,
                "outlineColor": {
                    "rgba" : [255, 255, 255, 255]
                },
                "outlineWidth": 100,
                semiMinorAxis : magnitudeToRadius(feature.properties.mag)*10000,
                semiMajorAxis : magnitudeToRadius(feature.properties.mag)*10000,
            }
        }

        czml.push(point);
    });

    viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));
});

// let dl = document.getElementById('dl');
let dl = document.createElement('a');
function dlCanvas() {
    var dt = viewer.canvas.toDataURL('image/png');
    this.href = dt;
};
dl.addEventListener('click', dlCanvas, false);


viewer.clock.onTick.addEventListener(() => {
    viewer.camera.rotateRight(-0.01);

    // let canvas = document.getElementById('')
    var dt = viewer.canvas.toDataURL('image/png');
    dl.href = dt;
    dl.download='canvas';
    dl.click();
});