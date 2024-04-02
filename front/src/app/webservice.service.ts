import { Injectable } from '@angular/core';
import { createClient, fetchExchange } from '@urql/core';
import { BACKEND, GET_WORLD, LANCER_PRODUCTION, ENGAGER_MANAGER, ACHAT_PRODUIT, ACHAT_UPGRADE} from './Graphqhrequests';
import { Product } from './world';

@Injectable({
  providedIn: 'root'
})
export class WebserviceService {

  server = BACKEND+'/graphql';
  user = ' ';

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

  achatProduit(product: Product, qt: number){
    return this.createClient().mutation(ACHAT_PRODUIT, { id: product.id, quantite: qt}).toPromise();
  }

  achatUpgrade(palier: any){
    return this.createClient().mutation(ACHAT_UPGRADE, {name: palier.name}).toPromise();
  }

}
