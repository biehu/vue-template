webpackJsonp([5],{7:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=o(1);t["default"]={methods:{loginOut:function(){(0,s.deleteCookie)("user"),this.$router.go("/login")}}}},30:function(e,t){e.exports=" <div class=content> <div class=nav> <p> <a>首页</a> <a @click=loginOut>退出</a> </p> </div> <router-view></router-view> </div> "},37:function(e,t,o){var s,i;s=o(7),i=o(30),e.exports=s||{},e.exports.__esModule&&(e.exports=e.exports["default"]),i&&(("function"==typeof e.exports?e.exports.options:e.exports).template=i)}});