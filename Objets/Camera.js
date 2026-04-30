// Librairie sur la cam�ra

// Pour cr�er une cam�ra
// Au point de d�part, le transformations sont neutres.
function creerCamera() {
  var tabCamera = [0, 0, 1, 0, 0, 0, 0, 1, 0];
  return tabCamera;
}

// Pour aller chercher les positions XYZ 
function getPositionsCameraXYZ(tabCamera) {
  return tabCamera.slice(0, 3);
}

// Pour aller chercher la position en X 
function getPositionCameraX(tabCamera) {
  return tabCamera[0];
}

// Pour aller chercher la position en Y
function getPositionCameraY(tabCamera) {
  return tabCamera[1];
}

// Pour aller chercher la position en Z
function getPositionCameraZ(tabCamera) {
  return tabCamera[2];
}

// Pour aller chercher les position cibl�es 
function getCiblesCameraXYZ(tabCamera) {
  return tabCamera.slice(3, 6);
}

// Pour aller chercher la position cibl�e en X 
function getCibleCameraX(tabCamera) {
  return tabCamera[3];
}

// Pour aller chercher la position cibl�e en X
function getCibleCameraY(tabCamera) {
  return tabCamera[4];
}

// Pour aller chercher la position cibl�e en X
function getCibleCameraZ(tabCamera) {
  return tabCamera[5];
}

// Pour aller chercher les orientations XYZ
function getOrientationsXYZ(tabCamera) {
  return tabCamera.slice(6, 9);
}

// Pour aller chercher l'orientation en X
function getOrientationX(tabCamera) {
  return tabCamera[6];
}

// Pour aller chercher l'orientation en Y
function getOrientationY(tabCamera) {
  return tabCamera[7];
}

// Pour aller chercher l'orientation en Z
function getOrientationZ(tabCamera) {
  return tabCamera[8];
}

// Pour modifier les positions XYZ 
function setPositionsCameraXYZ(tabXYZ, tabCamera) {
  tabCamera.splice(0, 3, tabXYZ[0], tabXYZ[1], tabXYZ[2]);
}

// Pour modifier la position en X 
function setPositionCameraX(fltX, tabCamera) {
  tabCamera[0] = fltX;
}

// Pour modifier la position en Y 
function setPositionCameraY(fltY, tabCamera) {
  tabCamera[1] = fltY;
}

// Pour modifier la position en Z 
function setPositionCameraZ(fltZ, tabCamera) {
  tabCamera[2] = fltZ;
}

// Pour modifier les positions cibl�es 
function setCiblesCameraXYZ(tabXYZ, tabCamera) {
  tabCamera.splice(3, 3, tabXYZ[0], tabXYZ[1], tabXYZ[2]);
}

// Pour modifier la position cibl�e en X 
function setCibleCameraX(fltX, tabCamera) {
  tabCamera[3] = fltX;
}

// Pour modifier la position cibl�e en Y 
function setCibleCameraY(fltY, tabCamera) {
  tabCamera[4] = fltY;
}

// Pour modifier la position cibl�e en Z
function setCibleCameraZ(fltZ, tabCamera) {
  tabCamera[5] = fltZ;
}

// Pour modifier les orientations XYZ
function setOrientationsXYZ(tabOrientationsXYZ, tabCamera) {
  tabCamera.splice(6, 3, tabOrientationsXYZ[0], tabOrientationsXYZ[1], tabOrientationsXYZ[2]);
}

// Pour modifier l'orientation en X
function setOrientationX(fltOrientationX, tabCamera) {
  tabCamera[6] = fltOrientationX;
}

// Pour modifier l'orientation en Y
function setOrientationY(fltOrientationY, tabCamera) {
  tabCamera[7] = fltOrientationY;
}

// Pour modifier l'orientation en Z
function setOrientationZ(fltOrientationZ, tabCamera) {
  tabCamera[8] = fltOrientationZ;
}

let nbOuvertures = 3;
function deplacerCamera() {
  var camera = objScene3D.camera;

  if (event.keyCode == 37 || event.keyCode == 39) { // Gauche / Droite
    if (objScene3D.binVueAerienne) return; // Bloque les mouvements en vue aérienne

    var fltX = getCibleCameraX(camera) - getPositionCameraX(camera);
    var fltZ = getCibleCameraZ(camera) - getPositionCameraZ(camera);
    var intDirection = (event.keyCode == 37) ? -1 : 1;
    var fltAngle = intDirection * Math.PI / 90; // Tourner 2 degrés
    var fltXPrime = fltX * Math.cos(fltAngle) - fltZ * Math.sin(fltAngle);
    var fltZPrime = fltX * Math.sin(fltAngle) + fltZ * Math.cos(fltAngle);
    setCibleCameraX(getPositionCameraX(camera) + fltXPrime, camera);
    setCibleCameraZ(getPositionCameraZ(camera) + fltZPrime, camera);
  }
  else if (event.keyCode == 38 || event.keyCode == 40) {
    if (objScene3D.binVueAerienne) return;

    var fltX = getCibleCameraX(camera) - getPositionCameraX(camera);
    var fltZ = getCibleCameraZ(camera) - getPositionCameraZ(camera);
    var fltRayon = Math.sqrt(fltX * fltX + fltZ * fltZ);
    var intDirection = (event.keyCode == 38) ? 1 : -1;

    var fltXPrime = intDirection * 0.2 * Math.cos(Math.acos(fltX / fltRayon));
    var fltZPrime = intDirection * 0.2 * Math.sin(Math.asin(fltZ / fltRayon));

    // Calculate where the camera WOULD move to
    // var newX = getPositionCameraX(camera) + fltXPrime;
    // var newZ = getPositionCameraZ(camera) + fltZPrime;
    var MARGIN = 0.3; // how far from walls to stay
    var newX = getPositionCameraX(camera) + fltXPrime + (fltXPrime > 0 ? MARGIN : -MARGIN);
    var newZ = getPositionCameraZ(camera) + fltZPrime + (fltZPrime > 0 ? MARGIN : -MARGIN);

    // Convert to grid coordinates and check the maze
    var gridX = Math.floor(newX);
    var gridZ = Math.floor(newZ);

    // Only move if the target cell is not a wall
    if (gridX >= 0 && gridZ >= 0 &&
      gridX < TAILLE_DEDALE && gridZ < TAILLE_DEDALE &&
      objScene3D.dedale[gridZ][gridX] === COULOIR) {

      setCibleCameraX(getCibleCameraX(camera) + fltXPrime, camera);
      setCibleCameraZ(getCibleCameraZ(camera) + fltZPrime, camera);
      setPositionCameraX(getPositionCameraX(camera) + fltXPrime, camera);
      setPositionCameraZ(getPositionCameraZ(camera) + fltZPrime, camera);
    }
  }
  else if (event.keyCode == 33) { // Page Up
    if (!objScene3D.binVueAerienne) {
      objScene3D.cameraJoueur = objScene3D.camera.slice(); // Sauvegarde de la position et orientation
      objScene3D.binVueAerienne = true;
      objScene3D.binTriche = false; // La triche est désactivée par défaut au passage en vue aérienne

      // Hauteur à 30 pour voir tout le dédale
      setPositionsCameraXYZ([15.5, 37, 15.5], camera);
      setCiblesCameraXYZ([15.5, 0, 15.5], camera);
      setOrientationsXYZ([0, 0, 1], camera); // L'orientation Z fixe le repère "Nord"
    }
  }
  else if (event.keyCode == 34) { // Page Down
    if (objScene3D.binVueAerienne && objScene3D.cameraJoueur) {
      objScene3D.camera = objScene3D.cameraJoueur.slice(); // Retourne exactement à la vue du joueur
      objScene3D.binVueAerienne = false;
      objScene3D.binTriche = false;
    }
  }
  else if (event.keyCode == 32) { // Barre d'Espace
    if (objScene3D.binVueAerienne) {
      // Mode triche (CTRL + SHIFT + ESPACE) pour afficher ou cacher les objets spéciaux
      if (event.ctrlKey && event.shiftKey) {
        objScene3D.binTriche = !objScene3D.binTriche;
      }
    } else {
      if (objScene3D.nbMursDetruisables > 0) {
        if (detruireMurEnFace(objScene3D.camera, objScene3D.dedale)) {
          objScene3D.nbMursDetruisables--;
        }
      }
      console.log("Murs détruisables restants : " + objScene3D.nbMursDetruisables);
    }
  }

  effacerCanevas(objgl);
  dessiner(objgl, objProgShaders, objScene3D);
}