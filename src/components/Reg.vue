<template>
  <div class="container container-table">
      <div class="row vertical-10p">
        <div class="container">
            <validator name="validation">
                <form  class="ui form loginForm" @submit.prevent="submit">
                  <h2>注册</h2>
                    
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
                       v-validate:password="{minlength: 8}">
                    <p class="error" v-if="$validation.password.minlength">your password is too short</p>
                  </div>
				  <div class="input-group">
                    <input class="form-control" name="confirmPassword" placeholder="Password" type="password" 
					   v-validate:confirm-password="{checkSamePasswords: true}">
                    <p class="error" v-if="$validation.confirmPassword.checkSamePasswords">your password repeat not like</p>
                  </div>
				  <div class="input-group">
                    <input class="form-control" name="email" placeholder="email" type="text" 
                       v-model="email"
                       v-validate:email="{isEmail: true}">
                    <p class="error" v-if="$validation.email.isEmail">yout email is not true</p>
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
				email: '',
                error: ''
            };
        },
		
		validators: {
			checkSamePasswords(val) {
				return val === this.vm.password;
			},
			isEmail(val) {
				return val.indexOf('@') > -1;
			}
		},
        
        methods: {
            submit: function (e) {
                var self = this
                this.$validate(true, function(){
                    if (self.$validation.invalid) {
                        return;
                    }
                });
				
				console.log(
				    this.username,
					this.password,
					this.email
				);
                
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