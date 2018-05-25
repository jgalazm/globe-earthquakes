var czml = [
    {
        "id": "document",
        "name": "CZML Point - Time Dynamic",
        "version": "1.0"
    },
    {
        "id": "point",
        "availability": "2012-08-04T16:00:00Z/2012-08-04T16:05:00Z",
        "position": {
            "cartographicDegrees": [
                "2012-08-04T16:00:00Z", -70, 20, 150000,
                "2012-08-04T16:00:40Z", -70, 20, 150000
            ]
        },
        "point": {
            "color": {
                "rgba": ["2012-08-04T16:00:00Z", 255, 255, 255, 128,
                "2012-08-04T16:00:20Z", 255, 0, 0, 255,
                "2013-08-04T16:00:20Z", 255, 0, 0, 255]
            },
            "outlineColor": {
                "rgba": [255, 0, 0, 128]
            },
            "outlineWidth": 3,
            "pixelSize": 15
        }
    }
];


var viewer = new Cesium.Viewer('cesiumContainer', {
    shouldAnimate: true
});

var baseQueryString = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"
var startTime = "&starttime=1990-01-01"
var endTime = "&endtime=2116-12-31"
var minMagnitudeString = "&minmagnitude=7.0"
var productType = "&producttype=moment-tensor"
var qString = baseQueryString + startTime + endTime + minMagnitudeString

$.getJSON(qString, function(data){
    data.features.forEach(function(feature, index){
        let date = new Date(feature.properties.time);
        let coordinates = feature.geometry.coordinates;
        console.log(date.toISOString());
        let point = {
            "id": "point"+index,
            "availability": date.toISOString()+"/2019-08-04T16:05:00Z",
            "position": {
                "cartographicDegrees": [
                    date.toISOString(), coordinates[0], coordinates[1] , 150000,
                    "2019-08-04T16:00:40Z", coordinates[0], coordinates[1], 150000
                ]
            },
            "point": {
                "color": {
                    "rgba": [ 255, 255, 255, 128]
                },
                "outlineColor": {
                    "rgba": [255, 0, 0, 128]
                },
                "outlineWidth": 3,
                "pixelSize": 15
            }
        }

        czml.push(point);
    });

    viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));
});

