<template>
    <div>
       <PageBanner />
        <div class="main-container">
            <div class="single-product">
                <div class="gallery">
                    <div class="images slider-image">
                        <div class="test12">
                            <img :src="getImgPath(photo)"/>
                            <div class="left" v-if="product.quantity > 0">
                                <span class="onsale" v-if="this.product.sale_status">{{ this.product.sale_status }}</span>
                                <span class="onsale" v-if="this.product.discount > 0">-{{ (product.discount / 100).toFixed(0) }}%</span>
                            </div>
                            <div class="left" v-else>
                                <span class="soldout">Soldout</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="product-content">
                    <div class="review_icons">
                        <div class="rating">
                            <ul class="list">
                                <li v-for="star in 5" :class="{ 'active': star <= reviewRate }" :key="star[reviewRate]" class="star usr-review">
                                    <font-awesome-icon :icon="['fas', 'star']" />
                                </li>
                            </ul>
                        </div>
                        <span class="review">{{ reviews.length }} reviews</span>
                    </div>
                    <div class="product_name">
                        <h2>{{ this.product.title }}</h2>
                    </div>
                    <div class="product_price">
                        <span class="price" v-if="this.product.discount > 0">{{ ((this.product.price / 100) * (1 - (this.product.discount / 10000))).toFixed(2) }} &euro;</span>
                        <span class="price" v-else>{{ (this.product.price/100).toFixed(2) }} &euro;</span>
                    </div>
                    <div class="desc">{{ this.product.desc }}</div>
                    <div class="size">
                        <span class="header">Size : </span>
                        <span class="size-type">{{ this.product.size }}</span>
                    </div>
                    <div class="quantity">
                        <span class="header">Quantity : </span>
                        <div class="product-quantity">
                            <span class="quantity-dec" @click="addQuantity(quantityValue, 1)"> - </span>
                            <input type="text" readonly name="quanity-val" class="quanity-val" v-model="quantityValue">
                            <span class="quantity-inc" @click="removeQuantity(quantityValue, product.quantity)"> + </span>
                        </div>
                    </div>
                    <div class="add-buttons">
                        <button type="button" id="addToCart" @click="addCart(product._id, quantityValue)" :class="(product.quantity > 0 ? 'addToCart' : 'addToCart disabled')">add to cart</button>
                        <button type="button" @click="addWishlist(product._id, $event)" class="single-wishlist wishlist"><i :class="(existsWishlist(product._id) ? 'flaticon-close' : 'flaticon-like')"></i></button>
                    </div>
                    <div class="buy-button">
                        <button @click="buyProductNow(product._id)" :class="(product.quantity > 0 ? 'buyNow' : 'buyNow disabled')" type="button" >buy it now</button>
                    </div>
                </div>
            </div>

            <div class="description-reviews">
					<div class="tablist">
						<a class="tabs" href="javascript:void(0)" :class="{ 'active': !activeTab }" @click="chngActiveTab(false)">Description</a>
						<a class="tabs" href="javascript:void(0)" :class="{ 'active': activeTab }" @click="chngActiveTab(true)">Reviews</a>
					</div>
					<div class="contents width100">
						<div id="prod-desc" v-if="!activeTab">
							<p>{{ product.desc }}</p>
						</div>
						<div id="prod-review" v-else-if="activeTab">
							<div id="new-review">
                                <div class="review row-spbt-center" :class="{ 'new-rev': newReview }">
									<span class="title">Latest costumers reviews</span>
                                    <button class="blackBtn" @click="newReview = !newReview" v-if="loggedin">Write a review</button>
                                </div>
                                <p v-if="alert.show" class="alert" :class="{ 'success': alert.type }">{{ alert.msg }}</p>
                                <form v-on:submit.prevent="submitReview" autocomplete="off" v-if="newReview">
                                    <div class="review info">
                                        <div class="input-fields">
                                            <input type="text" name="review-title" v-model="review.title" />
                                            <span class="input-placeholder">Title</span>
                                        </div>
                                        <div class="rate-container">
                                            <p class="rate-title">Rating</p>
                                            <div class="rating">
                                                <ul class="list">
                                                    <li @click="rate(star)" v-for="star in 5" :class="{ 'active': star <= review.stars }" :key="star[review.stars]" class="star">
                                                        <font-awesome-icon :icon="['fas', 'star']" />
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="input-fields">
                                            <textarea type="text" name="review-msg" rows="8" v-model="review.message"></textarea>
                                            <span class="input-placeholder">Message</span>
                                        </div>
                                        <div class="submit-review">
                                            <button class="blackBtn f-cont" type="submit">Submit review</button>
                                        </div>
                                    </div>
                                </form>
							</div>
							<div v-if="reviews.length == 0">
								<div class="review row-spbt-center">
									<span class="title">No reviews yet.</span>
								</div>
                            </div>
                            <div v-else>
								<div class="review" v-for="r in reviews" :key="r._id">
									<div class="review_icons">
										<!-- <i class="flaticon-star" v-for="n in r.rated" :key="n[r.rated]"></i> -->
                                        <div class="rating">
                                            <ul class="list">
                                                <li v-for="star in 5" :class="{ 'active': star <= r.rated }" :key="star[r.rated._id]" class="star usr-review">
                                                    <font-awesome-icon :icon="['fas', 'star']" />
                                                </li>
                                            </ul>
                                        </div>
									</div>
									<span class="title"> {{ r.title }} </span>
									<span class="by-date">
                                        <strong> {{ r.posted_by.first_name + " " + r.posted_by.last_name }} </strong> on 
                                        <strong> {{ new Date(r.created_at).toLocaleString() }} </strong>
                                    </span>
									<div class="message">
										<p> {{ r.desc }} </p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

            <RelatedProducts />
        </div>
    </div>
</template>

<script>
import PageBanner from "../components/PageBanner.vue";
import RelatedProducts from "../components/RelatedProducts.vue"
import axios from 'axios';

export default {
	name:'Product',
    data() {
        return {
            product: {},
            quantityValue: 1,
            photo: "",
            activeTab: false,
            reviews: [],
            review: {
                title: '',
                message: '',
                stars: 0,
            },
            newReview: false,
            loggedin: localStorage.getItem('currentUser') ? true: false,
            alert: {
                show: false,
                type: true,
                msg: ""
            },
            reviewRate: 0
        }
    },
    components: {
        PageBanner,
        RelatedProducts
    },
    // when route changes and this component is already rendered,
    // the logic will be slightly different.
    watch: {
        $route () {
            this.getProduct(this.$route.params.id, (err, product) => {
                if (err) this.error = err.toString()
                else this.product = product
            })
        }
    },
    created(){
		this.getProduct(this.$route.params.id);
        this.getReviews();
    },
	methods:{
        async getProduct(id){
			await axios.get('api/products/'+id).then(response => {
				this.product = response.data;
                this.photo = this.product.photos[0].photo_name
			})
		},
        addQuantity: function (value, min){
            if(value > min) this.quantityValue = value - 1;
        },
        removeQuantity: function (value, max){
            if(value < max) this.quantityValue = value + 1;
        },
        getImgPath (name) {
            return name ? require('../assets/products/'+name) : ''
        },
        buyProductNow: function (id){
            this.addCart(id, this.quantityValue)
            window.location.href='/Checkout';
        },
        chngActiveTab: function(type){
            type == this.activeTab ? null : this.activeTab = !this.activeTab;
        },
        getReviews: async function (){
            this.reviews = await axios.get("api/review/"+ this.$route.params.id).then(response => response.data); 
            this.reviewRate = Math.ceil(this.reviews.reduce((sum,item) => sum + item.rated, 0) / this.reviews.length)
        },
        rate(star) {
            if (star <= 5 && star >= 0) this.review.stars = this.review.stars === star ? star - 1 : star
        },
        submitReview: async function(){
            const res = await axios.post("api/review/", {
                title: this.review.title,
                desc: this.review.message,
                product_id: this.$route.params.id,
                rated: this.review.stars
            }).then(response => response.data);
            this.alert.show = true; 
            if(res == "error") { 
                this.alert.type = false; 
                this.alert.msg = "Couldn't post review, please try again.";
            }else {
                this.reviews.unshift(res); 
                this.newReview = false;
                this.review = {
                    title: '',
                    message: '',
                    stars: 0,
                }
                this.alert.type = true;
                this.alert.msg = "Review posted successfully.";
            }
        }
	}
}
</script>

<style scoped>
    h1{
        padding-top:250px;
    }
    .test12{
        
        width: 440px;
        position: relative;left: 0px;top: 0px;z-index: 999;opacity: 1;
    }
    .test12 img{
        width:100%;
    }
    .left{
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 20px;
        left: 20px;
    }
    .left span{
        text-transform: uppercase;
        transition: all 250ms ease-out;
        color: #fff;
        text-align: center;
        pointer-events: none;
        cursor: default;
    }
</style>