<template>
	<div class="user">
		<div class="search">
		   <button @click="search" class="user-control">查询</button>
	       <div class="search-input"><input v-model="username" type="text" class="form-control"></div>
		</div>
		<div class="list">
			<p v-for="user in users">
				<button @click="remove(user)" class="user-control">删除</button>
				<button @click="edit(user)" class="user-control">修改</button>
				{{user.name}}
			</p>
		</div>
		<form role="form">
			<h2 class="title">添加用户</h2>
			<hr/>
		    <div class="form-group">
		        <label for="exampleInputEmail1">
		            用户
		        </label>
		        <input v-model="newUser.name" type="text" class="form-control">
		    </div>
		    <div class="form-group">
		        <label for="exampleInputPassword1">
		            密码
		        </label>
		        <input v-model="newUser.pass" type="password" class="form-control">
		    </div>
			<div v-if="!!editUser" class="edit-btns" >
				<button @click="handleEdit" type="button" class="btn btn-default">
	               修改
	            </button>
				<button @click="cancelEdit" type="button" class="btn btn-default">
	               取消
	            </button>
			</div>
			<button v-else @click="add" type="button" class="btn btn-default">
               添加
            </button>
		</form>
	</div>
</template>

<script> 
	var newUser = {
	    name: '',
	    pass: ''
	};
	export default {
		name: 'Curd',
		
		data() {
			return {
				users: [],
				username: '',
				newUser: Object.assign({}, newUser),
				editUser: null
			}
		},
		
		methods: {
			fetch() {
				this.users = JSON.parse(localStorage.getItem('users') || '[]')
			},
			
			remove(user) {
				var users = JSON.parse(localStorage.getItem('users') || '[]');
                users = users.filter(function (item) {
					return item.name !== user.name;
				});
                localStorage.setItem('users', JSON.stringify(users));
				
				this.users = users;
			},
			
			add() {
				if (!this.newUser.name) return;
				
				var users = JSON.parse(localStorage.getItem('users') || '[]');
				users.push(this.newUser);
				localStorage.setItem('users', JSON.stringify(users));
				
				this.$set('users', users);
				
				this.newUser = Object.assign({}, newUser);
			},
			
			edit(user) {
				this.editUser = user;
				this.newUser = Object.assign({}, user);
			},
			
			cancelEdit() {
				this.editUser = null;
				this.newUser = Object.assign({}, newUser);
			},
			
			handleEdit() {
				if (!this.editUser) return;
				
				var users = JSON.parse(localStorage.getItem('users') || '[]');
                users = users.map(function (user) {
					if (this.editUser.name === user.name) {
						return this.newUser;
					} else {
						return user;
					}
				}.bind(this));
				
                localStorage.setItem('users', JSON.stringify(users));
                
                this.$set('users', users);
				
				this.newUser = Object.assign({}, newUser);
			},
			
			search() {
				if (!this.username) return;
				
				var users = JSON.parse(localStorage.getItem('users') || '[]');
                users = users.filter(function (user) {
                    return user.name.indexOf(this.username) > 0;
                }.bind(this));
				
				this.$set('users', users);
			}
		},
		
		ready() {
            this.fetch();
        }
	};
</script>

<style scoped>
	.input-group {
		display: block;
		padding-bottom: 10px;
	}
	.search {
		margin-bottom: 20px;
	}
	.search-input {
		margin-right: 60px;
	}
	.title {
		text-align: center;
	}
	.user-control {
		float: right;
	}
</style>