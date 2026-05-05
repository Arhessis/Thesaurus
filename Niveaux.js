function passerAuNiveauSuivant(objScene3D) {
    let niveauActuel = parseInt(document.getElementById('niveau').innerText);
    niveauActuel++;

    if (niveauActuel > 10) {
        boucleActive = false;
        clearInterval(intervalleMinuterie);

        let secondes = parseInt(document.getElementById('seconde').innerText);
        let scoreFinal = parseInt(document.getElementById('score').innerText) + (secondes * 10);
        document.getElementById('score-final').innerText = scoreFinal;

        document.getElementById('hud-container').style.display = 'none';
        document.getElementById('monCanvas').style.display = 'none';
        document.getElementById('victoire-container').style.display = 'flex';

        if (document.exitPointerLock) {
            document.exitPointerLock();
        }

        jouerSon('./Sounds/Victory7.mp3');

        return;
    }

    document.getElementById('niveau').innerText = niveauActuel;

    let secondes = parseInt(document.getElementById('seconde').innerText);
    let score = parseInt(document.getElementById('score').innerText);

    score += (secondes * 10);

    document.getElementById('score').innerText = score;

    document.getElementById('seconde').innerText = "60";
    demarrerMinuterie();
    jouerSon('./Sounds/levelstart1.mp3');

    const sequenceOuvreurs = [4, 4, 3, 3, 2, 2, 1, 1, 0, 0];
    let ouvreurs = sequenceOuvreurs[niveauActuel - 1];
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

    for (let i = 0; i < objScene3D.tabObjets3D.length; i++) {
        let objet = objScene3D.tabObjets3D[i];
        if (objet.typeObjet === "mur" && objet.texels && objet.texels.intNoTexture === TEX_OUVRABLES) {
            let posMur = getPositionsXYZ(objet.transformations);
            objScene3D.dedale[Math.floor(posMur[2])][Math.floor(posMur[0])] = MUR_OUVRABLE;
        }
    }

    let randomXTresor, randomZTresor;
    do {
        randomXTresor = Math.floor(Math.random() * TAILLE_DEDALE);
        randomZTresor = Math.floor(Math.random() * TAILLE_DEDALE);
    } while (objScene3D.dedale[randomZTresor][randomXTresor] !== COULOIR || (randomXTresor >= 14 && randomXTresor <= 16 && randomZTresor >= 14 && randomZTresor <= 16));

    setPositionsXYZ([randomXTresor + 0.5, 0, randomZTresor + 0.5], objScene3D.tresor.transformations);

    let nbFleches = 18 - ((niveauActuel - 1) * 2);

    objScene3D.tabObjets3D = objScene3D.tabObjets3D.filter(obj =>
        obj.typeObjet !== "fleche" &&
        obj.typeObjet !== "teleporteur" &&
        obj.typeObjet !== "recepteur"
    );
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
                !(randomX >= 14 && randomX <= 16 && randomZ >= 14 && randomZ <= 16) &&
                !(randomX === randomXTresor && randomZ === randomZTresor)) {
                celluleValide = true;
            }
        }

        setPositionsXYZ([randomX + 0.5, 0.6, randomZ + 0.5], fleche.transformations);
        objScene3D.tabFleches.push(fleche);
        objScene3D.tabObjets3D.push(fleche);
    }

    pointeVersTresor(objScene3D);

    // --- NOUVEAUX TÉLÉ-TRANSPORTEURS ---
    objScene3D.tabTeleporteurs = [];
    let nbTeleporteurs = Math.floor(niveauActuel / 2);

    for (let i = 0; i < nbTeleporteurs; i++) {
        let tel = creerTeleporteur(objgl);
        tel.typeObjet = "teleporteur";
        setEchellesXYZ([1, 1, 1], tel.transformations);
        let randomX, randomZ;
        let celluleValide = false;
        while (!celluleValide) {
            randomX = Math.floor(Math.random() * TAILLE_DEDALE);
            randomZ = Math.floor(Math.random() * TAILLE_DEDALE);
            if (objScene3D.dedale[randomZ][randomX] === COULOIR &&
                !(randomX >= 14 && randomX <= 16 && randomZ >= 14 && randomZ <= 16) &&
                !(randomX === randomXTresor && randomZ === randomZTresor)) {
                let conflit = false;
                for (let j = 0; j < objScene3D.tabFleches.length; j++) {
                    let posF = getPositionsXYZ(objScene3D.tabFleches[j].transformations);
                    if (Math.floor(posF[0]) === randomX && Math.floor(posF[2]) === randomZ) { conflit = true; break; }
                }
                for (let j = 0; j < objScene3D.tabTeleporteurs.length; j++) {
                    let posT = getPositionsXYZ(objScene3D.tabTeleporteurs[j].transformations);
                    if (Math.floor(posT[0]) === randomX && Math.floor(posT[2]) === randomZ) { conflit = true; break; }
                }
                if (!conflit) celluleValide = true;
            }
        }
        setPositionsXYZ([randomX, 0.01, randomZ], tel.transformations);
        objScene3D.tabTeleporteurs.push(tel);
        objScene3D.tabObjets3D.push(tel);
    }

    // --- NOUVEAUX TÉLÉ-RÉCEPTEURS ---
    objScene3D.tabRecepteurs = [];
    let nbRecepteurs = niveauActuel - 1;

    for (let i = 0; i < nbRecepteurs; i++) {
        let rec = creerRecepteur(objgl);
        rec.typeObjet = "recepteur";
        setEchellesXYZ([1, 1, 1], rec.transformations);
        let randomX, randomZ;
        let celluleValide = false;
        while (!celluleValide) {
            randomX = Math.floor(Math.random() * TAILLE_DEDALE);
            randomZ = Math.floor(Math.random() * TAILLE_DEDALE);
            if (objScene3D.dedale[randomZ][randomX] === COULOIR &&
                !(randomX >= 14 && randomX <= 16 && randomZ >= 14 && randomZ <= 16) &&
                !(randomX === randomXTresor && randomZ === randomZTresor)) {
                let conflit = false;
                for (let j = 0; j < objScene3D.tabFleches.length; j++) {
                    let posF = getPositionsXYZ(objScene3D.tabFleches[j].transformations);
                    if (Math.floor(posF[0]) === randomX && Math.floor(posF[2]) === randomZ) { conflit = true; break; }
                }
                for (let j = 0; j < objScene3D.tabTeleporteurs.length; j++) {
                    let posT = getPositionsXYZ(objScene3D.tabTeleporteurs[j].transformations);
                    if (Math.floor(posT[0]) === randomX && Math.floor(posT[2]) === randomZ) { conflit = true; break; }
                }
                for (let j = 0; j < objScene3D.tabRecepteurs.length; j++) {
                    let posR = getPositionsXYZ(objScene3D.tabRecepteurs[j].transformations);
                    if (Math.floor(posR[0]) === randomX && Math.floor(posR[2]) === randomZ) { conflit = true; break; }
                }
                if (!conflit) celluleValide = true;
            }
        }
        setPositionsXYZ([randomX, 0.01, randomZ], rec.transformations);
        objScene3D.tabRecepteurs.push(rec);
        objScene3D.tabObjets3D.push(rec);
    }

}

function verifierScore() {
    let scoreActuel = parseInt(document.getElementById('score').innerText) || 0;
    if (scoreActuel < 200) {
        clearInterval(intervalleMinuterie);
        boucleActive = false;

        document.getElementById('hud-container').style.display = 'none';
        document.getElementById('monCanvas').style.display = 'none';
        document.getElementById('defaite-container').style.display = 'flex';

        if (document.exitPointerLock) {
            document.exitPointerLock();
        }

        jouerSon('./Sounds/GameOver6.mp3');
        return true;
    }
    return false;
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

        if (objScene3D && objScene3D.binVueAerienne) {
            let scoreActuel = parseInt(document.getElementById('score').innerText);
            scoreActuel -= 10;
            document.getElementById('score').innerText = scoreActuel;

            if (scoreActuel < 10) {
                objScene3D.camera = objScene3D.cameraJoueur.slice();
                objScene3D.binVueAerienne = false;
                objScene3D.binTriche = false;
                effacerCanevas(objgl);
                dessiner(objgl, objProgShaders, objScene3D);
            }
        }

        if (tempsRestant > 0) {
            tempsRestant--;
            document.getElementById('seconde').innerText = tempsRestant;
        } else {
            if (verifierScore()) {
                return;
            }
            jouerSon('./Sounds/Fail3.mp3');
            recommencerNiveau(objScene3D);
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

    const sequenceOuvreurs = [4, 4, 3, 3, 2, 2, 1, 1, 0, 0];
    let ouvreurs = sequenceOuvreurs[niveauActuel - 1];
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