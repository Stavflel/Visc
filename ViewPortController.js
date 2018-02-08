
/**
 * View Port controller fo set fixed camera position on element ID using orbitalControll
 *
 * @author Rasmus Dahlkvist
 * */

//number of viewports,
THREE.ViewPortController = function (orbitController, viewPorts) {
    const INTERVAL_CLOSURE_Z = 26;
    const CENTER_POINT = new THREE.Vector3(50,0,15);
    const MAX_Z_POSITION = 66;
    const MIN_Z_POSITION = 40;
    const _DISTANCE_TO_ZERO_PLANE = 93;
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
            setViewPosition: function (_viewPosition) {
                viewPosition = _viewPosition;
            },
            getAxisPosition: function(index){
                switch (index){
                    case 0:
                        return viewPosition.x;
                    case 1:
                        return viewPosition.y;
                    case 2:
                        return viewPosition.z;
                    default:
                }
            },
            getViewPortAxisPosition: function (value) {
                return defaultViewPort.getViewPort().object.getPosition().toArray().indexOf(value);
            },
            distance: function () {
                return defaultViewPort.getViewPosition().angleTo(defaultViewPort.getViewPort().object.getPosition());
            },
            distanceToCenterPoint: function () {
              return defaultViewPort.getViewPosition().distanceTo(CENTER_POINT);
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
      /*  console.log("view port clicked? ")
        console.log("distance to zero plane " + defaultViewPort.distanceToCenterPoint());
        console.log("le view port?x + " + defaultViewPort.getViewPosition().x);
        console.log("le view port?y + " + defaultViewPort.getViewPosition().y);
        console.log("le view port?z + " + defaultViewPort.getViewPosition().z);*/
        if( defaultViewPort !== undefined ){
            if( defaultViewPort.getViewPort().object.getViewState() === true ){
                //TODO move to view port
                moveToViewPort();
            }
        }
    };

    /**
     * Initialize the default view
     * */
    function initializeDefaultView() {
        defaultViewPort.attachViewPort( scope.viewPorts[0] );
        resetOldDefault('');
    }

    /**
     * Add listeners to all the viewport elements inside the HTML-document
     * */
    function addListeners() {
        for( var i = 0; i < scope.viewPorts.length; i += 1 ){
            scope.viewPorts[i].object.getViewElement().addEventListener('click',viewPortListener);
        }
    }

    /**
     * Listener when the viewport is pressed
     * using the array that contains the viewports to get values
     * from the viewport that is clicked in the view
     * */
    function viewPortListener(event) {
        var viewPort = scope.viewPorts.find( function (value) {
            console.log("find : " + event.target.id);
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
        if (defaultViewPort.distanceToCenterPoint() > _DISTANCE_TO_ZERO_PLANE + 10) {
            scope.orbitController.updateZoom('out');
        }
        else if (defaultViewPort.distanceToCenterPoint() < _DISTANCE_TO_ZERO_PLANE - 10) {
            scope.orbitController.updateZoom('in');
        }
    }
    function checkRestrictionOnHighestCoord() {
        console.log("distance to zero plane " + defaultViewPort.distanceToCenterPoint());
        console.log("le view port?x + " + defaultViewPort.getViewPosition().x);
        console.log("le view port?y + " + defaultViewPort.getViewPosition().y);
        console.log("le view port?z + " + defaultViewPort.getViewPosition().z);
      /*  console.log("max value:  " + scope.axis().maxValue());
        console.log("min value:  " + scope.axis().minValue());
        console.log("zero axis:  " + scope.axis().zeroAxis());
        console.log("axis position?:  " + defaultViewPort.getAxisPosition(scope.axis().minValue()));*/

        if(scope.axis().maxValue() > 0){
            return defaultViewPort.getAxisPosition(defaultViewPort.getViewPortAxisPosition(scope.axis().maxValue())) > scope.axis().maxValue() - 10;
        }else if(scope.axis().maxValue() < 0){
            return defaultViewPort.getAxisPosition(defaultViewPort.getViewPortAxisPosition(scope.axis().maxValue())) < 0;
        }
    }
    function checkIfZeroOnNoneZeroAxis(){
        console.log(" check return value : " + scope.axis().zeroAxis());
        console.log("le view port?x + " + defaultViewPort.getViewPosition().x);
        console.log("le view port?y + " + defaultViewPort.getViewPosition().y);
        console.log("le view port?z + " + defaultViewPort.getViewPosition().z);
        console.log("the zero value :  " + defaultViewPort.getAxisPosition(scope.axis().zeroAxis()));
        var test = defaultViewPort.getViewPort().object.getPosition().toArray();
        if(scope.axis().zeroAxis() === 1){
            console.log("over here?");
            return defaultViewPort.getAxisPosition(scope.axis().zeroAxis()) < 10 &&
                defaultViewPort.getAxisPosition(scope.axis().zeroAxis()) > 0;
        }
        //TODO is working for this car need to be change
        else{
            console.log("jaman");
           return  defaultViewPort.getAxisPosition(defaultViewPort.getViewPortAxisPosition(scope.axis().minValue()))
               < scope.axis().minValue() + 10 && scope.axis().minValue() >
               defaultViewPort.getAxisPosition(defaultViewPort.getViewPortAxisPosition(scope.axis().minValue())) -10
        }
    }
    function moveToViewPort() {
        rotationDirection();
        if (checkRestrictionOnHighestCoord()) {
            if (currentVectorPosition.z > MAX_Z_POSITION) {
                scope.orbitController.updateRotationUp('down');
            } else if (currentVectorPosition.z < MIN_Z_POSITION) {
                scope.orbitController.updateRotationUp('up');
            }else if(checkIfZeroOnNoneZeroAxis()){
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
            index: function (indexToFind) {
                return defaultViewPort.getViewPort().object.getPosition().toArray().indexOf(indexToFind);
            },
            maxValue: function () {
                return Math.max.apply(null,defaultViewPort.getViewPort().object.getPosition().toArray());
            },
            minValue: function () {
                return Math.min.apply(null,defaultViewPort.getViewPort().object.getPosition().toArray());
            },
            zeroAxis: function () {
                return defaultViewPort.getViewPort().object.getPosition().toArray().findIndex(function (value) {
                    return value === 0;
                });
            }
        }
    };
    var tempArray = (function () {
        var array=[];
        return{
            getArray: function () {return array; },
            setArray: function (value) { array.push(value) }
        }
    })();
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            value: function(predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                    // d. If testResult is true, return kValue.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return undefined.
                return undefined;
            }
        });
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function indexOf(member, startFrom) {
            /*
            In non-strict mode, if the `this` variable is null or undefined, then it is
            set to the window object. Otherwise, `this` is automatically converted to an
            object. In strict mode, if the `this` variable is null or undefined, a
            `TypeError` is thrown.
            */
            if (this == null) {
                throw new TypeError("Array.prototype.indexOf() - can't convert `" + this + "` to object");
            }

            var
                index = isFinite(startFrom) ? Math.floor(startFrom) : 0,
                that = this instanceof Object ? this : new Object(this),
                length = isFinite(that.length) ? Math.floor(that.length) : 0;

            if (index >= length) {
                return -1;
            }

            if (index < 0) {
                index = Math.max(length + index, 0);
            }

            if (member === undefined) {
                /*
                  Since `member` is undefined, keys that don't exist will have the same
                  value as `member`, and thus do need to be checked.
                */
                do {
                    if (index in that && that[index] === undefined) {
                        return index;
                    }
                } while (++index < length);
            } else {
                do {
                    if (that[index] === member) {
                        return index;
                    }
                } while (++index < length);
            }

            return -1;
        };
    }
    //Initialize basic functions listeners and defaultview
    addListeners();
    initializeDefaultView();
};