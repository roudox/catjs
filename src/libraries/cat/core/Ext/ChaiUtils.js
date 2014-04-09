_cat.utils.chai = function () {

    var _chai,
        assert,
        _state = 0; // state [0/1] 0 - not evaluated / 1 - evaluated

    function _isSupported() {
        _state = 1;
        if (typeof chai !== "undefined") {
            _chai = chai;
            assert = _chai.assert;

        } else {
            _cat.core.log.info("Chai library is not supported, skipping annotation 'assert', consider adding it to the .catproject dependencies");
        }
    }


    function _sendTestResult(data) {

        var config  = _cat.core.getConfig();

        if (config) {
            _cat.utils.AJAX.sendRequestSync({
                url:  _cat.core.TestManager.generateAssertCall(config, data)
            });
        }
    }

    function _splitCapilalise(string) {
        if (!string) {
            return string;
        }

        return string.split(/(?=[A-Z])/);
    }

    function _capitalise(string) {
        if (!string) {
            return string;
        }
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function _getDisplayName(name) {
        var result = [];

        if (name) {
            name = _splitCapilalise(name);
            if (name) {
                name.forEach(function(item) {
                    result.push(_capitalise(item));
                });
            }
        }
        return result.join(" ");
    }

    return {

        assert: function (config) {

            if (!_state) {
                _isSupported();
            }

            var code,
                result,
                fail,
                failure,
                testdata,
                scrap = config.scrap.config,
                scrapName = (scrap.name ? scrap.name[0] : undefined),
                testName = (scrapName || "NA"),
                key, item, items=[], args=[];

            if (_chai) {
                if (config) {
                    code = config.code;
                    fail = config.fail;
                }
                if (assert) {
                    // TODO well, I have to code the parsing section (uglifyjs) for getting a better impl in here (loosing the eval shit)
                    // TODO js execusion will be replacing this code later on...
                    var success = true;
                    var output;
                    if (code) {
                        try {
                            //eval(code);
                            args.push("assert");
                            items.push(assert);
                            for (key in config.args) {
                                if (config.args.hasOwnProperty(key)) {
                                    args.push(key);
                                    items.push(config.args[key]);
                                }
                            }
                            result = new Function(args, "return " + code).apply(this, items);

                        } catch (e) {
                            success = false;
                            output = ["[CAT] Test failed, exception: ", e].join("");
                        }
                    }

                    if (success) {

                        output = "Test Passed";

                    }

                    testdata = _cat.core.TestManager.addTestData({
                        name: testName,
                        displayName: _getDisplayName(testName),
                        status: success ? "success" : "failure",
                        message: output,
                        success: success
                    });

                    _cat.core.ui.setContent({
                        style: ( (testdata.getStatus() === "success") ? "color:green" : "color:red" ),
                        header: testdata.getDisplayName(),
                        desc: testdata.getMessage(),
                        tips: _cat.core.TestManager.getTestSucceededCount()
                    });

                    _sendTestResult(testdata);

                    if (!success) {
                        throw new Error((output || "[CAT] Hmmm... It's an error alright, can't find any additional information"), (fail || ""));
                    }
                }
            }
        },

        /**
         * For the testing environment, set chai handle
         *
         * @param chai
         */
        test: function (chaiarg) {
            chai = chaiarg;
        }

    };

}();