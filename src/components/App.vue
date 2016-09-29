<template>
	<div class="wrap">
		<h1><img src="../assets/logo.png" /></h1>
		<router-view></router-view>
	</div>
</template>

<script>
	import {getCookie} from '../util';
	
	export default {
		data() {
			return {
				user: ''
			}
		},
		
		ready() {
			if (this.user !== getCookie('user')) {
			     this.user = getCookie('user');
			}
		}

	};
</script>

<style scoped>
	.wrap {
		margin: 20px;
	}
	h1 {
		text-align: center;
	}
	h1 img {
		width: 60px;
	}
</style>



