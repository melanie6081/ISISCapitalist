import { Component, Input, OnInit } from '@angular/core';
import { Product} from '../world';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BACKEND } from '../Graphqhrequests';


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

  progressbarvalue: number = 0;
  backend = BACKEND;


  ngOnInit(){
    setInterval(() => { this.calcScore(); }, 100);
  }
  calcScore() {
    throw new Error('Method not implemented.');
  }

  startFabrication(){

  }
}
