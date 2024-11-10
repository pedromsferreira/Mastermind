import * as THREE from 'three';
import * as GSAP from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

// Three.js variables
let scene, camera, renderer;
let controls;

// Game variables
let numCols = 4, numRows = 10, playColors = 6;
let guessSphereRadius = 2.5;

// Start position
let startPosX = 0
let startPosY = 1
let startPosZ = 0

// Board measurements
const boardHeight = 5;
const borderThickness = 1.5;
let guessBoxTotalSize = 0;
let clueBoxTotalSize = 0;

// Textures
// Metal textures
// Original used: https://ambientcg.com/view?id=Metal057A
const copperTexture =  new THREE.TextureLoader().load('textures/metal057/Metal057A_2K-PNG_Color.png');
const copperDisplacement =  new THREE.TextureLoader().load('textures/metal057/Metal057A_2K-PNG_Displacement.png');
const copperMetalness =  new THREE.TextureLoader().load('textures/metal057/Metal057A_2K-PNG_Metalness.png');
const copperRoughness =  new THREE.TextureLoader().load('textures/metal057/Metal057A_2K-PNG_Roughness.png');
const copperNormal =  new THREE.TextureLoader().load('textures/metal057/Metal057A_2K-PNG_NormalGL.png');
copperTexture.wrapS = THREE.RepeatWrapping;
copperTexture.wrapT = THREE.RepeatWrapping;
const copperMaterial = new THREE.MeshStandardMaterial({
    map: copperTexture,
    displacementMap: copperDisplacement,
    displacementScale: 0.1,
    metalnessMap: copperMetalness,
    roughnessMap: copperRoughness,
    normalMap: copperNormal
});

//Wood textures
// Original used: https://ambientcg.com/view?id=PaintedWood007B
const paintedWoodTexture = new THREE.TextureLoader().load('textures/paintedWood007/PaintedWood007B_2K-PNG_Color.png');
const paintedWoodTextureNormalTexture = new THREE.TextureLoader().load('textures/paintedWood007/PaintedWood007B_2K-PNG_NormalGL.png');
paintedWoodTexture.wrapS = THREE.RepeatWrapping;
paintedWoodTexture.wrapT = THREE.RepeatWrapping;
const paintedWoodMaterial = new THREE.MeshStandardMaterial({
    map: paintedWoodTexture,
    normalMap: paintedWoodTextureNormalTexture
});

// Original used: https://ambientcg.com/view?id=Wood022
const wood022Texture = new THREE.TextureLoader().load('textures/wood022/Wood022_2K-PNG_Color.png');
const wood022TextureNormalTexture = new THREE.TextureLoader().load('textures/wood022/Wood022_2K-PNG_NormalGL.png');
const wood022RoughnessTexture = new THREE.TextureLoader().load('textures/wood022/Wood022_2K-PNG_Roughness.png');
const wood022Material = new THREE.MeshStandardMaterial({
    map: wood022Texture,
    normalMap: wood022TextureNormalTexture,
    roughnessMap: wood022RoughnessTexture
});

// Original used: https://ambientcg.com/view?id=Wood039
const wood039Texture = new THREE.TextureLoader().load('textures/wood039/Wood039_2K-PNG_Color.png');
const wood039TextureNormalTexture = new THREE.TextureLoader().load('textures/wood039/Wood039_2K-PNG_NormalGL.png');
const wood39RoughnessTexture = new THREE.TextureLoader().load('textures/wood039/Wood039_2K-PNG_Roughness.png');
wood039Texture.wrapS = THREE.RepeatWrapping;
wood039Texture.wrapT = THREE.RepeatWrapping;
const wood039Material = new THREE.MeshStandardMaterial({
    map: wood039Texture,
    normalMap: wood039TextureNormalTexture,
    roughnessMap: wood39RoughnessTexture
});

// Original used: https://ambientcg.com/view?id=Wood077
const wood077Texture = new THREE.TextureLoader().load('textures/wood077/Wood077_2K-PNG_Color.png');
const wood077TextureNormalTexture = new THREE.TextureLoader().load('textures/wood077/Wood077_2K-PNG_NormalGL.png');
const wood077RoughnessTexture = new THREE.TextureLoader().load('textures/wood077/Wood077_2K-PNG_Roughness.png');
wood077Texture.wrapS = THREE.RepeatWrapping;
wood077Texture.wrapT = THREE.RepeatWrapping;
const wood077Material = new THREE.MeshStandardMaterial({
    map: wood077Texture,
    normalMap: wood077TextureNormalTexture,
    roughnessMap: wood077RoughnessTexture
});



function add_plane() {
    let geometry = new THREE.BoxGeometry(50, 0, 50);
    let material = new THREE.MeshBasicMaterial({ color: 'purple' });
    let plane = new THREE.Mesh(geometry, material);

    plane.position.set(0, 0, 0);
    scene.add(plane)
}

function add_box(sizeX, sizeY, sizeZ, posX, posY, posZ, material) {
    let geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    let face = new THREE.Mesh(geometry, material);

    face.position.set(posX, posY, posZ);
    scene.add(face);
}

function add_ring(radius, posX, posY, posZ, material = copperMaterial) {
    let geometry = new THREE.TorusGeometry(radius, radius / 7);
    let ring = new THREE.Mesh(geometry, material);

    ring.rotation.x = Math.PI / 2;
    ring.position.set(posX, posY, posZ);
    scene.add(ring);
}

function add_open_top_box(size, extraSize, material, posX, posY, posZ) {
    let sizeX = size + extraSize;
    let sizeY = boardHeight;
    let sizeZ = size + extraSize;

    // Add box faces
    add_box(sizeX, 0, sizeZ, posX, posY, posZ, wood039Material); // bottom
    // add_box(0, sizeY, sizeZ, sizeX / 2 + posX, sizeY / 2 + posY, posZ, wood039Material); // positive x side
    // add_box(0, sizeY, sizeZ, -sizeX / 2 + posX, sizeY / 2 + posY, posZ, wood039Material); // negative x side
    // add_box(sizeX, sizeY, 0, posX, sizeY / 2 + posY, sizeZ / 2 + posZ, wood039Material); // positive z side
    // add_box(sizeX, sizeY, 0, posX, sizeY / 2 + posY, -sizeZ / 2 + posZ, wood039Material); // negative z side

    // Add lid
    let squareShape = new THREE.Shape()
        .lineTo(0, sizeZ)
        .lineTo(sizeX, sizeZ)
        .lineTo(sizeX, 0)
        .lineTo(0, 0);
    let circleShape = new THREE.Shape()
        .absarc(
            sizeX / 2, //x
            sizeZ / 2, //y
            size / 2, //radius
            0, //startAngle
            Math.PI * 2, //endAngle
            false //clockwise
        );
    squareShape.holes.push(circleShape);

    let lid = new THREE.Mesh(new THREE.ShapeGeometry(squareShape), material);
    lid.position.set(posX - sizeX / 2, posY + sizeY, posZ + sizeZ / 2);
    lid.rotation.x = -Math.PI / 2;
    scene.add(lid);

    // Add cup for ball support
    add_cup(size / 2, posX, posY + sizeY, posZ);

    // Add ring for ball support
    add_ring((size + 0.3) / 2, posX, posY + sizeY, posZ, copperMaterial);

}

function add_cup(radius, x, y, z) {
    let geometry = new THREE.SphereGeometry(
        radius, //radius
        32, //widthSegments
        32, //heightSegments
        0, //phiStart
        Math.PI * 2, //phiLength
        Math.PI / 2, //thetaStart
        Math.PI //thetaLength
    );
    let cup = new THREE.Mesh(geometry, wood022Material);
    cup.position.set(x, y, z);
    scene.add(cup);
}

function add_borders(thickness, height, width, length, posX, posY, posZ, addLongSide = true, addSmallSide = true) {
    add_box(thickness, height, width, posX + length + thickness / 2, posY + height / 2, posZ, wood077Material); //small side
    add_box(length, height, thickness, posX + length / 2, posY + height / 2, posZ + (width - thickness) / 2, wood077Material); //long side
    if (addLongSide) {
        add_box(length, height, thickness, posX + length / 2, posY + height / 2, posZ - (width - thickness) / 2, wood077Material); //long side
    }
    if (addSmallSide) {
        add_box(thickness, height, width, posX - thickness / 2, posY + height / 2, posZ, wood077Material); //small side
    }
}

function add_board(posX = 0, posY = 1, posZ = 0, boxSize = 5, numRows = 10, numCols = 4) {
    let guessBoxExtraSize = 0.5 * boxSize;
    guessBoxTotalSize = boxSize + guessBoxExtraSize;

    const maxRowLen = guessBoxTotalSize * numCols;
    const maxColLen = guessBoxTotalSize * numRows;

    startPosX = posX - maxRowLen / 2;
    startPosZ = posZ - maxColLen / 2 - borderThickness * (numRows - 1) / 2;
    let currPosX, currPosZ;

    for (let i = 0; i < numRows; i++) {
        currPosX = startPosX + guessBoxTotalSize / 2;
        currPosZ = startPosZ + i * guessBoxTotalSize + guessBoxTotalSize / 2 + borderThickness * i;

        // Add borders for guessing boxes per row
        add_borders(
            borderThickness, //thickness
            boardHeight, //height
            guessBoxTotalSize + borderThickness * 2, //width
            maxRowLen, //length 
            currPosX - guessBoxTotalSize / 2, //posX
            posY, //posY
            currPosZ, //posZ
            (i < 1),
            true
        );

        // Add guessing boxes
        for (let j = 0; j < numCols; j++) {
            //size, sizeExtra, posX, posY, posZ
            add_open_top_box(
                boxSize,
                guessBoxExtraSize,
                wood039Material,
                currPosX,
                posY,
                currPosZ
            );
            currPosX += guessBoxTotalSize;
        }

        currPosX += borderThickness;

        // Add clue boxes
        let clueBoxSize = boxSize / 2;
        let clueBoxExtraSize = 0.5 * clueBoxSize;
        clueBoxTotalSize = clueBoxSize + clueBoxExtraSize;

        // Add borders for clue boxes per row
        add_borders(
            borderThickness, //thickness
            boardHeight, //height
            clueBoxTotalSize * 2 + borderThickness * 2, //width
            clueBoxTotalSize * Math.ceil(numCols / 2), //length 
            currPosX - clueBoxTotalSize, //posX
            posY, //posY
            currPosZ, //posZ
            true,
            false
        );
        currPosX += clueBoxTotalSize * (Math.round(numCols / 2) - 1);
        for (let j = 0; j < numCols; j++) {
            // Even
            if (j % 2 == 0) {
                add_open_top_box(
                    clueBoxSize,
                    clueBoxExtraSize,
                    wood039Material,
                    currPosX - clueBoxTotalSize / 2,
                    posY,
                    currPosZ + clueBoxTotalSize / 2
                );
            }

            // Odd
            if (j % 2 == 1) {
                add_open_top_box(
                    clueBoxSize,
                    clueBoxExtraSize,
                    wood039Material,
                    currPosX - clueBoxTotalSize / 2,
                    posY,
                    currPosZ - clueBoxTotalSize / 2
                );
                currPosX -= clueBoxTotalSize;
            }
        }
        if (numCols % 2 == 1) {
            add_box(
                clueBoxTotalSize,
                boardHeight,
                clueBoxTotalSize,
                currPosX - clueBoxTotalSize / 2,
                posY + boardHeight / 2,
                currPosZ - clueBoxTotalSize / 2,
                wood039Material
            )
        }
    }
    // Adjust start position for rest of the game
    startPosX += guessBoxTotalSize / 2;
    startPosZ += guessBoxTotalSize / 2;
}

function create_sphere(x, y, z, radius, thetaLength, material) {
    let geometry = new THREE.SphereGeometry(
        radius,
        32,
        16,
        0,
        Math.PI * 2,
        0,
        thetaLength
    );
    // let material = new THREE.MeshStandardMaterial({ color: color, wireframe: true });
    let sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(x, y, z)

    return sphere;
}

function add_pin(color, x, y, z, radius, height) {
    let texture = new THREE.TextureLoader();
    texture.load('textures/'.concat('solid_', color, '.png'), function (texture) {
        let cylGeometry = new THREE.CylinderGeometry(
            radius,
            radius,
            height
        );
        let material = new THREE.MeshStandardMaterial({ 
            map: texture,
            roughness: 0,
        });
        let cylinder = new THREE.Mesh(cylGeometry, material);
        cylinder.position.set(x, y, z);
        scene.add(cylinder);

        let sphere = create_sphere(x, y + height / 3, z, radius * 1.2, 0.5 * Math.PI, material);
        scene.add(sphere);
    });
}

function add_table(x, y, z, radiusBoard, height, materialBoard, materialLegs) {
    // Add table board
    let geometry = new THREE.CylinderGeometry(
        radiusBoard,
        radiusBoard,
        height,
        64
    );
    let board = new THREE.Mesh(geometry, materialBoard);
    board.position.set(x, y, z);
    scene.add(board);
   
    // Add table legs
    let legHeight = height*6;
    geometry = new THREE.CylinderGeometry(
        radiusBoard/20,
        radiusBoard/20,
        legHeight,
        64
    );

    let leg1 = new THREE.Mesh(geometry, materialLegs);
    leg1.position.set(x + radiusBoard/2, y - (legHeight)/2-height/2, z + radiusBoard/2);
    scene.add(leg1);

    let leg2 = new THREE.Mesh(geometry, materialLegs);
    leg2.position.set(x - radiusBoard/2, y - (legHeight)/2-height/2, z + radiusBoard/2);
    scene.add(leg2);

    let leg3 = new THREE.Mesh(geometry, materialLegs);
    leg3.position.set(x + radiusBoard/2, y - (legHeight)/2-height/2, z - radiusBoard/2);
    scene.add(leg3);

    let leg4 = new THREE.Mesh(geometry, materialLegs);
    leg4.position.set(x - radiusBoard/2, y - (legHeight)/2-height/2, z - radiusBoard/2);
    scene.add(leg4);
}

export function remove_guess_ball(targetRow, targetCol) {
    let target = scene.getObjectByName('guess_'.concat(targetRow, '_', targetCol));
    scene.remove(target);
}

// Add guess ball to the corresponding guess row
export function add_guess_ball(color, targetRow, targetCol) {
    let texture = new THREE.TextureLoader();
    texture.load('textures/marble/'.concat('marble_', color, '.png'), function (texture) {
        let material = new THREE.MeshStandardMaterial({ 
            map: texture,
            roughness: 0
        });

        let sphere = create_sphere(
            startPosX + guessBoxTotalSize * (numCols-1) - guessBoxTotalSize*targetCol,
            startPosY + boardHeight,
            startPosZ + (guessBoxTotalSize + borderThickness) * targetRow,
            guessSphereRadius,
            2*Math.PI,
            material
        )

        sphere.name = 'guess_'.concat(targetRow, '_', targetCol);
        scene.add(sphere);
    });
}

// Add clue pins to the corresponding guess row
export function add_clue_pins(clues, targetRow) {
    for (let i = 0, zOffset = +clueBoxTotalSize / 2; i < clues.length; i++) {
        add_pin(
            clues[i],
            startPosX + guessBoxTotalSize * numCols - borderThickness / 4 + clueBoxTotalSize * (Math.round(numCols / 2) - 1) - clueBoxTotalSize * (i % Math.round(numCols / 2)),
            startPosY + boardHeight,
            startPosZ + (guessBoxTotalSize + borderThickness) * targetRow + zOffset,
            guessSphereRadius / 2,
            3
        );

        if (i + 1 >= numCols / 2) {
            zOffset = -clueBoxTotalSize / 2;
        }
    }
}

export function init_world(codeSize, numColors, numTries) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
    });

    // Scene settings
    scene.background = new THREE.Color().setHex(0x9a8c74);

    // Camera settings
    camera.position.set(0, 110, -1);

    // Renderer settings
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // Add controls and helpers (if needed, uncomment)
    // let axesHelper = new THREE.AxesHelper(100);
    // scene.add(axesHelper);
    controls = new OrbitControls(camera, renderer.domElement);

    // Build objects into the world
    numRows = numTries;
    numCols = codeSize;
    playColors = numColors;

    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.7;

    const loader = new RGBELoader();
    loader.load(
        "textures/background.hdr", //original used: https://polyhaven.com/a/ninomaru_teien
        function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
        
        // Align board in the center of the table with x offset
        let xOffset = -7.5*(numCols/8);
        if(numCols % 2 == 0) {
            xOffset -= borderThickness/2;
        }
        else {
            xOffset -= 1.125;
        }

        add_board(xOffset, 1, 0, 5, numRows, numCols);
        let radius = numTries * 5 + numTries * 2.5 ;
        add_table(0, -2, 0, radius, 7, paintedWoodMaterial, wood022Material);
        const loading = document.getElementById('loading');
        loading.style.display = 'none';
    });
}

export function animate() {
    renderer.render(scene, camera);

    controls.update();

    window.onresize = function () { 
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight); 
    }

    requestAnimationFrame(animate);
}
