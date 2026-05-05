const COULOIR = 0;
const MUR_FIXE = 1;
const MUR_OUVRABLE = 2;
const ENCLOS = 3;

const TAILLE_DEDALE = 31;


function setCell(dedale, x, y, type) {
    if (y >= 0 && y < dedale.length && x >= 0 && x < dedale[0].length) {
        dedale[y][x] = type;
    }
}

function detruireMurEnFace(camera, dedale) {
    var posX = getPositionCameraX(camera);
    var posZ = getPositionCameraZ(camera);
    var dirX = getCibleCameraX(camera) - posX;
    var dirZ = getCibleCameraZ(camera) - posZ;
    var absX = Math.abs(dirX);
    var absZ = Math.abs(dirZ);

    if (absX < 0.001 && absZ < 0.001) {
        return false;
    }

    var targetX = Math.floor(posX);
    var targetZ = Math.floor(posZ);

    if (absX > absZ) {
        targetX = Math.floor(posX + (dirX > 0 ? 1 : -1));
    } else {
        targetZ = Math.floor(posZ + (dirZ > 0 ? 1 : -1));
    }


    if (targetX < 0 || targetX >= TAILLE_DEDALE || targetZ < 0 || targetZ >= TAILLE_DEDALE) {
        return false;
    }

    if (dedale[targetZ][targetX] === MUR_OUVRABLE) {
        setCell(dedale, targetX, targetZ, COULOIR);
        jouerSon('./Sounds/dig4.mp3');
        return true;
    }

    return false;
}

function placerLigne(dedale, x, y, length, type, direction) {
    for (let i = 0; i < length; i++) {
        if (direction === "h") {
            setCell(dedale, x + i, y, type);
        } else {
            setCell(dedale, x, y + i, type);
        }
    }
}



function creerDedale(taille) {
    let dedale = [];

    // 1. initialize full grid
    for (let i = 0; i < taille; i++) {
        dedale[i] = [];
        for (let j = 0; j < taille; j++) {
            dedale[i][j] = COULOIR;
        }
    }

    // outer walls
    placerLigne(dedale, 0, 0, 31, MUR_FIXE, "v");
    placerLigne(dedale, 1, 0, 30, MUR_FIXE, "h");
    placerLigne(dedale, 30, 0, 31, MUR_FIXE, "v");
    placerLigne(dedale, 0, 30, 31, MUR_FIXE, "h");

    //spawn walls
    placerLigne(dedale, 16, 17, 2, MUR_FIXE, "h");
    placerLigne(dedale, 13, 17, 2, MUR_FIXE, "h");
    placerLigne(dedale, 13, 13, 4, MUR_FIXE, "v");
    placerLigne(dedale, 17, 13, 4, MUR_FIXE, "v");
    placerLigne(dedale, 14, 13, 4, MUR_FIXE, "h");

    //left section
    placerLigne(dedale, 23, 28, 6, MUR_OUVRABLE, "h");
    placerLigne(dedale, 23, 26, 7, MUR_OUVRABLE, "h");
    placerLigne(dedale, 27, 24, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 23, 24, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 27, 22, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 23, 22, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 23, 20, 6, MUR_OUVRABLE, "h");
    placerLigne(dedale, 25, 18, 5, MUR_OUVRABLE, "h");
    placerLigne(dedale, 23, 16, 6, MUR_OUVRABLE, "h");
    placerLigne(dedale, 23, 17, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 23, 14, 7, MUR_OUVRABLE, "h");
    placerLigne(dedale, 23, 12, 6, MUR_OUVRABLE, "h");
    placerLigne(dedale, 28, 8, 4, MUR_OUVRABLE, "v");
    placerLigne(dedale, 23, 10, 4, MUR_OUVRABLE, "h");
    placerLigne(dedale, 23, 8, 4, MUR_OUVRABLE, "h");
    placerLigne(dedale, 26, 9, 1, MUR_OUVRABLE, "h");
    placerLigne(dedale, 23, 2, 6, MUR_OUVRABLE, "v");
    placerLigne(dedale, 23, 2, 4, MUR_OUVRABLE, "h");
    placerLigne(dedale, 26, 2, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 25, 4, 2, MUR_OUVRABLE, "h");
    placerLigne(dedale, 25, 6, 4, MUR_OUVRABLE, "h");
    placerLigne(dedale, 28, 2, 2, MUR_OUVRABLE, "h");
    placerLigne(dedale, 28, 2, 3, MUR_OUVRABLE, "v");

    //center section
    placerLigne(dedale, 17, 28, 5, MUR_OUVRABLE, "h");
    placerLigne(dedale, 17, 26, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 21, 26, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 18, 26, 1, MUR_OUVRABLE, "v");
    placerLigne(dedale, 20, 26, 1, MUR_OUVRABLE, "v");

    placerLigne(dedale, 15, 26, 4, MUR_OUVRABLE, "v");

    placerLigne(dedale, 9, 28, 5, MUR_OUVRABLE, "h");
    placerLigne(dedale, 9, 26, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 13, 26, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 10, 26, 1, MUR_OUVRABLE, "v");
    placerLigne(dedale, 12, 26, 1, MUR_OUVRABLE, "v");

    placerLigne(dedale, 21, 19, 6, MUR_OUVRABLE, "v");
    placerLigne(dedale, 19, 19, 2, MUR_OUVRABLE, "h");
    placerLigne(dedale, 19, 19, 6, MUR_OUVRABLE, "v");
    placerLigne(dedale, 17, 19, 6, MUR_OUVRABLE, "v");
    placerLigne(dedale, 18, 24, 1, MUR_OUVRABLE, "v");

    placerLigne(dedale, 15, 19, 6, MUR_OUVRABLE, "v");

    placerLigne(dedale, 13, 19, 6, MUR_OUVRABLE, "v");
    placerLigne(dedale, 11, 19, 1, MUR_OUVRABLE, "h");
    placerLigne(dedale, 12, 24, 1, MUR_OUVRABLE, "h");
    placerLigne(dedale, 11, 19, 6, MUR_OUVRABLE, "v");
    placerLigne(dedale, 9, 19, 6, MUR_OUVRABLE, "v");
    placerLigne(dedale, 10, 19, 1, MUR_OUVRABLE, "v");

    placerLigne(dedale, 21, 6, 12, MUR_OUVRABLE, "v");
    placerLigne(dedale, 19, 17, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 19, 11, 7, MUR_OUVRABLE, "v");
    placerLigne(dedale, 16, 11, 4, MUR_OUVRABLE, "h");
    placerLigne(dedale, 16, 8, 4, MUR_OUVRABLE, "v");
    placerLigne(dedale, 16, 8, 2, MUR_OUVRABLE, "h");
    placerLigne(dedale, 17, 6, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 17, 6, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 19, 4, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 19, 4, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 21, 2, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 19, 8, 2, MUR_OUVRABLE, "v");

    placerLigne(dedale, 9, 6, 12, MUR_OUVRABLE, "v");
    placerLigne(dedale, 11, 11, 7, MUR_OUVRABLE, "v");
    placerLigne(dedale, 9, 17, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 11, 11, 4, MUR_OUVRABLE, "h");
    placerLigne(dedale, 14, 8, 4, MUR_OUVRABLE, "v");
    placerLigne(dedale, 13, 8, 2, MUR_OUVRABLE, "h");
    placerLigne(dedale, 13, 6, 3, MUR_OUVRABLE, "v");

    placerLigne(dedale, 11, 6, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 11, 4, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 9, 4, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 9, 2, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 11, 8, 2, MUR_OUVRABLE, "v");


    placerLigne(dedale, 15, 6, 1, MUR_OUVRABLE, "h");

    placerLigne(dedale, 11, 2, 9, MUR_OUVRABLE, "h");
    placerLigne(dedale, 17, 2, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 13, 2, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 14, 4, 1, MUR_OUVRABLE, "v");
    placerLigne(dedale, 16, 4, 1, MUR_OUVRABLE, "v");


    //right section
    placerLigne(dedale, 2, 28, 6, MUR_OUVRABLE, "h");
    placerLigne(dedale, 1, 26, 7, MUR_OUVRABLE, "h");
    placerLigne(dedale, 1, 24, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 5, 24, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 1, 22, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 5, 22, 3, MUR_OUVRABLE, "h");
    placerLigne(dedale, 2, 20, 6, MUR_OUVRABLE, "h");
    placerLigne(dedale, 1, 18, 5, MUR_OUVRABLE, "h");
    placerLigne(dedale, 2, 16, 6, MUR_OUVRABLE, "h");
    placerLigne(dedale, 7, 17, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 1, 14, 7, MUR_OUVRABLE, "h");
    placerLigne(dedale, 2, 12, 6, MUR_OUVRABLE, "h");
    placerLigne(dedale, 2, 8, 4, MUR_OUVRABLE, "v");
    placerLigne(dedale, 4, 10, 4, MUR_OUVRABLE, "h");
    placerLigne(dedale, 4, 8, 4, MUR_OUVRABLE, "h");
    placerLigne(dedale, 4, 9, 1, MUR_OUVRABLE, "h");
    placerLigne(dedale, 7, 2, 6, MUR_OUVRABLE, "v");
    placerLigne(dedale, 4, 2, 4, MUR_OUVRABLE, "h");
    placerLigne(dedale, 4, 2, 3, MUR_OUVRABLE, "v");
    placerLigne(dedale, 4, 4, 2, MUR_OUVRABLE, "h");
    placerLigne(dedale, 2, 6, 4, MUR_OUVRABLE, "h");
    placerLigne(dedale, 1, 2, 2, MUR_OUVRABLE, "h");
    placerLigne(dedale, 2, 2, 3, MUR_OUVRABLE, "v");


    return dedale;
}