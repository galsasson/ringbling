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
        controls = new THREE.OrbitControls(camera, container);
        controls.noZoom = disableZoom;
        controls.addEventListener( 'change', render );
        // console.log(controls);
        controls.target.set(camAngles[0].tx, camAngles[0].ty, camAngles[0].tz);

        // add lights
        initSceneLights();

        // load resources (after all resouces will load, calls populateScene)
        // loadResources(populateScene);
        loadResources(function (){});
        populateScene();

        // Add a mouse up handler to toggle the animation
        addInputHandler();
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

    }

    function onSizeChange2(value) {

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

    //***************************************************************************//
    // User interaction                                                          //
    //***************************************************************************//
    function addInputHandler()
    {
        var dom = renderer.domElement;
        dom.addEventListener('mouseup', onMouseUp, false);
        dom.addEventListener('mousedown', onMouseDown, false);
        window.addEventListener('keydown', onKeyDown, false);
        window.addEventListener('keyup', onKeyUp, false);
    }

    function onKeyDown(evt)
    {
        var keyCode = getKeyCode(evt);
        keyPressed[keyCode] = true;

        console.log(keyCode);

        if (keyCode == 32) {
            if (animating) {
                videoScreen.video.pause();
            }
            else {
                videoScreen.video.play();
            }
            animating = !animating;
        }
        else if (keyCode >= 48 &&
                 keyCode < 48+camAngles.length) {
            var angle = keyCode-48;
            setCameraAngle(angle);
        }
        else if (keyCode == 67) // 'c'
        {
            console.log(camera.position);
            console.log(controls.target);
        }
        else if (keyCode == 70) {   // 'f'
            ring.toggleFaces();
        }
        else if (keyCode == 77) {   // 'm'
            ring.toggleFaceMovement();
        }
        else if (keyCode == 82) {   // 'r'
            resetObject();
        }
        else if (keyCode == 65) {   // 'a'
            nextClip();
            nextViewAngle();
        }
        else if (keyCode == 85) {   // 'u'
            ring.mergeNew();
        }
    }

    function downloadModel()
    {
        console.log("exporting stl");
        ring.updateMatrixWorld(true);
        exporter = new THREE.STLExporter();
        var data = exporter.exportScene(ring);
        download(data, "ringbling.stl", "application/sla");
    }

    var currentClip = 0;
    var currentViewAngle = 0;

    function nextClip()
    {
        currentClip++;
        if (currentClip >= 8) {
            currentClip = 0;
        }

        if (videoScreen.on) {
            setTimeout(screenToggle, 0);
        }
        setTimeout(resetObject, 200);
        setTimeout(selectChannel, 400);
        setTimeout(screenToggle, 600);
        setTimeout(nextClip, remote.channels[currentClip].length + 5000);
    }

    function nextViewAngle()
    {
        setTimeout(function() {setCameraAngle(0);}, 0);
        setTimeout(function() {setCameraAngle(1);}, 20000);
        setTimeout(function() {setCameraAngle(2);}, 40000);
        setTimeout(function() {setCameraAngle(0);}, 50000);
        setTimeout(function() {setCameraAngle(3);}, 60000);
        setTimeout(nextViewAngle, 85000);
    }

    function setCameraAngle(angle)
    {
        camPosTarget = new THREE.Vector3(camAngles[angle].x, camAngles[angle].y, camAngles[angle].z);
        camTargetTarget = new THREE.Vector3(camAngles[angle].tx, camAngles[angle].ty, camAngles[angle].tz);
    }

    function resetObject()
    {
        ring.reset();
    }

    function screenToggle()
    {
    }

    function selectChannel()
    {
    }

    function onKeyUp(evt)
    {
        var keyCode = getKeyCode(evt);

        keyPressed[keyCode] = false;
    }

    function onMouseDown(event)
    {
        event.preventDefault();

        // stop flying
        camPosTarget = null;
        camTargetTarget = null;

        // check intersections with interactive objects
        var vector = new THREE.Vector3(
            ( event.clientX / window.innerWidth ) * 2 - 1,
          - ( event.clientY / window.innerHeight ) * 2 + 1,
            camera.near);
        // var projector = new THREE.Projector();
        // projector.unprojectVector( vector, camera );
        vector.unproject(camera);

        var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize(), 0, 2000);

        /*
        var intersections = ray.intersectObject(remote, true);
        if (intersections.length == 0) {
            return;
        }

        var object = intersections[0].object;
        if (object.handleMouseDown != null)
        {
            object.handleMouseDown();
            pressedObjects.push(object);
        }
        */

        // console.log(result);
    }

    function onMouseUp(event)
    {
        event.preventDefault();

        while (pressedObjects.length > 0)
        {
            var obj = pressedObjects.pop();
            if (obj.handleMouseUp != null) {
                obj.handleMouseUp();
            }
        }
    }

    function onMouseMove(event)
    {
        event.preventDefault();
        if (dragging) {
            var x = prevMouse.x - event.x;
            var y = prevMouse.y - event.y;
            camera.rotation.y -= x/1000;

            prevMouse.x = event.x;
            prevMouse.y = event.y;
        }
    }

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
        "ring" : ring
    };
}

