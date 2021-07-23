<template>
    <div>
        <div class="my_details toogle_profile">
            <h3>MY DETAILS</h3>
            <p>Feel free to edit any of your details below so your account is totally up to date.</p>
            <div class="success-msg-login" v-show="success"><p>Profile updated successfully !</p></div> 
            <div class="error-msg-login" v-show="error"><p>Update failed !</p></div> 
            <form class="my_details_form" @submit.prevent="editProfile">
                <div>
                    <label for="name">First Name</label>
                    <input :class="{ 'error-inputs': $v.user.first_name.$error  }" type="text" v-model.lazy ="$v.user.first_name.$model" placeholder="First Name">
                </div>
                <div>
                    <label for="lastname">Last Name</label>
                    <input :class="{ 'error-inputs': $v.user.last_name.$error  }" type="text"  v-model.lazy ="$v.user.last_name.$model"  placeholder="Last Name">
                </div>
                <div>
                    <label for="mail">Email</label>
                    <input :class="{ 'error-inputs': $v.user.email.$error  }"  type="mail"  v-model.lazy ="$v.user.email.$model"  placeholder="Email" disabled>
                </div>
                <div>
                    <label for="mail">Phone Number</label>
                    <input :class="{ 'error-inputs': $v.user.phone.$error  }"  type="tel" v-model.lazy ="$v.user.phone.$model"  placeholder="+383 49 000 000">
                </div>
                <div>
                    <label for="mail">City</label>
                    <select  v-model="selectCity" @change="getCity($event)">
                        <option v-for="c in cities" v-bind:key="c.name" v-bind:value="c._id"> {{ c.name }} </option>
                    </select>
                </div>
                <div>
                    <label for="mail">Address</label>
                    <input type="address"  v-model="user.address"  placeholder="Adress" >
                </div>
                <div class="change_profile">
                    <button type="submit" class="sign_in_button">Change</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script> 
import { required,email ,minLength,maxLength} from 'vuelidate/lib/validators'
import axios from 'axios';

export default {
    name: 'EditProfile',
    data(){
        return{
            success: false, 
            error:false,
            myJson:null,
            user:{    
                first_name: '',        
                last_name:'',
                email:'',
                phone:'',
                address:'' ,
                city:''
            },
            selectCity:"",
            cities:[],
            submitted: false
        }
    },
    created () {
        this.myJson=JSON.parse(localStorage.getItem("currentUser"))
        this.user.first_name =  this.myJson.first_name,        
        this.user.last_name = this.myJson.last_name,
        this.user.email = this.myJson.email,
        this.user.phone = this.myJson.phone,
        this.user.address = this.myJson.address 
        this.selectCity=this.myJson.city
        this.loadCity()
    },
    methods:{
        async editProfile(){  
            this.submitted = true;
            this.$v.$touch();
            if (this.$v.$pending || this.$v.$error) {
            // stop here if form is invalid
                this.error = true
                setTimeout(() => this.error = false, 3000)
                return;
            }else{
                await axios.patch('api/users/'+this.myJson._id,{
                    update_profile:true,
                    first_name: this.user.first_name,
                    last_name: this.user.last_name,
                    phone: this.user.phone,
                    address: this.user.address,
                    city: this.user.city
                }).then(response => {
                    localStorage.setItem("currentUser",JSON.stringify(response.data));
                    if(!response.data.error){
                        this.success = true
                        setTimeout(() => this.success = false, 7000)
                    }else{
                        this.error = true
                        setTimeout(() => this.error = false, 7000)
                    }
                    
                })
            }
        },
        //Shfaqja e qyteteve me dropdown list
        async loadCity(){
            await axios.get('/api/city/').then(res => {
                this.cities = res.data;
            });
        },

        getCity(event){
            this.user.city = event.target.value
        }
    },
    validations:{
        user:{
            first_name: {required,minLength: minLength(4)},
            last_name: {required,minLength: minLength(2)},
            email: {email},
            phone:{
                maxLength: maxLength(12),
                valid: function(value) {
                    return /\+[0-9]{11}/.test(value) ;
                }
            }
        }
    }
}
</script>
<style scoped>
input,
textarea,
select {
    background: transparent;
    margin-top:3px;
}

</style>