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


product : Product = new Product()

max : number = 0

  @Input()
    set prod(value: Product) {
    this.product = value;

  if(!this.product) this.product= new Product()
   this.product.vitesse=10000
  }

  @Input()
  money : number = 0

  _qtmulti: string ="x1"
  @Input()
    set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
  }

  _worldmoney : number = 0
  @Input()
    set worldmoney(value: number) {
    this._worldmoney = value;
    if (this._worldmoney && this.product) this.calcMaxCanBuy();
  }


      
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

  maxnb(){
    console.log(this.max)
  }
  
  calcScore() {
    let temps_passe = Date.now() - this.lastupdate
    this.lastupdate= Date.now()
    if(!this.product.managerUnlocked){
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
    }else{
      this.product.timeleft = this.product.timeleft - temps_passe
    }
      
  }

  startFabrication(){
    console.log("fabrication")
    
    if(this.product.quantite>0){
      this.run=true
      this.product.timeleft = this.product.vitesse
      this.lastupdate = Date.now()
   
    }
    this.run=false
  }

  calcMaxCanBuy() {
    this.max = Math.trunc(((Math.log(1-((this._worldmoney/this.product.cout)*(1-this.product.croissance))))/Math.log(this.product.croissance))-1)
  }

}

