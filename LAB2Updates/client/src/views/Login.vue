<template>
    <div>
        <PageBanner />
        <div class="login">
            <div class="main-container">
                <div class="loginForgetPassword">
                    <div class="login_start"  v-show="showLoginForm">
                        <p>Login</p>
                        <p>Please login using your account details.</p>
                        <div class="login_form">
                            <div  class="error-msg-login" v-if="error"><p>{{msg}}</p></div>
                            <form class="log_register" @submit.prevent="login" >
                                <input type="email" v-model="email" name="email" placeholder="Email">
                                <input type="password" v-model="password" name="password" placeholder="Password">
                                <div class="button_sign">
                                    <button type="submit" class="sign_in_button">Sign in</button>
                                    <a href="#" @click.prevent="toggleForm('register')">Forgot your password?</a>
                                </div>
                                <a href="#"> <router-link to="/Register">Create account</router-link></a>
                            </form>
                        </div>
                    </div>
                    <div class="login_start" v-show="showResetForm" v-if="invalidUser != 2">
                        <p>Reset Your Password</p>
                        <p>We will send you an email to reset your password.</p>
                        <div  class="error-msg-login" v-if="invalidUser == 1"><p>This user doesn't exist!</p></div>
                        <div class="login_form">
                            <form class="log_register" @submit.prevent="forgotPassword">
                                <input type="email"  v-model="emailPassword" name="email" placeholder="Email">
                                <div class="button_sign">
                                    <button type="submit" class="sign_in_button">Submit</button>
                                    <a href="" @click.prevent="toggleForm('login')">Cancel</a>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="login_start" v-else>
                        <p>LEZADA Password Reset</p>
                        <p></p>
                        <div  class="success-msg-login" ><p>Please check your email address</p></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PageBanner from "../components/PageBanner.vue";
import axios from 'axios'
export default {
    name: 'Login',
    components: {
        PageBanner
    },
    data() {
      return {
        login_message: 'Please enter your credentials to login.',
        loginStage: 'login-form',
        currentForm: 'login',
        email:'',
        password:'',
        emailPassword:'',
        invalidUser:0,
        error: false,
        msg: ""
      }
   },
    mounted(){
        //If user logged in do not show login form
        if(localStorage.getItem("currentUser")){
            this.$router.push('/user');
        }
    },
    computed: {
        showResetForm() {
            return this.currentForm === 'register';
        },
        showLoginForm() {
            return this.currentForm === 'login';
        },
    },
    methods: {
        toggleForm(formName) {
            this.currentForm = formName;
        },
        async login(){
            await axios.post('login',{
                email:this.email,
                password:this.password
            }).then(response =>{
                console.log(response);
                if(response.data.error == undefined){
                    console.log(JSON.stringify(response.data.user));
                    localStorage.setItem("currentUser",JSON.stringify(response.data.user));
                    localStorage.setItem("token",response.data.accessToken);
                    var today = new Date();
                    today = today.getTime();
                    localStorage.setItem("lastActivity", today);
                    this.$router.push('/user');
                }
                if(response.data.error == 'Invalid Password'){
                    this.error = true;
                    this.msg = 'Incorrect email address or  password!'
                }else if(response.data.error == 'User does not exist'){
                    this.error = true;
                    this.msg = 'Incorrect email address or  password!'
                }
            });
        },

        async forgotPassword(){
            await axios.patch('login/reset-password',{
                email:this.emailPassword,
            }).then(res=>{
                if(res.data.error == 'invalid user'){
                    this.invalidUser = 1;
                }else if(res.data.error == 'valid user'){
                    this.invalidUser = 2;
                    // setTimeout(() => this.$router.push({ path: '/'}), 2000)
                }
            });
        }
    },
}
</script>