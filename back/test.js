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
        if (qt == t.qt) {
           console.log("Quantité correct")
        }
        if (product.timeleft == t.timeleft) {
            console.log("Timeleft correct")
        }  
    })
    