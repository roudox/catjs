var _fs=require("fs.extra"),_global=catrequire("cat.global"),_log=_global.log(),_props=catrequire("cat.props"),_path=require("path");module.exports=function(){return{getCATInfo:function(e){if(!e)return void 0;var a,i,r,t=e.file,n=e.scrap,o=e.basepath,p=_path.basename(t,".js");return t?(a=_path.dirname(t),o&&(a=a.replace(o,"")),0===a.indexOf("/")&&(a=a.substring(1)),r=_path.join(_path.dirname(t),p.replace(p,["_cat",p].join("_"))),i=n?[a.split("/").join("."),p,n.get("name")].join("."):void 0,{pkgName:i,file:r}):void _log.warning("[CAT extutils] No valid file was found, scrap info:"+(n||""))},getUserInfo:function(e){if(!e)return void 0;var a,i,r=e.file,t=e.scrap,n=e.basepath,o=_path.basename(r,".js");return a=_path.dirname(r),n&&(a=a.replace(n,"")),0===a.indexOf("/")&&(a=a.substring(1)),i=t?[a.split("/").join("."),o,t.get("name")].join("."):void 0,{pkgName:i,file:r?r:void 0}}}}();