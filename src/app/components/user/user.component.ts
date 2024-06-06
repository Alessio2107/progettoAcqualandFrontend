import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user = { name: '', age: 0, height: 0, latitude: 0, longitude: 0 };
  map!: Leaflet.Map;
  userMarker!: Leaflet.Marker;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    this.map = Leaflet.map('user-map').setView([42.35, 13.40], 13);

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('click', (e: Leaflet.LeafletMouseEvent) => {
      this.setUserLocation(e.latlng);
    });
  }

  setUserLocation(latlng: Leaflet.LatLng) {
    if (this.userMarker) {
      this.userMarker.setLatLng(latlng);
    } else {
      this.userMarker = Leaflet.marker(latlng, { draggable: true }).addTo(this.map);
    }

    this.user.latitude = latlng.lat;
    this.user.longitude = latlng.lng;
  }

  saveUser() {
    console.log(this.user);
    this.userService.saveUser(this.user).subscribe(response => {
      console.log('User saved:', response);
      sessionStorage.setItem('user', JSON.stringify(this.user));
    });
  }
}
