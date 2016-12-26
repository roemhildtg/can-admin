/*can-admin-app@0.1.0#config/flask/Article*/
define("can-admin-app@0.1.0#config/flask/Article",["exports","can-define/map/map","can-restless","can-route"],function(e,t,a,n){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(e,"__esModule",{value:!0}),e.Article=void 0;var r=i(t),l=i(a),c=i(n),u=e.Article=l["default"]({url:"/api/article",name:"article",map:r["default"].extend({author_id:{type:"number",formatter:function(e){return'<a  href="'+c["default"].url({view:"people_advanced",page:"details",objectId:e})+'">Author: '+e+"</a>"}},title:{type:"string"},content:{type:"string",excludeListTable:!0,textarea:!0},author:{serialize:!1,excludeListTable:!0,excludePropertyTable:!0,excludeForm:!0,excludeFilter:!0,set:function(e){return this.author_id=e,e}},reviewed:{type:"integer",value:0,formatter:function(e){return'<i class="fa fa-'+(e?"check":"square-o")+'"></i>'},fieldType:"select",options:[{label:"Yes",value:1},{label:"No",value:0}]}})});e["default"]={connection:u,title:"Article",manageButtons:[{iconClass:"fa fa-check",buttonClass:"success",text:"Mark Reviewed",onClick:function(e){e.forEach(function(e){e.reviewed=1,u.save(e).then(function(){})})}}]}});
//# sourceMappingURL=Article.js.map