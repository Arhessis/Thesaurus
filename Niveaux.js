function passerAuNiveauSuivant(objScene3D) {
    let niveauActuel = parseInt(document.getElementById('niveau').innerText);
    niveauActuel++;

    if (niveauActuel > 10) {
        boucleActive = false;
        return;
    }

    document.getElementById('niveau').innerText = niveauActuel;

    let secondes = parseInt(document.getElementById('seconde').innerText);
    let score = parseInt(document.getElementById('score').innerText);

    score += (secondes * 10);

    document.getElementById('score').innerText = score;

    document.getElementById('seconde').innerText = "60";
    demarrerMinuterie();

    let ouvreurs = Math.floor((10 - niveauActuel) / 2) + (niveauActuel % 2 !== 0 ? 0 : 1);
    if (niveauActuel === 1 || niveauActuel === 2) ouvreurs = 4;
    document.getElementById('ouvreursMurs').innerText = ouvreurs;
    objScene3D.nbMursDetruisables = ouvreurs;

    setPositionsCameraXYZ([15.5, 0.5, 15.5], objScene3D.camera);
    setCiblesCameraXYZ([15.5, 0.5, 16.5], objScene3D.camera);
    setOrientationsXYZ([0, 1, 0], objScene3D.camera);

    if (objScene3D.cameraJoueur) {
        setPositionsCameraXYZ([15.5, 0.5, 15.5], objScene3D.cameraJoueur);
        setCiblesCameraXYZ([15.5, 0.5, 16.5], objScene3D.cameraJoueur);
        setOrientationsXYZ([0, 1, 0], objScene3D.cameraJoueur);
    }

    objScene3D.tresorTrouve = false;
    objScene3D.aQuittéSpawn = false;
    objScene3D.murSpawn.actif = false;
    objScene3D.binVueAerienne = false;
    objScene3D.dedale[17][15] = COULOIR;

    let randomXTresor, randomZTresor;
    do {
        randomXTresor = Math.floor(Math.random() * TAILLE_DEDALE);
        randomZTresor = Math.floor(Math.random() * TAILLE_DEDALE);
    } while (objScene3D.dedale[randomZTresor][randomXTresor] !== COULOIR || (randomXTresor === 15 && randomZTresor === 15));

    setPositionsXYZ([randomXTresor + 0.5, 0, randomZTresor + 0.5], objScene3D.tresor.transformations);

    let nbFleches = 18 - ((niveauActuel - 1) * 2);

    objScene3D.tabObjets3D = objScene3D.tabObjets3D.filter(obj => obj.typeObjet !== "fleche");
    objScene3D.tabFleches = [];

    for (let i = 0; i < nbFleches; i++) {
        let fleche = creerFleche(objgl, [1.0, 0.84, 0.0, 1.0]);
        fleche.typeObjet = "fleche";
        setEchellesXYZ([0.2, 0.2, 0.2], fleche.transformations);

        let randomX, randomZ;
        let celluleValide = false;

        while (!celluleValide) {
            randomX = Math.floor(Math.random() * TAILLE_DEDALE);
            randomZ = Math.floor(Math.random() * TAILLE_DEDALE);

            if (objScene3D.dedale[randomZ][randomX] === COULOIR &&
                !(randomX === randomXTresor && randomZ === randomZTresor) &&
                !(randomX === 15 && randomZ === 15)) {
                celluleValide = true;
            }
        }

        setPositionsXYZ([randomX + 0.5, 0.6, randomZ + 0.5], fleche.transformations);
        objScene3D.tabFleches.push(fleche);
        objScene3D.tabObjets3D.push(fleche);
    }

    pointeVersTresor(objScene3D);

}

function demarrerMinuterie() {
    clearInterval(intervalleMinuterie);
    document.getElementById('seconde').innerText = DUREE_NIVEAU_TEST;

    intervalleMinuterie = setInterval(function () {
        let tempsRestant = parseInt(document.getElementById('seconde').innerText);

        if (tempsRestant > 11) {
            document.getElementById('hud-timer').className = "sHUD-font-color-white";
        } else {
            document.getElementById('hud-timer').className = "sHUD-font-color-red";
        }

        if (tempsRestant > 0) {
            tempsRestant--;
            document.getElementById('seconde').innerText = tempsRestant;
        } else {
            let scoreActuel = parseInt(document.getElementById('score').innerText);
            if (scoreActuel < 200) {
                clearInterval(intervalleMinuterie);
                boucleActive = false;
                alert("Game Over! Score inférieur à 200.");
                // Add GameOver audio trigger here later
            } else {
                recommencerNiveau(objScene3D);
            }
        }
    }, 1000);
}

function recommencerNiveau(objScene3D) {
    let scoreActuel = parseInt(document.getElementById('score').innerText);
    document.getElementById('score').innerText = scoreActuel - 200;

    document.getElementById('seconde').innerText = DUREE_NIVEAU_TEST;

    setPositionsCameraXYZ([15.5, 0.5, 15.5], objScene3D.camera);
    setCiblesCameraXYZ([15.5, 0.5, 16.5], objScene3D.camera);
    setOrientationsXYZ([0, 1, 0], objScene3D.camera);

    if (objScene3D.cameraJoueur) {
        setPositionsCameraXYZ([15.5, 0.5, 15.5], objScene3D.cameraJoueur);
        setCiblesCameraXYZ([15.5, 0.5, 16.5], objScene3D.cameraJoueur);
        setOrientationsXYZ([0, 1, 0], objScene3D.cameraJoueur);
    }

    objScene3D.tresorTrouve = false;
    objScene3D.aQuittéSpawn = false;
    objScene3D.murSpawn.actif = false;
    objScene3D.dedale[17][15] = COULOIR;

    let niveauActuel = parseInt(document.getElementById('niveau').innerText);

    const sequenceOuvreurs = [4, 4, 4, 3, 3, 2, 2, 1, 1, 0];
    let ouvreurs = sequenceOuvreurs[niveauActuel - 1];

    if (niveauActuel === 1 || niveauActuel === 2) ouvreurs = 4;
    document.getElementById('ouvreursMurs').innerText = ouvreurs;
    objScene3D.nbMursDetruisables = ouvreurs;

    for (let i = 0; i < objScene3D.tabObjets3D.length; i++) {
        let objet = objScene3D.tabObjets3D[i];
        if (objet.typeObjet === "mur" && objet.texels && objet.texels.intNoTexture === TEX_OUVRABLES) {
            let posMur = getPositionsXYZ(objet.transformations);
            objScene3D.dedale[Math.floor(posMur[2])][Math.floor(posMur[0])] = MUR_OUVRABLE;
        }
    }
}