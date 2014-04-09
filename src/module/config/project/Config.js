var _typedas=require("typedas"),_Action=require("./Action.js"),_Extension=require("./Extension.js"),_Task=require("./Task.js"),_global=catrequire("cat.global"),_log=_global.log(),_utils=catrequire("cat.utils"),_props=catrequire("cat.props"),_fs=require("fs.extra"),_path=require("path"),Config=function(t){function o(t){function o(t){var o=h[t];o&&o.forEach(function(o){o&&(o.name||_log.error("[CAT Config] Missing property 'name' for action configuration "),_[t]&&(_[t][o.name]=o))})}t?o(t):(o("actions"),o("tasks"),o("extensions"))}function n(){function t(t){var o,s;t&&(i=_utils.resolveObject(y,t),n=_path.normalize([e,i].join("/")),n&&(_fs.existsSync(n)?_log.debug(_props.get("cat.project.resource.exists").format("[cat config]",n)):_utils.mkdirSync(n),"source"===t&&(o=_path.join(n,"common"),_fs.existsSync(o)||(_utils.mkdirSync(o),_utils.copySync(_path.join(p.path,"src/module/project/src/common/README.txt"),_path.join(o,"README.txt"))),s=_path.join(n,"config"),_fs.existsSync(s)||_utils.mkdirSync(s),_utils.copySync(_path.join(p.path,"src/module/project/src/config/testdata.json"),_path.join(s,"testdata.json"))),d.info[t]=n))}function o(t){t.forEach(function(t){t&&(d.info[t]=y[t])})}var n,i,e=p.working.path;t("source"),t("target"),o(["host","port","appserver","apppath","cattarget"])}function i(t){c=t?t:y.tasks,c&&_typedas.isArray(c)?c.forEach(function(t){t&&(t.name&&_.tasks[t.name]||f.push(new _Task({data:t,emitter:l,global:y,catconfig:d})))}):_log.warning("[CAT Config] Missing 'tasks' configuration section")}function e(t){a=t?t:y.plugins,a&&_typedas.isArray(a)?a.forEach(function(t){t&&(t.name&&_.actions[t.name]||g.push(new _Action({data:t,emitter:l,global:y,catconfig:d})))}):_log.warning("[CAT Config] Missing 'plugins' configuration section")}function s(t){var o=t?t:y.extensions||y.dependencies;o&&_typedas.isArray(o)?o.forEach(function(t){t&&(t.name&&_.extensions[t.name]||u.push(new _Extension({data:t,emitter:l,global:y,catconfig:d})))}):_log.warning("[CAT Config] Missing 'dependencies' configuration section")}function r(){i(),e(),s(),o(),n()}var a,c,p=_global.get("home"),g=[],f=[],u=[],h={actions:g,tasks:f,extensions:u},_={tasks:{},actions:{},extensions:{}},l=t.emitter,y=t.data,d=this;return y?(this.name=y.name,this.base=y.base,this.actions=g,this.extensions=u,this.tasks=f,this.pluginPaths=[],this.info={},this._get=function(t){var o;return"me"===t?o=d:"map"===t&&(o=_),o},this._appendEntity=function(t,n){"plugins"===t?(e(n),o("actions")):"extensions"===t||"dependencies"===t?(s(n),o("extensions")):"tasks"===t&&(i(n),o("tasks"))},r(),this):void _utils.error(_props.get("cat.error.config").format("[CAT Config]"))};Config.prototype.destroy=function(){},Config.prototype.appendEntity=function(t,o){this._appendEntity(t,o)},Config.prototype.getTask=function(t){var o=this._get("map");return t&&o.tasks?o.tasks[t]:void 0},Config.prototype.getAction=function(t){var o,n=this._get("map");return t&&n.actions?(o=n.actions[t],o||(o=this.pluginLookup(t),o&&this._appendEntity("plugins",[{name:t,type:t}]),o=n.actions[t]),o):void 0},Config.prototype.getExtension=function(t){var o=this._get("map");return t&&o.extensions?o.extensions[t]:void 0},Config.prototype.addPluginLocations=function(t){var o=this._get("me");_typedas.isArray(t)?o.pluginPaths=o.pluginPaths.concat(t):_utils.error(_props.get("cat.arguments.type").format("[cat config]","Array"))},Config.prototype.pluginLookup=function(t){for(var o,n,i,e=this._get("me"),s=e.pluginPaths,r=0,a=s.length;a>r;r++)if(i=s[r])try{if(n=[i,t,".js"].join(""),n=_path.normalize(n),_fs.existsSync(n)){o=require(n);break}}catch(c){_utils.error(_props.get("cat.error.require.module").format("[cat config]",n))}return o},Config.prototype.getTargetFolder=function(){return _path.join(_global.get("home").working.path,"target",this.name)},Config.prototype.getInfo=function(t){var o=_utils.resolveObject(this.info,t);return o||_log.warning(_props.get("cat.error.config.missing").format("[cat config]",t)),o},Config.prototype.setInfo=function(t,o){return this.info[t]=o},Config.prototype.getPort=function(){var t=this.getInfo("appserver.port")||this.getInfo("port");return t||"8089"},Config.prototype.getHost=function(){return this.getInfo("appserver.host")||this.getInfo("host")},Config.prototype.getProtocol=function(){var t=this.getInfo("appserver.protocol")||this.getInfo("protocol");return t||"http://"},Config.prototype.getAddress=function(){var t,o,n;return t=this.getHost(),o=this.getPort(),n=this.getProtocol(),t&&o?[n,"://",t,":",o].join(""):void _log.warning("[CAT project config] Missing configuration properties: 'host' and/or 'port' (see catproject.json)")},Config.prototype.update=function(t){var o,n;if(t&&"data"in t&&(n=t.data))for(o in n)this._appendEntity(o,n[o])},module.exports=Config;