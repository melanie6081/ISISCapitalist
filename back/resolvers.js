
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
        
        updateScore(context)
        context.world.lastupdate=Date.now().toString()
}


function calcQtProductionforElapseTime(product, elapsedTime) {
    let qt = 0;
    if (!product.managerUnlocked) {
        if (product.timeleft !== 0 && (product.timeleft - elapsedTime) <= 0) {
            product.timeleft = 0;
            qt = 1;
        } else if (product.timeleft !== 0 && (product.timeleft - elapsedTime) > 0) {
            product.timeleft -= elapsedTime;
        }
    } else {
        if ((product.timeleft - elapsedTime) < 0) {
            let productionCycles = Math.floor(-(product.timeleft - elapsedTime) / product.vitesse);
            product.timeleft = product.vitesse - (-(product.timeleft - elapsedTime) % product.vitesse);
            qt = 1 + productionCycles;
        } else if ((product.timeleft - elapsedTime) == 0) {
            product.timeleft = product.vitesse;
            qt = 1;
        } else {
            product.timeleft -= elapsedTime;
        }
    }
    return qt;
}


    
function updateScore(context) {
    let gain = 0

    let time = Date.now() - Number(context.world.lastupdate)
    context.world.products.forEach(p => {
        
        console.log(time)
       
        let qt = calcQtProductionforElapseTime(p, time)
        
        gain += qt * p.revenu +(1 * context.world.activeangels * context.world.angelbonus / 100)
        
    })
    
    context.world.money += gain 
    context.world.score += gain
    context.world.totalangels = 150*Math.pow((score/Math.pow(10, 15)),0.5) - context.world.totalangels
    context.world.activeangels = 150*Math.pow((score/Math.pow(10, 15)),0.5) - context.world.activeangels
    context.world.lastupdate = Date.now().toString()
    
}



function unlockUpgrade(product){
    product.paliers.forEach( p => {
        if(!p.unlocked && product.quantite >= p.seuil){
            if(p.typeratio === "gain"){
                product.revenu *= p.ratio;
            }
            if(p.typeratio === "vitesse"){
                product.vitesse /= p.ratio;
            }
            p.unlocked = true; // Marquer le palier comme déverrouillé
        }
    });
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
          updateScore(context)
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
                    unlockUpgrade(product)                
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
            updateScore(context)
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
            updateScore(context)
            let manager = context.world.managers.find(p => p.name == args.name)
            let product = context.world.products.find(p => p.id == manager.idcible)
            if(!manager){
                throw new Error(`Le manager nommé ${args.name} n'existe pas`)
            }
            else{
                let date = Date.now().toString()
                manager.unlocked = true
                product.managerUnlocked = true
                context.world.lastupdate = date
                saveWorld(context)
            }
            return manager
        },
        acheterCashUpgrade(parent, args, context){
            updateScore(contexte)
            let upgrade = context.world.upgrades.find(p => p.id == args.id)
            let product = context.world.products.find(p => p.id == upgrade.idcible)
            if (!upgrade) {
                throw new Error(
                    `L'upgrade avec l'id ${args.id} n'existe pas`)
            }
            else{    
                if (context.world.money >= args.sueil) {
                    unlockUpgrade(product)
                }
                else{
                    throw new Error(
                        `Pas assez d'argent pour ${args.quantite} ${product.name}`)
                }   
            }
            let date = Date.now().toString()
            context.world.lastupdate = date
            saveWorld(context)

        },
        acheterAngelUpgrade(parent, args, context){
            updateScore(contexte)
            let upgrade = context.world.upgrades.find(p => p.id == args.id)
            let product = context.world.products.find(p => p.id == upgrade.idcible)
            if (!upgrade) {
                throw new Error(
                    `L'upgrade avec l'id ${args.id} n'existe pas`)
            }
            else{    
                if (context.world.money >= args.sueil) {
                    unlockUpgrade(product)
                }
                else{
                    throw new Error(
                        `Pas assez d'argent pour ${args.quantite} ${product.name}`)
                }   
            }

        },
        resetWorld(parent, args, context){
            let world = require("./world")
            context.world = world
            world.totalangels = context.world.totalangels
            world.activeangels = context.world.activeangels
            saveWorld(context)
            return world
        }

        

    }
    
};

