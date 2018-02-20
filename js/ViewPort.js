/**
 * View port object create and
 *
 * @author Rasmus Dahlkvist
 * */

//
THREE.ViewPort = function (position, viewState, viewElement, textElement, buttonElement) {
    this.object = (function (_position, _viewState, _viewElement, _textElement, _buttonElement) {
        var position = _position;
        var id = _viewElement.getAttribute('id');
        var viewState = _viewState;
        var viewElement = _viewElement;
        var textElement = _textElement;
        var buttonElement = _buttonElement;
        return {
            getPosition: function () {return position;    },
            getId: function () { return id; },
            getViewElement: function () { return viewElement;   },
            getViewTextElement: function () { return textElement;   },
            getViewButtonElement: function () { return buttonElement;   },
            getViewState: function () { return viewState;   },
            setViewState: function (args) { viewState = args;   }
        }
    })(position,viewState,viewElement, textElement, buttonElement);
};