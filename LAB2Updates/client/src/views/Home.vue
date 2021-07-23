<template>
    <div id="homepage">
        <Slider />
        <div class="main-container">
            <MainCategories />
            <div class="products-container" v-if="products.length > 0">
                <div class="align-center">
                    <h2 class="title">New arriwal collection</h2>
                    <p class="description">Find your style of arrival collection</p>
                </div>
                <div class="products">
                    <div class="item" v-for="p in products" v-bind:key="p._id">
                        <div>
                            <router-link :to="{ name: 'Product', params: { id: p._id } }">
                                <img :src="require('../assets/products/' + p.photos[0].photo_name)" />
                            </router-link>
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
                                <button type="button" class="buy" v-if="p.quantity > 0" @click="addCart(p._id, 1)">+  Add to cart</button>
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
                    <div class="align-center width100">
                        <router-link :to="{ name: 'Search' }">+ Show More..</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Slider from "../components/Slider.vue";
    import MainCategories from "../components/MainCategories.vue";
    import axios from 'axios';
    export default {
        name: "homepage",
        data() {
            return {
                products: []
            }
        },
        components: {
            Slider,
            MainCategories
        },
        mounted: async function(){
            const dbproducts = await axios.get("/api/products/products_homepage", {
                params: {
                    limit: 8
                }
            });
            this.products = dbproducts.data;
        }
    };
</script>