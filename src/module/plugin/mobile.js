var _catglobal=catrequire("cat.global"),_log=_catglobal.log(),_path=require("path"),_props=catrequire("cat.props"),_basePlugin=catrequire("cat.plugin.base"),_utils=catrequire("cat.utils"),_fs=require("fs.extra"),_typedas=require("typedas"),_spawn=catrequire("cat.plugin.spawn"),_myip=require("my-ip");module.exports=_basePlugin.ext(function(){function i(i){var o=this,t={android:{"default":{pkg:"com.hp.aamobile.cat/.example",app:"phonegap.apk"},actions:{start:{command:"adb",args:function(i){var o=t.android.default,a=i.pkg,n=i.ip||i.host,e=i.port;return a||(a=o.pkg),["shell","am","start","-e","IP",n,"-e","PORT",e,"-n",a]}},install:{command:"adb",args:function(i){var o=t.android.default,a=i.app;return a||(a=o.app),["install","-r",a]}}}}};!function(){if(o.host=i.host,o.port=i.port,o.pkg=i.pkg,o.app=i.app,!o.host)return void _utils.log("error","[CAT mobile plugin] No valid host was found");if("localhost"===o.host){if(o.ip=_myip(),!o.ip)return void _utils.log("error","[CAT mobile plugin] I cannot use localhost, please configure your ip (see catproject.json)");_log.info("warning","[CAT mobile plugin] I cannot use localhost but your ip was resolved: '"+o.ip+"' I'll try using it...")}}(),this.get=function(i){var o,a,n=t[i.device];return n||_log.warning("[CAT mobile plugin] No support for this device: ",n),o=n.actions,a=o[i.action],a?{command:a.command,args:a.args({ip:this.ip,host:this.host,port:this.port,pkg:this.pkg,app:this.app})}:void _log.warning("[CAT mobile plugin] No support for this action: ",a)}}var o,t,a,n,e,r=this;return{init:function(p){var s,l,g,u,c,d,m,f,h,b,v=["[libraries plugin] No valid configuration"];if(p||(_log.error(v[1]),r.setDisabled(!0)),o=p.emitter,t=p.global,a=p.data,n=p.internalConfig,e=n?n.getProject():void 0,r.dataInit(a),s=a.data,p&&s){if(l="device"in s&&s.device,f="action"in s&&s.action,!l||!f)return void _utils.log("error","[CAT mobile plugin] Missing parameters for plugin 'mobile' ");u="host"in s?s.host:e.getInfo("host"),c="port"in s?s.port:e.getInfo("port"),d="pkg"in s?s.pkg:void 0,m="app"in s?s.app:void 0,g=new i({host:u,port:c,pkg:d,app:m}),g&&(h=g.get({action:f,device:l})),h&&(_log.info("[CAT mobile plugin] running command",h?h.command+" "+h.args.join(" "):" NA "),b=_spawn().spawn({command:h.command,args:h.args,emitter:o}),b.on("close",function(i){0!==i&&_log.info("[CAT mobile plugin, spawn close] exited with code "+i),o.emit("job.done",{status:"done"})}))}},validate:function(){return{dependencies:["manager"]}}}});