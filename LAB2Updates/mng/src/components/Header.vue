<template>
    <div>
        <div class="navbar">
            <header>
                <a class="logo" href="/"><img :src="require('../assets/images/logo/logo_transparent.png')" />CMS</a>
                <div class="left">
                    <div class="profile dropdown" @click="userMenu = !userMenu">
                        <img :src="require('../assets/images/logo/logo_transparent.png')" />
                        <div class="username">
                            <span>Hi, </span>
                            <p>{{ this.userFullName }}</p>
                            <span><i class="fas fa-angle-down"></i></span>
                        </div>
                        <div class="dropdown-items" :class="{ show: userMenu }">
                            <div>
                                <a href="javascript:void(0)" @click="logout"><i class="fas fa-sign-out-alt"></i> Sign Out</a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
        <div class="navbar m-t-10">
            <nav>
                <ul class="menu">
                    <li>
                        <router-link to="/dashboard"><font-awesome-icon :icon="['fas', 'home']" />Dashboard</router-link> 
                    </li>
                    <li>
                        <router-link to="/products" ><font-awesome-icon :icon="['fas', 'tshirt']" />Products</router-link> 
                    </li>
                    <li>
                        <router-link to="/users"><font-awesome-icon :icon="['fas', 'users']" />Users</router-link> 
                    </li>
                    <li>
                       <router-link to="/live-chat">
                            <font-awesome-icon :icon="['fas', 'comment-dots']" />
                            Live chat
                            <span v-if="roomsLength > 0" class="badge outline-badge-red" style="pointer-events:none; margin-left: 8px;">{{ roomsLength }}</span>
                       </router-link>
                    </li>
                    <li>
                        <router-link to="/coupons"><font-awesome-icon :icon="['fas', 'tags']" />Coupons</router-link> 
                    </li>
                    <li>
                        <router-link to="/categories" ><font-awesome-icon :icon="['fas', 'sitemap']" />Categories</router-link> 
                    </li>
                    <li>
                        <router-link to="/banners"><font-awesome-icon :icon="['fas', 'images']" />Banners</router-link> 
                    </li>
                    <li>
                        <router-link :to="{ name: 'Orders', query: { page: 1 }}">
                            <font-awesome-icon :icon="['fas','file-invoice']"/> Orders
                        </router-link>
                    </li>
                     <li>
                        <router-link to="/city"><font-awesome-icon :icon="['fas', 'city']" />Cities</router-link> 
                    </li>
                </ul>
            </nav>
        </div>
        <nav class="menu">
            <router-link to="/"><h1>CMS</h1></router-link>
            <button class="hamburger-menu" aria-label="Main Menu" @click="openMenu()" :class="{ 'opened' : mobileMenu }">
                <svg width="50" height="50" viewBox="0 0 100 100">
                    <path class="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                    <path class="line line2" d="M 20,50 H 80" />
                    <path class="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                </svg>
            </button>
        </nav>
        <div class="mobile-menu-overlay" v-if="mobileMenu"></div>
        <div class="mobile-menu-container" :class="{ 'show' : mobileMenu }">
            <nav class="mobile-menu">
                <h1 class="mb-20">LEZADA CMS</h1>
                <ul>
                    <li><router-link to="/dashboard"><font-awesome-icon :icon="['fas', 'home']" />Dashboard</router-link></li>
                    <li><router-link to="/products" ><font-awesome-icon :icon="['fas', 'tshirt']" />Products</router-link> </li>
                    <li><router-link to="/users"><font-awesome-icon :icon="['fas', 'users']" />Users</router-link> </li>
                    <li><router-link to="/coupons"><font-awesome-icon :icon="['fas', 'tags']" />Coupons</router-link></li>
                    <li><router-link to="/categories" ><font-awesome-icon :icon="['fas', 'sitemap']" />Categories</router-link></li>
                    <li><router-link to="/banners"><font-awesome-icon :icon="['fas', 'images']" />Banners</router-link>
                    <li>
                        <router-link :to="{ name: 'Orders', query: { page: 1 }}">
                            <font-awesome-icon :icon="['fas','file-invoice']"/> Orders
                        </router-link>
                    </li>
                    <li @click="logout"><a><font-awesome-icon :icon="['fas', 'sign-out-alt']" /> Sign out</a></li>

                </ul>
            </nav>
        </div>
    </div>
</template>
<script>
    import axios from "axios";
    import io from 'socket.io-client';
    export default {
        data() {
            return { 
                userMenu: false,
                userFullName: "",
                roomsLength: 0,
                socket: io('localhost:8989', { transports: ['websocket', 'polling', 'flashsocket'] }),
                mobileMenu: false,
            };
        },
        methods: {
            logout() {
                axios.delete("login").then(() => {
                    localStorage.clear();
                    this.$router.push("/");
                });
            },
            openMenu: function(){
                this.mobileMenu = !this.mobileMenu;
            }
        },
        created(){
            this.socket.emit('rooms');
            this.socket.on('rooms', (data) => { this.roomsLength = data.length; });

            const user = JSON.parse(localStorage.getItem("currentUser"));
            this.userFullName = user.first_name + " " + user.last_name
        }
    };
</script>