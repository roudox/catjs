var _fsconfig=require("./../utils/fs/Config.js"),_Config=catrequire("cat.common.config"),_global=catrequire("cat.global"),_utils=catrequire("cat.utils"),_props=catrequire("cat.props"),_fs=require("fs.extra"),_log=_global.log(),_path=require("path"),_console=require("./../Console"),_project,_loader=function(o){function t(o){o||_console.log("[CAT Project] Missing callback for the project loader ");try{new _fsconfig(r,o)}catch(t){_console.log("[CAT Project] error occured, probably not valid cat project [catproject.json]: ")}}var r,e,a=["[Project] config argument is not valid","[Project] Data is not valid, expecting data of type Array","[Project] Loading project: "],c=o&&"callback"in o?o.callback:void 0,n=function(o){if(o)try{_project=new _Config({data:o,emitter:e})}catch(t){throw Error(t)}else _log.error(a[1])};if(!o)throw _log.error(a[0]),a[0];return r=o.path||".",e=o.emitter,r&&(r=_path.join(r,"catproject.json"),t(c||n)),_project};module.exports=function(){var o;return o={load:_loader,getProject:function(){return _project},getInfo:function(o){return _project.getInfo(o)},update:function(t){var r,e,a=function(o){_project&&_project.update({data:o})};t&&(r="data"in t&&t.data?t.data:void 0,e="path"in t&&t.path?t.path:void 0),r?a(r):a&&e&&o.load({callback:a,path:e})}}}();