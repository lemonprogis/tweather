var center = new google.maps.LatLng(33.14, -92.12);
  var map,infoWindow;
  var markers;
  var dynamap, dynamap2;
  function init() {
      var mapOptions = {
          zoom: 6,
          center: center,
          mapTypeId: google.maps.MapTypeId.ROAD
      }
     
      map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
      // NWS watches and warnings layer
      var wwLayer = 'http://gis.srh.noaa.gov/arcgis/rest/services/watchwarn/MapServer';
      var radarLayer = 'http://gis.srh.noaa.gov/arcgis/rest/services/RIDGERadar/MapServer'
      dynamap = new gmaps.ags.MapOverlay(wwLayer, {opacity: 0.3});
      dynamap2 = new gmaps.ags.MapOverlay(radarLayer,{opacity: 0.5});
      google.maps.event.addListenerOnce(dynamap.getMapService(), 'load', function(){
        dynamap.setMap(map);
        dynamap2.setMap(map);
        var service = dynamap.getMapService();
        var service2 = dynamap2.getMapService();
        var services = [service.layers, service2.layers];
       var toc = '';
        for (var i = 0; i < services.length; i++) {
          for(var s = 0; s < services[i].length; s++){
            toc += '<input type="checkbox" id="layer' + services[i][s].name + '"';
            if (services[i][s].visible) 
              toc += ' checked="checked"';
            toc += ' onclick="setVis()">' + services[i][s].name + '<br/>';
          }
        }
        document.getElementById('toc').innerHTML = toc;
      });

      // site weather locations. google but source is weather channel
      var weatherLayer = new google.maps.weather.WeatherLayer({
              temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
            });
      weatherLayer.setMap(map);

      //var cloudLayer = new google.maps.weather.CloudLayer();
      //cloudLayer.setMap(map);
      loadMarkers();

      
    }

    function setVis() {
      var service = dynamap.getMapService();
      var service2 = dynamap2.getMapService();
      var services = [service.layers, service2.layers];

      for (var i = 0; i < services.length; i++) {
         for(var s = 0; s < services[i].length; s++){
          var el = document.getElementById('layer' + services[i][s].name);
          services[i][s].visible = (el.checked === true);
        }
      }
      dynamap.refresh();
      dynamap2.refresh();
    }

  function bindInfoWindow(marker, map, infoWindow, html) {
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
      });
    }

    function downloadUrl(url, callback) {
      var request = window.ActiveXObject ?
          new ActiveXObject('Microsoft.XMLHTTP') :
          new XMLHttpRequest;

      request.onreadystatechange = function() {
        if (request.readyState == 4) {
          request.onreadystatechange = doNothing;
          callback(request, request.status);
        }
      };

      request.open('GET', url, true);
      request.send(null);
    }

    function doNothing() {}

    function loadMarkers(){
      allMarkers = [];
      infoWindow = new google.maps.InfoWindow;
      downloadUrl("phpsqlinfo_points.php", function(data) {
        var xml = data.responseXML;
      markers = xml.documentElement.getElementsByTagName("marker");
      //console.log("Number of Markers: "+markers.length);
      var count = 0;
        for (var i = 0; i < markers.length; i++) {
          count += 1;
           var screen_name = markers[i].getAttribute("u_screen_name");
           var name = markers[i].getAttribute("u_name");
           var pic = markers[i].getAttribute("u_pic");
           var tweet = findLink(markers[i].getAttribute("s_text"));
           var created_at = markers[i].getAttribute("s_created_at");
           var source = markers[i].getAttribute("s_source");
           //var latitude = markers[i].getAttribute("lat");
           //var longitude = markers[i].getAttribute("lng");
          
          var html = "<a href=\"https://twitter.com/"+screen_name+"\" target=\"_blank\"><img src=\""+pic+"\"/>&nbsp;&nbsp;&nbsp;&nbsp;</a><a href=\"https://twitter.com/"+screen_name+"\" target=\"_blank\">"+screen_name+"</a>"+
          "<h4>"+tweet+"</h4>"+
          "<p><i>"+created_at+"</i></p>";

          var point = new google.maps.LatLng(
              parseFloat(markers[i].getAttribute("lat")),
              parseFloat(markers[i].getAttribute("lng")));
          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: 'img/tweet.png'
            
      });
      bindInfoWindow(marker, map, infoWindow, html);
      
      if(count > 1000){
        break;
      }
      }
  });
      //numberOfMarkers();
    }

    // this refreshes the markers every 10 secods
    setInterval(function(){ loadMarkers(); }, 10000);

    function getXMLdoc(type, doc){
        if (window.XMLHttpRequest)
        {
          // code for IE7+, Firefox, Chrome, Opera, Safari
          xmlhttp=new XMLHttpRequest();
        }
        else
        {
          // code for IE6, IE5
          xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open(type,doc,false);
        xmlhttp.send();
        return xmlhttp.responseXML;
    }

    function numberOfMarkers(){
        var data = getXMLdoc("GET","phpsqlinfo_points.php");
        var root = data.getElementsByTagName('marker');
        document.getElementById('tweetCount').innerHTML =  root.length;
    }
    function findLink(text){
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
    }

    // window stuff
    window['setVis']=setVis;
    window.onload = init;
