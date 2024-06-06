import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  user = { name: '', age: 0, height: 0, latitude: 0, longitude: 0 };

  constructor(private userService: UserService) {}

  saveUser() {
    console.log(this.user);
    this.userService.saveUser(this.user).subscribe(response => {
      console.log('User saved:', response);
      sessionStorage.setItem('user', JSON.stringify(this.user));
    });
  }
}
