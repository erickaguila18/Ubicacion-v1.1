function cargar(){
var username=document.getElementById("username").value;
var latitude=document.getElementById("latitude").value;
var longitude=document.getElementById("longitude").value;

//alert(latitude +" " +longitude);

L.mapbox.accessToken = 'pk.eyJ1IjoiZXJpY2thZ3VpbGExOCIsImEiOiJla3prRmd3In0.FmFKzfaq4SLneLnbVnNlvA';
var map = L.mapbox.map('map', 'erickaguila18.li9a8dag');
L.tileLayer('https:/a.tiles.mapbox.com/v4/erickaguila18.li9a8dag/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: 'SUCUT',
    maxZoom: 17
}).addTo(map);



function onLocationFound(e) {

	L.marker([latitude, longitude]).addTo(map).bindPopup(username).openPopup();;


    var radius = e.accuracy / 2;
   // L.marker(e.latlng,{draggable: false}).addTo(map)
     //   .bindPopup("Estas a " + radius + " metros de este punto").openPopup();
    //L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}
map.on('locationerror', onLocationError);
map.on('locationfound', onLocationFound);
map.locate({setView: true, maxZoom: 17});
}


