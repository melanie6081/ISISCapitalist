import {gql} from "@urql/core";

//export const BACKEND = "https://isiscapitalistgraphql.kk.kurasawa.fr"
//https://isiscapitalistgraphql.kk.kurasawa.fr/graphql
export const BACKEND = "http://localhost:4000"
// ne pas oublier de le lancer npm start
//pour lancer front ng serve

export const GET_WORLD = gql`
    query getWorld {
        
        getWorld {
            name
            logo
            money
            score
            totalangels
            activeangels
            angelbonus
            lastupdate
            products {
                id
                name
                logo
                cout
                croissance
                revenu
                vitesse
                quantite
                timeleft
                managerUnlocked
                paliers {
                    name
                    logo
                    seuil
                    idcible
                    ratio
                    typeratio
                    unlocked
                }
            }
            allunlocks {
                name
                logo
                seuil
                idcible
                ratio
                typeratio
                unlocked
            }
            upgrades {
                name
                logo
                seuil
                idcible
                ratio
                typeratio
                unlocked
            }
            angelupgrades {
                name
                logo
                seuil
                idcible
                ratio
                typeratio
                unlocked
            }
            managers {
                name
                logo
                seuil
                idcible
                ratio
                typeratio
                unlocked
            }
        }
          
          
    }
`

export const LANCER_PRODUCTION = gql`
mutation lancerProductionProduit($id: Int!) {
    lancerProductionProduit(id: $id) {
        id
    }
}`

export const ENGAGER_MANAGER = gql`
mutation engagerManager($name: String!){
    engagerManager(name: $name){
        name
    }
}`

export const ACHAT_PRODUIT = gql`
mutation acheterQtProduit($id: Int!, $quantite: Int!){
    acheterQtProduit(id: $id, quantite: $quantite){
        quantite
    }
}`

export const ACHAT_UPGRADE = gql`
mutation AcheterCashUpgrade($name: String!) {
    acheterCashUpgrade(name: $name) {
      name
    }
  }
`



