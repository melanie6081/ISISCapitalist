
const { resolveObjectURL } = require('buffer')

const fs = require('fs')
const { products, lastupdate } = require('./world')
function saveWorld(context) {
    console.log(context.user)
    fs.writeFile("userworlds/" + context.user + "-world.json",
        JSON.stringify(context.world), err => {
            if (err) {
                console.error(err)
                throw new Error(
                    `Erreur d'écriture du monde coté serveur`)
            }
        })
}


function calcQtProductionforElapseTime(product, elapsedTime) {
    let qt = 0;
    let remainingTime = product.timeleft - elapsedTime;

    if (!product.managerUnlocked) {
        if (product.timeleft !== 0 && remainingTime <= 0) {
            product.timeleft = 0;
            qt = 1;
        } else if (product.timeleft !== 0 && remainingTime > 0) {
            product.timeleft -= elapsedTime;
        }
    } else {
        if (remainingTime < 0) {
            let productionCycles = Math.floor(-remainingTime / product.vitesse);
            product.timeleft = product.vitesse - (-remainingTime % product.vitesse);
            qt = 1 + productionCycles;
        } else if (remainingTime == 0) {
            product.timeleft = product.vitesse;
            qt = 1;
        } else {
            product.timeleft -= elapsedTime;
        }
    }

    return qt;
}

    



module.exports = {
    Query: {
        getWorld(parent, args, context) {
            saveWorld(context)
            return context.world
        }
    },
    Mutation: {
        acheterQtProduit(parent, args, context) {
            //updateScore(context)
          let product = context.world.products.find(p => p.id == args.id)
           
            if (!product) {
                throw new Error(
                    `Le produit avec l'id ${args.id} n'existe pas`)
            }
            else{
                let prix = product.cout*((1-Math.pow(product.croissance, args.quantite))/(1-product.croissance))
                let date = Date.now().toString()
                if (context.world.money >= prix) {
                    product.quantite += args.quantite
                    context.world.money -= prix
                    product.cout = product.cout * (Math.pow(product.croissance, args.quantite))                 
                    context.world.lastupdate = date             
                    saveWorld(context)
                    return product
                }
                else{
                    throw new Error(
                        `Pas assez d'argent pour ${args.quantite} ${product.name}`)
                }   
            } 
        },
        lancerProductionProduit(parent, args, context){
            //updateScore(context)
            let product = context.world.products.find(p => p.id == args.id)
            if (!product) {
                throw new Error(
                    `Le produit avec l'id ${args.id} n'existe pas`)
            }
            else{
                let date = Date.now().toString()
                if (product.timeleft == 0){
                product.timeleft = product.vitesse
                context.world.lastupdate = date
                saveWorld(context) 
                }         
            }
            return product             
        },
        engagerManager(parent, args, context) {
            //updateScore(context)
            let manager = context.world.managers.find(p => p.name == args.name)
            let product = context.world.products.find(p => p.id == manager.idcible)
            let cout = context.world.managers.find(p => p.seuil == manager.seuil)
            if(!manager){
                throw new Error(`Le manager nommé ${args.name} n'existe pas`)
            }
            else{
                let date = Date.now().toString()
                manager.unlocked = true
                product.managerUnlocked = true
                context.world.money -= cout
                context.world.lastupdate = date
                saveWorld(context)
            }
            return manager
        },

    }

    
};

