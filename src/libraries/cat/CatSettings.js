function _catjs_settings() {
    var _topWindow,
        _isIframe = function() {
            try {
                return window.self !== window.top;

            } catch (e) {
                return true;
            }
        },
        _rootWindow = function() {

            function _getTopWindow(parentarg) {
                if (!parentarg) {
                    parentarg = window;
                }
                parentarg = parentarg.parent;
                if(window.top !== parentarg) {
                    _getTopWindow(parentarg);
                }
                return parentarg;
            }

            if(window.top === window.self) {

                return window.top;

            } else {

                return _getTopWindow();
            }
        };

    // aliases
    _cat.core.alias("manager");
    _cat.core.alias("manager.wait", _cat.core.manager.statecontroller.wait);
    _cat.core.alias("manager.resolve", _cat.core.manager.statecontroller.resolve);
    _cat.core.alias("manager.defer", _cat.core.manager.statecontroller.defer);
    _cat.core.alias("plugin.get", _cat.core.plugin);
    _cat.core.alias("testdata", _cat.utils.TestsDB);
    
    if (_isIframe() ){
        _topWindow = _rootWindow();
        if (_topWindow && _topWindow._cat) {
            _cat = _topWindow._cat;

            return true;
        }
    }

    return false;
}

if (typeof exports !== "object") {

    _catjs_settings();

}