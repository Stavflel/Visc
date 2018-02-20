THREE.DefaultViewPort = function (name) {
    this.object = (function (_name) {
        var state = false;
        var name = _name;
        return{
            getState: function () {
                return state;
            },
            setState: function (_state) {
                state = _state;
            },
            getId: function () {
                return name;
            }
        }
    })(name);
};