import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink, RouterOutlet } from '@angular/router';
import { WebserviceService } from '../webservice.service';
import { OperationTypeNode } from 'graphql';
import { BACKEND } from '../Graphqhrequests';
import { World } from '../world';
import { ProductComponent } from '../product/product.component';
import { Title } from '@angular/platform-browser';
import { SessionComponent } from '../session/session.component';
import { User } from '../session/user';
import { BigvaluePipe } from "../bigvalue.pipe";
import { switchMap } from 'rxjs';



@Component({
    selector: 'app-jeu',
    standalone: true,
    templateUrl: './jeu.component.html',
    styleUrl: './jeu.component.css',
    imports: [RouterOutlet, ProductComponent, SessionComponent, BigvaluePipe, RouterLink],
})
export class JeuComponent implements OnInit{
log() {
console.log("coucou")
}
  
  user : User = new User()
  world : World = new World()
  backend = BACKEND
  pseudo = ""

  multiplicateur = 1



  constructor(private service : WebserviceService,private title:Title,  private route: ActivatedRoute,
    private router: Router){
    service.getWorld().then(
      world => {
        this.world = world.data.getWorld;
        console.dir(this.world)
        this.title.setTitle(this.world.name)
      });
  }


  ngOnInit() {
    this.pseudo = this.route.snapshot.params["pseudo"]
    console.log(this.pseudo)
  }



}
