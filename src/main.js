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
router.map({
    '/login': {
        name: 'login', 
        component: function (resolve) {
          require(['./components/Login.vue'],resolve)
        }
        
    },
    '/reg': {
        name: 'reg', 
        component: function (resolve) {
          require(['./components/Reg.vue'],resolve)
        }
    },
    '/content': {
		name: 'content',
        component: function (resolve) {
          require(['./components/content/Content.vue'],resolve)
        },
        auth: true,
        subRoutes: {
            '/curd/:page': {
				name: 'curd',
				component: function (resolve) {
		          require(['./components/content/Curd.vue'],resolve)
		        }
			}
        }
    },
    '*': {
		name: '404', 
        component: function (resolve) {
          require(['./components/404.vue'],resolve)
        }
	}
});

router.beforeEach(function(transition){
    if (transition.to.auth && !transition.to.router.app.$data.user) {
        transition.redirect('/login');
    } else {
        transition.next();
    }
});

router.start(App, '#app');
