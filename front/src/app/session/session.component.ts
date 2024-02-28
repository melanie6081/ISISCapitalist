import { Component, NgModule, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JeuComponent } from '../jeu/jeu.component';
import { WebserviceService } from '../webservice.service';
import { World } from '../world';
import { BACKEND } from '../Graphqhrequests';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [RouterOutlet, JeuComponent],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})

export class SessionComponent {

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

