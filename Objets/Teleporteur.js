function creerTeleporteur(objgl, rgba) {
    let objet3D = new Object();

    objet3D.vertex = creerGeometrieTeleporteur(objgl);
    objet3D.couleurs = creerCouleursBuffer(objgl, rgba, 8);
    objet3D.maillage = creerMaillageTeleporteur(objgl);
    objet3D.texels = creerTextelsTeleporteur(objgl);
    objet3D.transformations = creerTransformations();

    return objet3D;
}