import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product} from '../world';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BACKEND } from '../Graphqhrequests';
import { Orientation } from '../progressbar.component';
import { WebserviceService } from '../webservice.service';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent implements OnInit{


product : Product = new Product()
palier : number = 0
max : number = 0
multiValue : number = 0

//cout : number = this.product.cout * ((Math.pow(this.product.croissance,this.multiValue)-1)/(this.product.croissance -1))

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
    if(this._qtmulti=="x1") this.multiValue = 1;
    if(this._qtmulti=="x10") this.multiValue = 10;
    if(this._qtmulti=="x100") this.multiValue = 100;
    if(this._qtmulti=="prochain palier") {
      if (this.product.paliers.filter((p) => p.unlocked==false).length!=0) {
        this.multiValue = this.product.paliers.filter((p) => p.unlocked==false)[0].seuil - this.product.quantite;
      }
      else this.multiValue=0;
    }
    if(this._qtmulti=="max") this.multiValue = this.max;
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

  constructor(private service : WebserviceService){
      };
  

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
      console.log(qt)
      this.service.achatProduit(this.product,qt).catch(reason =>
        console.log("erreur: " + reason)
      );

    }

  }
  
  calcScore() {
    if (this.product.timeleft == 0){
      if (this.product.managerUnlocked){
        this.startFabrication()
      }else{return}
    }
    if (this.product.timeleft >0){
      let temps_passe = Date.now() - this.lastupdate
      this.product.timeleft -= temps_passe
      this.lastupdate = Date.now()

      if (this.product.timeleft <= 0){
        this.product.timeleft = 0
        this.progressbarvalue = 0

        this.notifyProduction.emit(this.product);
      }else{
        this.progressbarvalue = ((this.product.vitesse - this.product.timeleft)/this.product.vitesse)*100
      }
      
    }    
  }

  startFabrication(){
    
    if(this.product.quantite>0){
      this.run=true
      this.product.timeleft = this.product.vitesse
      this.lastupdate = Date.now()
      this.service.lancerProduction(this.product).catch(reason =>
        console.log("erreur: " + reason)
      );
   
    }
    this.run=false
  }

  calcMaxCanBuy() {
    console.log(this._worldmoney)
    this.max = Math.trunc((Math.log(1-((this._worldmoney/this.product.cout)*(1-this.product.croissance))))/Math.log(this.product.croissance))
  }

}

