<template>
    <div class="register">
        <PageBanner />
        <div class="main-container">
            <div class="login_start">
                <p>Create Account</p>
                <p>Please Register using account detail bellow.</p>
                <div v-show="success || error" :class=" { 'success-msg-login': success, 'error-msg-login': error } "><p>{{ msg }}</p></div>
                <div class="register_form">
                    <form class="log_register" @submit.prevent="registerData">
                        <div class="error-msg-login" v-if="!$v.user.reenterpassword.sameAsPassword"><p> Passwords must be identical!</p></div>
                        <div class="error-msg-login" v-if="$v.user.phone.$error"><p> Phone number example +38349666555</p></div>
                        
                        <div class="two_inputs">
                            <div>
                                <label for="name">First Name</label>
                                <input  :class="{ 'error-inputs': $v.user.first_name.$error  }" type="text"  v-model.lazy="$v.user.first_name.$model" placeholder="First Name">
                            </div>
                            <div>
                                <label for="lastname">Last Name</label>
                                <input  :class="{ 'error-inputs': $v.user.last_name.$error  }"  type="text"  v-model="$v.user.last_name.$model"  placeholder="Last Name">
                            </div>
                        </div>
                        <div class="two_inputs">
                            <div>
                                <label for="mail">Email</label>
                                <input :class="{ 'error-inputs': $v.user.email.$error  }" type="mail" v-model="$v.user.email.$model" name="mail" placeholder="Email">
                            </div>
                            <div>
                                <label for="phone">Phone Number</label>
                                <input  :class="{ 'error-inputs': $v.user.phone.$error  }" type="tel" v-model="$v.user.phone.$model" placeholder="+38344444444">
                            </div>
                        </div>
                        <div class="two_inputs">
                            <div>
                                <label for="password">Password</label>
                                <input   :class="{ 'error-inputs': $v.user.password.$error  }" type="password" v-model="$v.user.password.$model" placeholder="*********">
                            </div>
                            <div>
                                <label for="password">Reenter Password</label>
                                <input   :class="{ 'error-inputs': $v.user.reenterpassword.$error  }"  type="password" v-model="$v.user.reenterpassword.$model" placeholder="*********">
                            </div>
                        </div>
                        <div class="two_inputs">
                            <div class="w-100">
                                <label for="mail">City</label>
                                <select  v-model="selectCity" @change="getCity($event)">
                                    <option v-for="c in cities" v-bind:key="c.name" v-bind:value="c._id"> {{ c.name }} </option>
                                </select>
                            </div>
                            <div>
                                <label for="mail">Address</label>
                                <input   v-model="user.address" type="address" name="address" placeholder="Bregu i Diellit" value="">
                            </div>
                        </div>
                        <div class="button_sign">
                            <button type="submit" class="sign_in_button">Create</button>
                        </div>
                        <a href=""><router-link to="/">Return to Store</router-link></a>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import PageBanner from "../components/PageBanner.vue";
import { required,email ,minLength,sameAs,maxLength} from 'vuelidate/lib/validators'
export default {
    name: 'Register',
    components: {
        PageBanner
    },
    data(){
        return{
            user:{     
                first_name:'',
                last_name:'',
                email:'',
                phone:'',
                password:'',
                city:'',
                reenterpassword: '',
                address: '' 
            },
            validate: false,
            selectCity:"",
            cities:[],
            phone: false,
            error: false,
            success:false,
            msg: ""
        };
    },   
    created(){
        this.loadCity()
    },
    methods:{
        registerData(){
            // stop here if form is invalid
            this.$v.$touch();
            if (this.$v.$pending || this.$v.$error) {
                this.error = true;
                this.msg = 'Please fill all marked fields!'
                return;
            }else{
                axios.post('/register',{
                    first_name: this.user.first_name,
                    last_name: this.user.last_name,
                    email: this.user.email,
                    phone: this.user.phone,
                    password: this.user.password,
                    reenterpassword: this.user.reenterpassword,
                    address: this.user.address,
                    city: this.user.city
                }).then(res=> {
                    if(res.data.error != 1){
                        this.error = false;
                        this.success = true;
                        this.msg = 'Welcome to L E Z A D A family! You will be redirected to login in 5s.'
                        setTimeout( () => this.$router.push({ path: '/login'}), 5000);
                    }else{
                        this.error = true;
                        this.msg = 'This email is already registered'
                       
                    }
                });
            }
        },
        //Shfaqja e qyteteve me dropdown list
        async loadCity(){
            await axios.get('/api/city/').then(res=> {
                this.cities = res.data;
            });
        },
        getCity(event) {
            this.user.city = event.target.value
        }
    },
    validations:{
        user:{
            first_name: {required,minLength: minLength(4)},
            last_name:  {required,minLength: minLength(2)},
            email:  {required,email},
            phone:{
                required,
                maxLength: maxLength(12),
                valid: function(value) {
                    return /\+[0-9]{11}/.test(value) ;
                }
            },
            password: {
                required,
                minLength: minLength(6),
                valid: function(value) {
                    const containsUppercase = /[A-Z]/.test(value)
                    const containsLowercase = /[a-z]/.test(value)
                    const containsNumber = /[0-9]/.test(value)
                    const containsSpecial = /[#?!@$%^&*-]/.test(value)
                    return containsUppercase && containsLowercase && containsNumber && containsSpecial
                }
            },
            reenterpassword: {required,sameAsPassword: sameAs('password')}
        }
    }
}
</script>
<style scoped>
    .w-100{
        width:50% !important;
        display:flex;
        flex-direction: column;
    }
    .w-100 select{
        margin-top:5px;
    }
</style>