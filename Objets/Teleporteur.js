function creerTeleporteur(objgl, rgba) {
    let objet3D = new Object();

    objet3D.vertex = creerGeometrieTeleporteur(objgl);
    objet3D.couleurs = creerCouleursBuffer(objgl, rgba, 8);
    objet3D.maillage = creerMaillageTeleporteur(objgl);
    objet3D.texels = creerTextelsTeleporteur(objgl);
    objet3D.transformations = creerTransformations();

    return objet3D;
}

function creerGeometrieTeleporteur(objgl) {
    let buf = objgl.createBuffer();

    const d = 0.283;

    let tab = [
        0.1, 0.0, 0.1,  
        0.9, 0.0, 0.1, 
        0.9, 0.0, 0.9, 
        0.1, 0.0, 0.9, 

        0.5, 0.05, 0.5,


        0.5, 0.05, 0.1,
        0.5 + d, 0.05, 0.5 - d, 
        0.9, 0.05, 0.5, 
        0.5 + d, 0.05, 0.5 + d,   
        0.5, 0.05, 0.9,    
        0.5 - d, 0.05, 0.5 + d,   
        0.1, 0.05, 0.5,    
        0.5 - d, 0.05, 0.5 - d  
    ];

    objgl.bindBuffer(objgl.ARRAY_BUFFER, buf);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tab), objgl.STATIC_DRAW);
    return buf;
}
