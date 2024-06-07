import { Component, OnInit } from '@angular/core';
import { AttractionService } from 'src/app/services/attraction.service';
import * as Leaflet from 'leaflet';
import { isWhiteSpaceLike } from 'typescript';

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
    zoom: 16,
    center: { lat: 42.15061, lng: 14.69747 }
  };

  constructor(private attractionService: AttractionService) {}

  ngOnInit() {
    this.loadUserFromSession();
    this.getUserLocation();
    this.initializeMap();
  }

  initializeMap() {
    this.map = Leaflet.map('map', this.options);
    this.map.addLayer(this.options.layers[0]);
    this.initMarkers();
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

  initMarkers() {
    const initialMarkers = [
      {
        position: { lat: this.user.latitude, lng: this.user.longitude },
        name: 'posizione dell user',
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
      marker.addTo(this.map).bindPopup(`<b>${data.position.lat},${data.name}, ${data.position.lng}</b>`);
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
    console.log(event.latlng.lat, event.latlng.lng);
  }

  markerDragEnd(event: any, index: number) {
    console.log(event.target.getLatLng());
  }

  findNearbyAttractions() {
    this.attractionService.getNearbyAttractions(
      this.user.latitude, this.user.longitude, this.user.age, this.user.height
    ).subscribe(response => {
      this.attrazioni = response;
    });
  }
  mapClicked(event: any) {
    console.log("Longitudine e Latitudine del punto cliccato:", event.latlng);
  }
  
  onMapReady(map: Leaflet.Map) {
    this.map = map;
    this.initMarkers();
  }
}
