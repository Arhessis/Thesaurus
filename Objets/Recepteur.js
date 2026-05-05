function creerRecepteur(objgl) {
    let objet3D = new Object();
    
    objet3D.vertex = creerGeometrieTeleporteur(objgl); 
    
    let tabCouleurs = [];
    
    tabCouleurs.push(0.0, 0.8, 1.0, 1.0); 

    let bleuBord = [0.0, 0.3, 0.8, 1.0];
    for(let i=0; i<8; i++) { tabCouleurs.push(...bleuBord); }

    tabCouleurs.push(0.2, 0.2, 0.2, 1.0);

    let grisSol = [0.3, 0.3, 0.3, 1.0];
    for(let i=0; i<8; i++) { tabCouleurs.push(...grisSol); }

    let bufCouleurs = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, bufCouleurs);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);
    
    objet3D.couleurs = bufCouleurs;
    objet3D.maillage = creerMaillageTeleporteur(objgl); 
    objet3D.texels = null;
    objet3D.transformations = creerTransformations();
    
    return objet3D;
}

