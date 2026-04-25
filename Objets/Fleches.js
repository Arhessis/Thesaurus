function creerFleche(objgl, rgba) {
    let objet3D = new Object();

    objet3D.vertex = creerGeometrieFleche(objgl);

    objet3D.couleurs = creerCouleursBuffer(objgl, rgba, 40);
    objet3D.maillage = creerMaillageFleche(objgl);
    objet3D.transformations = creerTransformations();

    return objet3D;
}

function creerGeometrieFleche(objgl) {
    let buf = objgl.createBuffer();
    // Creates a pyramid pointing towards the positive Z axis
    let tab = [
        // === LE MANCHE (La tige de la flèche) - 24 sommets ===
        // Face arrière (Z = 0.0)
        0.4, 0.4, 0.0, 0.6, 0.4, 0.0, 0.6, 0.6, 0.0, 0.4, 0.6, 0.0,
        // Face avant (Z = 0.5)
        0.4, 0.4, 0.5, 0.6, 0.4, 0.5, 0.6, 0.6, 0.5, 0.4, 0.6, 0.5,
        // Face dessus (Y = 0.6)
        0.4, 0.6, 0.0, 0.6, 0.6, 0.0, 0.6, 0.6, 0.5, 0.4, 0.6, 0.5,
        // Face dessous (Y = 0.4)
        0.4, 0.4, 0.0, 0.6, 0.4, 0.0, 0.6, 0.4, 0.5, 0.4, 0.4, 0.5,
        // Face droite (X = 0.6)
        0.6, 0.4, 0.0, 0.6, 0.6, 0.0, 0.6, 0.6, 0.5, 0.6, 0.4, 0.5,
        // Face gauche (X = 0.4)
        0.4, 0.4, 0.0, 0.4, 0.6, 0.0, 0.4, 0.6, 0.5, 0.4, 0.4, 0.5,

        // === LA POINTE (La tête de la flèche) - 16 sommets ===
        // Base de la pyramide attachée au manche (Z = 0.5)
        0.2, 0.2, 0.5, 0.8, 0.2, 0.5, 0.8, 0.8, 0.5, 0.2, 0.8, 0.5,
        // Triangle dessous (pointe vers Z=1.0)
        0.2, 0.2, 0.5, 0.8, 0.2, 0.5, 0.5, 0.5, 1.0,
        // Triangle dessus
        0.2, 0.8, 0.5, 0.8, 0.8, 0.5, 0.5, 0.5, 1.0,
        // Triangle droite
        0.8, 0.2, 0.5, 0.8, 0.8, 0.5, 0.5, 0.5, 1.0,
        // Triangle gauche
        0.2, 0.2, 0.5, 0.2, 0.8, 0.5, 0.5, 0.5, 1.0
    ];
    objgl.bindBuffer(objgl.ARRAY_BUFFER, buf);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tab), objgl.STATIC_DRAW);
    return buf;
}

function creerMaillageFleche(objgl) {
    let buf = objgl.createBuffer();

    var tabMaillage = [
        // Maillage du manche (12 triangles)
        0, 1, 2, 0, 2, 3,     // Arrière
        4, 5, 6, 4, 6, 7,     // Avant
        8, 9, 10, 8, 10, 11,   // Dessus
        12, 13, 14, 12, 14, 15,  // Dessous
        16, 17, 18, 16, 18, 19,  // Droite
        20, 21, 22, 20, 22, 23,  // Gauche

        // Maillage de la pointe (6 triangles)
        24, 25, 26, 24, 26, 27,  // Base de la pyramide
        28, 29, 30,               // Dessous
        31, 32, 33,               // Dessus
        34, 35, 36,               // Droite
        37, 38, 39                // Gauche
    ];
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, buf);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    buf.intNbTriangles = 18;
    buf.intNbDroites = 0;

    return buf;
}

function pointeVersTresor(objScene3D) {
    let tresor = objScene3D.tresor;
    let tabFleches = objScene3D.tabFleches;

    if (!tresor || !tabFleches) return;

    let tresorX = getPositionX(tresor.transformations);
    let tresorZ = getPositionZ(tresor.transformations);

    for (let i = 0; i < tabFleches.length; i++) {
        let fleche = tabFleches[i];

        let flecheX = getPositionX(fleche.transformations);
        let flecheZ = getPositionZ(fleche.transformations);

        let dx = tresorX - flecheX;
        let dz = tresorZ - flecheZ;

        let angleRadian = Math.atan2(dx, dz);
        let angleDegre = angleRadian * (180 / Math.PI);

        setAngleY(angleDegre, fleche.transformations);
    }
}