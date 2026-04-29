function creerPointeur(objgl, rgba) {
    let objet3D = new Object();

    objet3D.vertex = creerGeometriePointeur(objgl);

    objet3D.couleurs = creerCouleursBuffer(objgl, rgba, 4);
    objet3D.maillage = creerMaillagePointeur(objgl);
    objet3D.transformations = creerTransformations();

    return objet3D;
}

function creerGeometriePointeur(objgl) {
    let buf = objgl.createBuffer();
    let tab = [
        0.0, 0.0, 0.5,  
        0.3, 0.0, -0.3, 
        0.0, 0.0, -0.1, 
        -0.3, 0.0, -0.3   
    ];

    objgl.bindBuffer(objgl.ARRAY_BUFFER, buf);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tab), objgl.STATIC_DRAW);

    return buf;
}

function creerMaillagePointeur(objgl) {
    let buf = objgl.createBuffer();
    let tabMaillage = [
        0, 1, 2, 
        0, 2, 3   
    ];

    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, buf);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    buf.intNbTriangles = 2;
    buf.intNbDroites = 0;

    return buf;
}

