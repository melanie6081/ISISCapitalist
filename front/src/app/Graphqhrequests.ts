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
<<<<<<< HEAD
lancerProductionProduit(id: $id) {
id
}
=======
    lancerProductionProduit(id: $id) {
        id
    }
>>>>>>> 9d1c1a8bc6693b512cd98b89271798938f657f23
}`

export const ENGAGER_MANAGER = gql`
mutation engagerManager($name: String!){
    engagerManager(name: $name){
        name
    }
}`

export const ACHAT_PRODUIT = gql`
<<<<<<< HEAD
mutation engagerManager($name: String!){
    engagerManager(name: $name){
        name
=======
mutation acheterQtProduit($id: Int!, $quantite: Int!){
    acheterQtProduit(id: $id, quantite: $quantite){
        quantite
>>>>>>> 9d1c1a8bc6693b512cd98b89271798938f657f23
    }
}`

