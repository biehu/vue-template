webpackJsonp([2],[
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
/* 10 */
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
/* 11 */,
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(14)
	__vue_script__ = __webpack_require__(16)
	__vue_template__ = __webpack_require__(17)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(15);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(8)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=_v-bb0cb05e&file=Login.vue&scoped=true!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./Login.vue", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/vue-loader/lib/style-rewriter.js?id=_v-bb0cb05e&file=Login.vue&scoped=true!./../../node_modules/vue-loader/lib/selector.js?type=style&index=0!./Login.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(7)();
	// imports


	// module
	exports.push([module.id, "\n\t.input-group[_v-bb0cb05e] {\n\t\tdisplay: block;\n\t\toverflow: hidden;\n\t    padding-bottom: 10px;\n\t}\n\t.invalid.untouched ~ .error[_v-bb0cb05e] {\n\t\tdisplay: none;\n\t}\n\th2[_v-bb0cb05e] {\n\t\ttext-align: center;\n\t}\n", ""]);

	// exports


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _util = __webpack_require__(10);

	exports.default = {
		name: 'Login',

		data: function data() {
			return {
				username: '',
				password: '',
				error: ''
			};
		},


		methods: {
			submit: function submit(e) {
				var _this = this;

				var self = this;
				this.$validate(true, function () {
					if (self.$validation.invalid) {
						return;
					}
				});
				this.$http.post('/vue/vue-crud/api.php', { username: this.username, password: this.password }).then(function (response) {
					if (response.data === 'biehu') {
						_this.$root.$data.isLogin = true;

						(0, _util.setCookie)('user', 'biehu');

						_this.$router.go('/');
					} else {
						_this.response = 'user is not right';
					}
				}, function (response) {
					console.log('Error', response);
					_this.error = 'server error';
				});
			}
		}
	};
	// </script>
	//
	// <style scoped>
	// 	.input-group {
	// 		display: block;
	// 		overflow: hidden;
	// 	    padding-bottom: 10px;
	// 	}
	// 	.invalid.untouched ~ .error {
	// 		display: none;
	// 	}
	// 	h2 {
	// 		text-align: center;
	// 	}
	// </style>
	// <template>
	//   <div class="container container-table">
	//       <div class="row vertical-10p">
	//         <div class="container">
	//         	<validator name="validation">
	// 	            <form  class="ui form loginForm" @submit.prevent="submit">
	// 	        	  <h2>登录</h2>
	//
	// 	              <div v-if=response class="text-red"><p>{{response}}</p></div>
	//
	// 	              <div class="input-group">
	// 	                <input class="form-control" name="username" placeholder="Username" type="text" 
	// 					   v-model="username"
	// 					   v-validate:username="{required: true}">
	// 				    <p class="error" v-if="$validation.username.required">required your name!</p>
	// 	              </div>
	// 	              <div class="input-group">
	// 	                <input class="form-control" name="password" placeholder="Password" type="password" 
	// 					   v-model="password"
	// 					   v-validate:password="{minlength: 8, maxlength: 16}">
	// 				    <p class="error" v-if="$validation.password.minlength">your password is too short</p>
	//                     <p class="error" v-if="$validation.password.maxlength">your password is too long</p>
	// 	              </div>
	// 	              <button type="submit" class="btn btn-primary btn-lg " :disabled="!$validation.valid">Submit</button>
	// 	            </form>
	// 			</validator>
	//         </div>
	//       </div>
	//   </div>
	// </template>
	//
	// <script>

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = "\n  <div class=\"container container-table\" _v-bb0cb05e=\"\">\n      <div class=\"row vertical-10p\" _v-bb0cb05e=\"\">\n        <div class=\"container\" _v-bb0cb05e=\"\">\n        \t<validator name=\"validation\" _v-bb0cb05e=\"\">\n\t            <form class=\"ui form loginForm\" @submit.prevent=\"submit\" _v-bb0cb05e=\"\">\n\t        \t  <h2 _v-bb0cb05e=\"\">登录</h2>\n\t            \t\n\t              <div v-if=\"response\" class=\"text-red\" _v-bb0cb05e=\"\"><p _v-bb0cb05e=\"\">{{response}}</p></div>\n\t\n\t              <div class=\"input-group\" _v-bb0cb05e=\"\">\n\t                <input class=\"form-control\" name=\"username\" placeholder=\"Username\" type=\"text\" v-model=\"username\" v-validate:username=\"{required: true}\" _v-bb0cb05e=\"\">\n\t\t\t\t    <p class=\"error\" v-if=\"$validation.username.required\" _v-bb0cb05e=\"\">required your name!</p>\n\t              </div>\n\t              <div class=\"input-group\" _v-bb0cb05e=\"\">\n\t                <input class=\"form-control\" name=\"password\" placeholder=\"Password\" type=\"password\" v-model=\"password\" v-validate:password=\"{minlength: 8, maxlength: 16}\" _v-bb0cb05e=\"\">\n\t\t\t\t    <p class=\"error\" v-if=\"$validation.password.minlength\" _v-bb0cb05e=\"\">your password is too short</p>\n                    <p class=\"error\" v-if=\"$validation.password.maxlength\" _v-bb0cb05e=\"\">your password is too long</p>\n\t              </div>\n\t              <button type=\"submit\" class=\"btn btn-primary btn-lg \" :disabled=\"!$validation.valid\" _v-bb0cb05e=\"\">Submit</button>\n\t            </form>\n\t\t\t</validator>\n        </div>\n      </div>\n  </div>\n";

/***/ }
]);