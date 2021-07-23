const WishlistCookie = {
    install(Vue) {
        Vue.mixin({
            methods: {
                existsWishlist: function(_id){
                    if(this.$cookies.isKey("wishlist")){
                        if(this.$cookies.get("wishlist")){
                            var array = this.$cookies.get("wishlist");
                            if(array["wishlist"].includes(_id)){
                                return true;
                            }
                        }
                    }
                    return false;
                },
                addWishlist: function (_id, event) {
                    event.target.classList.add("flaticon-loading-circle", "added-wishlist");
                    setTimeout(() => {
                        event.target.classList.remove("flaticon-like", "flaticon-close", "flaticon-loading-circle", "added-wishlist");
                        
                        var array = [];
                        if(!this.$cookies.isKey("wishlist")){
                            this.$cookies.set("wishlist", {"wishlist": array});
                        } else {
                            array = this.$cookies.get("wishlist")["wishlist"];
                        }

                        if(array.length > 0 && array.includes(_id)){
                            const index = array.indexOf(_id);    
                            if (index > -1) {
                                array.splice(index, 1);
                            }
                            this.$cookies.set("wishlist", {"wishlist": array});
                            event.target.classList.add("flaticon-like");
                        }else{
                            array.push(_id);
                            this.$cookies.set("wishlist", {"wishlist": array});
                            event.target.classList.add("flaticon-close");
                        }
                    },2000);
                }
            }
        });
    }
}
export default WishlistCookie;