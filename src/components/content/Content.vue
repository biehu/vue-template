<template>
	<div class="content">
		<div class="nav">
	        <p>
	        	<a>首页</a>
				<a @click="loginOut">退出</a>
			</p>
		</div>
        <router-view></router-view>
	</div>
</template>

<script>
	import {deleteCookie} from '../../util';
	
	export default {
		methods: {
            loginOut() {
				deleteCookie('user');
				this.$router.go('/login');
			}
		}
	};

</script>


