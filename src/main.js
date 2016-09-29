import Vue from 'vue';
import VueResource from 'vue-resource';
import Router from 'vue-router';
import App from './components/App';
import Curd from './components/content/Curd';
import NotFound from './components/404';
import Content from './components/content/Content';
import Login from './components/Login';

Vue.use(Router);

Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

var router = new Router();
router.map({
	'/login': {component: Login},
	'/': {
		component: Content,
		auth: true,
		subRoutes: {
			'': {component: Curd}
		}
	},
	'*': {component: NotFound}
});

router.beforeEach(function(transition){
    if (transition.to.auth && !transition.to.router.app.$data.user) {
        transition.redirect('/login');
    } else {
        transition.next();
    }
});

router.start(App, '#app');
