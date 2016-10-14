<template>
  <div class="container container-table">
      <div class="row vertical-10p">
        <div class="container">
        	<validator name="validation">
	            <form  class="ui form loginForm" @submit.prevent="submit">
	        	  <h2>登录</h2>
	            	
	              <div v-if=response class="text-red"><p>{{response}}</p></div>
	
	              <div class="input-group">
	                <input class="form-control" name="username" placeholder="Username" type="text" 
					   v-model="username"
					   v-validate:username="{required: true}">
				    <p class="error" v-if="$validation.username.required">required your name!</p>
	              </div>
	              <div class="input-group">
	                <input class="form-control" name="password" placeholder="Password" type="password" 
					   v-model="password"
					   v-validate:password="{minlength: 8, maxlength: 16}">
				    <p class="error" v-if="$validation.password.minlength">your password is too short</p>
                    <p class="error" v-if="$validation.password.maxlength">your password is too long</p>
	              </div>
	              <button type="submit" class="btn btn-primary btn-lg " :disabled="!$validation.valid">Submit</button>
	            </form>
			</validator>
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
			submit: function (e) {
		        var self = this
		        this.$validate(true, function () {
		          if (self.$validation.invalid) {
		            return;
		          }
		        });
				this.$http
				    .post(
					    '/vue/vue-crud/api.php', 
					    {username: this.username, password: this.password}
					)
				    .then((response) => {
						if (response.data === 'biehu') {
							this.$root.$data.isLogin = true;
							
							setCookie('user', 'biehu');
							
							this.$router.go('/content/curd/1');
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
		overflow: hidden;
	    padding-bottom: 10px;
	}
	.invalid.untouched ~ .error {
		display: none;
	}
	h2 {
		text-align: center;
	}
</style>