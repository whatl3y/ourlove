webpackJsonp([1],{153:function(t,e,a){"use strict";var n=a(26),s=a(229),i=a(220),r=a.n(i),o=a(221),c=a.n(o),l=a(222),u=a.n(l);n.a.use(s.a),e.a=new s.a({mode:"history",routes:[{path:"/",name:"Home",component:r.a},{path:"/file/*",component:u.a},{path:"/logout",component:u.a},{path:"/oauth/*",component:u.a},{path:"/redirect",component:u.a},{path:"/:relationship_id*",name:"Relationship",component:c.a,props:!0}]})},155:function(t,e){},156:function(t,e){},157:function(t,e){},158:function(t,e){},160:function(t,e,a){var n=a(8)(a(164),a(225),null,null,null);t.exports=n.exports},164:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a(28),s=a.n(n),i=a(223),r=a.n(i);e.default={name:"ourloveio",components:{TopNav:r.a},mounted:function(){this.$root.$refs=s()(this.$root.$refs,{toastr:this.$refs.toastr}),this.$refs.toastr.defaultPosition="toast-bottom-right"}}},165:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"home",data:function(){return{}}}},166:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),a.d(e,"default",function(){return m});var n=a(29),s=a.n(n),i=a(10),r=a.n(i),o=a(9),c=a.n(o),l=a(28),u=a.n(l),d=a(0),p=a.n(d),h=a(27),f=a(169),m={name:"relationship",props:["relationship_id"],data:function(){return{loading:!0,isLoggedIn:!1,toastMessage:null,mainTimingInterval:null,newRelationship:{},startDate:null,marriedDate:null,relationship:null,dynamicTimes:{secondsSinceStartDate:null,minutesSinceStartDate:null,daysSinceStartDate:null,weeksSinceStartDate:null,monthsSinceStartDate:null,yearsSinceStartDate:null,secondsSinceMarriedDate:null,minutesSinceMarriedDate:null,daysSinceMarriedDate:null}}},methods:{openSnackbar:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"success",a={success:"s",error:"e"};return this.$root.$refs.toastr[a[e]||"s"](t)},dateChanged:function(){this.newRelationship=u()({},this.newRelationship,{startDate:this.startDate?p()(this.startDate).format("YYYY-MM-DD"):null,marriedDate:this.marriedDate?p()(this.marriedDate).format("YYYY-MM-DD"):null})},showSuccessAddedPicture:function(t){this.openSnackbar("Successfully added picture!")},relationshipStatus:function(t){return this.loading?"loading"==t:this.relationship_id&&this.relationship?"valid"==t:"none"==t},createRelationship:function(){var t=this;return c()(r.a.mark(function e(){var a;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,f.a.create(t.relationship_id,t.newRelationship);case 3:return a=e.sent,e.next=6,t.getRelationship(a.id);case 6:t.openSnackbar("Successfully created relationship!"),e.next=13;break;case 9:e.prev=9,e.t0=e.catch(0),t.openSnackbar("There was a problem creating your relationship.","error"),console.log("error creating",e.t0);case 13:case"end":return e.stop()}},e,t,[[0,9]])}))()},getRelationship:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.relationship_id;return c()(r.a.mark(function a(){var n;return r.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return t.loading=!0,a.next=3,f.a.get(e);case 3:n=a.sent,t.relationship=n.relationship,t.relationship&&!t.mainTimingInterval&&(t.updateRelationshipTime(),t.mainTimingInterval=setInterval(function(){return t.updateRelationshipTime()},500)),t.loading=!1;case 7:case"end":return a.stop()}},a,t)}))()},updateRelationshipTime:function(){this.relationship.relationship_started&&(this.dynamicTimes.secondsSinceStartDate=p.a.utc().diff(p.a.utc(this.relationship.relationship_started),"seconds"),this.dynamicTimes.minutesSinceStartDate=p.a.utc().diff(p.a.utc(this.relationship.relationship_started),"minutes"),this.dynamicTimes.daysSinceStartDate=p.a.utc().diff(p.a.utc(this.relationship.relationship_started),"days"),this.dynamicTimes.weeksSinceStartDate=p.a.utc().diff(p.a.utc(this.relationship.relationship_started),"weeks"),this.dynamicTimes.monthsSinceStartDate=p.a.utc().diff(p.a.utc(this.relationship.relationship_started),"months"),this.dynamicTimes.yearsSinceStartDate=p.a.utc().diff(p.a.utc(this.relationship.relationship_started),"years")),this.relationship.relationship_married&&(this.dynamicTimes.secondsSinceMarriedDate=p.a.utc().diff(p.a.utc(this.relationship.relationship_married),"seconds")),this.dynamicTimes.minutesSinceMarriedDate=p.a.utc().diff(p.a.utc(this.relationship.relationship_married),"minutes"),this.dynamicTimes.daysSinceMarriedDate=p.a.utc().diff(p.a.utc(this.relationship.relationship_married),"days"),this.dynamicTimes.weeksSinceMarriedDate=p.a.utc().diff(p.a.utc(this.relationship.relationship_married),"weeks"),this.dynamicTimes.monthsSinceMarriedDate=p.a.utc().diff(p.a.utc(this.relationship.relationship_married),"months"),this.dynamicTimes.yearsSinceMarriedDate=p.a.utc().diff(p.a.utc(this.relationship.relationship_married),"years")}},created:function(){var t=this;return c()(r.a.mark(function e(){var a;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s.a.all([h.a.isLoggedIn(),h.a.setReturnTo(t.relationship_id),t.getRelationship()]);case 2:a=e.sent,t.isLoggedIn=a[0];case 4:case"end":return e.stop()}},e,t)}))()}}},167:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"reload-page",mounted:function(){window.location.reload()}}},168:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),a.d(e,"default",function(){return c});var n=a(10),s=a.n(n),i=a(9),r=a.n(i),o=a(27),c={name:"TopNav",data:function(){return{isLoggedIn:!1,displayName:null,integrations:{}}},methods:{getLoggedInAndIntegrations:function(){var t=this;return r()(s.a.mark(function e(){return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.a.getIntegrations();case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}},e,t)}))()},hasIntegration:function(t){return!!this.integrations[t]}},created:function(){var t=this;return r()(s.a.mark(function e(){var a;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.getLoggedInAndIntegrations();case 2:a=e.sent,t.isLoggedIn=a.logged_in,t.displayName=a.display_name,a.integrations instanceof Array&&a.integrations.forEach(function(e){return t.integrations[e]=!0});case 6:case"end":return e.stop()}},e,t)}))()}}},169:function(t,e,a){"use strict";var n=a(171),s=a.n(n),i=a(10),r=a.n(i),o=a(9),c=a.n(o);e.a={get:function(t){var e=this;return c()(r.a.mark(function a(){var n;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ourloveFetch("/api/v1.0/relationships/get/"+t);case 2:return n=e.sent,e.abrupt("return",n.json());case 4:case"end":return e.stop()}},a,e)}))()},create:function(t,e){var a=this;return c()(r.a.mark(function n(){var i;return r.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,ourloveFetch("/api/v1.0/relationships/create/"+t,{method:"POST",headers:{"Content-Type":"application/json"},body:s()({relationship:e})});case 2:return i=a.sent,a.abrupt("return",i.json());case 4:case"end":return a.stop()}},n,a)}))()}}},170:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a(26),s=a(154),i=a(159),r=a.n(i),o=a(160),c=a.n(o),l=a(153),u=a(161),d=a.n(u),p=a(163),h=a.n(p),f=a(162),m=a.n(f),v=a(157),g=(a.n(v),a(156)),j=(a.n(g),a(155)),_=(a.n(j),a(158));a.n(_);window.ourloveFetch=r()(fetch,{credentials:"same-origin"}),n.a.use(s.a),n.a.component("vue-toastr",d.a),n.a.component("datepicker",h.a),n.a.component("Dropzone",m.a),n.a.config.productionTip=!1,new n.a({el:"#app",router:l.a,template:"<App/>",components:{App:c.a}})},208:function(t,e){},209:function(t,e,a){function n(t){return a(s(t))}function s(t){var e=i[t];if(!(e+1))throw new Error("Cannot find module '"+t+"'.");return e}var i={"./af":43,"./af.js":43,"./ar":49,"./ar-dz":44,"./ar-dz.js":44,"./ar-ly":45,"./ar-ly.js":45,"./ar-ma":46,"./ar-ma.js":46,"./ar-sa":47,"./ar-sa.js":47,"./ar-tn":48,"./ar-tn.js":48,"./ar.js":49,"./az":50,"./az.js":50,"./be":51,"./be.js":51,"./bg":52,"./bg.js":52,"./bn":53,"./bn.js":53,"./bo":54,"./bo.js":54,"./br":55,"./br.js":55,"./bs":56,"./bs.js":56,"./ca":57,"./ca.js":57,"./cs":58,"./cs.js":58,"./cv":59,"./cv.js":59,"./cy":60,"./cy.js":60,"./da":61,"./da.js":61,"./de":63,"./de-at":62,"./de-at.js":62,"./de.js":63,"./dv":64,"./dv.js":64,"./el":65,"./el.js":65,"./en-au":66,"./en-au.js":66,"./en-ca":67,"./en-ca.js":67,"./en-gb":68,"./en-gb.js":68,"./en-ie":69,"./en-ie.js":69,"./en-nz":70,"./en-nz.js":70,"./eo":71,"./eo.js":71,"./es":73,"./es-do":72,"./es-do.js":72,"./es.js":73,"./et":74,"./et.js":74,"./eu":75,"./eu.js":75,"./fa":76,"./fa.js":76,"./fi":77,"./fi.js":77,"./fo":78,"./fo.js":78,"./fr":81,"./fr-ca":79,"./fr-ca.js":79,"./fr-ch":80,"./fr-ch.js":80,"./fr.js":81,"./fy":82,"./fy.js":82,"./gd":83,"./gd.js":83,"./gl":84,"./gl.js":84,"./he":85,"./he.js":85,"./hi":86,"./hi.js":86,"./hr":87,"./hr.js":87,"./hu":88,"./hu.js":88,"./hy-am":89,"./hy-am.js":89,"./id":90,"./id.js":90,"./is":91,"./is.js":91,"./it":92,"./it.js":92,"./ja":93,"./ja.js":93,"./jv":94,"./jv.js":94,"./ka":95,"./ka.js":95,"./kk":96,"./kk.js":96,"./km":97,"./km.js":97,"./ko":98,"./ko.js":98,"./ky":99,"./ky.js":99,"./lb":100,"./lb.js":100,"./lo":101,"./lo.js":101,"./lt":102,"./lt.js":102,"./lv":103,"./lv.js":103,"./me":104,"./me.js":104,"./mi":105,"./mi.js":105,"./mk":106,"./mk.js":106,"./ml":107,"./ml.js":107,"./mr":108,"./mr.js":108,"./ms":110,"./ms-my":109,"./ms-my.js":109,"./ms.js":110,"./my":111,"./my.js":111,"./nb":112,"./nb.js":112,"./ne":113,"./ne.js":113,"./nl":115,"./nl-be":114,"./nl-be.js":114,"./nl.js":115,"./nn":116,"./nn.js":116,"./pa-in":117,"./pa-in.js":117,"./pl":118,"./pl.js":118,"./pt":120,"./pt-br":119,"./pt-br.js":119,"./pt.js":120,"./ro":121,"./ro.js":121,"./ru":122,"./ru.js":122,"./se":123,"./se.js":123,"./si":124,"./si.js":124,"./sk":125,"./sk.js":125,"./sl":126,"./sl.js":126,"./sq":127,"./sq.js":127,"./sr":129,"./sr-cyrl":128,"./sr-cyrl.js":128,"./sr.js":129,"./ss":130,"./ss.js":130,"./sv":131,"./sv.js":131,"./sw":132,"./sw.js":132,"./ta":133,"./ta.js":133,"./te":134,"./te.js":134,"./tet":135,"./tet.js":135,"./th":136,"./th.js":136,"./tl-ph":137,"./tl-ph.js":137,"./tlh":138,"./tlh.js":138,"./tr":139,"./tr.js":139,"./tzl":140,"./tzl.js":140,"./tzm":142,"./tzm-latn":141,"./tzm-latn.js":141,"./tzm.js":142,"./uk":143,"./uk.js":143,"./uz":144,"./uz.js":144,"./vi":145,"./vi.js":145,"./x-pseudo":146,"./x-pseudo.js":146,"./yo":147,"./yo.js":147,"./zh-cn":148,"./zh-cn.js":148,"./zh-hk":149,"./zh-hk.js":149,"./zh-tw":150,"./zh-tw.js":150};n.keys=function(){return Object.keys(i)},n.resolve=s,t.exports=n,n.id=209},220:function(t,e,a){var n=a(8)(a(165),a(224),null,null,null);t.exports=n.exports},221:function(t,e,a){var n=a(8)(a(166),a(228),null,null,null);t.exports=n.exports},222:function(t,e,a){var n=a(8)(a(167),a(227),null,null,null);t.exports=n.exports},223:function(t,e,a){function n(t){a(208)}var s=a(8)(a(168),a(226),n,null,null);t.exports=s.exports},224:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"main col text-center"},[a("h1",{staticClass:"display-1"},[t._v("This is ourlove.io!")]),a("div",[t._v("Create your relationships now!")])])}]}},225:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[a("top-nav"),a("router-view"),a("vue-toastr",{ref:"toastr"})],1)},staticRenderFns:[]}},226:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"top-nav-container"},[a("b-navbar",{attrs:{toggleable:"toggleable",type:"inverse"}},[a("b-nav-toggle",{attrs:{target:"navbarNavDropdown"}}),a("b-link",{staticClass:"navbar-brand",attrs:{to:"/"}},[a("img",{staticClass:"img-fluid",staticStyle:{"max-height":"32px"},attrs:{src:"/public/images/favicon_white.png"}}),a("span",{staticClass:"margin-left-sm"},[t._v("ourlove.io")])]),a("b-collapse",{attrs:{id:"navbarNavDropdown","is-nav":"is-nav"}},[a("b-nav",{staticClass:"is-nav-bar ml-auto"},[t.displayName?a("div",{staticClass:"d-flex align-items-center text-small",staticStyle:{"padding-right":"4px","margin-right":"4px","border-right":"1px solid"}},[a("strong",[t._v("Welcome, "+t._s(t.displayName))])]):t._e(),t.hasIntegration("facebook")||t.hasIntegration("instagram")||t.hasIntegration("pinterest")?t._e():a("div",{staticClass:"d-flex align-items-center text-small"},[a("div",[t._v("login")])]),t.hasIntegration("facebook")?t._e():a("b-nav-item",{attrs:{to:"/oauth/facebook"}},[a("i",{staticClass:"fa fa-2x fa-facebook-square",attrs:{"aria-hidden":"true"}})]),t.hasIntegration("instagram")?t._e():a("b-nav-item",{attrs:{to:"/oauth/instagram"}},[a("i",{staticClass:"fa fa-2x fa-instagram",attrs:{"aria-hidden":"true"}})]),t.hasIntegration("pinterest")?t._e():a("b-nav-item",{attrs:{to:"/oauth/pinterest"}},[a("i",{staticClass:"fa fa-2x fa-pinterest-square",attrs:{"aria-hidden":"true"}})]),t.isLoggedIn?a("b-nav-item",{staticClass:"d-flex align-items-center text-small",attrs:{to:"/logout"}},[a("div",[t._v("logout")])]):t._e()],1)],1)],1)],1)},staticRenderFns:[]}},227:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"text-center"},[a("i",{staticClass:"fa fa-4x fa-spinner fa-spin"})])}]}},228:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container relationship-container"},[t.relationshipStatus("loading")?a("div",{staticClass:"text-center create-relationship-container"},[a("i",{staticClass:"fa fa-4x fa-spinner fa-spin"})]):t._e(),t.relationshipStatus("none")?a("div",{staticClass:"col create-relationship-container"},[t.isLoggedIn?t._e():a("div",{staticClass:"text-center"},[a("h1",{staticClass:"display-1"},[t._v(t._s(t.relationship_id))]),a("h3",{staticClass:"display-3"},[t._v("is available!")]),a("div",[t._v("Login today by clicking on one of the providers below to create your page now!")]),t._m(0)]),t.isLoggedIn?a("div",[a("div",{staticClass:"text-center"},[a("h1",{staticClass:"display-1"},[t._v(t._s(t.relationship_id))]),a("h3",[t._v("Create Relationship")])]),a("div",{staticClass:"col col-md-6 offset-md-3"},[a("label",[t._v("First Person's Name")]),a("b-form-input",{model:{value:t.newRelationship.p1name,callback:function(e){t.newRelationship.p1name=e},expression:"newRelationship.p1name"}}),a("label",[t._v("Second Person's Name")]),a("b-form-input",{model:{value:t.newRelationship.p2name,callback:function(e){t.newRelationship.p2name=e},expression:"newRelationship.p2name"}}),a("label",[t._v("Relationship Start Date")]),a("datepicker",{attrs:{format:"MMMM dd, yyyy","bootstrap-styling":!0},on:{closed:t.dateChanged},model:{value:t.startDate,callback:function(e){t.startDate=e},expression:"startDate"}}),a("label",[t._v("Optional: Married Date")]),a("datepicker",{attrs:{format:"MMMM dd, yyyy","bootstrap-styling":!0},on:{closed:t.dateChanged},model:{value:t.marriedDate,callback:function(e){t.marriedDate=e},expression:"marriedDate"}}),a("div",{staticClass:"text-center padding-md"},[a("b-button",{staticClass:"btn-ourlove-dark",attrs:{size:"lg"},on:{click:function(e){t.createRelationship()}}},[t._v("Create Relationship Page")])],1)],1)]):t._e()]):t._e(),t.relationshipStatus("valid")?a("div",{staticClass:"col text-center valid-relationship-container"},[a("h1",[t._v(t._s(t.relationship.person1_name)+" & "+t._s(t.relationship.person2_name))]),t.relationship.relationship_started?a("div",[a("div",[t._v("You've been together for "+t._s(t.dynamicTimes.secondsSinceStartDate)+" seconds")]),a("div",[t._v("or "+t._s(t.dynamicTimes.minutesSinceStartDate)+" minutes")]),a("div",[t._v("or "+t._s(t.dynamicTimes.daysSinceStartDate)+" days")]),a("div",[t._v("or "+t._s(t.dynamicTimes.weeksSinceStartDate)+" weeks")]),a("div",[t._v("or "+t._s(t.dynamicTimes.monthsSinceStartDate)+" months")]),a("div",[t._v("or "+t._s(t.dynamicTimes.yearsSinceStartDate)+" years")])]):t._e(),a("div",{staticClass:"col col-md-6 offset-md-3"},[a("dropzone",{attrs:{id:"relationship-pictures",url:"/api/v1.0/relationships/file_upload/"+t.relationship_id},on:{"vdropzone-success":t.showSuccessAddedPicture}})],1)]):t._e()])},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"margin-vertical-xlg"},[a("a",{attrs:{href:"/oauth/facebook"}},[a("i",{staticClass:"fa fa-5x fa-facebook-square",attrs:{"aria-hidden":"true"}})]),a("a",{attrs:{href:"/oauth/instagram"}},[a("i",{staticClass:"fa fa-5x fa-instagram margin-left-md",attrs:{"aria-hidden":"true"}})]),a("a",{attrs:{href:"/oauth/pinterest"}},[a("i",{staticClass:"fa fa-5x fa-pinterest-square margin-left-md",attrs:{"aria-hidden":"true"}})])])}]}},27:function(t,e,a){"use strict";var n=a(10),s=a.n(n),i=a(9),r=a.n(i);e.a={isLoggedIn:function(){var t=this;return r()(s.a.mark(function e(){var a;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,ourloveFetch("/api/v1.0/auth/logged_in");case 2:return a=t.sent,t.abrupt("return",a.json());case 4:case"end":return t.stop()}},e,t)}))()},getIntegrations:function(){var t=this;return r()(s.a.mark(function e(){var a;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,ourloveFetch("/api/v1.0/auth/integrations");case 2:return a=t.sent,t.abrupt("return",a.json());case 4:case"end":return t.stop()}},e,t)}))()},setReturnTo:function(t){var e=this;return r()(s.a.mark(function a(){return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ourloveFetch("/api/v1.0/auth/set_return_to/"+t);case 2:case"end":return e.stop()}},a,e)}))()}}}},[170]);
//# sourceMappingURL=app.ffd100bb255f7824787e.js.map