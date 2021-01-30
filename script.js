let map;
let marker;

//pulls up a blank map of Minneapolis on load
$(document).ready(function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 44.9778, lng: -93.2650 },
    zoom: 14,
  });
  userLocate();
});

//populate the map with markers, places info according to what user had searched
function initMap(city) {
  // geolocate URL
  geolocateURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyBepTaWB2S-ZswMELWF7HxBIvUDpXCAG9o"
  // console.log(geolocateURL)

  // AJAX call for geolocate
  $.ajax({
    url: geolocateURL,
    method: "GET",
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ': ' + xhr.statusText
      alert('Error - ' + errorMessage);
    },
    success: function (response) {
      //setting the variables for longitude and latitude to plug in to line 25 to center:
      var latOne = parseFloat(response.results[0].geometry.location.lat)
      var lonOne = parseFloat(response.results[0].geometry.location.lng)

      //  gets the map, sets parameters:
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: latOne, lng: lonOne },
        zoom: 14,
      });

      userLocate();

      var request = {
        location: new google.maps.LatLng(latOne, lonOne),
        radius: 1500,
        type: ['restaurants']
      };

      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, function (results, status) {
        $(".restaurant-container-md").empty();
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < 3; i++) {
            var name = results[i].name;
            var placeID = results[i].place_id;
            var photo = results[i].photos[0].getUrl
            var rating = results[i].rating;
            var price = results[i].price_level;
            var address = results[i].vicinity;
            // var hours = results[i].opening_hours.isOpen
            // console.log(hours)

            //set restaurant div = to HTML rest cont div
            var restarauntDiv = $(".restaurant-container-md")

            //create a <p> for the name, call it nameEl and set the value of name to the name variable
            var nameEl = $("<p>");
            nameEl.html(name);

            // var hoursEl = $("<p>");
            // hoursEl.html(hours);
            var addressEl = $("<p>");
            addressEl.html(address);

            var ratingEl = $("<p>");
            ratingEl.html("Rating: " + rating + " stars");

            //photo
            var photoEl = $("<img class='photo-size'>");
            photoEl.attr("src", photo);

            //price
            var priceEl = $("<p>");
            priceEl.html(price);
            //change to for loop?
            // for (var i = 0; i < price.length; i++)
            if (price == 1) {
              priceEl = "$"
            }
            if (price == 2) {
              priceEl = "$$"
            }
            if (price == 3) {
              priceEl = "$$$"
            }
            if (price == 4) {
              priceEl = "$$$$"
            }
            if (price == 5) {
              priceEl = "$$$$$"
            }

            //add it to the page
            restarauntDiv.append(nameEl);
            restarauntDiv.append(addressEl);
            restarauntDiv.append(ratingEl);
            restarauntDiv.append(priceEl);
            restarauntDiv.append(photoEl);
            // (restarauntDiv).append(hoursEl);

            var marker = new google.maps.Marker({
              place: {
                placeId: placeID,
                location: results[i].geometry.location
              },
              title: name,
            });
            marker.setMap(map);
          }
          map.setCenter(results[0].geometry.location);
        }
      })

      var request2 = {
        location: new google.maps.LatLng(latOne, lonOne),
        radius: 1500,
        type: ['lodging']
      };


      service.nearbySearch(request2, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          $(".attract-container-md").empty()
          for (var i = 0; i < 3; i++) {
            var name = results[i].name;
            var placeID = results[i].place_id;
            var photo = results[i].photos[0].getUrl
            var rating = results[i].rating;
            var address = results[i].vicinity

            // var hours = results[i].opening_hours.isOpen
            // console.log(hours)

            //set restaurant div = to HTML rest cont div
            var hotelDiv = $(".attract-container-md")

            //creating new row
            var newRow = $("<div class= 'row'>")

            //create new image column
            var imageCol = $("<div class= 'col-md-5'>")

            //create new description column
            var descriptionCol = $("<div class='col-md-7'>")

            //create a <p> for the name, call it nameEl and set the value of name to the name variable
            var nameEl = $("<p>");
            nameEl.html(name);

            // var hoursEl = $("<p>");
            // hoursEl.html(hours);

            var ratingEl = $("<p>");
            ratingEl.html("Rating: " + rating + " stars");

            //photo
            var photoEl = $("<img class='photo-size'>");
            photoEl.attr("src", photo);

            //address
            var addressEl = $("<p>");
            addressEl.html(address);

            //add it to the page
            hotelDiv.append(newRow);
            newRow.append(imageCol);
            imageCol.append(photoEl);
            newRow.append(descriptionCol);
            descriptionCol.append(nameEl);
            descriptionCol.append(addressEl);
            descriptionCol.append(ratingEl);

            // (restarauntDiv).append(hoursEl);

            var marker = new google.maps.Marker({
              place: {
                placeId: placeID,
                location: results[i].geometry.location
              },
              title: name,
            });

            marker.setMap(map);
          }
          map.setCenter(results[0].geometry.location);
        }
        console.log(results, status)
      }
      );
    }
  });
}

function userLocate() {
  infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Go to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

// on-click event for search button
$("#search").on("click", function (event) {
  event.preventDefault();
  //sets the variable "city" to the value of the input div
  var city = $("#enter-city").val().trim();
  if (city) {
    initMap(city);
  }
});

//handle errors for user location
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

