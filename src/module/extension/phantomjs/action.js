var _fs=require("fs.extra"),_path=require("path"),_global=catrequire("cat.global"),_log=_global.log(),_utils=catrequire("cat.utils"),_typedas=require("typedas"),_props=catrequire("cat.props"),_basePlugin=require("./../Base.js"),_phantomBridge=require("./phantom-bridge.js");module.exports=_basePlugin.ext(function(){var t=this,i={watch:function(){},apply:function(i){{var e=i?i.path:void 0,a="[Scan Ext] no valid configuration for 'apply' functionality";t.getEmitter()}t.apply(i),e||_utils.error(a),t.getEmitter().emit("phantomjs",{thiz:t,phantomjs:_phantomBridge})},init:function(i,e){t.initialize(i,e)}};return i});