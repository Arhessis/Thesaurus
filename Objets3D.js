function creerGeometriePlan(objgl) {
    let buf = objgl.createBuffer();
    let tab = [-1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1];
    objgl.bindBuffer(objgl.ARRAY_BUFFER, buf);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tab), objgl.STATIC_DRAW);
    return buf;
}

function creerGeometrieCube(objgl) {
    let buf = objgl.createBuffer();
    let tab = [
        0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0,  // face avant
        0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1   // face arrière
    ];
    objgl.bindBuffer(objgl.ARRAY_BUFFER, buf);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tab), objgl.STATIC_DRAW);
    return buf;
}

function creerMaillageCube(objgl) {
    var objMaillageCube = objgl.createBuffer();

    var tabMaillage = [
        // Face avant (Z=0)
        0, 1, 2, 0, 2, 3,
        // Face arrière (Z=1)
        5, 4, 7, 5, 7, 6,
        // Face gauche (X=0)
        4, 0, 3, 4, 3, 7,
        // Face droite (X=1)
        1, 5, 6, 1, 6, 2,
        // Face haut (Y=1)
        3, 2, 6, 3, 6, 7,
        // Face bas (Y=0) — optionnel, collée sur le plancher
        4, 5, 1, 4, 1, 0
    ];

    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, objMaillageCube);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    objMaillageCube.intNbTriangles = 12; // 6 faces × 2 triangles
    objMaillageCube.intNbDroites = 0;    // plus de droites

    return objMaillageCube;
}

function creerCouleursBuffer(objgl, rgba, nbSommets) {
    let buf = objgl.createBuffer();
    let tab = [];

    for (let i = 0; i < nbSommets; i++) {
        tab = tab.concat(rgba);
    }

    objgl.bindBuffer(objgl.ARRAY_BUFFER, buf);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tab), objgl.STATIC_DRAW);

    return buf;
}

function creerCubeColoré(objgl, rgba) {
    let objet3D = new Object();

    objet3D.vertex = creerGeometrieCube(objgl);
    objet3D.couleurs = creerCouleursBuffer(objgl, rgba, 8);
    objet3D.maillage = creerMaillageCube(objgl);
    objet3D.texels = null;
    objet3D.transformations = creerTransformations();

    return objet3D;
}

function creerPlanTexturé(objgl, noTexture, pcCouleur) {
    let obj = new Object();

    obj.vertex = creerGeometriePlan(objgl);
    obj.vertex.typeDessin = objgl.TRIANGLE_FAN;
    obj.couleurs = creerCouleursBuffer(objgl, [1.0, 1.0, 1.0, 1.0], 4);
    obj.maillage = null;
    obj.transformations = creerTransformations();

    let buf = objgl.createBuffer();
    let tabTexels = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];
    objgl.bindBuffer(objgl.ARRAY_BUFFER, buf);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabTexels), objgl.STATIC_DRAW);
    buf.intNoTexture = noTexture;
    buf.pcCouleurTexel = pcCouleur;
    obj.texels = buf;

    return obj;
}