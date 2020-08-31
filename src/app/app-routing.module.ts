import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultPageComponent } from '@pk-components/pages/default-page/default-page.component';
import { NotFoundPageComponent } from '@pk-components/pages/not-found-page/not-found-page.component';
import { CountryPageComponent } from '@pk-components/pages/country-page/country-page.component';

const routes: Routes = [
 {
    path: '',
    redirectTo: '/default',
    pathMatch: 'full'
  },
  {
    path: 'default',
    component: DefaultPageComponent
  },
  {
    path: 'country/:country',
    component: CountryPageComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
