import { Component, OnInit} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { JeuComponent } from '../jeu/jeu.component';
import { WebserviceService } from '../webservice.service';
import { World } from '../world';
import { BACKEND } from '../Graphqhrequests';
import { Title } from '@angular/platform-browser';
import { User } from './user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [RouterOutlet, JeuComponent,FormsModule, RouterLink],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})

export class SessionComponent implements OnInit{
log() {
console.log("coucou");
}

  user: User = new User()
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

  ngOnInit(): void {
    
  }

  getUser(){
    return this.user;
  }

  onSubmit() {
    console.log("hello")
    if (this.user.pseudo == "") {
      this.user.pseudo = "Anonymous" + Math.floor(Math.random() * 10000).toString();
    }
    console.log(this.user.pseudo)
    localStorage.setItem("username", this.user.pseudo);
    this.service.setUser(this.user.pseudo);

    this.service.getWorld().then(
      world => {
        console.log(world);
        this.world = world.data.getWorld;
        window.location.reload();
      }
    );
  }
}

