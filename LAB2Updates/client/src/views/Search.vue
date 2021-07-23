<template>
    <div>
        <PageBanner />
        <div class="search-header">
            <div class="main-container">
                <div class="search-items">
                    <p class="showing-result">Page {{ page}}  of {{pageCount}}  with  {{totalProducts}} products found</p>
                    <div class="product-showing">
                        <p class="showing-result">Show</p>
                        <select class="select-field"  @change="onPageChange($event)" name="show-per-page">
                            <option selected value="12">12</option>
                            <option value="24">24</option>
                        </select>
                        <p class="showing-result">per page</p>
                    </div>
                    <div class="product-showing">
                        <p class="showing-result">Sort by</p>
                        <select class="select-field" name="sort-by"  @change="onSort($event)" >
                            <option value="asc">Price, low to high</option>
                            <option value="desc">Price, high to low</option>
                        </select>
                    </div>
                </div>
                <div class="search-filter">
                    <div class="product-showing">
                        <p class="filter-text">Sort by</p>
                        <select class="select-field" name="sort-by">
                            <option value="ft">Featured</option>
                            <option selected value="bs">Best selling</option>
                            <option value="lth">Price, low to high</option>
                            <option value="htl">Price, high to low</option>
                        </select>
                    </div>
                    <p class="filter-text" id="open-filters"><i class="flaticon-filter"></i> Filters</p>
                </div>
            </div>
        </div>

        <div class="main-container">
            <div class="search-divider">
                <div class="search">
                    <h2 class="title">Search</h2>
                    <form @submit.prevent="search">
                        <div class="search-form-container">
                            <input type="text" placeholder="Search our store" v-model="searchFilter" />
                            <button type="submit" name="search-button"><i class="flaticon-loupe"></i></button>
                        </div>
                    </form>
                    <div v-for="c in categories" :key="c._id">
                        <h2 class="title">{{ c.name }}</h2>
                        <ul>
                            <li v-for="c1 in c.children" :key="c1._id" :class="{'activeCategory':c1._id == category}">
                                <router-link :to="{ name: 'Search', query: { category: c1._id , page :1 , gender: gender, changed: true} }">{{c1.name}}</router-link>
                            </li>
                        </ul>
                    </div>
                    <div class="pb-20">
                        <h2 class="title">Gender</h2>
                        <div class="sizes">
                            <router-link :to="{ name: 'Search', query: {keyword:searchFilter , category: category , page :1 , gender: '', changed: true} }"><p  :class="{'activeGender': '' == gender }"> ALL </p></router-link>
                            <router-link :to="{ name: 'Search', query: {keyword:searchFilter , category: category , page :1 , gender: 'F', changed: true} }"><p :class="{'activeGender': 'F' == gender }"> F</p></router-link>
                            <router-link :to="{ name: 'Search', query: { keyword:searchFilter , category: category , page :1 , gender: 'M', changed: true} }"><p :class="{'activeGender': 'M' == gender }"> M</p></router-link>
                        </div>
                    </div>
                    <div>
                        <h2 class="title">Price Range</h2>
                        <vue-slider :silent="true" v-if="this.value[0] && this.value[1]" :disabled="this.minMax[0] == this.minMax[1]" ref='slider' v-model="value" :interval="0.01" :lazy="true" :min='minMax[0]' :max='minMax[1]' ></vue-slider>
                        <p>{{value[0]}} &euro; - {{value[1]}} &euro;</p>
                    </div>
                </div>
                <div class="search-results">
                    <div class="products-container">
                        <div class="products">
                            <p v-if="totalProducts == 0">Sorry, no products found!</p>
                            <div v-else class="item" v-for="p in products" v-bind:key="p._id">
                                <div>
                                    <router-link :to="{ name: 'Product', params: { id: p._id } }"><a href="javascript:void(0)">
                                        <img :src="require('../assets/products/' + p.photos[0].photo_name)" />
                                    </a></router-link>
                                    <div class="left" v-if="p.quantity > 0">
                                        <span class="onsale" v-if="p.sale_status != null" v-text="p.sale_status"></span>
                                        <span class="onsale" v-if="p.discount > 0">-{{ (p.discount / 100).toFixed(0) }}%</span>
                                    </div>
                                    <div class="left" v-else>
                                        <span class="soldout">SOLDOUT</span>
                                    </div>
                                    <div class="right">
                                        <button type="button" class="wishlist" @click="addWishlist(p._id, $event)"><i :class="(existsWishlist(p._id) ? 'flaticon-close' : 'flaticon-like')"></i></button>
                                    </div>
                                </div>
                                <div class="content">
                                    <div class="position-relative">
                                        <h3 class="title" v-text="p.title"></h3>
                                        <button type="button" class="buy" @click="addCart(p._id, 1)" v-if="p.quantity > 0">+  Add to cart</button>
                                        <button type="button" class="buy soldout" v-else>-  Soldout</button>
                                    </div>
                                    <div class="price" v-if="p.discount > 0">
                                        <span>{{ ((p.price / 100) * (1 - (p.discount / 10000))).toFixed(2) }} &euro;</span>
                                        <span class="discount">{{ (p.price / 100).toFixed(2) }} &euro;</span>
                                    </div>
                                    <div class="price" v-else>
                                        <span>{{ (p.price / 100).toFixed(2) }} &euro;</span>
                                    </div>
                                </div>
                            </div>
                            <Pagination v-if="totalProducts > visibleItemsPerPageCount"
                            :current-page = "page"
                            :page-count = "pageCount"
                            class="search-pagination"
                            @nextPage="changeRoute"
                            @previousPage="changeRoute"
                            @loadPage="changeRoute"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PageBanner from "../components/PageBanner.vue";
import axios from 'axios'
import Pagination from "../components/Pagination.vue"
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

export default {
    name: 'Login',
    components: {
        PageBanner,
        Pagination,
        VueSlider
    },
    props: {
        page: { type: Number, default: 1 },
        keyword: { type: String, default: null },
        category: { type: String, default: null },
        gender: { type: String, default: null },
        priceStart: { type: Number, default: 0 },
        priceEnd: { type: Number, default: 0 },
        changed: { type: Boolean, default: false }
    },
    data(){
        return{
            products: [],
            categories: '',
            totalProducts:0,
            visibleItemsPerPageCount:12,
            pageCount:0,
            showCategories: false,
            sortByPrice:'asc',
            value: [],
            minMax: [],
            numberOfAjaxCAllPending: 0
        }
    },
    watch: {
        $route () {
            this.populatePage()
        },
        value(){
            this.changeRoute();
        }
    },
    created(){
        this.populatePage();
        this.populateCategory()
    },
    methods:{
        async populatePage(){
            var filter = {
                keyword: this.keyword,
                category: this.category,
                page: this.visibleItemsPerPageCount * (this.page - 1),
                limit: this.visibleItemsPerPageCount,
                price: this.sortByPrice,
                gender : this.gender,
                priceRange: [this.value[0], this.value[1]]
            }
            if(this.changed) filter.priceRange = [];
            
            await axios.post('/api/products/search/', filter).then( res => {
                if(res.data.products !== undefined && res.data.products.length > 0){
                    if((res.data.minMax[0].minValue / 100) != this.minMax[0] && (res.data.minMax[0].maxValue / 100) != this.minMax[1]){
                        this.value = [res.data.minMax[0].minValue / 100, res.data.minMax[0].maxValue / 100];
                    }
                    this.minMax = [res.data.minMax[0].minValue / 100, res.data.minMax[0].maxValue / 100];
                    this.totalProducts = res.data.total;
                    this.pageCount = Math.ceil(res.data.total / this.visibleItemsPerPageCount);
                    this.products = res.data.products;
                }else this.totalProducts = 0;
            });
        },
        async populateCategory(){
            const categories = await axios.get('/api/category', {
                params: {
                    parentId: "0"
                }
            });
            this.categories = categories.data[0].children;
        },
        changeRoute(page = 1){
            this.$router.push({
                name: 'Search',
                query: { keyword:this.searchFilter,category: this.category, gender: this.gender, page: page,priceStart: this.value[0], priceEnd: this.value[1] },
            });
        },
        onPageChange(){
            this.visibleItemsPerPageCount = parseInt(event.target.value);
            this.populatePage();
        },
        onSort(event){
            this.sortByPrice = event.target.value;
            this.populatePage();
        },
        search(){
            this.changeRoute();
        }
    },
}
</script>
<style>
.search-divider>div.search .sizes a p{
    color: #ababab;
    font-size: 16px;
    width: 38px;
    height: 40px;
    text-align: center;
    line-height: 38px;
    background: transparent;
    outline: none;
    cursor: pointer;
    transition: all .5s;
    margin-left:-2px;
}
</style>