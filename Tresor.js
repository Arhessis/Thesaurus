function creerTresore(objgl, rgba) {
    let objet3D = new Object();

    objet3D.vertex = creerGeometrieTresor(objgl);
    objet3D.couleurs = creerCouleursBuffer(objgl, rgba, 8);
    objet3D.maillage = creerMaillageCube(objgl);
    objet3D.texels = creerTextelsTresor(objgl);
    objet3D.transformations = creerTransformations();

    return objet3D;
}

function creerGeometrieTresor(objgl) {
    let buf = objgl.createBuffer();
    let tab = [
        // Face avant
        0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        // Face arrière
        1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        // Face dessus
        0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0,
        // Face dessous
        0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        // Face droite
        1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0,
        // Face gauche
        0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0
    ];
    objgl.bindBuffer(objgl.ARRAY_BUFFER, buf);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tab), objgl.STATIC_DRAW);
    return buf;
}

function creerTextelsTresor(objgl) {
    var objTexelsTresor = objgl.createBuffer();
    var tabTexels = [
        // On répète les coordonnées de la texture pour les 6 faces
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Face avant
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Face arrière
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Face dessus
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Face dessous
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, // Face droite
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0  // Face gauche
    ];
    objgl.bindBuffer(objgl.ARRAY_BUFFER, objTexelsTresor);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);

    objTexelsTresor.intNoTexture = TEX_TRESOR;
    objTexelsTresor.pcCouleurTexel = 1.00;

    return objTexelsTresor;
}

function creerMaillageTresor(objgl) {
    var objMaillage = objgl.createBuffer();
    var tabMaillage = [
        0, 1, 2, 0, 2, 3,  // Face avant
        4, 5, 6, 4, 6, 7,  // Face arrière
        8, 9, 10, 8, 10, 11,  // Face dessus
        12, 13, 14, 12, 14, 15,  // Face dessous
        16, 17, 18, 16, 18, 19,  // Face droite
        20, 21, 22, 20, 22, 23   // Face gauche
    ];
    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillage);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    objMaillage.intNbTriangles = 12;
    objMaillage.intNbDroites = 0;

    return objMaillage;
}