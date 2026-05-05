function dessiner(objgl, objProgShaders, objScene3D) {
    objgl.viewport(0, 0, objgl.drawingBufferWidth, objgl.drawingBufferHeight);

    var matProjection = mat4.create();
    var fltRapportCanevas = objgl.drawingBufferWidth / objgl.drawingBufferHeight;
    mat4.perspective(45, fltRapportCanevas, 0.01, 100, matProjection);

    objgl.uniformMatrix4fv(objProgShaders.matProjection, false, matProjection);

    for (var i = 0; i < objScene3D.tabObjets3D.length; i++) {
        var objet = objScene3D.tabObjets3D[i];

        if (objScene3D.binVueAerienne) {
            if (objet.typeObjet === "plafond") {
                continue;
            }
            if (!objScene3D.binTriche) {
                if (objet.typeObjet !== "plancher" && objet.typeObjet !== "mur" && objet.typeObjet !== "pointeur") {
                    continue;
                }
            }
        }

        // Empeche de redessiner un mur détruit
        if (objet.typeObjet === "mur") {
            if (objet === objScene3D.murSpawn && !objScene3D.murSpawn.actif) {
        continue;
    }
            var posMur = getPositionsXYZ(objet.transformations);
            var murX = Math.floor(posMur[0]);
            var murZ = Math.floor(posMur[2]);
            if (murZ >= 0 && murZ < TAILLE_DEDALE && murX >= 0 && murX < TAILLE_DEDALE) {
                var cellule = objScene3D.dedale[murZ][murX];
                if (cellule === COULOIR) {
                    continue;
                }
            }
        }

        var vertex = objet.vertex;
        var couleurs = objet.couleurs;
        var texels = objet.texels;
        var maillage = objet.maillage;
        var transformations = objet.transformations;

        var matModeleVue = mat4.create();
        mat4.identity(matModeleVue);

        mat4.lookAt(getPositionsCameraXYZ(objScene3D.camera),
            getCiblesCameraXYZ(objScene3D.camera),
            getOrientationsXYZ(objScene3D.camera),
            matModeleVue);

        mat4.translate(matModeleVue, getPositionsXYZ(transformations));
        mat4.scale(matModeleVue, getEchellesXYZ(transformations));
        mat4.rotateX(matModeleVue, getAngleX(transformations) * Math.PI / 180);
        mat4.rotateY(matModeleVue, getAngleY(transformations) * Math.PI / 180);
        mat4.rotateZ(matModeleVue, getAngleZ(transformations) * Math.PI / 180);

        objgl.uniformMatrix4fv(objProgShaders.matModeleVue, false, matModeleVue);

        if (maillage == null && texels == null) {
            objgl.disableVertexAttribArray(objProgShaders.posTexel);

            objgl.bindBuffer(objgl.ARRAY_BUFFER, vertex);
            objgl.vertexAttribPointer(objProgShaders.posVertex, 3, objgl.FLOAT, false, 0, 0);

            objgl.bindBuffer(objgl.ARRAY_BUFFER, couleurs);
            objgl.vertexAttribPointer(objProgShaders.couleurVertex, 4, objgl.FLOAT, false, 0, 0);

            objgl.uniform1i(objProgShaders.noTexture, TEX_TRANSPARENT);
            objgl.uniform1f(objProgShaders.pcCouleurTexel, 0.0);

            objgl.drawArrays(vertex.typeDessin, 0, 4);

            objgl.enableVertexAttribArray(objProgShaders.posTexel);
        }
        else if (maillage != null && texels == null) {
            objgl.disableVertexAttribArray(objProgShaders.posTexel);

            objgl.bindBuffer(objgl.ARRAY_BUFFER, vertex);
            objgl.vertexAttribPointer(objProgShaders.posVertex, 3, objgl.FLOAT, false, 0, 0);

            objgl.bindBuffer(objgl.ARRAY_BUFFER, couleurs);
            objgl.vertexAttribPointer(objProgShaders.couleurVertex, 4, objgl.FLOAT, false, 0, 0);

            objgl.uniform1i(objProgShaders.noTexture, TEX_TRANSPARENT);
            objgl.uniform1f(objProgShaders.pcCouleurTexel, 0.0);

            objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, maillage);
            objgl.drawElements(objgl.TRIANGLES, maillage.intNbTriangles * 3, objgl.UNSIGNED_SHORT, 0);
            objgl.drawElements(objgl.LINES, maillage.intNbDroites * 2, objgl.UNSIGNED_SHORT, maillage.intNbTriangles * 2 * 3);

            objgl.enableVertexAttribArray(objProgShaders.posTexel);
        }
        else if (maillage == null && texels != null) {
            if (getPositionCameraY(objScene3D.camera) > HAUTEUR_PLAFOND) {
                continue;
            }

            objgl.bindBuffer(objgl.ARRAY_BUFFER, vertex);
            objgl.vertexAttribPointer(objProgShaders.posVertex, 3, objgl.FLOAT, false, 0, 0);

            objgl.bindBuffer(objgl.ARRAY_BUFFER, couleurs);
            objgl.vertexAttribPointer(objProgShaders.couleurVertex, 4, objgl.FLOAT, false, 0, 0);

            objgl.enableVertexAttribArray(objProgShaders.posTexel);

            objgl.activeTexture(objgl.TEXTURE0 + texels.intNoTexture);
            objgl.bindTexture(objgl.TEXTURE_2D, objScene3D.textures[texels.intNoTexture]);

            objgl.bindBuffer(objgl.ARRAY_BUFFER, texels);
            objgl.vertexAttribPointer(objProgShaders.posTexel, 2, objgl.FLOAT, false, 0, 0);

            objgl.uniform1i(objProgShaders.noTexture, texels.intNoTexture);
            objgl.uniform1f(objProgShaders.pcCouleurTexel, texels.pcCouleurTexel);

            objgl.drawArrays(vertex.typeDessin, 0, 4);
        }
        else {
            objgl.bindBuffer(objgl.ARRAY_BUFFER, vertex);
            objgl.vertexAttribPointer(objProgShaders.posVertex, 3, objgl.FLOAT, false, 0, 0);

            objgl.bindBuffer(objgl.ARRAY_BUFFER, couleurs);
            objgl.vertexAttribPointer(objProgShaders.couleurVertex, 4, objgl.FLOAT, false, 0, 0);

            objgl.activeTexture(objgl.TEXTURE0 + texels.intNoTexture);
            objgl.bindTexture(objgl.TEXTURE_2D, objScene3D.textures[texels.intNoTexture]);

            objgl.bindBuffer(objgl.ARRAY_BUFFER, texels);
            objgl.vertexAttribPointer(objProgShaders.posTexel, 2, objgl.FLOAT, false, 0, 0);

            objgl.uniform1i(objProgShaders.noTexture, texels.intNoTexture);
            objgl.uniform1f(objProgShaders.pcCouleurTexel, texels.pcCouleurTexel);

            objgl.bindBuffer(objgl.ELEMENT_ARRAY_BUFFER, maillage);
            objgl.drawElements(objgl.TRIANGLES, maillage.intNbTriangles * 3, objgl.UNSIGNED_SHORT, 0);
            objgl.drawElements(objgl.LINES, maillage.intNbDroites * 2, objgl.UNSIGNED_SHORT, maillage.intNbTriangles * 2 * 3);
        }
    }
}

function effacerCanevas(objgl) {
    objgl.clearColor(0.0, 0.0, 0.0, 1.0);
    objgl.clear(objgl.COLOR_BUFFER_BIT | objgl.DEPTH_BUFFER_BIT);
}