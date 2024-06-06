import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  faFacebookF = faFacebookF;
  faTwitter = faTwitter;
  faInstagram = faInstagram;

  constructor(private router: Router) {}
  
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/user']);
  }

}
