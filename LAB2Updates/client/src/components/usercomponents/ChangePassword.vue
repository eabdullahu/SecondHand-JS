<template>
    <div class="change_password toogle_profile" >
        <h3>CHANGE PASSWORD</h3>
        <p>Feel free to update your password so your account stays secure.</p>
        <div v-if ="errMessage" class="error-msg-login"><p>{{msg}}</p></div>
        <div v-else-if ="successMessage" class="success-msg-login"><p>{{msg}}</p></div>
        <div class="error-msg-login" v-if="!$v.user.confirmpassword.sameAsPassword"><p> Passwords must be identical!</p></div>
        <form class="my_details_form"  @submit.prevent="changePassword">
            <div>
                <label for="name">Current Password</label>
                <input :class="{ 'error-inputs': $v.user.password.$error  }" type="password" v-model="$v.user.password.$model">
            </div>
            <div>
                <label for="lastname">New Password</label>
                <input :class="{ 'error-inputs': $v.user.new_password.$error  }" type="password" v-model="$v.user.new_password.$model">
            </div>
            <div>
                <label for="mail">Re-enter New Password</label>
                <input :class="{ 'error-inputs': $v.user.confirmpassword.$error  }" v-model="$v.user.confirmpassword.$model" type="password">
            </div>
            <div class="save_password">
                <button type="submit" class="sign_in_button">Save</button>
            </div>
        </form>
    </div>
</template>
<script>

import { required ,minLength, sameAs} from 'vuelidate/lib/validators'
import axios from 'axios'
import jwt from 'jsonwebtoken'
var user=JSON.parse(localStorage.getItem("currentUser"));
export default {
    name:'ChangePassword',
    data(){
        return{
            user:{    
                password:'',        
                new_password:'',
                confirmpassword:''
            },
            errMessage: false,
            successMessage:false,
            msg:''
        }
    },
    methods:{
        async changePassword(){  
            this.$v.$touch();
            if (this.$v.$pending || this.$v.$error) {
                return;
            }else{
                console.log("TESTRITA");
                console.log(user);

                this.validate_token();
                await axios.patch('api/users/'+user._id,{
                    update_profile:false,
                    password: this.user.password,
                    new_password: this.user.new_password
                }).then(response => {
                    if(response.data.error =='error1'){
                        this.msg = response.data.message;
                        this.errMessage = true;
                        setTimeout(() => this.errMessage = false, 3000)
                    }else if(response.data.error  =='error0'){
                        this.msg = response.data.message;
                        this.errMessage = true;
                        setTimeout(() => this.errMessage = false, 3000)
                    }else{
                        this.msg = response.data.message;
                        console.log(response.data);
                        this.successMessage = true;
                        setTimeout(() => this.successMessage = false, 3000)
                    }
                })
            }
        },
        async validate_token(){
            // verify a token symmetric
            jwt.verify(localStorage.getItem('token'),  'a8478397b836a1dc2a4b6212be3d343ea41a6983abb8d214d7b293409d4407726b5ed93a732d03dd65c6cc502a51c343b7c85aaa1af4f50919154b547f04097c');
        }
    },
    validations:{
        user:{
            password: {required},
            new_password: {
                minLength: minLength(6),
                valid:function(value) {
                    const containsUppercase = /[A-Z]/.test(value)
                    const containsLowercase = /[a-z]/.test(value)
                    const containsNumber = /[0-9]/.test(value)
                    const containsSpecial = /[#?!@$%^&*-]/.test(value)
                    return containsUppercase && containsLowercase && containsNumber && containsSpecial
                }
            },
            confirmpassword: {sameAsPassword: sameAs('new_password')},
        }
    }
}
</script>
