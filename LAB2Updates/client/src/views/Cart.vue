<template>
    <div id="Cart">
        <PageBanner />
        <div class="main-container">
            <div class="view-cart-container">
                <form v-on:submit.prevent="updateCartQuantity">
                    <table>
                        <thead>
                            <tr>
                                <th colspan="2">Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody v-if="cartProducts.length > 0">
                            <tr v-for="(p, index) in cartProducts" :key="p._id">
                                <td class="image"><img :src="require('../assets/products/' + p.product.photos[0].photo_name)" /></td>
                                <td class="name">
                                    <router-link :to="{ name: 'Product', params: { id: p._id } }" v-text="p.product.title">

                                    </router-link>
                                </td>
                                <td class="price" v-if="p.product.discount > 0"> {{ ((p.product.price / 100) * (1 - (p.product.discount / 10000))).toFixed(2) }} &euro;</td>
                                <td class="price" v-else> {{ (p.product.price / 100).toFixed(2) }} &euro;</td>
                                <td class="quantity">
                                    <div class="product-quantity-shopping-cart">
                                        <div class="product-quantity">
                                            <span class="quantity-dec" @click="addQuantity(index, p.quantity, 1)"> - </span>
                                            <input type="number" readonly autocomplete="off" name="quanityVal[]" class="quanity-val" v-model="productsQuantity[p._id]" />
                                            <span class="quantity-inc" @click="removeQuantity(index, p.quantity, p.product.quantity)"> + </span>
                                        </div>
                                    </div>
                                </td>
                                <td class="price" v-if="p.product.discount > 0"> {{ (p.quantity * (p.product.price / 100) * (1 - (p.product.discount / 10000))).toFixed(2) }} &euro;</td>
                                <td class="price" v-else> {{ (p.product.price / 100).toFixed(2) * p.quantity }} &euro;</td>
                                <td class="remove-from-cart">
                                    <button type="button" class="remove-product-cart" @click="removeCart(p._id, true)"><i class="flaticon-close"></i></button>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr class="align-center"><td colspan="6">Your shopping cart is empty.</td></tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th class="white-space-nowrap" colspan="2">Total: <span id="shopping-total-price"> {{ cartProducts.reduce((sum,item) => sum + (item.product.price / 100).toFixed(2) * item.quantity, 0).toFixed(2) }} </span> &euro;</th>
                                <th class="action-buttons align-right" colspan="4">
                                    <button type="submit" name="updateCart" :disabled="cartProducts.length <= 0">update cart</button>
                                    <button type="button" id="proceedToCheckout" :disabled="cartProducts.length <= 0" @click="sendToCheckout()">proceed to checkout</button>
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    // import axios from 'axios';
    import PageBanner from "../components/PageBanner.vue";
    export default ({
        name: "Cart",
        components: {
            PageBanner
        },
        methods: {
            addQuantity: function (index, value, min){
                if(value > min){
                    this.cartProducts[index].quantity = value-1;
                    this.updateCart(this.cartProducts[index]._id, value-1);
                }
            },
            removeQuantity: function (index, value, max){
                if(value < max){
                    this.cartProducts[index].quantity = value+1;
                    this.updateCart(this.cartProducts[index]._id, value+1);
                }
            },
            sendToCheckout: function (){
                window.location.href='/Checkout';
            }
        }
    });
</script>
