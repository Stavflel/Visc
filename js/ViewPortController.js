
/**
 * View Port controller fo set fixed camera position on element ID using orbitalControll
 *
 * @author Rasmus Dahlkvist
 * */

//number of viewports,
THREE.ViewPortController = function (orbitController, viewPorts, guiElement, camera) {
    const INTERVAL_CLOSURE_Z = 26;
    const CENTER_POINT = new THREE.Vector3(50,0,15);
    const PAN_POSITION = new THREE.Vector2(520,290);
    const MAX_Z_POSITION = 55;
    const MIN_Z_POSITION = 30;
    const _DISTANCE_TO_ZERO_PLANE = 93;
    var _startDistance = 0;
    this.gui = new Object();
    var scope = this;
    var guiElement = guiElement;
    this.viewPorts = viewPorts;
    this.orbitController = orbitController;
    var nearViewPorts = [];
    var clickDisabled = false;
    var currentVectorPosition = camera.position;

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
                    case 0: return viewPosition.x;
                    case 1: return viewPosition.y;
                    case 2: return viewPosition.z;
                    default:
                }
            },
            getCurrentVectorPosition: function (point) {
              switch (point){
                  case 'x': return viewPosition.x;
                  case 'y': return viewPosition.y;
                  case 'z': return viewPosition.z;
                  default:
              }
            },
            getViewPortVectorPosition: function (point) {
                switch (point){
                    case 'x': return defaultViewPort.getViewPort().object.getPosition().x;
                    case 'y': return defaultViewPort.getViewPort().object.getPosition().y;
                    case 'z': return defaultViewPort.getViewPort().object.getPosition().z;
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
        //console.log("distance to zero plane " + defaultViewPort.distanceToCenterPoint());
       /* console.log("le view port?x  " + defaultViewPort.getViewPosition().x);
         console.log("le view port?y  " + defaultViewPort.getViewPosition().y);
        console.log("le view port?z +" + defaultViewPort.getViewPosition().z);*/
        if( defaultViewPort !== undefined ){
            if( defaultViewPort.getViewPort().object.getViewState() === true ){
             //   console.log("moving");
                //TODO move to view port
                moveToViewPort();
            }/*Älse if( defaultViewPort.getViewPort().object.getViewState() === false){
                console.log("check boundaries");
                checkBoundaries();
            }*/

        }
    };

    function addNearViewPortObjects() {
        nearViewPorts.push(new THREE.DefaultViewPort('front'));
        nearViewPorts.push(new THREE.DefaultViewPort('back'));
        nearViewPorts.push(new THREE.DefaultViewPort('side'));
        nearViewPorts.push(new THREE.DefaultViewPort('interior'));
    }
    function resetState() {
        for(var i = 0; i < nearViewPorts.length; i++){ nearViewPorts[i].object.setState(false); }
    }
    /**
     * Initialize the default view
     * */
    function initializeDefaultView() {
        defaultViewPort.attachViewPort( scope.viewPorts[0] );
     //   resetOldDefault('');
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
        console.log("wahaw" + event.target.id);
        var _eventID = '';
        //resetOldDefault('');
            if(clickDisabled) {
                return;
            }
            var viewPort;
            if ( event.target.id === 'front' || event.target.id === 'frontbutton'  || event.target.id === 'fronttext' ) {
                _eventID = 'front';
                moveToCenterOfGravity();
                startMoving();
                setGUIValuesOnCamera();
            }
            else if( event.target.id === 'back' || event.target.id === 'backbutton'  || event.target.id === 'backtext'  ) {
                _eventID = 'back';
                moveToCenterOfGravity();
                startMoving();
                setGUIValuesOnCamera();
            }
            else if( event.target.id === 'side' || event.target.id === 'sidebutton'  || event.target.id === 'sidetext'  ) {
                _eventID = 'side';
                moveToCenterOfGravity();
                startMoving();
                setGUIValuesOnCamera();
            }
            function startMoving (){
                resetOldDefault('');
                resetState();
                viewPort = scope.viewPorts.find(findViewPortById);
                viewPort.object.setViewState(true);
                scope.orbitController.autoRotate = true;
                defaultViewPort.attachViewPort(viewPort);
                _startDistance = defaultViewPort.distance();
            }
            function setGUIValuesOnCamera(){
                resetClassesButton();
              //  resetClassesText();
                defaultViewPort.getViewPort().object.getViewButtonElement().classList.remove("buttoninactive");
                defaultViewPort.getViewPort().object.getViewButtonElement().classList.remove("button");
                defaultViewPort.getViewPort().object.getViewButtonElement().classList.add("button");

                defaultViewPort.getViewPort().object.getViewTextElement().classList.remove("textinactive");
                defaultViewPort.getViewPort().object.getViewTextElement().classList.remove("text");
                defaultViewPort.getViewPort().object.getViewTextElement().classList.add("text");
               // defaultViewPort.getViewPort().object.getViewElement().classList.remove()
            }
            function resetClassesButton(){
                var array = Array.prototype.slice.call(guiElement.children);
                for(var i = 0; i < array.length; i += 1)    {
                    var children = Array.prototype.slice.call(array[i].children);
                    for(var j = 0; j < children.length; j += 1){
                        if(children[j].classList.contains("button")) {
                            children[j].classList.remove("button");
                            children[j].classList.add("buttoninactive");
                        }
                        if(children[j].classList.contains("text")) {
                            children[j].classList.remove("text");
                            children[j].classList.add("textinactive");
                        }
                    }
                }
            }
        function resetClassesText(){
            var array = Array.prototype.slice.call(guiElement.children);
            for(var i = 0; i < array.length; i += 1)    {
                var children = Array.prototype.slice.call(array[i].children);
                for(var j = 0; j < children.length; j += 1){
                    if(children[j].classList.contains("text")) {
                        children[j].classList.remove("text");
                        children[j].classList.add("textinactive");
                    }
                }
            }
        }
            function findViewPortById(value) {
                return value.object.getId() === _eventID;
            }

         clickDisabled = true;
         setTimeout(function () {
            clickDisabled = false;
         },2000);

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
            scope.orbitController.autoRotate = false;
            scope.orbitController.autoRotateNegative = true;
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

        if(defaultViewPort.getViewPort().object.getPosition().x > 0){
            return defaultViewPort.getAxisPosition(
                defaultViewPort.getViewPortAxisPosition(scope.axis().maxValue())) > scope.axis().maxValue() - 5;
        }else{
            return defaultViewPort.getAxisPosition(defaultViewPort.getViewPortAxisPosition(scope.axis().minValue()))
                < defaultViewPort.getViewPort().object.getPosition().x + 5;
        }
    }
    function checkIfZeroOnNoneZeroAxis(){
        if(scope.axis().zeroAxis() === 1){
            return defaultViewPort.getAxisPosition(scope.axis().zeroAxis()) < 15 &&
                defaultViewPort.getAxisPosition(scope.axis().zeroAxis()) > 0;
        }
        //TODO is working for this car need to be change
        else{
           return  defaultViewPort.getAxisPosition(defaultViewPort.getViewPortAxisPosition(scope.axis().minValue()))
               < scope.axis().minValue() + 10 && scope.axis().minValue() >
               defaultViewPort.getAxisPosition(defaultViewPort.getViewPortAxisPosition(scope.axis().minValue())) - 15
        }
    }
    function moveToViewPort() {
        rotationDirection();
        if (currentVectorPosition.z > MAX_Z_POSITION) {
           // console.log("max min");
            scope.orbitController.updateRotationUp('down');
        } else if (currentVectorPosition.z < MIN_Z_POSITION) {
          //  console.log("min max");
            scope.orbitController.updateRotationUp('up');
        }
        if (checkRestrictionOnHighestCoord()) {
          //  console.log("zero or none");
            if (currentVectorPosition.z > MAX_Z_POSITION) {
           //     console.log("max min");
                scope.orbitController.updateRotationUp('down');
            } else if (currentVectorPosition.z < MIN_Z_POSITION) {
            //    console.log("min max");
                scope.orbitController.updateRotationUp('up');
            }else if(checkIfZeroOnNoneZeroAxis()){
                stopRotating();
            }
        }
        defaultZoom();
    }

    function moveToCenterOfGravity(){
        scope.orbitController.updatePanPosition(CENTER_POINT);
    }
    //TODO a func that checks if it is out side a set boundary
    // Cause of lagg issuse with low fps :///
    function checkBoundaries() {
        var tracker = 0;
        //TODO check if positive or negative
        if(defaultViewPort.getViewPortVectorPosition('x') > 0){
            if(defaultViewPort.getCurrentVectorPosition('x') > defaultViewPort.getViewPortVectorPosition('x') - 5){
                tracker += 1;
            }
        }else{
            if(defaultViewPort.getCurrentVectorPosition('x') < defaultViewPort.getViewPortVectorPosition('x') + 5){
                tracker += 1;
            }
        }
        //TODO check if zero axis
        if(scope.axis().zeroAxis() === 1){
            if(defaultViewPort.getCurrentVectorPosition('y') < 0 &&
                defaultViewPort.getCurrentVectorPosition('y') > 10){
                tracker += 1;
            }
        }else{
            if(defaultViewPort.getCurrentVectorPosition('y') > defaultViewPort.getViewPortVectorPosition('y') + 10 &&
            defaultViewPort.getCurrentVectorPosition('y') < defaultViewPort.getViewPortVectorPosition('y') - 10){
                tracker += 1;
            }
        }

        //ZOOM up and down
        if(defaultViewPort.getCurrentVectorPosition('z') > MAX_Z_POSITION && defaultViewPort < MIN_Z_POSITION){
            tracker += 1;
        }
        if(tracker === 3){
            console.log("ehehe :D");
            nearViewPorts.find(function (value) {
                return value.object.getId() === defaultViewPort.getViewPort().object.getId()
            }).setState(false);
        }
    }
    //Stop rotating on both direction
    function stopRotating() {
        scope.orbitController.autoRotateNegative = false;
        scope.orbitController.autoRotate = false;
        var nearPort = nearViewPorts.find(function (value) {
            return value.object.getId() === defaultViewPort.getViewPort().object.getId();
        });
        nearPort.object.setState(true);
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
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function indexOf(member, startFrom) {

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
    addNearViewPortObjects();
};