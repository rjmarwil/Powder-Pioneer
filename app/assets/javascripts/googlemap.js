var map;

//############### Google Map Initialize ##############
function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(39.2244,-105.9981), //Google map Coordinates
    zoom: 8, //zoom level, 0 = earth view to higher value
    panControl: true, //enable pan Control
    zoomControl: true, //enable zoom control
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL //zoom control size
    },
    scaleControl: true, // enable scale control
    mapTypeId: google.maps.MapTypeId.ROADMAP // google map type
  };

  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  //Load Markers from the database
  $.ajax({
      url: "/markers",
      method: "GET",
    }).success(function (data) {
      $(data).each(function () {
     //Get user input values for the marker from the form
      var name = $(this).attr('name');
      var difficulty = $(this).attr('difficulty');
      var riskiness = $(this).attr('riskiness');
      var description = $(this).attr('description');
      var point = new google.maps.LatLng(parseFloat($(this).attr('lat')),parseFloat($(this).attr('lng')));

      //call create_marker() function for xml loaded maker
      create_marker(point, name, difficulty, riskiness, description, false, false, false);
    });
  });

  //drop a new marker on click
  google.maps.event.addListener(map, 'rightclick', function(event) {
    //Edit form to be displayed with new marker
    var EditForm = '<p><div class="marker-edit">'+
    '<form action="ajax-save.php" method="POST" name="SaveMarker" id="SaveMarker">'+
    '<label for="pName"><span>Place Name :</span><input type="text" name="pName" class="save-name" placeholder="Enter Title" maxlength="40" /></label>'+
    '<label for="pDifficulty"><span>Difficulty :</span> <select name="pDifficulty" class="save-difficulty"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></label>'+
    '<label for="pRiskiness"><span>Riskiness :</span> <select name="pRiskiness" class="save-riskiness"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></label>'+
    '<label for="pDesc"><span>Description :</span><textarea name="pDesc" class="save-desc" placeholder="Enter Description"></textarea></label>'+
    '</form>'+
    '</div></p><button name="save-marker" class="save-marker">Save Marker Details</button>';

    //call create_marker() function
    create_marker(event.latLng, 'New Ski Area', 1, 1, EditForm, true, true, true);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

//############### Create Marker Function ##############
function create_marker(MapPos, MapTitle, MapDiff, MapRisk, MapDesc, InfoOpenDefault, DragAble, Removable) {
  //new marker
  var image = '/assets/ski-map-icon.png';
  var marker = new google.maps.Marker({
      position: MapPos,
      map: map,
      icon: image,
      draggable:DragAble
  });

  //Content structure of info Window for the Markers
  var contentString = $('<div class="marker-info-win">'+
  '<div class="marker-inner-win"><span class="info-content">'+
  '<h1 class="marker-heading">'+MapTitle+'</h1>'+
  '<p><strong>Riskiness:</strong> '+MapRisk+'</p><p><strong>Difficulty:</strong> '+MapDiff+'</p><p><strong>Description:</strong> '+MapDesc+'</p><p>'+
  '</span><button name="remove-marker" class="remove-marker" title="Remove Marker">Remove Marker</button>'+
  '</div></div>');

  //Create an infoWindow
  var infowindow = new google.maps.InfoWindow();

  //set the content of infoWindow
  infowindow.setContent(contentString[0]);

  //Find remove button in infoWindow
  var removeBtn = contentString.find('button.remove-marker')[0];

 //Find save button in infoWindow
  var saveBtn = contentString.find('button.save-marker')[0];

  //add click listener to remove marker button
  google.maps.event.addDomListener(removeBtn, "click", function(event) {
    //call remove_marker function to remove the marker from the map
    remove_marker(marker);
  });

  if(typeof saveBtn !== 'undefined') { //continue only when save button is present
    //add click listener to save marker button
    google.maps.event.addDomListener(saveBtn, "click", function(event) {
      var mReplace = contentString.find('span.info-content'); //html to be replaced after success
      var mName = contentString.find('input.save-name')[0].value; //name input field value
      var mDifficulty = contentString.find('select.save-difficulty')[0].value; //difficulty input field value
      var mRiskiness = contentString.find('select.save-riskiness')[0].value; //riskiness input field value
      var mDesc = contentString.find('textarea.save-desc')[0].value; //description input field value

      if (mName === "" || mDesc === "") {
        alert("Please enter Name and Description");
      }
      else {
        //call save_marker function and save the marker details
        save_marker(marker, mName, mDifficulty, mRiskiness, mDesc, mReplace);
      }
    });
  }

  //add click listener to save marker button
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker); // click on marker opens info window
  });

  if(InfoOpenDefault) { //whether info window should be open by default
    infowindow.open(map,marker);
  }
}

//############### Remove Marker Function ##############
function remove_marker(Marker) {
  /* determine whether marker is draggable
  new markers are draggable and saved markers are fixed */
  if (Marker.getDraggable()) {
    Marker.setMap(null); //just remove new marker
  }
  else {
    //Remove saved marker from DB and map using jQuery Ajax
    var mLatLng = Marker.getPosition().toUrlValue(); //get marker position
    var myData = {marker: {lat : mLatLng.split(",")[0], lng : mLatLng.split(",")[1] }}; //post variables
    $.ajax({
      type: "DELETE",
      url: "/markers/",
      data: myData,
      success:function(){
        Marker.setMap(null);
      },
      error:function (xhr, ajaxOptions, thrownError){
        alert(thrownError); //throw any errors
      }
    });
  }
}

//############### Save Marker Function ##############
function save_marker(Marker, mName, mDifficulty, mRiskiness, mDesc, replaceWin) {
  //Save new marker using jQuery Ajax
  var mLatLng = Marker.getPosition().toUrlValue(); //get marker position
  var myData = {marker: {name : mName, difficulty : mDifficulty, riskiness : mRiskiness, lat : mLatLng.split(",")[0], lng : mLatLng.split(",")[1], description : mDesc }}; //post variables
  console.log(replaceWin);
  $.ajax({
    type: "POST",
    url: "/markers",
    data: myData,
    success:function(data){
      replaceWin.html(data); //replace info window with new html
      Marker.setDraggable(false); //set marker to fixed
    },
    error:function (xhr, ajaxOptions, thrownError){
      alert(thrownError); //throw any errors
    }
  });
}

// var map;
// var marker;
//
// var infowindow = new google.maps.InfoWindow({
//   size: new google.maps.Size(150,50)
// });
//
// // A function to create the marker and set up the event window function
// function createMarker(latlng, name, html) {
//   var contentString = html;
//   var image = '/assets/ski-map-icon.png';
//   var marker = new google.maps.Marker({
//     position: latlng,
//     map: map,
//     icon: image,
//     draggable: true,
//     zIndex: Math.round(latlng.lat()*-100000)<<5
//   });
//
//   // google.maps.event.addListener(marker, 'click', function() {
//   //   infowindow.setContent(contentString);
//   //   infowindow.open(map,marker);
//   // });
//
//   google.maps.event.trigger(marker, 'click');
//   return marker;
// }
//
// function initialize() {
//   // create the map
//   var mapOptions = {
//     zoom: 8,
//     center: new google.maps.LatLng(39.2244,-105.9981),
//     mapTypeControl: true,
//     mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
//     navigationControl: true,
//     mapTypeId: google.maps.MapTypeId.ROADMAP
//   };
//   map = new google.maps.Map(document.getElementById("map-canvas"),
//         mapOptions);
//
//   google.maps.event.addListener(map, 'click', function() {
//     infowindow.close();
//   });
//
//   google.maps.event.addListener(map, 'click', function(event) {
//     //call function to create marker
//     if (marker) {
//       marker.setMap(null);
//       marker = null;
//     }
//     marker = createMarker(event.latLng, "name", "<b>Location</b><br>"+event.latLng);
//   });
// }
//
// google.maps.event.addDomListener(window, 'load', initialize);
