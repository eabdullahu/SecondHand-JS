<template>
        <header>
            <nav class="menu">
                <router-link to="/">
                    <img :src="require('./../assets/logo.png')"/>
                </router-link>
                 <button class="hamburger-menu" aria-label="Main Menu" @click="openMenu()" :class="{ 'opened' : mobileMenu }">
                    <svg width="50" height="50" viewBox="0 0 100 100">
                        <path class="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                        <path class="line line2" d="M 20,50 H 80" />
                        <path class="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                    </svg>
                </button>
                <ul class="menu">
                    <li><router-link to="/">Homepage</router-link></li>

                    <li class="dropdown" v-for="c in categories" :key="c._id">
                        <a href="javascript:void(0)">{{ c.name }}<i class="flaticon-down-arrow"></i></a>
                        <ul class="dropdown-items" v-if="c.children">
                            <li class="inner" v-for="c1 in c.children" :key="c1._id">
                                <ul>
                                    <li><a class="title" href="javascript:void(0)">{{ c1.name }}</a></li>
                                    <li v-on:click="clearFilter" v-for="c2 in c1.children" :key="c2._id">
                                        <router-link :to="{ name: 'Search', query: {  keyword: '' ,category: c2._id ,page: 1 } }">{{c2.name}}</router-link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li><router-link to="/aboutUs">Aboutus</router-link></li>
                    <li><router-link to="/contact">Contact</router-link></li>
                </ul>
                <div class="icons">
                    <div>
                        <div class="search-form-header">
                            <form  @submit.prevent="searchItems">
                                <input v-model="searchFilter" type="text" placeholder="Search our store" />
                                <button type="submit" name="submit-search"><i class="flaticon-loupe"></i></button>
                            </form>
                        </div>
                    </div>
                    <div>
                        <router-link to="/Login">
                            <i class="flaticon-user"></i> 
                        </router-link> 
                    </div>
                    <div>
                        <a href="javascript:void(0)">
                            <router-link to="/Wishlist"><i class="flaticon-heart"></i></router-link> 
                        </a>
                    </div>
                    <div class="indicator-container" @click="setShown(!isShown);">
                        <i class="flaticon-shopping-cart"></i>
                        <span class="indicator">{{ cartProducts.length }}</span>
                    </div>
                </div>
                
                <div class="mobile-menu-overlay" v-if="mobileMenu"></div>
                <div class="mobile-menu-container" :class="{ 'show' : mobileMenu }">
                    <div class="search-form-header">
                        <form action="" method="get">
                            <input type="text" placeholder="Search our store" name="search-products" />
                            <button type="button" name="submit-search" id="submit-search"><i class="flaticon-loupe"></i></button>
                        </form>
                    </div>
                    <div class="icons display-flex">
                        <div>
                            <a href="/login">
                                <i class="flaticon-user"></i>
                            </a>
                        </div>
                        <div>
                            <a href="/Wishlist">
                                <i class="flaticon-heart"></i>
                            </a>
                        </div>
                        <div class="indicator-container" @click="setShown(!isShown);">
                            <i class="flaticon-shopping-cart"></i>
                            <span class="indicator">{{ cartProducts.length }}</span>
                        </div>
                    </div>
                    <nav class="mobile-menu">
                        <ul>
                            <li><a href="/">Homepage</a></li>
                            <li class="menu-has-children">
                                <a href="javascript:void(0)">Kategoritë</a>
                                <span class="flaticon-remove close-open"></span>
                                <ul class="sub-menu">
                                    <li class="menu-has-children">
                                        <ul class="sub-menu">
                                            <li v-for="c in categories" :key="c._id">
                                                <a href="javascript:void(0)"><router-link :to="{ name: 'Search', query: { category: c.name } }">{{c.name}}</router-link></a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                    <div class="mobile-social-media">
                        <a href="javascript-void"><i class="flaticon-facebook"></i></a>
                        <a href="javascript-void"><i class="flaticon-instagram"></i></a>
                        <a href="javascript-void"><i class="flaticon-twitter"></i></a>
                        <a href="javascript-void"><i class="flaticon-youtube"></i></a>
                    </div>
                </div>
            </nav>
        </header>
</template>
<script>
import axios from 'axios'
export default{
    name: 'Header',
    data(){
        return{
            categories: '',
            searchItem: '',
            mobileMenu: false,
            category:''
        }
    },
    created(){
        this.populateHeaders()
        this.getCartData();
    },
    watch: {
        $route () {
            this.searchItem = this.$route.params.title
            this.category = this.$route.query.category
        }
    },
    methods:{
        async populateHeaders(){
            const categories = await axios.get('/api/category', {
                params: {
                    is_active: true,
                    parentId: 0
                }
            });
            this.categories = categories.data;
        },
        searchItems(){
            if(this.$route.query.keyword != this.searchFilter ) this.$router.push({ name:"Search", query: { keyword: this.searchFilter, page:1 }});
            console.log(this.$route)

        },
        openMenu: function(){
            this.mobileMenu = !this.mobileMenu;
        }
    }
    
}
</script>