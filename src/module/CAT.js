var _flow,
    _jsutils = require("js.utils"),
    _sysutils = catrequire("cat.sys.utils"),
    _analytics = require("./analytics/analytics"),
    _fs = require("fs");

var CAT = function () {

    var _global,
        _stringFormat,
        _log,
        _project,
        _catconfig,
        _path,
        _properties,
        _events,
        _emitter,
        _basedir,
        _watch,
        _debug,
        _cache,
        _utils,
        _targets,
        _catconfigInternal,
        _counter= 0,
        _configargs,
        _module,
        _proxy;

    /**
     * Get which task to get to run from the CAT command line.
     *
     * @param target The passed task
     * @private
     */
    function _runTask(target, watch) {

        var project,
            task;

        target = target.toString();
        target = target.toLowerCase();

        if (_catconfigInternal) {

            project = _catconfigInternal.externalConfig.project;
            task = project.getTask(target);
            if (task) {
                _flow.log({msg: [" > Open Task: ", JSON.stringify(task), ("watch: " + (watch ? true : false))].join(" ")});

                if (watch) {
                    // set watch configuration
                    _catconfigInternal.watch(watch);
                }

                // apply task
                task.apply(_catconfigInternal);
            } else {
                _utils.log("error", "[CAT] No valid task named: '" + _targets + "', validate your cat's project configuration (catproject.json)");
            }
        }
    }

    function _runme(watch) {

        _emitter.on("task.done", function (obj) {
            _flow.log({msg: [" Close Task: ", _targets[_counter]].join(" ")});
            _counter++;
            if (_counter < _targets.length) {
                _emitter.removeAllListeners("task.done");
                _runme(watch);

                if (_configargs && _configargs.callback) {
                    _configargs.taskcb.call(this, _targets[_counter]);
                }

            } else {
                if (_configargs && _configargs.callback) {
                    _configargs.callback.call(_configargs);
                }
            }
        });
        _runTask(_targets[_counter], watch);
    }
   
    (function () {

        _stringFormat = require("string-format");
        _path = require("path");
        _events = require('events');
        _emitter = new _events.EventEmitter();
        _basedir = function (config) {
            return ((config && config.home) || {home: {path: "."}});
        };

    })();

    _module = {


        /**
         * Initial CAT module
         * Note: Get called from CATCli module
         *
         * @param config
         */
        init: function (config) {

            var me = this,
                basedir,
                projectDir;

            _configargs = config;
            (function (config) {

                basedir = _basedir(config);
                projectDir = basedir.path;

                _global = catrequire("cat.global");             

                // initial global "home" property
                _global.set("home", basedir);

                _cache = catrequire("cat.cache");
                _cache.set("pid", process.pid);


                (function() {                   

                    // initial folders
                    _sysutils.createSystemFolder("cache", true);
                    _sysutils.createSystemFolder("reports", true);
                    _global.init();
                    
                    
                    _log = _global.log();                    
                    _utils = catrequire("cat.utils");
                    _project = catrequire("cat.project");
                    _catconfig = catrequire("cat.config");
                    _properties = catrequire("cat.props");

                    
                })();
                
            })(config);


            // Property module initialization
            _properties.init(function (error, properties) {

                // on error
                if (error) {
                    // we don't have the error properties just yet
                    _log.error("[Properties] " + error);
                    return undefined;
                }

                // After property log file loaded apply CAT module
                global.CAT.props = properties;

                /*
                 CAT apply call
                 */
                me.apply.call(me, config);

            });


        },

        watch: function (config) {
            if (config) {
//                _targets.forEach(function (target) {
//                    _runTask(target, config);
//                });
                _counter = 0;
                _runme(config);

            }
        },

        /**
         * Apply CAT module
         * Note: Get called after properties module initialization
         *
         * @param config
         */
        apply: function (config) {

            // TODO messages should be taken from resource
            var grunt, args, path, watch = false, kill = -1,
                npmtest = "npm", testmodule,
                testcmd,
                initProjectType,
                msg = ["[CAT] Project failed to load, No valid argument path was found"];

            /**
             * Set environment variables
             *
             * @returns {undefined}
             * @private
             */
            function _init() {

                if (!config) {
                    return undefined;
                }
                var home = _global.get("home"),
                    workingDir;

                if (home && home.working) {
                    workingDir = home.working.path;
                }

                kill = (config.kill || kill);
                watch = (config.watch || watch);
                _debug = ("debug" in config ? config.debug : false);
                testcmd = (config["test"] || undefined);
                _proxy = (config.proxy || undefined);
                initProjectType = typeof config.init === 'undefined' ? undefined :  config.init || "cat";
                _targets = config.task;
                grunt = config.grunt;
                args = config;
                path = (config.path || workingDir);

                if (path) {
                    _log.debug("[CAT] Initial, current location: " + _path.resolve(path));
                }

                _log.debug("[CAT] Initial, command line arguments: " + JSON.stringify(config));

                // listen to the processes, do a cleanup on shutdown
                //process.stdin.resume();

                process.on('uncaughtException', function (err) {
                    console.error(err);
                    process.exit(1);
                });

                process.on('exit', function () {
                    _cache.removeByKey("pid", process.pid);
                });

                process.on('SIGINT', function () {
                    process.exit(1);
                });

            }

            /**
             * Load CAT tasks and call them (e.g. scan)
             * Note: according to the command line inputs
             *
             * @private
             */
            function _apply() {

                var project,
                    pids,
                    commandmodule,
                    checkAnalytics,
                    targets = _targets, counter,
                    wait = false,
                    home = _global.get("home");


                _log.info("watch: " + watch + " kill: " + kill + " process: " + process.pid);

                if (testcmd) {
                    testcmd = (testcmd.trim ? testcmd.trim() : testcmd);
                    
                    testmodule = require("./../../test/test.js");
                    if (testcmd === "build") {
                        testmodule.build(_proxy);
                        
                    } else if (testcmd === "buildall") {
                        testmodule.buildall(_proxy);
                    
                    } else if (testcmd === "clean") {
                        testmodule.clean();
                    }
                    
                    return undefined;
                }

                if (initProjectType) {
                    commandmodule = catrequire("cat.init.command");
                    config.initProjectType = initProjectType;
                    
                    commandmodule.command(config);
                }

                
                _module.debug(_debug);                
                _module.kill(kill);

                if (_targets) {

                    if (path) {

                        // flow logger initialization
                        _flow = catrequire("cat.flow");
                        _flow.init();

                        if (watch) {
                            _watch = catrequire("cat.watch");
                            _watch.init();
                        }                                                                     
                        
                        // load CAT project
                        project = _project.load({
                            path: path,
                            emitter: _emitter
                        });


                        _project.update({
                            path: (_path.join(home.path, "resources"))
                        });

                        if (project) {
                            // update analytics
                            if (project.info.analytics || (project.info.analytics === "")) {
                                checkAnalytics = project.info.analytics;
                                var re = new RegExp( "(no)|(n)|(false)", "gi" );
                                if (!(re.test(checkAnalytics))) {
                                    _analytics.updateAnalytics(global.catcommand, project.name);
                                }
                            }


                            // apply project's tasks
                            if (_targets) {

                                // Load CAT internal configuration (resources/cat.json)
                                _catconfigInternal = _catconfig.load({
                                    project: project,
                                    grunt: grunt,
                                    emitter: _emitter
                                });

                                if (!watch) {
                                    _counter = 0;
                                    _runme();
                                }

                            }
                        }

                    } else {

                        _log.warning(msg[0]);
                        throw msg[0];

                    }
                }
            }

            _init();
            _apply();

        },

        isDebug: function() {
            return _debug;
        },
        
        debug: function(debug) {

            var unhook,
                util,
                nocolor;
            
            function _hook_stdout(callback) {
                var old_write = process.stdout.write;

                process.stdout.write = (function(write) {
                    return function(string, encoding, fd) {
                        write.apply(process.stdout, arguments);
                        callback(string, encoding, fd);
                    }
                })(process.stdout.write);

                return function() {
                    process.stdout.write = old_write
                };
            }

            if (debug) {
                util = require('util');
                nocolor = require("stripcolorcodes");
                unhook = _hook_stdout(function(string, encoding, fd) {
                    string = nocolor(string);
                    string = string.split("\n").join("").split("\r").join("");
                    util.debug(util.inspect(string))
                });
            }

        },
        
        kill: function(pid) {
            var pids;

            if (pid !== undefined && pid !== null && pid !== -1) {

                // TODO 1 might be a process number, change it to negative maybe.
                if (pid === 1) {
                    // kill all current running processes except me.
                    pids = _cache.removeByKey("pid", process.pid);
                    _utils.kill(pids, [process.pid]);

                } else if (pid === 0) {
                    if (process) {
                        process.exit(1);
                    }

                } else {
                    _utils.kill([pid], [process.pid]);
                }

                if (_configargs && _configargs.callback) {
                    _configargs.callback.call(_configargs);
                }
            }

        },

        getProject: function() {
            if (_catconfigInternal && _catconfigInternal.externalConfig) {
                return _catconfigInternal.externalConfig.project;
            }

            return null;
        }
    };

    return _module;

};


module.exports = CAT;
