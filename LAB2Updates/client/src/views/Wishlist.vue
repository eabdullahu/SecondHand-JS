<template>
    <div id="Wishlist">
        <PageBanner />
        <div class="main-container">
            <div class="products-container">
                <transition-group name="list" tag="div" class="products" v-if="showProducts">
                    <div class="item" v-for="(p, index) in products" v-bind:key="p._id">
                        <div>
                            <a href="#">
                                <img :src="require('../assets/products/' + p.photos[0].photo_name)" />
                            </a>
                            <div class="left" v-if="p.quantity > 0">
                                <span class="onsale" v-if="p.sale_status != null" v-text="p.sale_status"></span>
                                <span class="onsale" v-if="p.discount > 0">-{{ (p.discount / 100).toFixed(0) }}%</span>
                            </div>
                            <div class="left" v-else>
                                <span class="soldout">SOLDOUT</span>
                            </div>
                            <div class="right">
                                <button type="button" class="wishlist" @click="addWishlist(p._id, $event); removeElement(index);"><i class="flaticon-close"></i></button>
                            </div>
                        </div>
                        <div class="content">
                            <div class="position-relative">
                                <h3 class="title" v-text="p.title"></h3>
                                <button type="button" class="buy" v-if="p.quantity > 0" @click="addCart(p._id, 1)">+  Add to cart</button>
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
                </transition-group>
                <div class="products" v-else>
                    <div class="align-center width100" id="wishlistEmpty">
                        <a class="show-more" href="javascript:void(0)">Your wishlist is empty.</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .list-item {
        display: inline-block;
        margin-right: 10px;
    }
    .list-enter-active, .list-leave-active {
        transition: all 1s;
    }
    .list-enter, .list-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }
</style>

<script>
    import axios from 'axios';
    import PageBanner from "../components/PageBanner.vue";
    export default ({
        name: "Wishlist",
        components: {
            PageBanner
        },
        data(){
            return {
                products: [],
                showProducts: this.$cookies.isKey("wishlist") ? this.$cookies.get("wishlist")["wishlist"].length > 0 : false
            }
        },
        mounted: function(){
            this.getProducts();
        },
        methods: {
            getProducts: async function(){
                const products = await axios.get("/api/products/product_ids", {
                    params: {
                        product_ids: this.$cookies.isKey("wishlist") ? this.$cookies.get("wishlist")["wishlist"] : []
                    }
                });
                this.products = products.data;
                console.log(this.$cookies.get("wishlist")["wishlist"]);
            },
            removeElement: function(index) {
                setTimeout(() => {
                    if(this.$cookies.isKey("wishlist") && this.$cookies.get("wishlist")["wishlist"].length <= 0){
                        this.showProducts = !this.showProducts;
                    }
                    this.products.splice(index, 1);
                }, 2000);
            }
        }   
    });
</script>
