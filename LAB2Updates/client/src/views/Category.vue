<template>
    <div>
        <PageBanner />
        <div class="main-container">
            <div class="search-divider">
                <LeftCategory @searchItemEvent="populateSearch($event)"/>
                <div class="search-results">
                    <div class="products-container">
                        <div class="products">
                            <div class="item" v-for="p in products" v-bind:key="p._id">
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
                                        <button type="button" class="buy" v-if="p.quantity > 0">+  Add to cart</button>
                                        <button type="button" class="buy soldout" v-else>-  Soldout</button>
                                    </div>
                                    <div class="price" v-if="p.discount > 0">
                                        <span>{{ (p.price / 100).toFixed(2) * (1 - (p.discount / 10000)).toFixed(2) }} &euro;</span>
                                        <span class="discount">{{ (p.price / 100).toFixed(2) }} &euro;</span>
                                    </div>
                                    <div class="price" v-else>
                                        <span>{{ (p.price / 100).toFixed(2) }} &euro;</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import PageBanner from "../components/PageBanner.vue";
import LeftCategory from "../components/LeftCategory.vue"
export default {
    components: {
        PageBanner,
        LeftCategory
    },
    data(){
        return{
            products: [],
            productCat: '',
            productTitle: ''
        }
    },
    // when route changes and this component is already rendered,
    // the logic will be slightly different.
    watch: {
        $route () {
            this.products = {}
            this.populatePage(this.$route.params.category,this.$route.params.title, (err, product) => {
                if (err) {
                    this.error = err.toString()
                } else {
                    this.product = product
                }
            })
        }
    },
    created(){
        this.productCat = this.$route.params.category
        this.productTitle = this.$route.params.title
        this.populatePage(this.productCat, this.productTitle)
    },
    methods:{
        async populatePage(cat, title){
            var params = {};
            
            if(cat != null && cat != 'all'){
                params.category = cat.trim()
            }
            if(title != null && title != 'all' ){
                params.title = title.trim()
            }
            await axios.get("/api/products/search", {params:params}).then(res=>{
                this.products = res.data
            });

        },

        async populateSearch(title){
            this.populatePage(this.productCat,title);
        }
    }
}
</script>

<style scoped>
    h1{
        padding-top:200px;
    }
</style>