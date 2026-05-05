function creerTeleporteur(objgl) {
    let objet3D = new Object();
    objet3D.vertex = creerGeometrieTeleporteur(objgl);

    let tabCouleurs = [];

    let gris = [0.4, 0.4, 0.4, 1.0];
    for (let i = 0; i < 4; i++) { tabCouleurs.push(...gris); }

    tabCouleurs.push(1.0, 0.5, 0.0, 1.0);

    let orangeFonce = [0.8, 0.3, 0.0, 0.8];
    for (let i = 0; i < 8; i++) { tabCouleurs.push(...orangeFonce); }

    let bufCouleurs = objgl.createBuffer();
    objgl.bindBuffer(objgl.ARRAY_BUFFER, bufCouleurs);
    objgl.bufferData(objgl.ARRAY_BUFFER, new Float32Array(tabCouleurs), objgl.STATIC_DRAW);

    objet3D.couleurs = bufCouleurs;

    objet3D.maillage = creerMaillageTeleporteur(objgl);
    objet3D.texels = null;
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

function creerMaillageTeleporteur(objgl) {
    let buf = objgl.createBuffer();

    let tabMaillage = [
        0, 1, 2,
        0, 2, 3,

        4, 5, 6,
        4, 6, 7,
        4, 7, 8,
        4, 8, 9,
        4, 9, 10,
        4, 10, 11,
        4, 11, 12,
        4, 12, 5
    ];

    objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, buf);
    objgl.bufferData(objgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabMaillage), objgl.STATIC_DRAW);

    buf.intNbTriangles = 10;
    buf.intNbDroites = 0;

    return buf;
}

function verifierTeleportation(objScene3D) {
    if (!objScene3D.tabTeleporteurs || objScene3D.tabTeleporteurs.length === 0) return;
    if (!objScene3D.tabRecepteurs || objScene3D.tabRecepteurs.length === 0) return;

    let camX = getPositionCameraX(objScene3D.camera);
    let camZ = getPositionCameraZ(objScene3D.camera);

    for (let i = 0; i < objScene3D.tabTeleporteurs.length; i++) {
        let posTel = getPositionsXYZ(objScene3D.tabTeleporteurs[i].transformations);

        let distance = Math.sqrt(Math.pow(posTel[0] - camX, 2) + Math.pow(posTel[2] - camZ, 2));

        if (distance < 0.8) {
            let indexRecepteur = Math.floor(Math.random() * objScene3D.tabRecepteurs.length);
            let posRec = getPositionsXYZ(objScene3D.tabRecepteurs[indexRecepteur].transformations);

            setPositionCameraX(posRec[0] + 0.5, objScene3D.camera);
            setPositionCameraZ(posRec[2] + 0.5, objScene3D.camera);

            let dir = getDirectionCameraXYZ(objScene3D.camera);
            setCibleCameraX(posRec[0] + 0.5 + dir[0], objScene3D.camera);
            setCibleCameraZ(posRec[2] + 0.5 + dir[2], objScene3D.camera);

            jouerSon('./Sounds/teleport5.mp3');

            break;
        }
    }
}