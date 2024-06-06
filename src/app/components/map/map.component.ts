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

  constructor(private attractionService: AttractionService) {}
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 16,
    center: { lat: 42.15061, lng: 14.69747 }
  }

  initMarkers() {
    const initialMarkers = [
      {
        position: { lat: 42.15005, lng: 14.69642 },
        name: 'Blue tornado',
        draggable: true
      },
      {
        position: { lat: 42.149140, lng: 14.696093 },
        name:'Schock',
        draggable: false
      },
      {
        position: { lat: 42.14936, lng: 14.69735 },
        name:'Black Hole',
        draggable: true
      }
    ];
    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map).bindPopup(`<b>${data.position.lat},${data.name},  ${data.position.lng}</b>`);
      this.map.panTo(data.position);
      this.markers.push(marker)
    }
  }

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  } 




  //dfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff

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
      });
    } else {
      console.error("La Geolocalizzazione non e supportata in questo browser.");
    }
  }

  findNearbyAttractions() {
    this.attractionService.getNearbyAttractions(
      this.user.latitude, this.user.longitude, this.user.age, this.user.height
    ).subscribe(response => {
      this.attrazioni = response;
    });
  }
}
