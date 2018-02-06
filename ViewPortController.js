
/**
 * View Port controller fo set fixed camera position on element ID using orbitalControll
 *
 * @author Rasmus Dahlkvist
 * */

//number of viewports,
THREE.ViewPortController = function (orbitController, viewPorts) {
    const INTERVAL_CLOSURE_Z = 26;
    const ZERO_PLANE = new THREE.Vector3(0,0,0);
    const MAX_Z_POSITION = 66;
    const MIN_Z_POSITION = 40;
    const _DISTANCE_TO_ZERO_PLANE = 190;
    var _startDistance = 0;
    this.gui = new Object();
    var scope = this;
    this.viewPorts = viewPorts;
    this.orbitController = orbitController;


    //TODO Initialize default viewport
    /**
     * Object which contains the value of the
     * default view port and the current camera position
     *
     * Returns value based on distance to vectors from the
     * current viewport position and camera position
     * */
    var defaultViewPort = (function () {
        var currentViewPort = null;
        var viewPosition = THREE.Vector3(0,0,0);
        return {
            getViewPort: function () {
                return currentViewPort;
            },
            attachViewPort: function (viewPort) {
                currentViewPort = viewPort;
            },
            getViewPosition: function () {
               return viewPosition;
            },
            getAxisPosition: function(index){
                switch (index){
                    case 0:
                        return defaultViewPort.getViewPosition().x;
                    case 1:
                        return defaultViewPort.getViewPosition().y;
                    case 2:
                        return defaultViewPort.getViewPosition().z;
                }
            },
            setViewPosition: function (_viewPosition) {
                viewPosition = _viewPosition;
            },
            distance: function () {
                return defaultViewPort.getViewPosition().angleTo(defaultViewPort.getViewPort().object.getPosition());
            },
            distanceToZeroPlane: function () {
              return defaultViewPort.getViewPosition().distanceTo(ZERO_PLANE);
            }
        }
    })();

    /**
     * Called in render loop
     * Update camera position if the viewState of a view port is true
     *
     * @param currentViewPos the current vector position of the camera
     * */
    this.update = function (currentViewPos) {
        defaultViewPort.setViewPosition(currentViewPos);
        if(defaultViewPort !== undefined){
            if(defaultViewPort.getViewPort().object.getViewState() === true){
                //TODO move to view port
                moveToViewPort();
            }
        }
    };

    /**
     * Initialize the default view
     * */
    function initializeDefaultView() {
        defaultViewPort.attachViewPort(scope.viewPorts[0]);
        resetOldDefault('');
    }

    /**
     * Add listeners to all the viewport elements inside the HTML-document
     * */
    function addListeners() {
        for(var i = 0; i < scope.viewPorts.length; i += 1){
            scope.viewPorts[i].object.getViewElement().addEventListener('click',viewPortListener);
        }
    }

    /**
     * Listener when the viewport is pressed
     * using the array that contains the viewports to get values
     * from the viewport that is clicked in the view
     * */
    function viewPortListener(event) {
        var viewPort = scope.viewPorts.find(function (value) {
            if( value.object.getViewState() !== true ) {
                value.object.setViewState(true);
                resetOldDefault(event.target.id);
                return value.object.getId() === event.target.id;
            }else{ return value.object.getId() === event.target.id; }
        });
        defaultViewPort.attachViewPort(viewPort);
        if( defaultViewPort.getViewPort() !== undefined ){
            scope.orbitController.autoRotate = true;
            _startDistance = defaultViewPort.distance();
        }
    }

    /**
     * Add false to the viewstate which is not default in the controller
     * @param id the element id
     * */
    function resetOldDefault(id) {
        scope.viewPorts.filter(function (value) {
            if( value.object.getId() !== id && value.object.getViewState() === true ){ value.object.setViewState(false) }
        });
    }

    /**
     * Check which direction for the rotation
     * based on distance to the new viewport position.
     * */
    function rotationDirection() {
        if((defaultViewPort.distance() - _startDistance) > 0){
            _controls.autoRotate = false;
            _controls.autoRotateNegative = true;
        }
    }
    /**
     *
     * */
    function defaultZoom() {
        if (defaultViewPort.distanceToZeroPlane() > _DISTANCE_TO_ZERO_PLANE + 10) {
            scope.orbitController.updateZoom('out');
        }
        else if (defaultViewPort.distanceToZeroPlane() < _DISTANCE_TO_ZERO_PLANE - 10) {
            scope.orbitController.updateZoom('in');
        }
    }
    function checkRestrictionOnHighestCoord() {
        if(scope.axis().value() > 0){
            return defaultViewPort.getAxisPosition(scope.axis().index()) > 0;
        }else if(scope.axis().value() < 0){
            return defaultViewPort.getAxisPosition(scope.axis().index()) < 0;
        }
    }
    function moveToViewPort() {
        rotationDirection();
        if (checkRestrictionOnHighestCoord()) {
            if (currentVectorPosition.z > MAX_Z_POSITION) {
                scope.orbitController.updateRotationUp('down');
            } else if (currentVectorPosition.z < MIN_Z_POSITION) {
                scope.orbitController.updateRotationUp('up');
            }else if(defaultViewPort.getAxisPosition(scope.axis().zeroAxis()) < 10 &&
                defaultViewPort.getAxisPosition(scope.axis().zeroAxis()) > 0){
                stopRotating();
            }
        }
        defaultZoom();
    }
    //Stop rotating on both direction
    function stopRotating() {
        scope.orbitController.autoRotateNegative = false;
        scope.orbitController.autoRotate = false;
        resetOldDefault('');
    }
    //Have a new view port to rotate to
    //Need to check the position of the new one
    THREE.ViewPortController.prototype.axis = function () {
        return {
            index: function () {
                return defaultViewPort.getViewPort().object.getPosition().toArray().findIndex(function (value) {
                    return Math.max(value);
                });
            },
            value: function () {
                return defaultViewPort.getViewPort().object.getPosition().toArray().find(function (value) {
                    return Math.max(value);
                });
            },
            zeroAxis: function () {
                return defaultViewPort.getViewPort().object.getPosition().toArray().findIndex(function (value) {
                    return value === 0;
                });
            }
        }
    };
    //Initialize basic functions listeners and defaultview
    addListeners();
    initializeDefaultView();
};