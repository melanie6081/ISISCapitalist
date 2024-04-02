import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Palier, Product} from '../world';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BACKEND } from '../Graphqhrequests';
import { Orientation } from '../progressbar.component';
import { WebserviceService } from '../webservice.service';
import { BigvaluePipe } from "../bigvalue.pipe";
import {MatCardModule} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MatProgressBarModule, BigvaluePipe, MatCardModule,MatButton],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent implements OnInit{


product : Product = new Product()
palier : number = 0
max : number = 0
multiValue : number = 0
nouveaucout : number = 0
coutAfficher : number = 0

prochainPalier : number = 0

  @Input()
    set prod(value: Product) {
    this.product = value;
    if(!this.product) this.product= new Product()
    this.product.vitesse

    if(this.product && this.product.timeleft > 0){
      this.lastupdate = Date.now();
      this.progressbarvalue = ((this.product.vitesse - this.product.timeleft) / this.product.vitesse)*100;
    }
  }

  @Input()
  money : number = 0

  _qtmulti: string ="x1"
  @Input()
    set qtmulti(value: string) {
    this._qtmulti = value;

    if (this._qtmulti && this.product) {
      this.calcMaxCanBuy();
    }
    if(this._qtmulti=="x1") this.multiValue = 1;
    if(this._qtmulti=="x10") this.multiValue = 10;
    if(this._qtmulti=="x100") this.multiValue = 100;
    if(this._qtmulti=="suivant") {
      if (this.product.paliers.filter((p) => p.unlocked==false).length!=0) {
        this.multiValue = this.product.paliers.filter((p) => p.unlocked==false)[0].seuil - this.product.quantite;
      }
      else this.multiValue=0;
    }
    if(this._qtmulti=="max") {
      this.multiValue = this.max;
    }
  }

  _worldmoney : number = 0
  @Input()
    set worldmoney(value: number) {
    this._worldmoney = value;
    if (this._worldmoney && this.product) {
      this.calcMaxCanBuy();
    }
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

  constructor(private service : WebserviceService,  private snackBar: MatSnackBar){
      };
  

  ngOnInit(){
    setInterval(() => { this.calcScore();}, 100);
  }

  buyProduit(){

    console.log("max can buy")
    console.log(this.max)

    if (this._worldmoney>=this.coutAfficher){
      console.log("cout produit")
      console.log(this.product.cout)
      //let qt= this.product.quantite
      let product = this.product
      let qt = this.multiValue
      // on prévient le composant parent que ce produit a eu un cout
      this.notifyAchat.emit({qt, product});

      this.product.cout=this.calcNewCout()
      this.product.quantite += this.multiValue

      if (this.product.quantite>=this.product.paliers.filter((p) => p.unlocked==false)[0].seuil){
        this.product.paliers.filter((p) => p.unlocked==false)[0].unlocked = true
      }

      this.calcProchainPalier()
      this.calcMaxCanBuy()
      this.calcNewCout();
      this.calcCoutTot();

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
<<<<<<< HEAD
        );
=======
      );
>>>>>>> 9d1c1a8bc6693b512cd98b89271798938f657f23
   
    }
    this.run=false
  }

  popMessage(message: string): void {
    this.snackBar.open(message, "", { duration: 5000 });
  }

  calcUpgrade(p: Palier){
    if (p.seuil<= this.product.quantite){
      if (p.typeratio=="gain"){
        this.product.revenu=this.product.revenu*p.ratio
        let message = "Vos revenus du produit "+this.product.name+" ont augmenté de manière significative !!"
        this.popMessage(message)
      }
      if (p.typeratio=="vitesse"){
        this.product.vitesse=this.product.vitesse/p.ratio
        let message = "Attention vitesse hyper-espace !! Votre produit  "+this.product.name+" se fabrique à la vitesse de la lumière !!"
        this.popMessage(message)
      }
    }
  }

  calcMaxCanBuy() {
    console.log(this._worldmoney)
    this.max = Math.trunc((Math.log(1-((this._worldmoney/this.product.cout)*(1-this.product.croissance))))/Math.log(this.product.croissance))

  }

  calcProchainPalier(){
    if (this.product.paliers.filter((p) => p.unlocked==false).length!=0) {
      this.prochainPalier= this.product.paliers.filter((p) => p.unlocked==false)[0].seuil;
    }
  }

  calcNewCout(){
    if(this.product.quantite>0){
      this.nouveaucout = this.product.cout*Math.pow(this.product.croissance,this.multiValue)
    }
    else{
      this.nouveaucout = this.product.cout
    }
    return this.nouveaucout
  }

  calcCoutTot(){
    this.coutAfficher=this.product.cout*((1-Math.pow(this.product.croissance,this.multiValue))/(1-this.product.croissance))
  }

 
    

}

