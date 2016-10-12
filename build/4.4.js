webpackJsonp([4],{

/***/ 10:
/***/ function(module, exports) {

	export function setCookie(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	}

	export function getCookie(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return "";
	}

	export function deleteCookie(cname) {
	    setCookie(cname, '', -1);
	}

/***/ },

/***/ 26:
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__vue_script__ = __webpack_require__(27)
	__vue_template__ = __webpack_require__(28)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }


/***/ },

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _util = __webpack_require__(10);

	exports.default = {
		methods: {
			loginOut: function loginOut() {
				(0, _util.deleteCookie)('user');
				this.$router.go('/login');
			}
		}
	};

	// </script>
	//
	//
	//
	// <template>
	// 	<div class="content">
	// 		<div class="nav">
	// 	        <p>
	// 	        	<a>首页</a>
	// 				<a @click="loginOut">退出</a>
	// 			</p>
	// 		</div>
	//         <router-view></router-view>
	// 	</div>
	// </template>
	//
	// <script>

/***/ },

/***/ 28:
/***/ function(module, exports) {

	module.exports = "\n\t<div class=\"content\">\n\t\t<div class=\"nav\">\n\t        <p>\n\t        \t<a>首页</a>\n\t\t\t\t<a @click=\"loginOut\">退出</a>\n\t\t\t</p>\n\t\t</div>\n        <router-view></router-view>\n\t</div>\n";

/***/ }

});