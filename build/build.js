webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	import Vue from 'vue';
	import VueResource from 'vue-resource';
	import VueValidator from 'vue-validator';
	import Router from 'vue-router';
	import App from './components/App';

	Vue.use(Router);

	Vue.use(VueResource);
	Vue.http.options.emulateJSON = true;

	Vue.use(VueValidator);

	var router = new Router();
	var view = function (name) {
	    return function(resolve) {
	        __webpack_require__.e/* require */(1, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(1)("./" + name + '.vue')]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this));
	    }
	};
	router.map({
	    '/login': {
	        name: 'login', 
	        component: function (resolve) {
	          __webpack_require__.e/* require */(2, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(13)]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this))
	        }
	        
	    },
	    '/reg': {
	        name: 'reg', 
	        component: function (resolve) {
	          __webpack_require__.e/* require */(3, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(18)]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this))
	        }
	    },
	    '/': {
			name: 'content',
	        component: function (resolve) {
	          __webpack_require__.e/* require */(4, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(26)]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this))
	        },
	        auth: true,
	        subRoutes: {
	            '': {
					name: 'curd',
					component: function (resolve) {
			          __webpack_require__.e/* require */(5, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(29)]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this))
			        }
				}
	        }
	    },
	    '*': {
			name: '404', 
	        component: function (resolve) {
	          __webpack_require__.e/* require */(6, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(2)]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this))
	        }
		}
	});



	router.start(App, '#app');


/***/ }
]);