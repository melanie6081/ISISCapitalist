import { Component, Input } from '@angular/core';
import { Product } from '../world';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent {
  @Input()
  product : Product = new Product()

  @Input()
  money : number = 0
}
