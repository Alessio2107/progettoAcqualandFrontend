import { Component, OnInit } from '@angular/core';
import { AttractionService } from 'src/app/services/attraction.service';
import * as Leaflet from 'leaflet';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  user = { latitude: 0, longitude: 0, age: 0, height: 0 };
  attrazioni: any[] = [];
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 20,
    center: { lat:42.15005, lng: 14.69642}
  };

  constructor(private attractionService: AttractionService) {}

  ngOnInit() {
    this.loadUserFromSession();
    this.getUserLocation();
    
  }

  loadUserFromSession() {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    } else {
      console.error("Dati dell'utente non trovati.");
    }
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.user.latitude = position.coords.latitude;
        this.user.longitude = position.coords.longitude;
        this.updateMapCenter();
      });
    } else {
      console.error("La Geolocalizzazione non è supportata in questo browser.");
    }
  }

  updateMapCenter() {
    if (this.map) {
      this.map.setView(new Leaflet.LatLng(this.user.latitude, this.user.longitude), this.options.zoom);
    }
  }

  onMapReady(map: Leaflet.Map) {
    this.map = map;
    this.initializeMap();
    this.initMarkers();
  }

  initializeMap() {
    this.map.addLayer(this.options.layers[0]);
  }

  initMarkers() {
    const initialMarkers = [
      {
        position: { lat: this.user.latitude, lng: this.user.longitude },
        name: 'Posizione dell\'utente',
        draggable: true
      },
      {
        position: { lat:42.151023250462856, lng:14.695903658866884 },
        name: 'Piscina a onde',
        draggable: true
      },
      {
        position: { lat:42.150865717258654, lng: 14.696477651596071 },
        name: 'Idromassaggio',
        draggable: true
      },
      {
        position: { lat: 42.15053968454859, lng: 14.696552753448488 },
        name: 'Piscina Baby',
        draggable: true
      },
      {
        position: { lat: 42.1504879962818, lng: 14.694975614547731},
        name: 'Kilimanjaro',
        draggable: true
      },
      {
        position: { lat: 42.15005, lng: 14.69642 },
        name: 'Blue tornado',
        draggable: true
      },
      {
        position: { lat: 42.149140, lng: 14.696093 },
        name: 'Schock',
        draggable: false
      },
      {
        position: { lat: 42.14936, lng: 14.69735 },
        name: 'Black Hole',
        draggable: true
      }
    ];

    initialMarkers.forEach((data, index) => {
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map).bindPopup(`<b> ${data.name},${data.position.lat}, ${data.position.lng}</b>`);
      this.markers.push(marker);
    });

    if (initialMarkers.length > 0) {
      this.map.panTo(initialMarkers[0].position);
    }
  }

  generateMarker(data: any, index: number): Leaflet.Marker {
    return Leaflet.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  markerClicked(event: any, index: number) {
    // console.log(event.latlng.lat, event.latlng.lng);
  }

  markerDragEnd(event: any, index: number) {
    console.log(event.target.getLatLng());
  }

  findNearbyAttractions() {
    this.attractionService.getNearbyAttractions(
      this.user.latitude, this.user.longitude, this.user.age, this.user.height
    ).subscribe(response => {
      this.attrazioni = response;
      this.findNearbyMarkers();
    });
  }

  mapClicked(event: any) {
    // console.log("Longitudine e Latitudine del punto cliccato: ", event.latlng);
  }


  calculateDistance(lat1 :number, lon1 :number, lat2 : number, lon2 : number) {
    console.log(lat1, lon1, lat2, lon2)
    var R = 6371000; 
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c;
    return distance;

}
  /*calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;
    console.log(d)
    return d;

  }*/

  findNearbyMarkers() {
    const nearbyMarkers = this.markers.filter((marker, index) => {
      if (index === 0) return false;
      const distance = this.calculateDistance(
        this.user.latitude,
        this.user.longitude,
        marker.getLatLng().lat,
        marker.getLatLng().lng

      );
      return distance;
    });


    console.log('Marker vicini entro 50 metri:', nearbyMarkers);
    this.attrazioni = nearbyMarkers.map(marker => {
      const popupContent = marker.getPopup()?.getContent();
      const name = typeof popupContent === 'string' ? popupContent.split(',')[1]?.trim() : 'Attrazione';
      return {
        name: name,
        description: `Latitudine: ${marker.getLatLng().lat}, Longitudine: ${marker.getLatLng().lng}`
      };
    });
  }



//                                                  ALTRO METODO PER LA DISTANZA




    /*
    const info = sessionStorage.getItem('user');

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
      var R = 6371;
      var dLat = this.deg2rad(lat2-lat1);
      var dLon = this.deg2rad(lon2-lon1);
      var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
    }
    
    deg2rad(deg) {
      return deg * (Math.PI/180)
    }
      */
}
