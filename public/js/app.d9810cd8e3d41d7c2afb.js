webpackJsonp([1],{148:function(e,t,a){"use strict";var n=a(13),s=a(207),i=a(202),r=a.n(i),o=a(203),l=a.n(o);n.default.use(s.a),t.a=new s.a({mode:"history",routes:[{path:"/",name:"Home",component:r.a},{path:"/:relationship_id*",name:"Relationship",component:l.a,props:!0}]})},149:function(e,t){},150:function(e,t){},151:function(e,t,a){var n=a(23)(a(155),a(205),null,null,null);e.exports=n.exports},155:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"ourloveio"}},156:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"home",data:function(){return{}}}},157:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),a.d(t,"default",function(){return p});var n=a(26),s=a.n(n),i=a(25),r=a.n(i),o=a(161),l=a.n(o),c=a(0),d=a.n(c),u=a(158),p={name:"relationship",props:["relationship_id"],data:function(){return{loading:!0,toastMessage:null,mainTimingInterval:null,newRelationship:{},startDate:null,marriedDate:null,relationship:null,dynamicTimes:{secondsSinceStartDate:null,minutesSinceStartDate:null,daysSinceStartDate:null,weeksSinceStartDate:null,monthsSinceStartDate:null,yearsSinceStartDate:null,secondsSinceMarriedDate:null,minutesSinceMarriedDate:null,daysSinceMarriedDate:null}}},methods:{openSnackbar:function(e){arguments.length>1&&void 0!==arguments[1]&&arguments[1];this.toastMessage=e,this.$refs.snackbar.open()},dateChanged:function(){this.newRelationship=l()({},this.newRelationship,{startDate:this.startDate?d()(this.startDate).format("YYYY-MM-DD"):null,marriedDate:this.marriedDate?d()(this.marriedDate).format("YYYY-MM-DD"):null})},showSuccess:function(e){this.openSnackbar("Successfully added picture!")},relationshipStatus:function(e){return this.loading?"loading"==e:this.relationship_id&&this.relationship?"valid"==e:"none"==e},createRelationship:function(){var e=this;return r()(s.a.mark(function t(){var a;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,u.a.create(e.relationship_id,e.newRelationship);case 3:return a=t.sent,t.next=6,e.getRelationship(a.id);case 6:e.openSnackbar("Successfully created relationship!"),t.next=13;break;case 9:t.prev=9,t.t0=t.catch(0),e.openSnackbar("There was a problem creating your relationship.","error"),console.log("error creating",t.t0);case 13:case"end":return t.stop()}},t,e,[[0,9]])}))()},getRelationship:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.relationship_id;return r()(s.a.mark(function a(){var n;return s.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return e.loading=!0,a.next=3,u.a.get(t);case 3:n=a.sent,e.relationship=n.relationship,e.relationship&&!e.mainTimingInterval&&(e.updateRelationshipTime(),e.mainTimingInterval=setInterval(function(){return e.updateRelationshipTime()},500)),e.loading=!1;case 7:case"end":return a.stop()}},a,e)}))()},updateRelationshipTime:function(){this.relationship.relationship_started&&(this.dynamicTimes.secondsSinceStartDate=d.a.utc().diff(d.a.utc(this.relationship.relationship_started),"seconds"),this.dynamicTimes.minutesSinceStartDate=d.a.utc().diff(d.a.utc(this.relationship.relationship_started),"minutes"),this.dynamicTimes.daysSinceStartDate=d.a.utc().diff(d.a.utc(this.relationship.relationship_started),"days"),this.dynamicTimes.weeksSinceStartDate=d.a.utc().diff(d.a.utc(this.relationship.relationship_started),"weeks"),this.dynamicTimes.monthsSinceStartDate=d.a.utc().diff(d.a.utc(this.relationship.relationship_started),"months"),this.dynamicTimes.yearsSinceStartDate=d.a.utc().diff(d.a.utc(this.relationship.relationship_started),"years")),this.relationship.relationship_married&&(this.dynamicTimes.secondsSinceMarriedDate=d.a.utc().diff(d.a.utc(this.relationship.relationship_married),"seconds")),this.dynamicTimes.minutesSinceMarriedDate=d.a.utc().diff(d.a.utc(this.relationship.relationship_married),"minutes"),this.dynamicTimes.daysSinceMarriedDate=d.a.utc().diff(d.a.utc(this.relationship.relationship_married),"days"),this.dynamicTimes.weeksSinceMarriedDate=d.a.utc().diff(d.a.utc(this.relationship.relationship_married),"weeks"),this.dynamicTimes.monthsSinceMarriedDate=d.a.utc().diff(d.a.utc(this.relationship.relationship_married),"months"),this.dynamicTimes.yearsSinceMarriedDate=d.a.utc().diff(d.a.utc(this.relationship.relationship_married),"years")}},created:function(){var e=this;return r()(s.a.mark(function t(){return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.getRelationship();case 2:case"end":return t.stop()}},t,e)}))()}}},158:function(e,t,a){"use strict";var n=a(160),s=a.n(n),i=a(26),r=a.n(i),o=a(25),l=a.n(o);t.a={get:function(e){var t=this;return l()(r.a.mark(function a(){var n;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("/api/v1.0/relationships/get/"+e);case 2:return n=t.sent,t.abrupt("return",n.json());case 4:case"end":return t.stop()}},a,t)}))()},create:function(e,t){var a=this;return l()(r.a.mark(function n(){var i;return r.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,fetch("/api/v1.0/relationships/create/"+e,{method:"POST",headers:{"Content-Type":"application/json"},body:s()({relationship:t})});case 2:return i=a.sent,a.abrupt("return",i.json());case 4:case"end":return a.stop()}},n,a)}))()}}},159:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(13),s=a(152),i=a.n(s),r=a(151),o=a.n(r),l=a(148),c=a(154),d=a.n(c),u=a(153),p=a.n(u),m=a(150),h=(a.n(m),a(149));a.n(h);n.default.use(i.a),n.default.component("datepicker",d.a),n.default.component("Dropzone",p.a),n.default.config.productionTip=!1,new n.default({el:"#app",router:l.a,template:"<App/>",components:{App:o.a}})},199:function(e,t,a){function n(e){return a(s(e))}function s(e){var t=i[e];if(!(t+1))throw new Error("Cannot find module '"+e+"'.");return t}var i={"./af":40,"./af.js":40,"./ar":46,"./ar-dz":41,"./ar-dz.js":41,"./ar-ly":42,"./ar-ly.js":42,"./ar-ma":43,"./ar-ma.js":43,"./ar-sa":44,"./ar-sa.js":44,"./ar-tn":45,"./ar-tn.js":45,"./ar.js":46,"./az":47,"./az.js":47,"./be":48,"./be.js":48,"./bg":49,"./bg.js":49,"./bn":50,"./bn.js":50,"./bo":51,"./bo.js":51,"./br":52,"./br.js":52,"./bs":53,"./bs.js":53,"./ca":54,"./ca.js":54,"./cs":55,"./cs.js":55,"./cv":56,"./cv.js":56,"./cy":57,"./cy.js":57,"./da":58,"./da.js":58,"./de":60,"./de-at":59,"./de-at.js":59,"./de.js":60,"./dv":61,"./dv.js":61,"./el":62,"./el.js":62,"./en-au":63,"./en-au.js":63,"./en-ca":64,"./en-ca.js":64,"./en-gb":65,"./en-gb.js":65,"./en-ie":66,"./en-ie.js":66,"./en-nz":67,"./en-nz.js":67,"./eo":68,"./eo.js":68,"./es":70,"./es-do":69,"./es-do.js":69,"./es.js":70,"./et":71,"./et.js":71,"./eu":72,"./eu.js":72,"./fa":73,"./fa.js":73,"./fi":74,"./fi.js":74,"./fo":75,"./fo.js":75,"./fr":78,"./fr-ca":76,"./fr-ca.js":76,"./fr-ch":77,"./fr-ch.js":77,"./fr.js":78,"./fy":79,"./fy.js":79,"./gd":80,"./gd.js":80,"./gl":81,"./gl.js":81,"./he":82,"./he.js":82,"./hi":83,"./hi.js":83,"./hr":84,"./hr.js":84,"./hu":85,"./hu.js":85,"./hy-am":86,"./hy-am.js":86,"./id":87,"./id.js":87,"./is":88,"./is.js":88,"./it":89,"./it.js":89,"./ja":90,"./ja.js":90,"./jv":91,"./jv.js":91,"./ka":92,"./ka.js":92,"./kk":93,"./kk.js":93,"./km":94,"./km.js":94,"./ko":95,"./ko.js":95,"./ky":96,"./ky.js":96,"./lb":97,"./lb.js":97,"./lo":98,"./lo.js":98,"./lt":99,"./lt.js":99,"./lv":100,"./lv.js":100,"./me":101,"./me.js":101,"./mi":102,"./mi.js":102,"./mk":103,"./mk.js":103,"./ml":104,"./ml.js":104,"./mr":105,"./mr.js":105,"./ms":107,"./ms-my":106,"./ms-my.js":106,"./ms.js":107,"./my":108,"./my.js":108,"./nb":109,"./nb.js":109,"./ne":110,"./ne.js":110,"./nl":112,"./nl-be":111,"./nl-be.js":111,"./nl.js":112,"./nn":113,"./nn.js":113,"./pa-in":114,"./pa-in.js":114,"./pl":115,"./pl.js":115,"./pt":117,"./pt-br":116,"./pt-br.js":116,"./pt.js":117,"./ro":118,"./ro.js":118,"./ru":119,"./ru.js":119,"./se":120,"./se.js":120,"./si":121,"./si.js":121,"./sk":122,"./sk.js":122,"./sl":123,"./sl.js":123,"./sq":124,"./sq.js":124,"./sr":126,"./sr-cyrl":125,"./sr-cyrl.js":125,"./sr.js":126,"./ss":127,"./ss.js":127,"./sv":128,"./sv.js":128,"./sw":129,"./sw.js":129,"./ta":130,"./ta.js":130,"./te":131,"./te.js":131,"./tet":132,"./tet.js":132,"./th":133,"./th.js":133,"./tl-ph":134,"./tl-ph.js":134,"./tlh":135,"./tlh.js":135,"./tr":136,"./tr.js":136,"./tzl":137,"./tzl.js":137,"./tzm":139,"./tzm-latn":138,"./tzm-latn.js":138,"./tzm.js":139,"./uk":140,"./uk.js":140,"./uz":141,"./uz.js":141,"./vi":142,"./vi.js":142,"./x-pseudo":143,"./x-pseudo.js":143,"./yo":144,"./yo.js":144,"./zh-cn":145,"./zh-cn.js":145,"./zh-hk":146,"./zh-hk.js":146,"./zh-tw":147,"./zh-tw.js":147};n.keys=function(){return Object.keys(i)},n.resolve=s,e.exports=n,n.id=199},202:function(e,t,a){var n=a(23)(a(156),a(204),null,null,null);e.exports=n.exports},203:function(e,t,a){var n=a(23)(a(157),a(206),null,null,null);e.exports=n.exports},204:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("md-layout",{staticClass:"main",attrs:{"md-column":"","md-vertical-align":"center","md-align":"center"}},[a("h1",{staticClass:"md-display-2"},[e._v("This is ourlove.io!")]),e._v(" "),a("div",[e._v("Create your relationships now!")])])},staticRenderFns:[]}},205:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("md-layout",{attrs:{id:"app"}},[a("router-view")],1)},staticRenderFns:[]}},206:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("md-layout",{staticClass:"main-wrapper relationship-container",attrs:{"md-align":"center"}},[e.relationshipStatus("loading")?a("md-layout",{staticClass:"create-relationship-container",attrs:{"md-row":"","md-align":"center"}},[a("md-spinner",{attrs:{"md-indeterminate":""}})],1):e._e(),e._v(" "),e.relationshipStatus("none")?a("md-layout",{staticClass:"text-center create-relationship-container",attrs:{"md-column":"","md-flex-medium":"75","md-flex-large":"50"}},[a("div",{staticClass:"md-display-2"},[e._v("Create Relationship!")]),e._v(" "),a("md-layout",[a("md-layout",{attrs:{"md-column":""}},[a("md-input-container",[a("label",[e._v("First Person's Name")]),e._v(" "),a("md-input",{model:{value:e.newRelationship.p1name,callback:function(t){e.newRelationship.p1name=t},expression:"newRelationship.p1name"}})],1),e._v(" "),a("md-input-container",[a("label",[e._v("Second Person's Name")]),e._v(" "),a("md-input",{model:{value:e.newRelationship.p2name,callback:function(t){e.newRelationship.p2name=t},expression:"newRelationship.p2name"}})],1),e._v(" "),a("md-input-container",[a("label",[e._v("Relationship Start Date")]),e._v(" "),a("md-input",{model:{value:e.newRelationship.startDate,callback:function(t){e.newRelationship.startDate=t},expression:"newRelationship.startDate"}}),e._v(" "),a("datepicker",{staticStyle:{width:"100%"},on:{closed:e.dateChanged},model:{value:e.startDate,callback:function(t){e.startDate=t},expression:"startDate"}})],1),e._v(" "),a("md-input-container",[a("label",[e._v("Optional: Married Date")]),e._v(" "),a("md-input",{model:{value:e.newRelationship.marriedDate,callback:function(t){e.newRelationship.marriedDate=t},expression:"newRelationship.marriedDate"}}),e._v(" "),a("datepicker",{staticStyle:{width:"100%"},on:{closed:e.dateChanged},model:{value:e.marriedDate,callback:function(t){e.marriedDate=t},expression:"marriedDate"}})],1),e._v(" "),a("md-layout",{attrs:{"md-align":"center"}},[a("md-button",{staticClass:"md-raised md-primary",on:{click:function(t){e.createRelationship()}}},[e._v("Create Relationship Page")])],1)],1)],1)],1):e._e(),e._v(" "),e.relationshipStatus("valid")?a("md-layout",{staticClass:"valid-relationship-container",attrs:{"md-column":"","md-vertical-align":"center"}},[a("div",{staticClass:"md-display-2"},[e._v(e._s(e.relationship.person1_name)+" & "+e._s(e.relationship.person2_name))]),e._v(" "),e.relationship.relationship_started?a("div",{attrs:{"md-column":"","md-vertical-align":"center"}},[a("div",[e._v("You've been together for "+e._s(e.dynamicTimes.secondsSinceStartDate)+" seconds")]),e._v(" "),a("div",[e._v("or "+e._s(e.dynamicTimes.minutesSinceStartDate)+" minutes")]),e._v(" "),a("div",[e._v("or "+e._s(e.dynamicTimes.daysSinceStartDate)+" days")]),e._v(" "),a("div",[e._v("or "+e._s(e.dynamicTimes.weeksSinceStartDate)+" weeks")]),e._v(" "),a("div",[e._v("or "+e._s(e.dynamicTimes.monthsSinceStartDate)+" months")]),e._v(" "),a("div",[e._v("or "+e._s(e.dynamicTimes.yearsSinceStartDate)+" years")])]):e._e(),e._v(" "),a("md-layout",{attrs:{"md-column":"","md-flex":""}},[a("dropzone",{attrs:{id:"relationship-pictures",url:"/api/v1.0/relationships/file_upload/"+e.relationship_id},on:{"vdropzone-success":e.showSuccess}},[a("input",{attrs:{type:"hidden",name:"token",value:""}})])],1)],1):e._e(),e._v(" "),a("md-snackbar",{ref:"snackbar",attrs:{"md-position":"bottom center","md-duration":"4000"}},[a("span",[e._v(e._s(e.toastMessage))])])],1)},staticRenderFns:[]}}},[159]);
//# sourceMappingURL=app.d9810cd8e3d41d7c2afb.js.map