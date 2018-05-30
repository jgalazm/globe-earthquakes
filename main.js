document.body.style['background-color']='black'
var c = document.createElement('canvas');
c.width = 100;
c.height = 100;
document.body.appendChild(c);
var ctx=c.getContext("2d");

var grd=ctx.createRadialGradient(
    c.width/2,
    c.width/2,
    0.10*c.width,
    c.width/2,
    c.width/2,
    0.4*c.width);
grd.addColorStop(0,"white");
grd.addColorStop(1, "rgba(255,255,255,0)");

// Fill with gradient
ctx.fillStyle=grd;
ctx.fillRect(0,0,c.width,c.width);



var c2 = document.createElement('canvas');
c2.width = 100;
c2.height = 100;
var ctx2=c2.getContext("2d");
ctx2.beginPath();
ctx2.arc(50,50,40,0,2*Math.PI);
ctx2.lineWidth = 5;
ctx2.strokeStyle = '#ffffff';
ctx2.stroke();
ctx2.fillStyle = 'green';
ctx2.fill();
document.body.appendChild(c2);

// var czml = [
//     {
//         "id": "document",
//         "name": "CZML Point - Time Dynamic",
//         "version": "1.0"
//     }
// ];


var viewer = new Cesium.Viewer('cesiumContainer', {
    shouldAnimate: true,
    imageryProvider: new Cesium.createTileMapServiceImageryProvider({
        url: '/node_modules/cesium/Build/Cesium/Assets/Textures/NaturalEarthII'
    }),
});

// var baseQueryString = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"
// var startTime = "&starttime=1990-01-01"
// var endTime = "&endtime=2116-12-31"
// var minMagnitudeString = "&minmagnitude=8.0"
// var productType = "&producttype=moment-tensor"
// var qString = baseQueryString + startTime + endTime + minMagnitudeString

// // $.getJSON(qString, function(data){
// //     data.features.forEach(function(feature, index){
// //         let date = new Date(feature.properties.time);
// //         let dateBlanco = new Date(date.getTime());
// //         dateBlanco.setMonth(dateBlanco.getMonth()+1);

// //         let dateEnd = new Date(date.getTime());
// //         dateEnd.setMonth(dateEnd.getMonth()+10);
// //         let coordinates = feature.geometry.coordinates;


// //         viewer.entities.add({
// //             // availability: date.toISOString()+"/"+dateEnd.toISOString(),
// //             show:true,
// //             position: Cesium.Cartesian3.fromDegrees( coordinates[0], coordinates[1] , 150000),
// //             ellipse : {
// //                 semiMinorAxis : 300000.0,
// //                 semiMajorAxis : 300000.0,
// //                 // height: 200000.0,
// //                 material : new Cesium.Material({
// //                     fabric : {
// //                       type : 'Image',
// //                       uniforms : {
// //                         image : canvas.toDataURL();
// //                       }
// //                     }
// //                   }),
// //                 // outline : false // height must be set for outline to display
// //             }
// //         });
            
// //         // let point = {
// //         //     "id": "point"+index,
// //         //     "availability": date.toISOString()+"/"+dateEnd.toISOString(),
// //         //     "position": {
// //         //         "cartographicDegrees": [
// //         //             date.toISOString(), coordinates[0], coordinates[1] , 150000,
// //         //             "2019-08-04T16:00:40Z", coordinates[0], coordinates[1], 150000
// //         //         ]
// //         //     },
// //         //     "point": {
// //         //         "color": {
// //         //             "rgba": [ date.toISOString(), 255, 255, 255, 255,
// //         //                 dateBlanco.toISOString(), 128, 128, 0, 255,
// //         //                 "2019-08-04T16:00:40Z", 128, 128, 0, 255]
// //         //         },
// //         //         "outlineColor": {
// //         //             "rgba": [255, 255, 255, 255]
// //         //         },
// //         //         "outlineWidth": 1,
// //         //         "pixelSize": 10
// //         //     }
// //         // }

// //         // czml.push(point);
// //     });

// //     // viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));
// // });

let dateStart;
let date = new Date();
let dateEnd = new Date();
dateEnd.setMonth(dateEnd.getMonth()+1);
viewer.clock.stopTime = Cesium.JulianDate.fromDate(dateEnd);
viewer.clock.startTime = Cesium.JulianDate.fromDate(date);


var greenCircle = viewer.entities.add({
    availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
        start : Cesium.JulianDate.fromDate(date),
        stop : Cesium.JulianDate.fromDate(dateEnd)
    })]),
    position: Cesium.Cartesian3.fromDegrees(-111.0+20, 40.0, 150000.0),
    name : 'Green circle at height with outline',
    ellipse : {
        semiMinorAxis : new Cesium.CallbackProperty(
            function (time, result){
                if(dateStart == undefined){
                    dateStart = new Date(time);
                }
                let ellapsed = new Date(time) - dateStart;

                if (ellapsed > 500){
                    return 300000.0;
                }
                return 600000.0
            }
        ),
        semiMajorAxis : new Cesium.CallbackProperty(
            function (time, result){
                if(dateStart == undefined){
                    dateStart = new Date(time);
                }
                let ellapsed = new Date(time) - dateStart;

                if (ellapsed >500){
                    return 300000.0;
                }
                return 600000.0
            }
        ),
        material:new Cesium.ImageMaterialProperty({
            image : new Cesium.CallbackProperty(
                function (time, result){
                    let ellapsed = new Date(time) - dateStart;

                    if (ellapsed >500){
                        return c2;
                    }
                    return c;
                }
            ),
            transparent: true
        }),
        asynchronous: true
    }
});