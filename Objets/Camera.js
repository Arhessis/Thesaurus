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

  // Try applying pitch, but clamp so the camera can't flip past straight up/down
  var PITCH_LIMIT = 0.98; // dirY of ~0.98 ≈ 78 degrees — adjust to taste
  var tabPitched = rotateVectorAroundAxis(tabDirection, tabRight, fltPitch);
  tabPitched = normalizeVector(tabPitched);

  if (tabPitched[1] < PITCH_LIMIT && tabPitched[1] > -PITCH_LIMIT) {
    tabDirection = tabPitched;
  }
  // If the pitch would exceed the limit, we keep tabDirection as-is (yaw already applied)
  // This means horizontal look still works even at the vertical boundary

  setDirectionCameraXYZ(tabDirection, tabCamera);
}

function tryMoveCamera(camera, dx, dz) {
  var MARGIN = 0.25;

  function isFree(x, z) {
    var gx = Math.floor(x);
    var gz = Math.floor(z);
    if (gx < 0 || gz < 0 || gx >= TAILLE_DEDALE || gz >= TAILLE_DEDALE) return false;
    return objScene3D.dedale[gz][gx] === COULOIR;
  }

  var curX = getPositionCameraX(camera);
  var curZ = getPositionCameraZ(camera);
  var newX = curX + dx;
  var newZ = curZ + dz;

  var canMoveX = isFree(newX + MARGIN, curZ + MARGIN) &&
    isFree(newX + MARGIN, curZ - MARGIN) &&
    isFree(newX - MARGIN, curZ + MARGIN) &&
    isFree(newX - MARGIN, curZ - MARGIN);

  var canMoveZ = isFree(curX + MARGIN, newZ + MARGIN) &&
    isFree(curX + MARGIN, newZ - MARGIN) &&
    isFree(curX - MARGIN, newZ + MARGIN) &&
    isFree(curX - MARGIN, newZ - MARGIN);

  if (canMoveX) {
    setPositionCameraX(newX, camera);
  }

  if (canMoveZ) {
    setPositionCameraZ(newZ, camera);
  }

  var dir = getDirectionCameraXYZ(camera);
  setCibleCameraX(getPositionCameraX(camera) + dir[0], camera);
  setCibleCameraZ(getPositionCameraZ(camera) + dir[2], camera);

  return canMoveX || canMoveZ;
}



function deplacerCameraSouris(event) {
  if (!objScene3D || objScene3D.binVueAerienne) return;
  if (document.pointerLockElement !== document.getElementById('monCanvas')) return;

  var camera = objScene3D.camera;
  var sensitivity = 0.001;
  var fltYaw = -event.movementX * sensitivity;
  var fltPitch = event.movementY * sensitivity;

  rotateCamera(camera, fltYaw, fltPitch);

  var EYE_HEIGHT = 0.5;
  setPositionCameraY(EYE_HEIGHT, camera);
  setCibleCameraY(
    EYE_HEIGHT + getDirectionCameraXYZ(camera)[1],
    camera
  );
  // No drawing here — the game loop handles all rendering
}

function deplacerCamera() {
  if (!objScene3D || objScene3D.binVueAerienne) {
    boucleActive = false;
    return;
  }

  var camera = objScene3D.camera; // ← this line was missing

  var keyForward = touchesEnfoncees[38] || touchesEnfoncees[87]; // ↑ W
  var keyBack = touchesEnfoncees[40] || touchesEnfoncees[83]; // ↓ S
  var keyLeft = touchesEnfoncees[37] || touchesEnfoncees[65]; // ← A
  var keyRight = touchesEnfoncees[39] || touchesEnfoncees[68]; // → D

  var ROTATION_SPEED = 0.02; // Adjust rotation speed as needed

  if (keyForward || keyBack || keyLeft || keyRight) {
    var tabDirection = getDirectionCameraXYZ(camera);
    tabDirection[1] = 0;
    tabDirection = normalizeVector(tabDirection);

    var tabStrafeRight = normalizeVector(crossProduct([0, 1, 0], tabDirection));

    var dx = 0, dz = 0;
    var yaw = 0;

    if (keyForward) {
      dx += tabDirection[0] * VITESSE_MAX;
      dz += tabDirection[2] * VITESSE_MAX;
    }
    if (keyBack) {
      dx -= tabDirection[0] * VITESSE_MAX;
      dz -= tabDirection[2] * VITESSE_MAX;
    }
    if (keyLeft) {
      yaw += ROTATION_SPEED;
    }
    if (keyRight) {
      yaw -= ROTATION_SPEED;
    }

    if (yaw !== 0) {
      rotateCamera(camera, yaw, 0);
    }

    if (dx !== 0 || dz !== 0) {
      tryMoveCamera(camera, dx, dz);
    }
  }

  // ── FERMETURE DU SPAWN ─────────────────────────────────────
  if (!objScene3D.aQuittéSpawn && objScene3D.murSpawn) {
    if (getPositionCameraZ(camera) > 18.2) {
      objScene3D.aQuittéSpawn = true;
      objScene3D.murSpawn.actif = true;
      objScene3D.dedale[17][15] = MUR_FIXE;

      var camZ = getPositionCameraZ(camera);
      if (camZ < 18.25 + 0.25) {
        setPositionCameraZ(18.25 + 0.25, camera);
        var dir = getDirectionCameraXYZ(camera);
        setCibleCameraZ(getPositionCameraZ(camera) + dir[2], camera);
      }
    }
  }

  verifierCollisionTresor(objScene3D);
  effacerCanevas(objgl);
  dessiner(objgl, objProgShaders, objScene3D);

  if (document.pointerLockElement === document.getElementById('monCanvas')) {
    requestAnimationFrame(deplacerCamera);
  } else {
    var aTouches = Object.values(touchesEnfoncees).some(v => v);
    if (aTouches) {
      requestAnimationFrame(deplacerCamera);
    } else {
      boucleActive = false;
    }
  }
}