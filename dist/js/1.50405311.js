webpackJsonp([1],[,,function(e,t){var n=e.exports={version:"1.2.6"};"number"==typeof __e&&(__e=n)},function(e,t,n){var r,s;r=n(6),s=n(29),e.exports=r||{},e.exports.__esModule&&(e.exports=e.exports["default"]),s&&(("function"==typeof e.exports?e.exports.options:e.exports).template=s)},,,function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t["default"]={name:"Page",props:{currentPage:{type:Number,"default":1},lastPage:{type:Number,required:!0},offset:{type:Number,"default":3}},methods:{changePage:function(e){this.$dispatch("change-page",e)}},computed:{isActived:function(){return this.currentPage},pagesNumber:function(){if(!this.lastPage)return[];var e=this.currentPage-this.offset;e<1&&(e=1);var t=e+2*this.offset;t>=this.lastPage&&(t=this.lastPage);for(var n=[];e<=t;)n.push(e),e++;return n}}}},,function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var s=n(9),a=r(s),o=n(10),i=r(o),u=n(3),c=r(u),f={name:"",pass:""};t["default"]={name:"Curd",data:function(){return{users:[],username:"",newUser:(0,i["default"])({},f),editUser:null,lastPage:1,pageNum:2,currentPage:1}},methods:{handleChange:function(e){console.log(e)},changePage:function(e){this.fetch(e)},fetch:function(e){var t=JSON.parse(localStorage.getItem("users")||"[]");this.lastPage=Math.ceil(t.length/this.pageNum),e&&(this.currentPage=e);var n=(this.currentPage-1)*this.pageNum,r=(this.currentPage-1)*this.pageNum+this.pageNum;this.users=t.slice(n,r)},remove:function(e){var t=JSON.parse(localStorage.getItem("users")||"[]");t=t.filter(function(t){return t.name!==e.name}),localStorage.setItem("users",(0,a["default"])(t)),this.users=this.users.filter(function(t){return t.name!==e.name})},add:function(){if(this.newUser.name){var e=JSON.parse(localStorage.getItem("users")||"[]");e.push(this.newUser),localStorage.setItem("users",(0,a["default"])(e)),this.$set("users",e),this.newUser=(0,i["default"])({},f)}},edit:function(e){this.editUser=e,this.newUser=(0,i["default"])({},e)},cancelEdit:function(){this.editUser=null,this.newUser=(0,i["default"])({},f)},handleEdit:function(){if(this.editUser){var e=JSON.parse(localStorage.getItem("users")||"[]");e=e.map(function(e){return this.editUser.name===e.name?this.newUser:e}.bind(this)),localStorage.setItem("users",(0,a["default"])(e)),this.$set("users",e),this.newUser=(0,i["default"])({},f)}},search:function(){if(this.username){var e=JSON.parse(localStorage.getItem("users")||"[]");e=e.filter(function(e){return e.name.indexOf(this.username)>0}.bind(this)),this.$set("users",e)}}},ready:function(){this.fetch()},components:{Page:c["default"]}}},function(e,t,n){e.exports={"default":n(11),__esModule:!0}},function(e,t,n){e.exports={"default":n(12),__esModule:!0}},function(e,t,n){var r=n(2);e.exports=function(e){return(r.JSON&&r.JSON.stringify||JSON.stringify).apply(JSON,arguments)}},function(e,t,n){n(24),e.exports=n(2).Object.assign},function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},function(e,t){var n={}.toString;e.exports=function(e){return n.call(e).slice(8,-1)}},function(e,t,n){var r=n(13);e.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,s){return e.call(t,n,r,s)}}return function(){return e.apply(t,arguments)}}},function(e,t){e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},function(e,t,n){var r=n(19),s=n(2),a=n(15),o="prototype",i=function(e,t,n){var u,c,f,l=e&i.F,p=e&i.G,d=e&i.S,g=e&i.P,v=e&i.B,h=e&i.W,m=p?s:s[t]||(s[t]={}),b=p?r:d?r[t]:(r[t]||{})[o];p&&(n=t);for(u in n)c=!l&&b&&u in b,c&&u in m||(f=c?b[u]:n[u],m[u]=p&&"function"!=typeof b[u]?n[u]:v&&c?a(f,r):h&&b[u]==f?function(e){var t=function(t){return this instanceof e?new e(t):e(t)};return t[o]=e[o],t}(f):g&&"function"==typeof f?a(Function.call,f):f,g&&((m[o]||(m[o]={}))[u]=f))};i.F=1,i.G=2,i.S=4,i.P=8,i.B=16,i.W=32,e.exports=i},function(e,t){e.exports=function(e){try{return!!e()}catch(t){return!0}}},function(e,t){var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(e,t,n){var r=n(14);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==r(e)?e.split(""):Object(e)}},function(e,t){var n=Object;e.exports={create:n.create,getProto:n.getPrototypeOf,isEnum:{}.propertyIsEnumerable,getDesc:n.getOwnPropertyDescriptor,setDesc:n.defineProperty,setDescs:n.defineProperties,getKeys:n.keys,getNames:n.getOwnPropertyNames,getSymbols:n.getOwnPropertySymbols,each:[].forEach}},function(e,t,n){var r=n(21),s=n(23),a=n(20);e.exports=n(18)(function(){var e=Object.assign,t={},n={},r=Symbol(),s="abcdefghijklmnopqrst";return t[r]=7,s.split("").forEach(function(e){n[e]=e}),7!=e({},t)[r]||Object.keys(e({},n)).join("")!=s})?function(e,t){for(var n=s(e),o=arguments,i=o.length,u=1,c=r.getKeys,f=r.getSymbols,l=r.isEnum;i>u;)for(var p,d=a(o[u++]),g=f?c(d).concat(f(d)):c(d),v=g.length,h=0;v>h;)l.call(d,p=g[h++])&&(n[p]=d[p]);return n}:Object.assign},function(e,t,n){var r=n(16);e.exports=function(e){return Object(r(e))}},function(e,t,n){var r=n(17);r(r.S+r.F,"Object",{assign:n(22)})},,function(e,t){},,,function(e,t){e.exports=' <div class=page> <ul class=pagination> <li v-if="currentPage > 1"> <a href=# aria-label=Previous @click.prevent="changePage(currentPage - 1)"> <span aria-hidden=true>«</span> </a> </li> <li v-for="page in pagesNumber" v-bind:class="[ page == isActived ? \'active\' : \'\']"> <a href=# @click.prevent=changePage(page)>{{ page }}</a> </li> <li v-if="currentPage < lastPage"> <a href=# aria-label=Next @click.prevent="changePage(currentPage + 1)"> <span aria-hidden=true>»</span> </a> </li> </ul> </div> '},,,function(e,t){e.exports=' <div class=user _v-6164ef42=""> <div class=search _v-6164ef42=""> <button @click=search class=user-control _v-6164ef42="">查询</button> <div class=search-input _v-6164ef42=""><input v-model=username type=text class=form-control _v-6164ef42=""></div> </div> <div class=list _v-6164ef42=""> <p v-for="user in users" _v-6164ef42=""> <button @click=remove(user) class=user-control _v-6164ef42="">删除</button> <button @click=edit(user) class=user-control _v-6164ef42="">修改</button> {{user.name}} </p> <page :current-page=currentPage :last-page=lastPage @change-page=changePage _v-6164ef42=""></page> </div> <form role=form _v-6164ef42=""> <h2 class=title _v-6164ef42="">添加用户</h2> <hr _v-6164ef42=""> <div class=form-group _v-6164ef42=""> <label for=exampleInputEmail1 _v-6164ef42=""> 用户 </label> <input v-model=newUser.name type=text class=form-control _v-6164ef42=""> </div> <div class=form-group _v-6164ef42=""> <label for=exampleInputPassword1 _v-6164ef42=""> 密码 </label> <input v-model=newUser.pass type=password class=form-control _v-6164ef42=""> </div> <div v-if=!!editUser class=edit-btns _v-6164ef42=""> <button @click=handleEdit type=button class="btn btn-default" _v-6164ef42=""> 修改 </button> <button @click=cancelEdit type=button class="btn btn-default" _v-6164ef42=""> 取消 </button> </div> <button v-else="" @click=add type=button class="btn btn-default" _v-6164ef42=""> 添加 </button> </form> </div> '},,,,,,function(e,t,n){var r,s;n(26),r=n(8),s=n(32),e.exports=r||{},e.exports.__esModule&&(e.exports=e.exports["default"]),s&&(("function"==typeof e.exports?e.exports.options:e.exports).template=s)}]);