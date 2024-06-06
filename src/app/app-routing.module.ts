import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { MapComponent } from './components/map/map.component';

const routes: Routes = [
  { path: 'user', component: UserComponent },
  { path: 'map', component: MapComponent },
  { path: '', redirectTo: '/user', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
