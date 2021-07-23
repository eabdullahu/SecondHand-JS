<template>
    <div class="login">
        <div class="main-container">
            <div class="loginForgetPassword">
                <div class="login_start" >
                    <p>Enter a new password</p>
                    <p>Please enter a new password</p>
                    <div v-if ="msg.length > 0" class="success-msg-login"><p>{{msg}}</p></div>
                    <div class="error-msg-login" v-if="!$v.confirmpassword.sameAsPassword"><p> Passwords must be identical!</p></div>
                    <div class="login_form">
                        <form class="log_register" @submit.prevent="resetPassword" >
                            <input :class="{ 'error-inputs': $v.password.$error  }" type="password"  v-model="$v.password.$model" placeholder="Password">
                            <input :class="{ 'error-inputs': $v.confirmpassword.$error  }" type="password"  v-model="$v.confirmpassword.$model" placeholder="Confirm password">
                            <button type="submit" class="sign_in_button">Sign in</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {minLength, sameAs} from 'vuelidate/lib/validators'
import axios from 'axios'
export default {
    data() {
      return {
        token: null,
        password: null,
        confirmpassword: null,
        msg:'',
        userId:''
      }
    },
    created(){
        this.checkValidation();
    },
    watch: {
        $route () {
            this.checkValidation();
        }
    },
    methods: {
        async  resetPassword() {
            this.$v.$touch();
            if (this.$v.$pending || this.$v.$error) {
                return;
            }else{
                await axios.post("/login/reset-password", {
                    user:this.userId,
                    password: this.password
                }).then(res => {
                    if(res.data.message == 0){
                        this.msg = 'Changed successfully!';
                        setTimeout(() => this.$router.push({name: 'Login'}), 3000)
                    }
                });
            }
        },
        async checkValidation() {
            await axios.post("/login/check-pass", {
                password_reset_token: this.$route.params.random_token,
            }).then(res => {
                if(res.data.message == 'false'){
                    this.$router.push({ path: '/notfound'})
                }else{
                    this.userId = res.data.user._id;
                }
            });
        }
    },
    validations:{
        password: {
            minLength: minLength(6),
            valid:function(value) {
                const containsUppercase = /[A-Z]/.test(value)
                const containsLowercase = /[a-z]/.test(value)
                const containsNumber = /[0-9]/.test(value)
                const containsSpecial = /[#?!@$%^&*-]/.test(value)
                return containsUppercase && containsLowercase && containsNumber && containsSpecial
            }
        },
        confirmpassword: {sameAsPassword: sameAs('password')},
        
    }
}
</script>