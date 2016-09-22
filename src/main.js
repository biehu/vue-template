import Vue from 'vue';
import VueResource from 'vue-resource';
import Router from 'vue-router';
import App from './components/App';
import Hello from './components/Hello';

Vue.use(Router);
Vue.use(VueResource);

var router = new Router();
router.map({
	'/hello': {
		component: Hello
	}
});

router.redirect({
	'*': '/hello'
});

router.start(App, '#app');
