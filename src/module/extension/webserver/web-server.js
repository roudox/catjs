var _http=require("http"),_url=require("url"),_path=require("path"),_fs=require("fs"),_express=require("express"),_global=catrequire("cat.global"),_log=_global.log(),_props=catrequire("cat.props"),_server,_utils=catrequire("cat.utils"),_winston=require("winston"),vars={assert:require("./CatObjects/assert")},webserver=function(){return{start:function(e,r){var s=e.path,t=e.port||"80",o=e.set,n=function(e,r,s){r.header("Access-Control-Allow-Origin",e.headers.origin),r.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE,OPTIONS"),s()};if(!s||s&&!_fs.existsSync(s))return void _utils.log("warning","[CAT WebServer] not valid location: "+s);_server=_express();var i=new _winston.Logger({transports:[new _winston.transports.File({filename:"express_server.log",level:"verbose",json:!1})]}),a={write:function(e){i.info(e)}};_server.configure(function(){_server.set("port",process.env.PORT||t),_server.use(_express.logger({stream:a,format:"dev"})),_server.use(_express.bodyParser()),_server.use(n),_server.use(_express.bodyParser()),_server.use(_express.static(s))}),o&&o.forEach(function(e){var r;e&&"var"in e&&(r=vars[e.var],void 0!==r&&"prop"in e&&(r=r[e.prop],_server.get("/"+e.key,r)))}),_server.get("/exit",function(e,r){r.setHeader("Content-Type","text/javascript;charset=UTF-8"),r.send('{"exit": 1}'),process.exit(1)}),_server.listen(t,function(){_log.info(_props.get("cat.ext.webserver.start").format("[webserver ext]")),r&&r.call(this)})},stop:function(e){_server&&(_log.debug(_props.get("cat.ext.webserver.stop").format("[webserver ext]")),e&&e.call(this),_server.close(function(){}))}}}();module.exports=webserver;