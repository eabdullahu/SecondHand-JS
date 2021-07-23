<template>
    <div class="container m-t-20">
        <div class="inputContainer justify-content-between align-items-center m-t-0"> 
            <h4 class="title"> Users </h4>
            <div class="d-flex widthUnset">
                <input type="submit" class="input outline-badge-blue shadow header" value="+ New Users" @click="addNewUser()">
            </div>
        </div>
        <div class="responsiveTable" v-if = 'this.users.length > 0'>
            <table class="m-t-20">
                <thead>
                    <tr>
                        <th class="text-center">First Name</th>
                        <th class="text-center">Last Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>Phone Number</th>
                        <th>Role</th>
                        <th>Active User</th>
                        <th class="text-center">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for='u in users' :key="u._id"> 
                        <td class="text-center">{{u.first_name}}</td>
                        <td class="text-center">{{ u.last_name }}</td>
                        <td>{{ u.email }}</td>
                        <td class="text-primary">{{ u.address}}</td>
                        <td>{{ u.city}}</td>
                        <td>{{ u.phone}}</td>
                        <td v-if='u.role == "admin" '><span class="badge outline-badge-red" >{{ u.role}}</span></td>
                        <td v-else><span class="badge outline-badge-blue" >{{ u.role}}</span></td>
                        <td v-if='u.is_active == true'><span class="badge outline-badge-green" >{{ u.is_active}}</span></td>
                        <td v-else><span class="badge outline-badge-red" >{{ u.is_active}}</span></td>

                        <td>
                            <div class="icons click">
                                <span @click='userInfo(u._id,u.first_name,u.last_name,u.is_active)'><font-awesome-icon :icon="['fas','edit']" class="green" /></span>
                            </div>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
        <form v-on:submit.prevent="handleSubmit" class="p-20 m-t-20 bg" v-if="form.isShown">
            <div class="first width100 m-r-0">
                <div class="inputContainer g33">
                    <div>
                        <p>First  Name</p>
                        <input type="text" class="input" placeholder="Title" v-model="$v.user.first_name.$model" :class="{ 'error-input': $v.user.first_name.$error }">
                    </div>
                    <div>
                        <p>Last Name</p>
                        <input type="text" class="input" placeholder="Title" v-model="$v.user.last_name.$model" :class="{ 'error-input': $v.user.last_name.$error }">

                    </div>
                    <div>
                        <p>Email</p>
                        <input type="text" class="input" placeholder="Title" v-model="$v.user.mail.$model" :class="{ 'error-input': $v.user.mail.$error }">

                    </div>
                </div>
                <div class="inputContainer g33">

                    <div>
                        <p>Address</p>
                        <input type="text" class="input" placeholder="Title" v-model="$v.user.address.$model" :class="{ 'error-input': $v.user.address.$error }">
                    </div>
                    <div>
                        <p>Phone number</p>
                        <input type="text" class="input" placeholder="Title" v-model="$v.user.phone.$model" :class="{ 'error-input': $v.user.phone.$error }">
                    </div>  
                    <div>
                        <p>Role</p>
                        <select class="input" v-model="user.role">
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                        </select>
                    </div> 
                    <div>
                        <p>City</p>
                        <select class="input" @change="updateCity($event)" v-model="user.city">
                            <option v-for="(c, index) in cities" :data-index="index" :value="c._id" :key="c._id">{{ c.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="inputContainer justify-content-end m-t-20">
                    <input type="submit" name="submit" class="input header outline-badge-green shadow" value="Add user">
                </div>
            </div>
        </form>
        <div class="p-20 m-t-20 bg-black transition max-height" v-if='userDetails.show'>
            <h3>{{ userDetails.name}} {{ userDetails.lastname }}</h3>
            <div class="first width100 m-r-0 m-t-20">
                <div class="stats">
                    <div class="stats-user">
                        <p>Number of posted products</p>
                        <span class="badge outline-badge-red" >{{ userDetails.noProducts }}</span>
                    </div>
                    <div class="stats-user">
                        <p>Number of orders</p>
                        <span class="badge outline-badge-blue" >{{ userDetails.noOrders }}</span>
                    </div>
                    <div class="stats-user">
                        <p>Number of posted reviews</p>
                        <span class="badge outline-badge-green" >{{ userDetails.noReviews}}</span>
                    </div>
                </div>
            </div>
            <p v-if='userDetails.is_active == true' class="deactivate" @click="activeStatus(userDetails.id)">Deactivate this user</p>
            <p v-else class="activate" @click="activeStatus(userDetails.id)"> Activate this user </p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { required, maxLength} from 'vuelidate/lib/validators'

    export default {
        name: "Users",
        data() {
            return {
                users: [],
                cities:[],
                user: {
                    id: null,
                    first_name: '',
                    last_name: '',
                    address: '',
                    phone: '',
                    mail: '',
                    role: '',
                    city : ''
                },
                form: {
                    subCategories : [],
                    isShown: false,
                    title: null,
                    type: null
                },
                userDetails :{
                    id:0,
                    name:'',
                    lastname:'',
                    show:false,
                    noProducts: 0,
                    noOrders: 0,
                    noReviews: 0,
                    noSoldProducts: 0,
                    isActive: ''
                }
            }
        },
        created(){
            this.getUsers();
            this.getCities();
        },
        methods: {
            getUsers(){
                axios.get("/admin-api/users/").then(response => {
                    this.users = response.data
                    console.log(this.users);
                });  
            },
            getCities(){
                axios.get("/admin-api/city/").then(response => {
                    this.cities = response.data;
                    console.log(this.cities);
                });  
            },
            handleSubmit() {
                this.$v.$touch();
                if (this.$v.$pending || this.$v.$error) {
                    return;
                }


                axios.post('/admin-api/users/',{

                    first_name: this.user.first_name,
                    last_name: this.user.last_name,
                    email: this.user.mail,
                    phone: this.user.phone,
                    shipping_address: this.user.address,
                    city : this.user.city,
                    fromAdmin: true

                }).then((response) => {
                    if(response.data == "success"){
                        this.$toast.open({
                            message: 'User added successfully!',
                            type: 'success',
                        });
                        location.reload();
                    }else {
                        this.$toast.open({
                            message: 'This email address already exist in our database!',
                            type: 'error',
                        });
                    }
                })
            },
            addNewUser(){
                this.userDetails.show = false;

                if(this.form.type == "add") {
                    this.form = {
                        ...this.form,
                        type: null,
                        isShown: false
                    }
                }else {
                    this.form = {
                        ...this.form,
                        type: "add",
                        isShown: true,
                        title: "You are adding new user!"
                    }
                }
            },
            updateCity(event){
                this.user.city = event.target.value;
            },
            async activeStatus(user){
                await axios.patch('/admin-api/users/activate/',{
                    user : user,
                    status : this.userDetails.is_active
                }).then(response => {
                    console.log(response.data.message);
                    if(response.data.message == "Deactivated successfully!"){
                        this.$toast.open({
                            message: 'Status has been changed!',
                            type: 'success',
                        });
                        this.getUsers();
                        setTimeout(() => this.userDetails.show = false, 500)

                    }else {
                        this.$toast.open({
                            message: 'Try again later!',
                            type: 'error',
                        });
                    }
                 });
            },
            async userInfo(id,name,lastname,isActive){

                this.userDetails.is_active= isActive;
                this.form.isShown = false;
                this.userDetails.id = id;
                this.userDetails.show = (this.userDetails.show == true ?   false : true);
                this.userDetails.name = name;
                this.userDetails.lastname = lastname;

                await axios.get('/admin-api/products/user/'+id).then(res => { this.userDetails.noProducts = res.data });
                await axios.get('/api/mng/order/user/'+id).then(res => { this.userDetails.noOrders = res.data })
                await axios.get('/admin-api/reviews/user/'+id).then(res => { this.userDetails.noReviews = res.data })



            }
        } ,
        validations(){
            return {
                user: {
                    first_name: { required },
                    last_name: { required},
                    mail: { required },
                    phone:{
                        required,
                        maxLength: maxLength(12),
                        valid: function(value) {
                            return /\+[0-9]{11}/.test(value) ;
                        }
                    },
                    address: { required},
                    role: { required },


                }
            }
        }
    }
</script>
