<template>
  <div class="container container-table">
      <div class="row vertical-10p">
        <div class="container">
            <form class="ui form loginForm" @submit.prevent="submit">
            	
              <div v-if=response class="text-red"><p>{{response}}</p></div>

              <div class="input-group">
                <input class="form-control" name="username" placeholder="Username" type="text" v-model="username">
              </div>
              <div class="input-group">
                <input class="form-control" name="password" placeholder="Password" type="password" v-model="password">
              </div>
              <button type="submit" class="btn btn-primary btn-lg ">Submit</button>
            </form>
        </div>
      </div>
  </div>
</template>

<script>
	import {setCookie} from '../util';
	
	export default {
		name: 'Login',
		
		data() {
			return {
				username: '',
				password: '',
				error: ''
			};
		},
		
		methods: {
			submit: function () {
				this.$http
				    .post(
					    '/vue/vue-crud/api.php', 
					    {username: this.username, password: this.password}
					)
				    .then((response) => {
						if (response.data === 'biehu') {
							this.$root.$data.isLogin = true;
							
							setCookie('user', 'biehu');
							
							this.$router.go('/');
						} else {
							this.response = 'user is not right';
						}
					}, (response) => {
						console.log('Error', response);
						this.error = 'server error';
					});
			}
		}
	};
</script>

<style scoped>
	.input-group {
		display: block;
	    padding-bottom: 10px;
	}
</style>