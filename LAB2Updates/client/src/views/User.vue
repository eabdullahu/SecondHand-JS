<template>
    <div class="userProfile">
        <PageBanner />
        <div class="main-container">
            <div class="user_profile">
                <div class="l_profile">
                    <div class="user_image">
                        <div class="user_initials">
                            <h1>RM</h1>
                        </div>
                        <p>Hi,<br><span>{{this.fullName}}</span></p>

                    </div>
                     <ul class="account_list">
                        <li>
                            <router-link to="/user/overview" ><i class="fas fa-user"></i> Account Overview</router-link> 
                        </li>
                        <li>
                             <router-link to="/user/profile" class="active_compo"><font-awesome-icon :icon="['fas','user-alt']"/> My Details</router-link> 
                        </li>
                        <li>
                             <router-link to="/user/changePasword" class="active_compo"><font-awesome-icon :icon="['fas','lock']"/> Change Password</router-link> 
                        </li>
                        <li>
                            <router-link :to="{ name: 'My Products', query: { page: 1 }}"><font-awesome-icon :icon="['fas','tshirt']"/> My Products</router-link>
                        </li>
                        <li>
                            <router-link to="/user/addProducts" class="active_compo"><font-awesome-icon :icon="['fas','plus']"/> Add Product</router-link>
                         </li>
                        <li>
                            <router-link to="/user/myOrders"><font-awesome-icon :icon="['fas','file-invoice-dollar']"/>  My Orders </router-link>
                        </li>
                        <li>
                            <a href="#" @click="logout"><font-awesome-icon :icon="['fas','sign-out-alt']"/> Sign out</a>
                        </li>
                    </ul>
                </div>
                <div class="r_profile">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import PageBanner from "../components/PageBanner.vue";
    import axios from 'axios';
    export default {    
        name: 'UserProfile',
        components: {
            PageBanner
        },
        data(){
            return{
                myJson:null,
                fullName:"",
                initials:""
            }
        },
        watch: {
            $route() {
                this.checkLogin();
            }
        },
        created(){
            this.myJson=JSON.parse(localStorage.getItem("currentUser"))
            this.fullName =  this.myJson.first_name + " " + this.myJson.last_name
            this.checkLogin();
        },
        methods: {
            logout() {
                axios.delete('login').then(() =>{
                    localStorage.clear();
                    this.$router.push('/login');
                });
            },
            checkLogin(){
                if(localStorage.getItem("currentUser")){
                    var date = localStorage.getItem("lastActivity");
                    var today = new Date();
                    today.setMinutes(today.getMinutes()-40);
                    today = today.getTime();
                    if(date && date < today){
                        this.logout();
                    }else {
                        var today2 = new Date();
                        today2 = today2.getTime();
                        localStorage.setItem("lastActivity", today2);
                    }
                }else {
                    this.logout();
                }
            }
        }
    }
</script>