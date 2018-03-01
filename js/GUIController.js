

//TODO remove that ur able to stop rotation on change camera view animation
GUIController = function () {
    var scope = this;
    var scene;
    var camera;
    var _controls;
    var container;
    var geometryArray;
    var currentVectorPosition = new THREE.Vector3(0, 0, 0);
    var movingCamera;
    var viewPortController;
    var stats;
    var textureCube;
    //Keeps track of all camera views
    var RESET_BUTTON_PRESSED = false;
    var reset_Button;
    var viewPorts = [];
    var rayCaster;
    var newCaster;
    var mouse = new THREE.Vector2(), INTERSECTED;
    var FLOOR = -250;
    var renderer;

    this.object = (function () {
        var guiElements = new Object();
        return{
            getGeometryArray: function () {
              return geometryArray;
            },
            getGuiElements: function () {
                return guiElements;
            },
            addGuiElement: function (id,value) {
                guiElements[id] = value;
            },
            getId: function () {
                return name;
            },
            setListenersForExterior: function () {
                guiElements['colorRed'].addEventListener('click', colorClicked);
                guiElements['colorBlue'].addEventListener('click', colorClicked);
                guiElements['colorPurple'].addEventListener('click', colorClicked);
                guiElements['colorGray'].addEventListener('click', colorClicked);
                guiElements['colorTeal'].addEventListener('click', colorClicked);
                guiElements['colorOrange'].addEventListener('click', colorClicked);

                guiElements['rimOne'].addEventListener('click', rimClicked);
                guiElements['rimTwo'].addEventListener('click', rimClicked);
                guiElements['rimThree'].addEventListener('click', rimClicked);
                guiElements['rimFour'].addEventListener('click', rimClicked);
            },
            dispatchListeners: function () {
                //Todo dettach exterior listeners
            }
        }
    })();

    //TODO remove that ur able to stop rotation on change camera view animation

    this.initializeWEBGL = function () {
        reset_Button = scope.object.getGuiElements()['resetButton'];
        reset_Button.style.display = 'none';
        //camera nav variables

        setViewPorts();
        initializeScene();

        function setViewPorts() {
            //Vectors
            //vector front
            //

            //vector back
            //

            //vector side
            //

            //vector interior
            //viewPorts.push(new THREE.ViewPort(new THREE.Vector3(50,0,18)));
            //distance to zeroplane 58

            viewPorts.push(new THREE.ViewPort(new THREE.Vector3(50, -88, 40), false,
                scope.object.getGuiElements()['side'], scope.object.getGuiElements()['sidetext'],
                scope.object.getGuiElements()['sidebutton']));
            viewPorts.push(new THREE.ViewPort(new THREE.Vector3(-35, 0, 40), false,
                scope.object.getGuiElements()['front'], scope.object.getGuiElements()['fronttext'],
                scope.object.getGuiElements()['frontbutton']));
            viewPorts.push(new THREE.ViewPort(new THREE.Vector3(136, 0, 40), false,
                scope.object.getGuiElements()['back'], scope.object.getGuiElements()['backtext'],
                scope.object.getGuiElements()['backbutton']));
            viewPorts.push(new THREE.ViewPort(new THREE.Vector3(50, 0, 18), false,
                scope.object.getGuiElements()['interior'], scope.object.getGuiElements()['interiortext'],
                scope.object.getGuiElements()['interiorbutton']));
        }

        animateScene();

        function initializeScene() {
            /*setTimeout(function () {
                //document.body.children[2].style.display="none";
            },10);*/
            if (!Detector.webgl) {
                Detector.addGetWebGLMessage();
                return;
            }
            rayCaster = new THREE.Raycaster();
            newCaster = new THREE.Raycaster();
            container = scope.object.getGuiElements()['container'];

            textureCube = new THREE.CubeTextureLoader()
                .setPath( 'textures/backgroundone/')
                .load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );

            containerWidth = container.clientWidth;
            containerHeight = container.clientHeight;
            renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(containerWidth, containerHeight);
            renderer.gammaInput = true;
            renderer.gammaOutput = true;
            renderer.shadowMap.enabled = true;
            container.appendChild(renderer.domElement);

            // Add object picking
            projector = new THREE.Projector();
            mouseVector = new THREE.Vector3();

            //Adding object on camera for colletion detection
            var cameraCube = new THREE.CubeGeometry(20, 20, 20, 1, 1, 1);
            var wireMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
            movingCamera = new THREE.Mesh(cameraCube, wireMaterial);
            movingCamera.position.set(0, 0, 0);

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 1, 1000);
            camera.position.set(0, -20, 50);
            camera.up.set(0, 0, 1);

            var light = new THREE.SpotLight();
            light.angle = Math.PI / 16;
            light.penumbra = 0.5;
            light.castShadow = true;
            light.position.set( 600, 0, 600 );
            scene.add( light );
            var light2 = light.clone();
            light2.position.set( 0, 600, 0 );
            scene.add( light2 );
            var light3 = light2.clone();
            light3.position.set( 0, 0, 600 );
            scene.add( light3 );

            var light4 = light3.clone();
            light4.position.set( 0, 0, -600);
            scene.add( light4 );
            var geometry = new THREE.CircleBufferGeometry( 100, 100);
            var planeMaterial = new THREE.MeshPhongMaterial( { color: 0x00000, side: THREE.DoubleSide, specular: 0x101010 } );
            var ground = new THREE.Mesh( geometry, planeMaterial );

            ground.position.set( 50, 0, 2.5 );
            ground.scale.set( 0.5, 0.5, 0.5);
            ground.receiveShadow = true;
            scene.add( ground );

            var circleThickness = [];
            for(var i=0.1; i<5 ; i+= 0.1) {
                circleThickness[i] = ground.clone();
                circleThickness[i].position.set(50,0, 3-i);
                circleThickness[i].updateMatrix();
                scene.add( circleThickness[i] );
            }
            //camera initialized
            //adding movingCamera object to the camera object
            //for tracking the collisions
            camera.lookAt(scene.position);
            //camera.add(movingCamera);
            scene.add(camera);

            var grid = new THREE.GridHelper(400, 400, 0xffffff, 0x555555);
            // scene.add(grid);
            _controls = new THREE.OrbitControls(camera, renderer.domElement, document);
            _controls.panSpeed = 0.8;
            _controls.noPan = false;
            viewPortController = new THREE.ViewPortController(_controls, viewPorts, scope.object.getGuiElements()['cameraButtons'], camera);

            geometryArray = new Object();
            /* Floor  */
            loadJSON(jsonFileNames, numberOfJSONFiles, boundingBoxMinimum, boundingBoxMaximum);
            //loadJSON(jsonFileNamesFord,numberOfJSONFilesFord,boundingBoxMinimumFord,boundingBoxMaximumFord);


            /*pointLight = new THREE.PointLight(0xffffff, 1);
            pointLight.position.copy(camera.position);
            camera.add(pointLight);*/


            window.addEventListener("mousemove", onMouseMove, false);
            window.addEventListener("resize", onWindowResize, false);
            _controls.addEventListener('change', render);
            stats = new Stats();
            container.appendChild(stats.dom);

            setForOnlyNavigationAroundXAxis();
            _controls.maxDistance = 300;
        }

        function loadJSON(jsonFileNames, numberOfJSONFiles, boundingBoxMinimum, boundingBoxMaximum) {
            var scaleFactor = calculateScaleFactor(boundingBoxMinimum, boundingBoxMaximum);
            var loader = new THREE.JSONLoader();
            /**
             * Loads le json files and add a reff id _jsonLink
             * to each mesh name, so It can be trace when something is gonna
             * be changed with that specific mesh
             *
             * XD:D:D:
             * */
            for (var _json in jsonFileNames) {
                //  console.log("layerlink" + jsonFileNames[_json]);
                var _jsonLink = jsonFileNames[_json];
                (function (link) {
                    loader.load(
                        // resource URL
                        _json,
                        // onLoad callback
                        function (geometry, materials) {
                            // console.log("jaja" + link);
                            var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
                                side: THREE.DoubleSide
                            }));
                            mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
                            mesh.name = link;
                            mesh.castShadow = true;
                            mesh.receiveShadow = true;
                            scene.add(mesh);
                            geometryArray[link] = mesh;
                            if ((scene.children.length - 1) == numberOfJSONFiles) {
                                fitAll(scene);
                            }else{
                                contextRender.object.initializeDefault();
                            }
                        },
                        // onProgress callback
                        function (xhr) {
                               //   console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                        },

                        // onError callback
                        function (err) {
                            //        console.log('An error happened');
                        }
                    );
                })(_jsonLink);
            }
        }
        function onWindowResize(resizeEvent) {
            renderer.setSize(container.clientWidth, container.clientHeight);
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
        }

        function onMouseMove(event) {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        //TODO add rotation around x axis only
        function setForOnlyNavigationAroundXAxis() {
            _controls.minPolarAngle = -Math.PI;
            _controls.maxPolarAngle = Math.PI / 2;
        }


        /**
         * Scale each mesh based on vertexs in each json that being loaded.
         * */
        function calculateScaleFactor(boundingBoxMinimum, boundingBoxMaximum) {
            // Get bounding box size
            var bBoxSize = [(boundingBoxMaximum[0] - boundingBoxMinimum[0]),
                (boundingBoxMaximum[1] - boundingBoxMinimum[1]),
                (boundingBoxMaximum[2] - boundingBoxMinimum[2])];
            // Detect largest dimension
            var largestSize = bBoxSize[0];
            if (bBoxSize[1] > largestSize) {
                largestSize = bBoxSize[1];
            }
            if (bBoxSize[2] > largestSize) {
                largestSize = bBoxSize[2];
            }

            // Scale dimension to 100
            return 100.0 / largestSize;
        }

        /**
         * Fit the content together in the scene
         * */
        function fitAll(node) {
            // Calculate bounding box of the whole scene
            var boundingBoxOfNode = new THREE.Box3().setFromObject(node);
            var centerOfGravity = boundingBoxOfNode.center();
            var newCameraPosition = new THREE.Vector3();
            newCameraPosition.subVectors(centerOfGravity, _controls.target);
            camera.position.addVectors(camera.position, newCameraPosition);
            camera.lookAt(centerOfGravity);
            _controls.target.set(centerOfGravity.x, centerOfGravity.y, centerOfGravity.z);

            // Move camera along z until the object fits into the screen
            var sphereSize = boundingBoxOfNode.size().length() * 0.5;
            var distToCenter = sphereSize / Math.sin(Math.PI / 180.0 * camera.fov * 0.5);
            var target = _controls.target;
            var vec = new THREE.Vector3();
            vec.subVectors(camera.position, target);
            vec.setLength(distToCenter);
            camera.position.addVectors(vec, target);
        }

        function animateScene() {
            _controls.update();
            requestAnimationFrame(animateScene);
            renderScene();
        }

        function renderScene() {
            render();
            stats.update();
            renderer.render(scene, camera);
        }
        function render() {
            camera.updateMatrixWorld();
            currentVectorPosition.set(camera.position.x, camera.position.y, camera.position.z);
            _controls.updateCurrent3DVector(currentVectorPosition);
            viewPortController.update(currentVectorPosition);
          //  rayCastingMouse();
            renderer.render(scene, camera);
        }
        function rayCastingMouse() {
            rayCaster.setFromCamera( mouse, camera );
            var intersects = rayCaster.intersectObjects( scene.children );
            if ( intersects.length > 0 ) {
                if ( INTERSECTED != intersects[ 0 ].object ) {
                    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                    INTERSECTED = intersects[ 0 ].object;
                    INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                    INTERSECTED.material.emissive.setHex( 0xff0000 );


                    console.log("MESH NAME: " + INTERSECTED.name );
                }
            } else {
                if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                INTERSECTED = null;
            }
        }
    };
    //TODO get all ids that going to change on a click
    function colorClicked(event) {
        contextRender.object.bodyColorClicked(this.id);
    }
    function rimClicked(event) {
        contextRender.object.rimClicked(this.id);
    }
    function backgroundListener(event) {
        contextRender.object.setNewTexture(this.id);
        clearBackgroundSelected();
        $(scope.object.getGuiElements()[this.id]).removeClass('inactiveState');
        $(scope.object.getGuiElements()[this.id]).addClass('activeState');
    }
    function clearBackgroundSelected() {
        $(scope.object.getGuiElements()['nightBackground']).removeClass('activeState');
        $(scope.object.getGuiElements()['bridgeBackground']).removeClass('activeState');
        $(scope.object.getGuiElements()['cloudBackground']).removeClass('activeState');

        $(scope.object.getGuiElements()['nightBackground']).addClass('inactiveState');
        $(scope.object.getGuiElements()['bridgeBackground']).addClass('inactiveState');
        $(scope.object.getGuiElements()['cloudBackground']).addClass('inactiveState');
    }
    function addBackgroundListeners() {
        setTimeout(function () {
            scope.object.getGuiElements()['nightBackground'].addEventListener('click', backgroundListener);
            scope.object.getGuiElements()['bridgeBackground'].addEventListener('click', backgroundListener);
            scope.object.getGuiElements()['cloudBackground'].addEventListener('click', backgroundListener);
        },10);
    }

    addBackgroundListeners();
};