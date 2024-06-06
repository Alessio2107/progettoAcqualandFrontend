import { Component, OnInit } from '@angular/core';
import { AttractionService } from 'src/app/services/attraction.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  user = { latitude: 0, longitude: 0, age: 0, height: 0 };
  attrazioni: any[] = [];

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
