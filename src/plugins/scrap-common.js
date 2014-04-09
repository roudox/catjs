var _Scrap=catrequire("cat.common.scrap"),_tplutils=catrequire("cat.tpl.utils"),_utils=catrequire("cat.utils"),_uglifyutils=catrequire("cat.uglify.utils"),_typedas=require("typedas"),_behavior=require("./Behavior.js"),_jshint=require("jshint").JSHINT,_scraputils=catrequire("cat.scrap.utils"),_path=require("path"),_global=catrequire("cat.global"),_log=_global.log();module.exports=function(){var t=_tplutils.readTemplateFile("scrap/_func_snippet"),e=_tplutils.readTemplateFile("scrap/_assert_call"),a=_tplutils.readTemplateFile("scrap/_import_js"),n=_tplutils.readTemplateFile("scrap/_import_css");return{init:function(i){_Scrap.add({name:"context",single:!1,singleton:1,func:function(){var t,e=this;t=this.get("context"),t&&e.setCtxArguments(t)}}),_Scrap.add({name:"screenshot",single:!1,singleton:1,func:function(){var t=this;t.print("app.getScreenshot();")}}),_Scrap.add({name:"code",single:!1,func:function(){var e,a,n=this;e=this.get("code"),e&&(_utils.prepareCode(e),a=e.join("\n"),a&&n.print(_tplutils.template({content:t,data:{comment:" Generated code according to the scrap comment (see @@code)",code:a}})))}}),_Scrap.add({name:"log",func:function(){var e,a,n=this;e=this.get("log"),e&&(_utils.prepareCode(e),a=["console.log(",e,");"],n.print(_tplutils.template({content:t,data:{comment:" Generated log statement according to the scrap comment (see @@code)",code:a.join("")}})))}}),_Scrap.add({name:"run@",func:function(){}}),_Scrap.add({name:"catui",func:function(){var e=this,a=e.get("catui");a&&e.print(_tplutils.template({content:t,data:{comment:" CAT UI call ",code:["_cat.core.ui.",a,"();"].join("")}}))}}),_Scrap.add({name:"signal",func:function(){var e=this,a=e.get("signal");return e.get("manager")?void 0:void(a&&e.print(_tplutils.template({content:t,data:{comment:" Signal call ",code:["_cat.utils.Signal.send('",a,"');"].join("")}})))}}),_Scrap.add({name:"manager",single:!1,singleton:1,func:function(){var e,a,n=this,i=n.get("name");e=n.get("manager"),e&&(a=n.get("signal"),n.print(_tplutils.template({content:t,data:{comment:" Manager call ",code:"(function() {_cat.core.managerCall('"+i+"', function(){_cat.utils.Signal.send('"+a+"');}); })();"}})))}}),_Scrap.add({name:"perform",single:!1,func:function(){var e,a,n,i,c=this,r=c.get("name");if(e=c.get("perform")){i=c.extractAnnotations(e);for(a in i)n=i[a],c.print(_tplutils.template({content:t,data:{comment:" Add Manager behavior ",code:"_cat.core.setManagerBehavior('"+r+"', '"+a+"', '"+n+"');"}}))}}}),_Scrap.add({name:"assert",single:!1,func:function(){var t,a,n,i,c,r=this,o="",s=0;if(t=this.get("assert"),i=this.get("context"),t){if(a=t[0])try{n=_uglifyutils.getCodeSnippet({code:a})}catch(l){}i&&(c=i.length,o+="{",i.forEach(function(t){o+=t+":"+t+(c-1>s?",":""),s++}),o+="}"),r.print(_tplutils.template({content:e,data:{expression:JSON.stringify(["assert",n].join(".")),fail:!0,scrap:JSON.stringify(r),param1:o||"{}"}}))}}}),_Scrap.add({name:"import",single:!1,func:function(){function t(t){var e,a;return t&&(e=t.split("."),a=e[e.length-1]),a}function e(t,e){var i,c={js:a,css:n};t&&(i=c[t]),i&&e&&r.print(_tplutils.template({content:i,data:{src:e}}))}var i,c=this.get("import"),r=this;r.$setType("html"),r.set("auto",!1),c&&c.forEach(function(a){a&&(i=t(a),i&&e(i,a))})}}),_Scrap.add({name:"embed",func:function(){this.$setType("html")}}),_Scrap.add({name:"inject",func:function(){var t=this.get("inject");this.setSingle("inject",!0),this.$setType("*"),this.set("auto",!1),this.print(t)}}),_Scrap.add({name:"replace",func:function(){var t,e,a,n,i,c=this,r=this.getContextItem("behavior"),o=(this.get("replace"),{});if(_typedas.isArray(r)){t=c.extractAnnotations(r);for(e in t)if(e&&"replace"===e)if(a=t[e],a=a.trim(),n=_utils.resolveObject(_behavior,a))o.inject=n;else try{i=_path.join(_path.resolve("."),a),n=require(i),n?o.inject=n[e]:_utils.log("warning","[cat scrap-common plugin] failed to resolve 'replace' functionality module, "+i)}catch(s){_utils.log("warning","[cat scrap-common plugin] failed to resolve 'replace' functionality module, "+a)}}else _typedas.isString(r)&&(a=r,o.inject=a);o&&o.inject?(this.$setBehavior(o),this.$setReplaceData({action:o.inject})):_utils.log("warning","[cat scrap-common plugin] No valid behavior was found, check your scrap behavior settings.")}}),_Scrap.add({name:"behavior",single:!1,func:function(){}}),i.emitter.emit("job.done",{status:"done"})},apply:function(){},getType:function(){return"scrap-common"}}};