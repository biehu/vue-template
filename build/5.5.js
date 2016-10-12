webpackJsonp([5],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(30)
	__vue_script__ = __webpack_require__(32)
	__vue_template__ = __webpack_require__(50)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(31);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=_v-6164ef42&file=Curd.vue&scoped=true!./../../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./Curd.vue", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/vue-loader/lib/style-rewriter.js?id=_v-6164ef42&file=Curd.vue&scoped=true!./../../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./Curd.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "\n\t.input-group[_v-6164ef42] {\n\t\tdisplay: block;\n\t\tpadding-bottom: 10px;\n\t}\n\t.search[_v-6164ef42] {\n\t\tmargin-bottom: 20px;\n\t}\n\t.search-input[_v-6164ef42] {\n\t\tmargin-right: 60px;\n\t}\n\t.title[_v-6164ef42] {\n\t\ttext-align: center;\n\t}\n\t.user-control[_v-6164ef42] {\n\t\tfloat: right;\n\t}\n", ""]);

	// exports


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _stringify = __webpack_require__(33);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _assign = __webpack_require__(36);

	var _assign2 = _interopRequireDefault(_assign);

	var _Page = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../common/Page\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _Page2 = _interopRequireDefault(_Page);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var newUser = {
		name: '',
		pass: ''
	}; // <template>
	// 	<div class="user">
	// 		<div class="search">
	// 		   <button @click="search" class="user-control">查询</button>
	// 	       <div class="search-input"><input v-model="username" type="text" class="form-control"></div>
	// 		</div>
	// 		<div class="list">
	// 			<p v-for="user in users">
	// 				<button @click="remove(user)" class="user-control">删除</button>
	// 				<button @click="edit(user)" class="user-control">修改</button>
	// 				{{user.name}}
	// 			</p>
	//
	// 			<Page :current-page="currentPage" :last-page="lastPage" @change-page="changePage"></Page>
	// 		</div>
	// 		<form role="form">
	// 			<h2 class="title">添加用户</h2>
	// 			<hr/>
	// 		    <div class="form-group">
	// 		        <label for="exampleInputEmail1">
	// 		            用户
	// 		        </label>
	// 		        <input v-model="newUser.name" type="text" class="form-control">
	// 		    </div>
	// 		    <div class="form-group">
	// 		        <label for="exampleInputPassword1">
	// 		            密码
	// 		        </label>
	// 		        <input v-model="newUser.pass" type="password" class="form-control">
	// 		    </div>
	// 			<div v-if="!!editUser" class="edit-btns" >
	// 				<button @click="handleEdit" type="button" class="btn btn-default">
	// 	               修改
	// 	            </button>
	// 				<button @click="cancelEdit" type="button" class="btn btn-default">
	// 	               取消
	// 	            </button>
	// 			</div>
	// 			<button v-else @click="add" type="button" class="btn btn-default">
	//                添加
	//             </button>
	// 		</form>
	// 	</div>
	// </template>
	//
	// <script> 
	exports.default = {
		name: 'Curd',

		data: function data() {
			return {
				users: [],
				username: '',
				newUser: (0, _assign2.default)({}, newUser),
				editUser: null,
				lastPage: 1,
				pageNum: 2,
				currentPage: 1
			};
		},

		//		
		//		computed: {
		//			lastPage() {
		//				return this.$route.query ? 
		//				    +this.$route.query.page : 1;
		//			}
		//		},

		methods: {
			handleChange: function handleChange(page) {
				console.log(page);
			},
			changePage: function changePage(page) {
				this.fetch(page);
			},
			fetch: function fetch(page) {
				var users = JSON.parse(localStorage.getItem('users') || '[]');

				this.lastPage = Math.ceil(users.length / this.pageNum);
				if (page) this.currentPage = page;

				var start = (this.currentPage - 1) * this.pageNum;
				var end = (this.currentPage - 1) * this.pageNum + this.pageNum;
				this.users = users.slice(start, end);
			},
			remove: function remove(user) {
				var users = JSON.parse(localStorage.getItem('users') || '[]');
				users = users.filter(function (item) {
					return item.name !== user.name;
				});
				localStorage.setItem('users', (0, _stringify2.default)(users));

				this.users = this.users.filter(function (item) {
					return item.name !== user.name;
				});
			},
			add: function add() {
				if (!this.newUser.name) return;

				var users = JSON.parse(localStorage.getItem('users') || '[]');
				users.push(this.newUser);
				localStorage.setItem('users', (0, _stringify2.default)(users));

				this.$set('users', users);

				this.newUser = (0, _assign2.default)({}, newUser);
			},
			edit: function edit(user) {
				this.editUser = user;
				this.newUser = (0, _assign2.default)({}, user);
			},
			cancelEdit: function cancelEdit() {
				this.editUser = null;
				this.newUser = (0, _assign2.default)({}, newUser);
			},
			handleEdit: function handleEdit() {
				if (!this.editUser) return;

				var users = JSON.parse(localStorage.getItem('users') || '[]');
				users = users.map(function (user) {
					if (this.editUser.name === user.name) {
						return this.newUser;
					} else {
						return user;
					}
				}.bind(this));

				localStorage.setItem('users', (0, _stringify2.default)(users));

				this.$set('users', users);

				this.newUser = (0, _assign2.default)({}, newUser);
			},
			search: function search() {
				if (!this.username) return;

				var users = JSON.parse(localStorage.getItem('users') || '[]');
				users = users.filter(function (user) {
					return user.name.indexOf(this.username) > 0;
				}.bind(this));

				this.$set('users', users);
			}
		},

		ready: function ready() {
			this.fetch();
		},


		components: {
			Page: _Page2.default
		}
	};
	// </script>
	//
	// <style scoped>
	// 	.input-group {
	// 		display: block;
	// 		padding-bottom: 10px;
	// 	}
	// 	.search {
	// 		margin-bottom: 20px;
	// 	}
	// 	.search-input {
	// 		margin-right: 60px;
	// 	}
	// 	.title {
	// 		text-align: center;
	// 	}
	// 	.user-control {
	// 		float: right;
	// 	}
	// </style>

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(34), __esModule: true };

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var core = __webpack_require__(35);
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return (core.JSON && core.JSON.stringify || JSON.stringify).apply(JSON, arguments);
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(37), __esModule: true };

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(38);
	module.exports = __webpack_require__(35).Object.assign;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(39);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(43)});

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(40)
	  , core      = __webpack_require__(35)
	  , ctx       = __webpack_require__(41)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 40 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(42);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(44)
	  , toObject = __webpack_require__(45)
	  , IObject  = __webpack_require__(47);

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(49)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 44 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(46);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(48);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = "\n\t<div class=\"user\" _v-6164ef42=\"\">\n\t\t<div class=\"search\" _v-6164ef42=\"\">\n\t\t   <button @click=\"search\" class=\"user-control\" _v-6164ef42=\"\">查询</button>\n\t       <div class=\"search-input\" _v-6164ef42=\"\"><input v-model=\"username\" type=\"text\" class=\"form-control\" _v-6164ef42=\"\"></div>\n\t\t</div>\n\t\t<div class=\"list\" _v-6164ef42=\"\">\n\t\t\t<p v-for=\"user in users\" _v-6164ef42=\"\">\n\t\t\t\t<button @click=\"remove(user)\" class=\"user-control\" _v-6164ef42=\"\">删除</button>\n\t\t\t\t<button @click=\"edit(user)\" class=\"user-control\" _v-6164ef42=\"\">修改</button>\n\t\t\t\t{{user.name}}\n\t\t\t</p>\n\t\t\t\n\t\t\t<page :current-page=\"currentPage\" :last-page=\"lastPage\" @change-page=\"changePage\" _v-6164ef42=\"\"></page>\n\t\t</div>\n\t\t<form role=\"form\" _v-6164ef42=\"\">\n\t\t\t<h2 class=\"title\" _v-6164ef42=\"\">添加用户</h2>\n\t\t\t<hr _v-6164ef42=\"\">\n\t\t    <div class=\"form-group\" _v-6164ef42=\"\">\n\t\t        <label for=\"exampleInputEmail1\" _v-6164ef42=\"\">\n\t\t            用户\n\t\t        </label>\n\t\t        <input v-model=\"newUser.name\" type=\"text\" class=\"form-control\" _v-6164ef42=\"\">\n\t\t    </div>\n\t\t    <div class=\"form-group\" _v-6164ef42=\"\">\n\t\t        <label for=\"exampleInputPassword1\" _v-6164ef42=\"\">\n\t\t            密码\n\t\t        </label>\n\t\t        <input v-model=\"newUser.pass\" type=\"password\" class=\"form-control\" _v-6164ef42=\"\">\n\t\t    </div>\n\t\t\t<div v-if=\"!!editUser\" class=\"edit-btns\" _v-6164ef42=\"\">\n\t\t\t\t<button @click=\"handleEdit\" type=\"button\" class=\"btn btn-default\" _v-6164ef42=\"\">\n\t               修改\n\t            </button>\n\t\t\t\t<button @click=\"cancelEdit\" type=\"button\" class=\"btn btn-default\" _v-6164ef42=\"\">\n\t               取消\n\t            </button>\n\t\t\t</div>\n\t\t\t<button v-else=\"\" @click=\"add\" type=\"button\" class=\"btn btn-default\" _v-6164ef42=\"\">\n               添加\n            </button>\n\t\t</form>\n\t</div>\n";

/***/ }
]);