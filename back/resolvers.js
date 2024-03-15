
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
    let quantityProduced = 0;
    let remainingTime = product.timeleft - elapsedTime;

    if (!product.managerUnlocked) {
        if (product.timeleft !== 0 && remainingTime <= 0) {
            product.timeleft = 0;
            quantityProduced = 1;
        } else if (product.timeleft !== 0 && remainingTime > 0) {
            product.timeleft -= elapsedTime;
        }
    } else {
        if (remainingTime < 0) {
            let productionCycles = Math.floor(-remainingTime / product.vitesse);
            product.timeleft = product.vitesse - (-remainingTime % product.vitesse);
            quantityProduced = 1 + productionCycles;
        } else if (remainingTime === 0) {
            product.timeleft = product.vitesse;
            quantityProduced = 1;
        } else {
            product.timeleft -= elapsedTime;
        }
    }

    return quantityProduced;
}



let tests = [
    { p: { vitesse: 2370, timeleft: 0, managerUnlocked: false }, elapseTime: 7000, qt: 0, timeleft: 0 },
    { p: { vitesse: 2876, timeleft: 2385, managerUnlocked: false }, elapseTime: 7393, qt: 1, timeleft: 0 },
    { p: { vitesse: 2927, timeleft: 2355, managerUnlocked: false }, elapseTime: 5606, qt: 1, timeleft: 0 },
    { p: { vitesse: 1700, timeleft: 813, managerUnlocked: false }, elapseTime: 118, qt: 0, timeleft: 695 },
    { p: { vitesse: 2807, timeleft: 589, managerUnlocked: false }, elapseTime: 2433, qt: 1, timeleft: 0 },
    { p: { vitesse: 20, timeleft: 18, managerUnlocked: false }, elapseTime: 4252, qt: 1, timeleft: 0 },
    { p: { vitesse: 5140, timeleft: 4108, managerUnlocked: false }, elapseTime: 3875, qt: 0, timeleft: 233 },
    { p: { vitesse: 3481, timeleft: 1731, managerUnlocked: false }, elapseTime: 4711, qt: 1, timeleft: 0 },
    { p: { vitesse: 5677, timeleft: 1386, managerUnlocked: false }, elapseTime: 5773, qt: 1, timeleft: 0 },
    { p: { vitesse: 133, timeleft: 124, managerUnlocked: false }, elapseTime: 311, qt: 1, timeleft: 0 },
    { p: { vitesse: 4995, timeleft: 2315, managerUnlocked: false }, elapseTime: 736, qt: 0, timeleft: 1579 },
    { p: { vitesse: 890, timeleft: 732, managerUnlocked: true }, elapseTime: 19502, qt: 22, timeleft: 810 },
    { p: { vitesse: 1829, timeleft: 480, managerUnlocked: true }, elapseTime: 17302, qt: 10, timeleft: 1468 },
    { p: { vitesse: 2359, timeleft: 1989, managerUnlocked: true }, elapseTime: 4133, qt: 1, timeleft: 215 },
    { p: { vitesse: 4610, timeleft: 2390, managerUnlocked: true }, elapseTime: 12723, qt: 3, timeleft: 3497 },
    { p: { vitesse: 5660, timeleft: 5235, managerUnlocked: true }, elapseTime: 15256, qt: 2, timeleft: 1299 },
    { p: { vitesse: 1819, timeleft: 860, managerUnlocked: true }, elapseTime: 5679, qt: 3, timeleft: 638 },
    { p: { vitesse: 56, timeleft: 46, managerUnlocked: true }, elapseTime: 5515, qt: 98, timeleft: 19 },
    { p: { vitesse: 507, timeleft: 97, managerUnlocked: true }, elapseTime: 18235, qt: 36, timeleft: 114 },
    { p: { vitesse: 3804, timeleft: 3168, managerUnlocked: true }, elapseTime: 4958, qt: 1, timeleft: 2014 },
    { p: { vitesse: 440, timeleft: 64, managerUnlocked: true }, elapseTime: 15685, qt: 36, timeleft: 219 },
    ]
    
    tests.forEach( t => {
        let product = { ... t.p }
        qt = calcQtProductionforElapseTime(product, t.elapseTime)
        if (qt !== t.qt) {
            console.log("Quantité de production incorrecte pour le produit: " + JSON.stringify(t.p) + " avec un temps écoulé de " + t.elapseTime + "ms")
            console.log("attendu: " + t.qt+", obtenu: "+qt)
        }
        if (product.timeleft !== t.timeleft) {
            console.log("Timeleft incorrect pour le produit: " + JSON.stringify(t.p) + " avec un temps écoulé de " + t.elapseTime + "ms")
            console.log("attendu: " + t.timeleft+", obtenu: "+product.timeleft)
    
        }
    })
    



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

    }

    
};

