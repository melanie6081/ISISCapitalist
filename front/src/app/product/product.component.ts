import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product} from '../world';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BACKEND } from '../Graphqhrequests';
import { Orientation } from '../progressbar.component';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent implements OnInit{

  @Input()
  product : Product = new Product()

  @Input()
  money : number = 0
  
  vitesse : number = this.product.vitesse
  run : boolean = false
  initialValue : number = 0 
  auto : boolean = false
  orientation : Orientation = Orientation.horizontal

  lastupdate : number = 0


  progressbarvalue: number = 0;
  backend = BACKEND;

  @Output() 
  notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();


  ngOnInit(){
    setInterval(() => { this.calcScore(); }, 100);
  }
  
  calcScore() {
    let temps_passe = Date.now() - this.lastupdate
    if (this.product.timeleft==0){return}
    else {
     this.product.timeleft = this.product.timeleft - temps_passe
     if(this.product.timeleft<=0){
      this.product.timeleft = 0
      this.progressbarvalue = 0

      // + cout prod plus tard 
      // on prévient le composant parent que ce produit a généré son revenu.
      this.notifyProduction.emit(this.product);
     }
     if(this.product.timeleft>0){
      this.progressbarvalue = ((this.product.vitesse - this.product.timeleft)/this.product.vitesse)*100
     }
    }
  }

  startFabrication(){
    console.log("fabrication")
    if(this.product.quantite>0){
      this.product.timeleft = this.product.vitesse
      this.lastupdate = Date.now()
    }
 
  }
}

