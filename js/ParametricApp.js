function ParametricApp() {
    var renderer = null;
    var scene = null;
    /* Constants */
    window.ratio = 1.138;

    var controls = null;
    var camera = null;

    var clock = null;

    var animating = true;

    window.resMgr = null;

    var keyPressed = [];

    var exporter = {};

    var ring = null;

    var spotLight;

    var pressedObjects = [];

    var reversedScale = 1;

    var highRes = true;

    var camAngles = [{'x': -156, 'y':87, 'z':605, 'tx':45.5, 'ty':69.9, 'tz':483.5},
                     {'x': 1173.9, 'y':236.6, 'z':1538.5, 'tx':107.2, 'ty':109.7, 'tz':223.7},
                     {'x': 426.9, 'y':178.8, 'z':70.3, 'tx':0, 'ty':80, 'tz':500},
                     {'x': -871.9, 'y':576.4, 'z':1625.6, 'tx':55.8, 'ty':104, 'tz':172.9}
                     ];
    var camPosTarget = null;
    var camTargetTarget = null;
    var modelWidth = window.innerWidth;
    var modelHeight = window.innerHeight;
    //***************************************************************************//
    // initialize the renderer, scene, camera, and lights                        //
    //***************************************************************************//
    function loadModel(id, width, height, showGUI, disableZoom)
    {
        // Grab our container div
        var container = document.getElementById(id);
        modelWidth = width;
        modelHeight = height;
        // Create the Three.js renderer, add it to our div
        renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true } );
        renderer.setSize(width, height);
        renderer.setClearColor(0xffffff, 0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;
        container.appendChild( renderer.domElement );

        // Create a new Three.js scene
        scene = new THREE.Scene();

        // Put in a camera
        camera = new THREE.PerspectiveCamera( 10,
            width / height, 1, 10000 );

        camera.position.set(camAngles[0].x, camAngles[0].y, camAngles[0].z);
        camera.lookAt(new THREE.Vector3(camAngles[0].tx, camAngles[0].ty, camAngles[0].tz));
        controls = new THREE.OrbitControls(camera, container);
        controls.noZoom = disableZoom;
        controls.target.set(camAngles[0].tx, camAngles[0].ty, camAngles[0].tz);
        controls.update();

        // add lights
        initSceneLights();

        // load resources (after all resouces will load, calls populateScene)
        // loadResources(populateScene);
        loadResources(function (){});
        populateScene();

        // Add a mouse up handler to toggle the animation
        // addInputHandler();
        window.addEventListener( 'resize', onWindowResize, false );

        // add gui
        if (showGUI) {
            addGui();
        }

        clock = new THREE.Clock();

        // init keyPressed
        for (var i=0; i<255; i++)
        {
            keyPressed[i] = false;
        }

        // Run our render loop
    	run();
    }

    function loadResources(whenFinished)
    {
        window.resMgr = new ResourceManager();
        window.resMgr.initMaterials();
        window.resMgr.loadResources(whenFinished);
    }

    //***************************************************************************//
    // Populate the scene with lights                                            //
    //***************************************************************************//
    function initSceneLights()
    {
        // Create an ambient and a directional light to show off the object
        // var dirLight = [];
        var ambLight = new THREE.AmbientLight( 0x333333 ); // soft white light
        scene.add( ambLight );

        // object spotlight
        spotLight = new THREE.SpotLight(0xFFFFFF, 1);
        spotLight.angle = Math.PI/2;
        spotLight.exponent = 12;
        spotLight.position.set(-200, 337, 1015);
        spotLight.target.position.set(-98, 82, 522);
        spotLight.castShadow = true;
        spotLight.shadow.camera.far = 1500;
        // spotLight.shadowCameraVisible = true;
        scene.add(spotLight);

        var sspotLight = new THREE.SpotLight(0xFFFFFF, 1);
        sspotLight.angle = Math.PI/2;
        sspotLight.exponent = 12;
        sspotLight.position.set(200, -337, -1015);
        sspotLight.target.position.set(98, -82, -522);
        sspotLight.castShadow = true;
        sspotLight.shadow.camera.far = 1500;
        scene.add(sspotLight);
    }

    //***************************************************************************//
    // Populate the scene object with our objects                                //
    //***************************************************************************//
    function populateScene()
    {
        ring = new RingBling();
        ring.init();
        // ring.rotation.x = Math.PI/2;
        ring.position.set(camAngles[0].tx, camAngles[0].ty-15, camAngles[0].tz);
        scene.add(ring);
    }

    function addGui()
    {
        var gui = new dat.GUI();
        var lightG = gui.addFolder("LIGHT");
        lightG.add(spotLight, 'exponent', 0, 90);
        lightG.add(spotLight, 'intensity', 0, 4);

        gui.add(ring, 'ringsOffset', -6, 0).onChange(function() {ring.updateGeometry(ring)});
        gui.add(ring, 'angle', 0, Math.PI/2).onChange(function() {ring.updateGeometry(ring)});

        var ringG = gui.addFolder("RIGHT RING");
        ringG.add(ring.ringr, 'width', 0, 30).onChange(function() {ring.updateGeometry(ring)});
        ringG.add(ring.ringr, 'height', 0, 30).onChange(function() {ring.updateGeometry(ring)});
        ringG.add(ring.ringr, 'thickness', 0, 6).onChange(function() {ring.updateGeometry(ring)});
        ringG.add(ring.ringr, 'radialSegments', 1, 100).onChange(function() {ring.updateGeometry(ring)});
        ringG.add(ring.ringr, 'tubularSegments', 1, 300).onChange(function() {ring.updateGeometry(ring)});
        ringG.add(ring.ringr.extra, 'stride', 0, 20).onChange(function() {ring.updateGeometry(ring)});
        ringG.add(ring.ringr.extra, 'flattenSides', 0, 1).onChange(function() {ring.updateGeometry(ring)});
        ringG.add(ring.ringr.extra, 'flattenTop', 0, 1).onChange(function() {ring.updateGeometry(ring)});
        ringG.add(ring.ringr.extra, 'flattenAngle', 0, Math.PI*2).onChange(function() {ring.updateGeometry(ring)});
        ringG.add(ring.ringr.extra, 'trueTubOrientation').onChange(function() {ring.updateGeometry(ring)});
        var style = ringG.addFolder("Style");
        style.add(ring.ringr.extra, 'freq', 0, 20).onChange(function() {ring.updateGeometry(ring)});
        style.add(ring.ringr.extra, 'mag', 0, 1).onChange(function() {ring.updateGeometry(ring)});
        style.add(ring.ringr.extra, 'clamp').onChange(function() {ring.updateGeometry(ring)});

        var ringGL = gui.addFolder("LEFT RING");
        ringGL.add(ring.ringl, 'width', 0, 30).onChange(function() {ring.updateGeometry(ring)});
        ringGL.add(ring.ringl, 'height', 0, 30).onChange(function() {ring.updateGeometry(ring)});
        ringGL.add(ring.ringl, 'thickness', 0, 6).onChange(function() {ring.updateGeometry(ring)});
        ringGL.add(ring.ringl, 'radialSegments', 1, 100).onChange(function() {ring.updateGeometry(ring)});
        ringGL.add(ring.ringl, 'tubularSegments', 1, 300).onChange(function() {ring.updateGeometry(ring)});
        ringGL.add(ring.ringl.extra, 'stride', -20, 0).onChange(function() {ring.updateGeometry(ring)});
        ringGL.add(ring.ringl.extra, 'flattenSides', 0, 1).onChange(function() {ring.updateGeometry(ring)});
        ringGL.add(ring.ringl.extra, 'flattenTop', 0, 1).onChange(function() {ring.updateGeometry(ring)});
        ringGL.add(ring.ringl.extra, 'flattenAngle', 0, Math.PI*2).onChange(function() {ring.updateGeometry(ring)});
        ringGL.add(ring.ringl.extra, 'trueTubOrientation').onChange(function() {ring.updateGeometry(ring)});
        style = ringGL.addFolder("Style");
        style.add(ring.ringl.extra, 'freq', 0, 20).onChange(function() {ring.updateGeometry(ring)});
        style.add(ring.ringl.extra, 'mag', 0, 1).onChange(function() {ring.updateGeometry(ring)});
        style.add(ring.ringl.extra, 'clamp').onChange(function() {ring.updateGeometry(ring)});
    }

    function onSizeChange1(value) {
        if (siris_sizes[value]) {
            ring.ringr.height = siris_sizes[value][0];
            ring.ringr.width = siris_sizes[value][1];
            ring.updateGeometry(ring);
        }
        else {
            console.log("Sorry, no such ring size");
        }
    }

    function onSizeChange2(value) {
        if (siris_sizes[value]) {
            ring.ringl.height = siris_sizes[value][0];
            ring.ringl.width = siris_sizes[value][1];
            ring.updateGeometry(ring);
        }
        else {
            console.log("Sorry, no such ring size");
        }
    }

    //***************************************************************************//
    // render loop                                                               //
    //***************************************************************************//

    function run()
    {
        var deltaMS = clock.getDelta()*1000;

        render();

        if (animating)
        {
            if (ring) {
                ring.update();
            }
        }

        // change camera view angles
        if (camPosTarget != null) {
            camera.position.lerp(camPosTarget, 0.1);
            if (camPosTarget.clone().sub(camera.position).length() < 0.1) {
                camPosTarget = null;
            }
        }
        if (camTargetTarget != null) {
            controls.target.lerp(camTargetTarget, 0.1);
            if (camTargetTarget.clone().sub(controls.target).length() < 0.1) {
                camTargetTarget = null;
            }
        }

        // Ask for another frame
        requestAnimationFrame(run);
        controls.update();
    }

    // Render the scene
    function render()
    {
        renderer.render(scene, camera);
    }

    function downloadModel(filename, downloadType)
    {
        if (!filename || filename=="") {
            filename = "splint";
        }

        ring.updateMatrixWorld(true);
        exporter = new THREE.STLExporter();
        var data = exporter.exportScene(ring);
        download(data, filename+".stl", "application/sla", downloadType);
    }

    var currentClip = 0;
    var currentViewAngle = 0;

    function onWindowResize()
    {
        camera.aspect = modelWidth / modelHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(modelWidth, modelHeight);
    }

    function getKeyCode(evt)
    {
        if (window.event != null)
            return window.event.keyCode;
        else
            return evt.which;
    }

    function map(i, sStart, sEnd, tStart, tEnd)
    {
        var v = i-sStart;
        if (v>=0) {
            if (i < sStart) {
                return tStart;
            } else if (i > sEnd) {
                return tEnd;
            }
        } else {
            if (i > sStart) {
                return tStart;
            } else if (i < sEnd){
                return tEnd;
            }
        }
        var sRange = sEnd - sStart;
        if (sRange == 0) {
            return tStart;
        }

        var tMax = tEnd - tStart;
        return tStart + v / sRange * tMax;
    }

    function getFuncVal(t)
    {
        return new THREE.Vector3(
            Math.sin(t*Math.cos(t)),
            Math.cos(t*Math.sin(t)),
            Math.cos(t*Math.tan(t))
            );
    }

    function clip(x, bottom, top)
    {
        if (!clip) {
            return x;
        }

        if (x < bottom) {
            x = bottom;
        }
        else if (x > top) {
            x = top;
        }

        return x;
    }
    return {
        "loadModel" : loadModel,
        "downloadModel" : downloadModel,
        "ring" : ring,
        "onSizeChange1" : onSizeChange1,
        "onSizeChange2" : onSizeChange2
    };
}

