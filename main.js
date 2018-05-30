document.body.style['background-color']='black'
var c = document.createElement('canvas');
c.width = 100;
c.height = 100;
// document.body.appendChild(c);
var ctx=c.getContext("2d");

var grd=ctx.createRadialGradient(c.width/2,c.width/2,10,c.width/2,c.width/2,40);
grd.addColorStop(0,"white");
grd.addColorStop(1, "rgba(255,255,255,0)");

// Fill with gradient
ctx.fillStyle=grd;
ctx.fillRect(0,0,c.width,c.width);


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
});

var baseQueryString = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"
var startTime = "&starttime=1990-01-01"
var endTime = "&endtime=2116-12-31"
var minMagnitudeString = "&minmagnitude=8.0"
var productType = "&producttype=moment-tensor"
var qString = baseQueryString + startTime + endTime + minMagnitudeString

$.getJSON(qString, function(data){
    data.features.forEach(function(feature, index){
        let date = new Date(feature.properties.time);
        let dateBlanco = new Date(date.getTime());
        dateBlanco.setMonth(dateBlanco.getMonth()+1);

        let dateEnd = new Date(date.getTime());
        dateEnd.setMonth(dateEnd.getMonth()+10);
        let coordinates = feature.geometry.coordinates;


        viewer.entities.add({
            show:true,
            position: Cesium.Cartesian3.fromDegrees( coordinates[0], coordinates[1] , 150000),
            ellipse : {
                semiMinorAxis : 300000.0,
                semiMajorAxis : 300000.0,
                height: 200000.0,
                material : Cesium.Color.GREEN,
                outline : true // height must be set for outline to display
            }
        });
            
        // let point = {
        //     "id": "point"+index,
        //     "availability": date.toISOString()+"/"+dateEnd.toISOString(),
        //     "position": {
        //         "cartographicDegrees": [
        //             date.toISOString(), coordinates[0], coordinates[1] , 150000,
        //             "2019-08-04T16:00:40Z", coordinates[0], coordinates[1], 150000
        //         ]
        //     },
        //     "point": {
        //         "color": {
        //             "rgba": [ date.toISOString(), 255, 255, 255, 255,
        //                 dateBlanco.toISOString(), 128, 128, 0, 255,
        //                 "2019-08-04T16:00:40Z", 128, 128, 0, 255]
        //         },
        //         "outlineColor": {
        //             "rgba": [255, 255, 255, 255]
        //         },
        //         "outlineWidth": 1,
        //         "pixelSize": 10
        //     }
        // }

        // czml.push(point);
    });

    viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));
});

