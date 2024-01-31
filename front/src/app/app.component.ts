import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebserviceService } from './webservice.service';
import { OperationTypeNode } from 'graphql';
import { BACKEND } from './Graphqhrequests';
import { World } from './world';
import { ProductComponent } from './product/product.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  world : World = new World()
  backend = BACKEND
  title = 'SleepyWorld'

  constructor(private service : WebserviceService){
    service.getWorld().then(
      world => {
        this.world = world.data.getWorld;
        console.dir(this.world)
      });
  }
}
