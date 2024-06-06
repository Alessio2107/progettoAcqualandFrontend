import { Component } from '@angular/core';
import { AttractionService } from 'src/app/services/attraction.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  user = { latitude: 0, longitude: 0, age: 0, height: 0 };
  attrazioni: any[] = [];

  constructor(private attractionService: AttractionService) {}

  ngOnInit() {
    this.getUserLocation();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.user.latitude = position.coords.latitude;
        this.user.longitude = position.coords.longitude;
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
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
