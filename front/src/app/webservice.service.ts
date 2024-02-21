import { Injectable } from '@angular/core';
import { Client, fetchExchange } from '@urql/core';
import { BACKEND, GET_WORLD } from './Graphqhrequests';

@Injectable({
  providedIn: 'root'
})
export class WebserviceService {

  server = BACKEND+'/graphql';
  user = ' ';

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

  getWorld(){
    return this.createClient().query(GET_WORLD, {}).toPromise();
  }

}
