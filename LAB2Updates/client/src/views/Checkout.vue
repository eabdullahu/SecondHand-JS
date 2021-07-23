<template>
    <div class="height100vh" id="Checkout">
        <div class="main-container height100">
            <form v-on:submit.prevent="registerOrder" class="height100" autocomplete="off">
                <div class="checkout-container">
                    <div class="information-container">
                        <a class="ml-5 checkout-logo-pc" href="/">
                            <img :src="require('../assets/logo/logo.png')">
                        </a>
                        <ul class="breadcrumbs">
                            <li><a href="/Cart">Cart</a></li>
                            <li><a href="javascript:void(0)">Information</a></li>
                            <li><a href="javascript:void(0)">Payment</a></li>
                        </ul>
                        <div class="contact-information">
                            <h2>Contact information</h2>
                            <p v-if="!loggedIn.userLogin" class="alert notify">Please login, or we will create an account for you.</p>
                            <div class="info" v-if="!loggedIn.userLogin">
                                <div class="input-fields half">
                                    <input type="text" name="first-name" v-model="$v.form.firstname.$model" :class="{ 'error-checkout': $v.form.firstname.$error }" />
                                    <span class="input-placeholder">First name</span>
                                </div>
                                <div class="input-fields half">
                                    <input type="text" name="last-name" v-model="$v.form.lastname.$model" :class="{ 'error-checkout': $v.form.lastname.$error }" />
                                    <span class="input-placeholder">Last name</span>
                                </div>
                                <div class="input-fields">
                                    <input type="text" name="address" v-model="$v.form.address.$model" :class="{ 'error-checkout': $v.form.address.$error }" />
                                    <span class="input-placeholder">Address</span>
                                </div>
                                <div class="input-fields half">
                                    <input type="text" name="email" v-model="$v.form.email.$model" :class="{ 'error-checkout': $v.form.email.$error }" />
                                    <span class="input-placeholder">Email</span>
                                </div>
                                <div class="input-fields half">
                                    <input type="text" name="phone" v-model="$v.form.phone.$model" :class="{ 'error-checkout': $v.form.phone.$error }" />
                                    <span class="input-placeholder">Phone</span>
                                </div>
                                <div class="input-fields">
                                    <input type="text" name="city" v-model="$v.form.city.$model" :class="{ 'error-checkout': $v.form.city.$error }" />
                                    <span class="input-placeholder">City</span>
                                </div>
                                <div class="input-fields half">
                                    <input type="password" name="password" v-model="$v.form.password.$model" :class="{ 'error-checkout': $v.form.password.$error }" />
                                    <span class="input-placeholder">Password</span>
                                </div>
                                <div class="input-fields half">
                                    <input type="password" name="confirm-password" v-model="$v.form.confirm_passwd.$model" :class="{ 'error-checkout': $v.form.confirm_passwd.$error }" />
                                    <span class="input-placeholder">Confirm password</span>
                                </div>
                            </div>
                            <p class="alert success" v-else>You are logged in as: {{ loggedIn.user.first_name + " " + loggedIn.user.last_name }}</p>

                            <h2 class="shippinginfo">Shipping information</h2>
                            <div class="info">
                                <div class="input-fields">
                                    <input type="text" name="address" v-model="$v.shipping.address.$model" :class="{ 'error-checkout': $v.shipping.address.$error }" />
                                    <span class="input-placeholder">Address</span>
                                </div>
                                <div class="input-fields half">
                                    <input type="text" name="city" v-model="$v.shipping.city.$model" :class="{ 'error-checkout': $v.shipping.city.$error }" />
                                    <span class="input-placeholder">City</span>
                                </div>
                                <div class="input-fields half">
                                    <input type="text" name="phone" v-model="$v.shipping.phone.$model" :class="{ 'error-checkout': $v.shipping.phone.$error }" />
                                    <span class="input-placeholder">Phone</span>
                                </div>
                                <div style="clear: both; height: 30px;"></div>
                                <div class="return-continue">
                                    <a href="/Cart"><i class="flaticon-left-arrow"></i> Return to cart</a>
                                    <button type="submit" name="submit-profile">Continue to payment</button>
                                </div>
                            </div>
                        </div>
                        <footer class="checkout-footer">
                            <p class="copyright-text">All rights reserved EKIPA</p>
                        </footer>
                    </div>
                    <transition name="slide">
                        <div class="cart-container" v-if="(showCart && isMobile()) || !isMobile()">
                            <div class="checkout-products">
                                <div class="product" v-for="(p) in cartProducts" :key="p._id">
                                    <div class="image-quantity">
                                        <img :src="require('../assets/products/' + p.product.photos[0].photo_name)" />
                                        <span class="quantity" v-text="p.quantity"></span>
                                    </div>
                                    <p v-text="p.product.title"></p>
                                    <p class="price" v-if="p.product.discount > 0"> {{ ((p.product.price / 100).toFixed(2) * (1 - (p.product.discount / 10000))).toFixed(2) }} &euro;</p>
                                    <p class="price" v-else> {{ (p.product.price / 100).toFixed(2) * p.quantity }} &euro;</p>
                                </div>

                                <p class="alert m-0 mt-20" v-if="alert.show" :class="alert.type">{{ alert.message }}</p>
                                <form v-on:submit.prevent="useDiscount">
                                    <div class="input-fields" :class="{ 'alertmsg': alert.show }">
                                        <input type="text" name="discount-token" v-model="shipping.discountToken" />
                                        <span class="input-placeholder">Token</span>
                                        <button type="submit">Submit</button>
                                    </div>
                                </form>

                                <div class="subtotal-price">
                                    <p>Subtotal</p>
                                    <p> {{ shipping.order_total }} &euro;</p>
                                </div>
                                <div class="order-discount">
                                    <p>Discount</p>
                                    <p>-{{ (shipping.discount).toFixed(2) }} &euro;</p>
                                </div>
                                <div class="total-price">
                                    <p>Total</p>
                                    <p class="total-checkout-price"> {{ (shipping.order_total - shipping.discount).toFixed(2) }} &euro;</p>
                                </div>
                            </div>
                        </div>
                    </transition>
                    <div class="mobile-top-container">
                        <div class="checkout-mobile-logo">
                            <a class="ml-5" href="index.html">
                                <img :src="require('../assets/logo/logo.png')" />
                            </a>
                        </div>
                        <div class="checkout-mobile-orders">
                            <p @click="openCart();">
                                <i class="flaticon-shopping-cart"></i>
                                <span id="checkout-desc-label">Show order summary &nbsp;</span> 
                                <i id="checkout-up-down-icon" class="flaticon-down-arrow"></i>
                            </p>
                            <h4> {{ shipping.order_total }} &euro;</h4>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { required,email ,minLength,sameAs,maxLength} from 'vuelidate/lib/validators'

    export default {
        name: "Checkout",
        data(){
            return {
                form: {
                    firstname: "",
                    lastname: "",
                    address: "",
                    email: "",
                    phone: "",
                    city: "",
                    password: "",
                    confirm_passwd: ""
                },
                shipping: {
                    address: "",
                    city: "",
                    phone: "",
                    payment_type: "Cash",
                    discount: 0,
                    order_total: 0,
                    discountToken: ""
                },
                loggedIn: {
                    userLogin: false,
                    user: "" 
                },
                showCart: false,
                alert: {}
            }
        },

        async beforeMount (){
            await this.getCartData();

            if(localStorage.getItem('currentUser')){
                var logUser = JSON.parse(localStorage.getItem("currentUser"))
                this.loggedIn.userLogin = true;
                this.loggedIn.user = logUser;
            }

            if(this.cartProducts.length <= 0) window.location.href = '/';
            this.shipping.order_total = this.cartProducts.reduce((sum,item) => sum + (item.product.price / 100) * item.quantity, 0).toFixed(2);
            this.couponUsed();
        },
        methods: {
            couponUsed: async function () {
                const cp = await axios.get("api/coupon/hasCoupon").then(resp => resp.data);
                if(cp) {
                    this.shipping.discount = this.shipping.order_total * (cp.discount / 100)
                    this.alert = { show: true, type: "notify", message: "You are using coupon '" + cp.token + "'" }
                }
            },
            registerOrder: async function (){
                this.$v.$touch();
                if (this.$v.$pending || this.$v.$error) {
                    console.log("here");
                    return;
                }

                var axx;
                if(this.loggedIn.userLogin){
                    axx = await axios.post("/api/orders", {
                        id: this.loggedIn.user._id,
                        shipping: this.shipping
                    }).then(response => response.data);
                }else {
                    axx = await axios.post("/api/orders", {
                        user: this.form,
                        shipping: this.shipping
                    }).then(response => response.data);
                }
                if(axx == "error"){
                    alert("There was an error, please try again!");
                }else if(axx == "emailExists"){
                    alert("This email already exists!");
                }else {
                    alert("Order completed, you will be redirected to homepage");
                    window.location.href = '/';
                }
            },
            openCart: function () {
                this.showCart = !this.showCart;
            },
            isMobile() {
                return screen.width <= 768;
            },
            useDiscount: async function(){
                const cp = await axios.get("api/coupon/" + this.shipping.discountToken).then(resp => resp.data);
                if(cp) {
                    this.shipping.discount = this.shipping.order_total * (cp.discount / 100)
                    this.alert = { show: true, type: "success", message: "You have applied coupon '" + cp.token + "'" }
                }else {
                    this.alert = { show: true, type: "", message: "Coupon: '" + this.shipping.discountToken + "' doesn't exist." }
                }
            }
        },
        validations(){
            if (!this.loggedIn.userLogin) {
                return {
                    form: {
                        firstname: {required, minLength: minLength(4)},
                        lastname: {required, minLength: minLength(2)},
                        address: {required, minLength: minLength(5)},
                        email:  {required, email},
                        phone:{
                            required,
                            maxLength: maxLength(12),
                            valid: function(value) {
                                return /\+[0-9]{11}/.test(value) ;
                            }
                        },
                        city: {required, minLength: minLength(3)},
                        password: {
                            required,
                            minLength: minLength(6),
                            valid: function(value) {
                                const containsUppercase = /[A-Z]/.test(value)
                                const containsLowercase = /[a-z]/.test(value)
                                const containsNumber = /[0-9]/.test(value)
                                const containsSpecial = /[#?.!@$%^&*-]/.test(value)
                                return containsUppercase && containsLowercase && containsNumber && containsSpecial
                            }
                        },
                        confirm_passwd: {required, sameAsPassword: sameAs('password')}
                    },
                    shipping:{
                        address: {required, minLength: minLength(5)},
                        city: {required, minLength: minLength(3)},
                        phone:{
                            required,
                            maxLength: maxLength(12),
                            valid: function(value) {
                                return /\+[0-9]{11}/.test(value) ;
                            }
                        }
                    }
                }
            }else {
                return {
                    shipping:{
                        address: {required, minLength: minLength(5)},
                        city: {required, minLength: minLength(3)},
                        phone:{
                            required,
                            maxLength: maxLength(12),
                            valid: function(value) {
                                return /\+[0-9]{11}/.test(value) ;
                            }
                        }
                    }
                }
            }
        }
    };
</script>

<style scoped>
    .slide-enter-active {
        -moz-transition-duration: 0.5s;
        -webkit-transition-duration: 0.5s;
        -o-transition-duration: 0.5s;
        transition-duration: 0.5s;
        -moz-transition-timing-function: ease-in;
        -webkit-transition-timing-function: ease-in;
        -o-transition-timing-function: ease-in;
        transition-timing-function: ease-in;
    }

    .slide-leave-active {
        -moz-transition-duration: 0.5s;
        -webkit-transition-duration: 0.5s;
        -o-transition-duration: 0.5s;
        transition-duration: 0.5s;
        -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
        -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
        -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
        transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
    }

    .slide-enter-to, .slide-leave {
        max-height: 350px;
        overflow: hidden;
    }

    .slide-enter, .slide-leave-to {
        overflow: hidden;
        max-height: 0;
    }
</style>