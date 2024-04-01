import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { Client, fetchExchange } from '@urql/core';
import { BACKEND, GET_WORLD, LANCER_PRODUCTION, ENGAGER_MANAGER} from './Graphqhrequests';
=======
import { createClient, fetchExchange } from '@urql/core';
import { BACKEND, GET_WORLD, LANCER_PRODUCTION, ENGAGER_MANAGER, ACHAT_PRODUIT} from './Graphqhrequests';
>>>>>>> 9d1c1a8bc6693b512cd98b89271798938f657f23
import { Product } from './world';

@Injectable({
  providedIn: 'root'
})
export class WebserviceService {

  server = BACKEND+'/graphql';
  user = 'x-user';

  constructor() { 
  }

  createClient(){
    return createClient({ url : this.server,
      exchanges: [fetchExchange],
      fetchOptions: () => {
        return {
          headers : {'x-user': this.user},
        }
      }})
  }

  setUser(user: string) {
    this.user = user;
  }

  getWorld(){
    return this.createClient().query(GET_WORLD, {}).toPromise();
  }

  lancerProduction(product: Product) {
    return this.createClient().mutation(LANCER_PRODUCTION, { id:
    product.id}).toPromise();
  }

  engagerManager(palier: any){
    return this.createClient().mutation(ENGAGER_MANAGER, { name:
      palier.name}).toPromise();
  }

<<<<<<< HEAD
=======
  achatProduit(product: Product, qt: number){
    return this.createClient().mutation(ACHAT_PRODUIT, { id: product.id, quantite: qt}).toPromise();
  }

>>>>>>> 9d1c1a8bc6693b512cd98b89271798938f657f23
}
