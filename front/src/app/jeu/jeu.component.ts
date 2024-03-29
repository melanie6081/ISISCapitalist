import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink, RouterOutlet } from '@angular/router';
import { WebserviceService } from '../webservice.service';
import { OperationTypeNode } from 'graphql';
import { BACKEND } from '../Graphqhrequests';
import { Palier, Product, World } from '../world';
import { ProductComponent } from '../product/product.component';
import { Title } from '@angular/platform-browser';
import { SessionComponent } from '../session/session.component';
import { User } from '../session/user';
import { BigvaluePipe } from "../bigvalue.pipe";
import { switchMap } from 'rxjs';
import { NgIf, NgFor, NgClass} from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';



@Component({
    selector: 'app-jeu',
    standalone: true,
    templateUrl: './jeu.component.html',
    styleUrl: './jeu.component.css',
    imports: [RouterOutlet, ProductComponent, SessionComponent, BigvaluePipe, RouterLink, NgIf, NgFor, NgClass, MatBadgeModule],
})
export class JeuComponent implements OnInit{

log() {
console.log("coucou")
}
  
  user : User = new User()
  world : World = new World()
  backend = BACKEND
  pseudo = ""
  produit : Product = new Product()

  qtmulti = "x1"
  multivalue = 1

  showManagers = false

  badgeManagers = 0


  constructor(private service : WebserviceService,private title:Title,  private route: ActivatedRoute,
    private router: Router, private snackBar: MatSnackBar){
    service.getWorld().then(
      world => {
        this.world = world.data.getWorld;
        console.dir(this.world)
        this.title.setTitle(this.world.name)
      });
  }


  ngOnInit() {
    this.managerCanBuy()
    this.pseudo = this.route.snapshot.params["pseudo"]
    console.log(this.pseudo)
  }

  selecteur(): string{
    if(this.qtmulti=="x1"){
      this.qtmulti = "x10"
      console.log(this.qtmulti)
      return this.qtmulti
    }
    if(this.qtmulti=="x10"){
      this.qtmulti = "x100"
      console.log(this.qtmulti)
      return this.qtmulti
    }
    if(this.qtmulti=="x100"){
      this.qtmulti = "prochain palier"
      console.log(this.qtmulti)
      return this.qtmulti
    }

    if(this.qtmulti=="prochain palier"){
      this.qtmulti = "max"
      console.log(this.qtmulti)
      return this.qtmulti
    }

    if(this.qtmulti=="max"){
      this.qtmulti = "x1"
      console.log(this.qtmulti)
      return this.qtmulti
    }

    return this.qtmulti
  }

  onProductionDone(p: Product) {
    this.world.money = this.world.money + (p.revenu * p.quantite)
    this.world.score = this.world.score + (p.revenu * p.quantite)
  }

  show():boolean{
    if(this.showManagers==true){
      return this.showManagers=false
    }
    if(this.showManagers==false){
      return this.showManagers=true
    }

    return this.showManagers
  }

  hireManager(m: Palier) {
    if(m.seuil>this.world.money){
    return
    }
    else{
    this.world.money-=m.seuil
    m.unlocked=true
    this.produit.managerUnlocked=true
    let message = "Bien joué, votre production n'en sera que meilleure ;P"
    this.popMessage(message)
    }
  }

  popMessage(message : string) : void {
    this.snackBar.open(message,"",{duration:3000});
  }

  managerCanBuy(){
    for(let m of this.world.managers){
      if(!m.unlocked && m.seuil<this.world.money){
        this.badgeManagers+=1
      }

    }
  }

}
