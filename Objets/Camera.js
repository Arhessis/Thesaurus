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

function normalizeVector(tabVector) {
  var fltX = tabVector[0], fltY = tabVector[1], fltZ = tabVector[2];
  var fltLongueur = Math.sqrt(fltX * fltX + fltY * fltY + fltZ * fltZ);
  return fltLongueur > 0 ? [fltX / fltLongueur, fltY / fltLongueur, fltZ / fltLongueur] : [0, 0, 1];
}

function crossProduct(tabA, tabB) {
  return [
    tabA[1] * tabB[2] - tabA[2] * tabB[1],
    tabA[2] * tabB[0] - tabA[0] * tabB[2],
    tabA[0] * tabB[1] - tabA[1] * tabB[0]
  ];
}

function getDirectionCameraXYZ(tabCamera) {
  return normalizeVector([
    getCibleCameraX(tabCamera) - getPositionCameraX(tabCamera),
    getCibleCameraY(tabCamera) - getPositionCameraY(tabCamera),
    getCibleCameraZ(tabCamera) - getPositionCameraZ(tabCamera)
  ]);
}

function setDirectionCameraXYZ(tabDirection, tabCamera) {
  var fltDistance = Math.sqrt(
    Math.pow(getCibleCameraX(tabCamera) - getPositionCameraX(tabCamera), 2) +
    Math.pow(getCibleCameraY(tabCamera) - getPositionCameraY(tabCamera), 2) +
    Math.pow(getCibleCameraZ(tabCamera) - getPositionCameraZ(tabCamera), 2)
  );
  setCiblesCameraXYZ([
    getPositionCameraX(tabCamera) + tabDirection[0] * fltDistance,
    getPositionCameraY(tabCamera) + tabDirection[1] * fltDistance,
    getPositionCameraZ(tabCamera) + tabDirection[2] * fltDistance
  ], tabCamera);
}

function rotateVectorAroundAxis(tabVector, tabAxis, fltAngle) {
  var ux = tabAxis[0], uy = tabAxis[1], uz = tabAxis[2];
  var cosA = Math.cos(fltAngle), sinA = Math.sin(fltAngle);
  var dot = ux * tabVector[0] + uy * tabVector[1] + uz * tabVector[2];
  return [
    tabVector[0] * cosA + (uy * tabVector[2] - uz * tabVector[1]) * sinA + ux * dot * (1 - cosA),
    tabVector[1] * cosA + (uz * tabVector[0] - ux * tabVector[2]) * sinA + uy * dot * (1 - cosA),
    tabVector[2] * cosA + (ux * tabVector[1] - uy * tabVector[0]) * sinA + uz * dot * (1 - cosA)
  ];
}

function rotateCamera(tabCamera, fltYaw, fltPitch) {
  var tabDirection = getDirectionCameraXYZ(tabCamera);
  var tabUp = normalizeVector(getOrientationsXYZ(tabCamera));
  var tabRight = normalizeVector(crossProduct(tabUp, tabDirection));

  // Apply yaw freely
  tabDirection = rotateVectorAroundAxis(tabDirection, tabUp, fltYaw);
  tabDirection = normalizeVector(tabDirection);

  // Try applying pitch
  var tabPitched = rotateVectorAroundAxis(tabDirection, tabRight, fltPitch);
  tabPitched = normalizeVector(tabPitched);

  // Clamp: don't allow looking more than ~60 degrees up or down
  // dirY of 0.85 ≈ 58 degrees, adjust this value to taste
  var PITCH_LIMIT = 0.75;
  if (tabPitched[1] < PITCH_LIMIT && tabPitched[1] > -PITCH_LIMIT) {
    tabDirection = tabPitched;
  }

  setDirectionCameraXYZ(tabDirection, tabCamera);
}

function deplacerCameraSouris(event) {
  if (!objScene3D || objScene3D.binVueAerienne) return;
  if (document.pointerLockElement !== document.getElementById('monCanvas')) return;

  var camera = objScene3D.camera;
  var sensitivity = 0.001;
  var fltYaw = -event.movementX * sensitivity;
  var fltPitch = event.movementY * sensitivity;

  rotateCamera(camera, fltYaw, fltPitch);

  // Keep camera Y locked at player eye level — never let it drift
  var EYE_HEIGHT = 0.5;
  setPositionCameraY(EYE_HEIGHT, camera);
  setCibleCameraY(
    EYE_HEIGHT + getDirectionCameraXYZ(camera)[1],
    camera
  );

  effacerCanevas(objgl);
  dessiner(objgl, objProgShaders, objScene3D);
}

function tryMoveCamera(camera, dx, dz) {
  var MARGIN = 0.25; // player "radius"

  var newX = getPositionCameraX(camera) + dx;
  var newZ = getPositionCameraZ(camera) + dz;

  // Check all 4 corners of the player's bounding box
  function isFree(x, z) {
    var gx = Math.floor(x);
    var gz = Math.floor(z);
    if (gx < 0 || gz < 0 || gx >= TAILLE_DEDALE || gz >= TAILLE_DEDALE) return false;
    return objScene3D.dedale[gz][gx] === COULOIR;
  }

  var canMoveX = isFree(newX + MARGIN, getPositionCameraZ(camera) + MARGIN) &&
    isFree(newX + MARGIN, getPositionCameraZ(camera) - MARGIN) &&
    isFree(newX - MARGIN, getPositionCameraZ(camera) + MARGIN) &&
    isFree(newX - MARGIN, getPositionCameraZ(camera) - MARGIN);

  var canMoveZ = isFree(getPositionCameraX(camera) + MARGIN, newZ + MARGIN) &&
    isFree(getPositionCameraX(camera) + MARGIN, newZ - MARGIN) &&
    isFree(getPositionCameraX(camera) - MARGIN, newZ + MARGIN) &&
    isFree(getPositionCameraX(camera) - MARGIN, newZ - MARGIN);

  if (canMoveX) {
    setPositionCameraX(newX, camera);
  }
  if (canMoveZ) {
    setPositionCameraZ(newZ, camera);
  }

  // Always update the target to match new position + current direction
  var dir = getDirectionCameraXYZ(camera);
  setCibleCameraX(getPositionCameraX(camera) + dir[0], camera);
  setCibleCameraZ(getPositionCameraZ(camera) + dir[2], camera);

  return canMoveX || canMoveZ;
}

let nbOuvertures = 3;
// function deplacerCamera(event) {
//   event = event || window.event;
//   var camera = objScene3D.camera;

//   if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
//     if (event.preventDefault) event.preventDefault();
//     if (objScene3D.binVueAerienne) return;

//     var tabDirection = getDirectionCameraXYZ(camera);
//     tabDirection[1] = 0;
//     tabDirection = normalizeVector(tabDirection);
//     var tabRight = normalizeVector(crossProduct(getOrientationsXYZ(camera), tabDirection));
//     var fltStep = 0.2;
//     var dx = 0, dz = 0;

//     if (event.keyCode === 38) { // flèche haut = avancer
//       dx = tabDirection[0] * fltStep;
//       dz = tabDirection[2] * fltStep;
//     } else if (event.keyCode === 40) { // flèche bas = reculer
//       dx = -tabDirection[0] * fltStep;
//       dz = -tabDirection[2] * fltStep;
//     } else if (event.keyCode === 37) { // flèche gauche = strafe gauche
//       dx = -tabRight[0] * fltStep;
//       dz = -tabRight[2] * fltStep;
//     } else if (event.keyCode === 39) { // flèche droite = strafe droite
//       dx = tabRight[0] * fltStep;
//       dz = tabRight[2] * fltStep;
//     }

//     tryMoveCamera(camera, dx, dz);
//   }
//   else if (event.keyCode == 38 || event.keyCode == 40) {
//     if (objScene3D.binVueAerienne) return;

//     var fltX = getCibleCameraX(camera) - getPositionCameraX(camera);
//     var fltZ = getCibleCameraZ(camera) - getPositionCameraZ(camera);
//     var fltRayon = Math.sqrt(fltX * fltX + fltZ * fltZ);
//     var intDirection = (event.keyCode == 38) ? 1 : -1;

//     var fltXPrime = intDirection * 0.2 * Math.cos(Math.acos(fltX / fltRayon));
//     var fltZPrime = intDirection * 0.2 * Math.sin(Math.asin(fltZ / fltRayon));

//     // Calculate where the camera WOULD move to
//     // var newX = getPositionCameraX(camera) + fltXPrime;
//     // var newZ = getPositionCameraZ(camera) + fltZPrime;
//     var MARGIN = 0.3; // how far from walls to stay
//     var newX = getPositionCameraX(camera) + fltXPrime + (fltXPrime > 0 ? MARGIN : -MARGIN);
//     var newZ = getPositionCameraZ(camera) + fltZPrime + (fltZPrime > 0 ? MARGIN : -MARGIN);

//     // Convert to grid coordinates and check the maze
//     var gridX = Math.floor(newX);
//     var gridZ = Math.floor(newZ);

//     // Only move if the target cell is not a wall
//     if (gridX >= 0 && gridZ >= 0 &&
//       gridX < TAILLE_DEDALE && gridZ < TAILLE_DEDALE &&
//       objScene3D.dedale[gridZ][gridX] === COULOIR) {

//       setCibleCameraX(getCibleCameraX(camera) + fltXPrime, camera);
//       setCibleCameraZ(getCibleCameraZ(camera) + fltZPrime, camera);
//       setPositionCameraX(getPositionCameraX(camera) + fltXPrime, camera);
//       setPositionCameraZ(getPositionCameraZ(camera) + fltZPrime, camera);
//     }
//   }
//   else if (event.keyCode == 33) { // Page Up
//     if (!objScene3D.binVueAerienne) {
//       objScene3D.cameraJoueur = objScene3D.camera.slice(); // Sauvegarde de la position et orientation
//       objScene3D.binVueAerienne = true;
//       objScene3D.binTriche = false; // La triche est désactivée par défaut au passage en vue aérienne

//       // Hauteur à 30 pour voir tout le dédale
//       setPositionsCameraXYZ([15.5, 37, 15.5], camera);
//       setCiblesCameraXYZ([15.5, 0, 15.5], camera);
//       setOrientationsXYZ([0, 0, 1], camera); // L'orientation Z fixe le repère "Nord"
//     }
//   }
//   else if (event.keyCode == 34) { // Page Down
//     if (objScene3D.binVueAerienne && objScene3D.cameraJoueur) {
//       objScene3D.camera = objScene3D.cameraJoueur.slice(); // Retourne exactement à la vue du joueur
//       objScene3D.binVueAerienne = false;
//       objScene3D.binTriche = false;
//     }
//   }
//   else if (event.keyCode == 32) { // Barre d'Espace
//     if (objScene3D.binVueAerienne) {
//       // Mode triche (CTRL + SHIFT + ESPACE) pour afficher ou cacher les objets spéciaux
//       if (event.ctrlKey && event.shiftKey) {
//         objScene3D.binTriche = !objScene3D.binTriche;
//       }
//     } else {
//       if (objScene3D.nbMursDetruisables > 0) {
//         if (detruireMurEnFace(objScene3D.camera, objScene3D.dedale)) {
//           objScene3D.nbMursDetruisables--;
//         }
//       }
//       console.log("Murs détruisables restants : " + objScene3D.nbMursDetruisables);
//     }
//   }

//   effacerCanevas(objgl);
//   dessiner(objgl, objProgShaders, objScene3D);
// }
function deplacerCamera(event) {
  event = event || window.event;
  var camera = objScene3D.camera;

  var keyUp = event.keyCode === 38 || event.keyCode === 87; // ↑ or W
  var keyDown = event.keyCode === 40 || event.keyCode === 83; // ↓ or S

  if (keyUp || keyDown) {
    if (event.preventDefault) event.preventDefault();
    if (objScene3D.binVueAerienne) return;

    var tabDirection = getDirectionCameraXYZ(camera);
    tabDirection[1] = 0; // stay on the ground plane
    tabDirection = normalizeVector(tabDirection);

    var fltStep = 0.2;
    var sign = keyUp ? 1 : -1;
    var dx = tabDirection[0] * fltStep * sign;
    var dz = tabDirection[2] * fltStep * sign;

    tryMoveCamera(camera, dx, dz);
  }
  else if (event.keyCode === 33) { // Page Up → aerial view
    if (!objScene3D.binVueAerienne) {
      objScene3D.cameraJoueur = objScene3D.camera.slice();
      objScene3D.binVueAerienne = true;
      objScene3D.binTriche = false;
      setPositionsCameraXYZ([15.5, 37, 15.5], camera);
      setCiblesCameraXYZ([15.5, 0, 15.5], camera);
      setOrientationsXYZ([0, 0, 1], camera);
    }
  }
  else if (event.keyCode === 34) { // Page Down → return to player view
    if (objScene3D.binVueAerienne && objScene3D.cameraJoueur) {
      objScene3D.camera = objScene3D.cameraJoueur.slice();
      objScene3D.binVueAerienne = false;
      objScene3D.binTriche = false;
    }
  }
  else if (event.keyCode === 32) { // Space → destroy wall
    if (objScene3D.binVueAerienne) {
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