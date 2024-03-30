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
multiValue : number = 1

  @Input()
    set prod(value: Product) {
    this.product = value;

  if(!this.product) this.product= new Product()
   this.product.vitesse
  }

  @Input()
  money : number = 0

  _qtmulti: string ="x1"
  @Input()
    set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
    if(this.qtmulti=="x1") this.multiValue = 1;
    if(this.qtmulti=="x10") this.multiValue = 10;
    if(this.qtmulti=="x100") this.multiValue = 100;
    if(this.qtmulti=="prochain palier") this.multiValue = this.prod.paliers[0].seuil - this.prod.quantite;
    if(this.qtmulti=="max") this.multiValue = this.max;
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

  @Output() 
  notifyAchat: EventEmitter<{"qt":number,"product":Product}> = new EventEmitter();

  ngOnInit(){
    setInterval(() => { this.calcScore();}, 100);
  }

  buyProduit(){

    if (this.max>=this.multiValue){
      console.log("achat")
      console.log("argent du monde : ")
      console.log(this._worldmoney)
      this.product.quantite += this.multiValue
      let qt= this.product.quantite
      let product = this.product
        // on prévient le composant parent que ce produit a eu un cout
      this.notifyAchat.emit({qt, product});
      console.log("nouveau solde du monde : ")
      console.log(this._worldmoney)
      console.log("nouvelle quantite : ")
      console.log(this.product.quantite)
    }

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
    console.log(this._worldmoney)
    this.max = Math.trunc((Math.log(1-((this._worldmoney/this.product.cout)*(1-this.product.croissance))))/Math.log(this.product.croissance))
  }

}

