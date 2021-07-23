import axios from 'axios';
import { store, mutations } from "./Store";

const Cart = {
    install(Vue) {
        Vue.mixin({
            computed: {
                isShown() {
                    return store.isShown;
                },
                cartProducts() {
                    return store.cartProducts;
                },
                productsQuantity(){
                    return store.productsQuantity
                }
            },
            methods: {
                setShown: mutations.setShown,
                setProducts: mutations.setProducts,
                updateCart: mutations.updateCart,
                getCartData: async function(){
                    const prod = await axios.get("/api/products/session-products").then(response => response.data);
                    this.setProducts(prod);
                    this.refreshBinding(prod);
                },
                addCart: async function(_id, quantity){
                    const prod = await axios.post("/api/products/session-products", {
                        product_id: _id,
                        quantity: quantity
                    });
                    this.setProducts(prod.data);
                    this.setShown(true);
                    this.refreshBinding(prod.data);
                },
                removeCart: async function(_id, conf=false){
                    if(conf){
                        if(confirm("Do you really want to delete?")){
                            const prod = await axios.delete("/api/products/session-products/"+_id);
                            this.setProducts(prod.data);
                            this.refreshBinding(prod.data);
                        }
                    }else {
                        const prod = await axios.delete("/api/products/session-products/"+_id);
                        this.setProducts(prod.data);
                        this.refreshBinding(prod.data);
                    }
                },
                updateCartQuantity: async function(){
                    const prod = await axios.post("/api/products/update-session-products", {
                        update_products: this.productsQuantity
                    });
                    this.setProducts(prod.data);
                },
                refreshBinding: function (data){
                    var _this = this;
                    if(data.length > 0) {
                        data.forEach(function(item){
                            _this.updateCart(item._id, item.quantity);
                        });
                    }
                }
            }
        });
    }
}
export default Cart;