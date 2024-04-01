import { Injectable } from '@angular/core';
import { Client, fetchExchange } from '@urql/core';
import { BACKEND, GET_WORLD, LANCER_PRODUCTION, ENGAGER_MANAGER} from './Graphqhrequests';
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
    return new Client({ url : this.server,
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

}
