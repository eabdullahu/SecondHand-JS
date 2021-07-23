<template>
    <div>
        <div id="shopping-overlay" :class="{ 'show' : isShown }"></div>
        <div id="shopping-container" :class="{ 'show' : isShown }">
            <div class="heading">
                <span class="title">Cart</span>
                <span class="indicator-container" @click="setShown(false)"><i class="flaticon-close"></i></span>
            </div>
            <div class="shopping-products">
                <div class='shopping-single-product' v-for="p in cartProducts" :key="p._id">
                    <span class='remove-product' @click="removeCart(p._id)"><i class='flaticon-close'></i></span>
                    <router-link :to="{ name: 'Product', params: { id: p._id } }">
                        <img :src="require('../assets/products/' + p.product.photos[0].photo_name)" />
                    </router-link>
                    <div class='name-content'>
                        <router-link :to="{ name: 'Product', params: { id: p._id } }">
                            <span class='shopping-name' v-text="p.product.title"></span>
                            <p>
                                <span class='cart-count'>{{ p.quantity }} x</span>
                                <span class='product-price' v-if="p.product.discount > 0"> {{ ((p.product.price / 100) * (1 - (p.product.discount / 10000))).toFixed(2) }} &euro;</span>
                                <span class='product-price' v-else> {{ (p.product.price / 100).toFixed(2) }} &euro;</span>
                            </p>
                        </router-link>
                    </div>
                </div>
                <div id="shopping-cart-prices" v-if="cartProducts.length > 0">
                    <!-- <div class="sub-total">
                        <span>Subotal: </span>
                        <span id="cart-total-price">{{ cartProducts.reduce((sum,item) => sum + (item.product.price / 100) * item.quantity, 0).toFixed(2) }} &euro;</span>
                    </div>
                    <div class="discount">
                        <span>Discount: </span>
                        <span id="cart-total-price">{{ cartProducts.reduce((sum,item) => sum + (item.product.price / 100) * item.quantity, 0).toFixed(2) }} &euro;</span>
                    </div> -->
                    <div class="cart-total">
                        <span>Total: </span>
                        <span id="cart-total-price">{{ cartProducts.reduce((sum,item) => sum + (item.product.price / 100) * item.quantity, 0).toFixed(2) }} &euro;</span>
                    </div>
                    <div style="height: 30px;"></div>
                    <a href="/Checkout" class="shopping-buttons shopping-checkout">Checkout</a>
                    <a href="/Cart" class="shopping-buttons shopping-view-cart">View cart</a>
                </div>
                <div class="cart-total cart-empty" id="shopping-cart-empty" v-else>
                    <span><i class="flaticon-shopping-cart"></i>&nbsp; Your shopping cart is empty.</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default ({
        name: "Cart"
    });
</script>
