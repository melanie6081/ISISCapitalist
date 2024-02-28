import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebserviceService } from '../webservice.service';
import { OperationTypeNode } from 'graphql';
import { BACKEND } from '../Graphqhrequests';
import { World } from '../world';
import { ProductComponent } from '../product/product.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-jeu',
  standalone: true,
  imports: [RouterOutlet,ProductComponent],
  templateUrl: './jeu.component.html',
  styleUrl: './jeu.component.css'
})
export class JeuComponent {
  world : World = new World()
  backend = BACKEND


  constructor(private service : WebserviceService,private title:Title){
    service.getWorld().then(
      world => {
        this.world = world.data.getWorld;
        console.dir(this.world)
        this.title.setTitle(this.world.name)
      });
  }
}
