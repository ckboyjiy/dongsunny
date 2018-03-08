import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import {SearchComponent} from './place/search/search.component';

const routes: Routes = [
  { path: 'dest/search', component: SearchComponent }
]

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
