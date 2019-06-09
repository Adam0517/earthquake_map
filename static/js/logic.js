
// Define variables for our base layers
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Create a baseMaps object
var baseMaps = {
  "Satellite Map": satellite,
  "Outdoors Map": outdoors,
  "Light Map": lightmap
};


// Link for earthquake data 
var APILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var earth = new L.LayerGroup();
// Grab data with d3
d3.json(APILink, function(data) {

  var information = data.features;

  for (i = 0; i < information.length; i++){

    Lat = information[i].geometry.coordinates[1];
    Lon = information[i].geometry.coordinates[0];
    Location = [Lat, Lon]
    Mag = information[i].properties.mag;
    URL = information[i].properties.url;
    Title = information[i].properties.title;

    // Conditionals for different color of Mag
    var dColor = "";
    if (Mag < 1) {
      dColor = "yellow";
    }
    else if (Mag < 2 ) {
      dColor = "lightblue";
    }
    else if (Mag < 3 ) {
      dColor = "violet";
    }
    else if (Mag < 4 ) {
      dColor = "orange";
    }
    else if (Mag < 5 ) {
      dColor = "red";
    }
    else {
      dColor = "brown";
    }

    L.circle(Location,{
      fillOpacity: 0.7,
      color: dColor,
      fillColor: dColor,
      weight : 1,
      // Adjust radius
      radius: Mag*40000
    }).bindPopup("<h3>" + Title + "</h3> <hr> <h4>Detail Link: " + URL + "</h4>").addTo(earth)
  }

// Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ["0-1","1-2","2-3","3-4","4-5","5+"];
    var colors = ["yellow","lightblue","violet","orange","red","brown"];
    var labels = [];

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] +"\"> " + limit + "</li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap); 

});

// Link for boundaries data 
var bound = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

var boundary = new L.LayerGroup();

d3.json(bound, function (geoJson) {
  L.geoJSON(geoJson.features, {
      style: function (geoJsonFeature) {
          return {
              weight: 2,
              color: 'orange'
          }
      },
  }).addTo(boundary);
})

// Create an overlay object
var overlayMaps = {
  "Fault Line": boundary,
  "Earthquake" : earth
};

// Define a map object
var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 3,
  layers: [satellite,boundary,earth]
});

L.control.layers(baseMaps,overlayMaps).addTo(myMap);

