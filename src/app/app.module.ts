import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './components/user/user.component';
import { MapComponent } from './components/map/map.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LoginComponent } from './registration/login/login.component';
import { RegisterComponent } from './registration/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    MapComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    LeafletModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
