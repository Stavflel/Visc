/**
 * View port object create and
 *
 * @author Rasmus Dahlkvist
 * */

//
THREE.ViewPort = function (position, viewState, viewElement) {

    this.object = (function (_position, _viewState, _viewElement) {
        var position = _position;
        var id = _viewElement.getAttribute('id');
        var viewState = _viewState;
        var viewElement = _viewElement;
        return {
            getPosition: function () {return position;    },
            getId: function () { return id; },
            getViewElement: function () { return viewElement;   },
            getViewState: function () { return viewState;   },
            setViewState: function (args) { viewState = args;   }
        }
    })(position,viewState,viewElement);
};