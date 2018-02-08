//TODO Initialize default viewport
/**
 * Object which contains the value of the
 * default view port and the current camera position
 *
 * Returns value based on distance to vectors from the
 * current viewport position and camera position
 * */

THREE.DefaultViewPort = function () {
    var scope = this;
    const CENTER_POINT = new THREE.Vector3(50,0,15);
    this.object = (function () {
        var currentViewPort = null;
        var closeToViewPort = false;
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
                    case 'x': return scope.getViewPort().object.getPosition().x;
                    case 'y': return scope.getViewPort().object.getPosition().y;
                    case 'z': return scope.getViewPort().object.getPosition().z;
                    default:
                }
            },
            getViewPortAxisPosition: function (value) {
                return scope.getViewPort().object.getPosition().toArray().indexOf(value);
            },
            distance: function () {
                return scope.getViewPosition().angleTo(scope.getViewPort().object.getPosition());
            },
            distanceToCenterPoint: function () {
                return scope.getViewPosition().distanceTo(CENTER_POINT);
            },
            getCloseToViewPort: function () {
                return closeToViewPort;
            },
            setCloseToViewPort: function (value) {
                closeToViewPort = value;
            }
        }
    })();
};