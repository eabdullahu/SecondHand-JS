<template>
    <div v-if="Object.keys(product).length != 0">
        <div class="prod-details m-t-20">
            <div class="one-details" v-if=' product.photos && product.photos.length > 0 '>
                <div class="image-container"> <img :src="getImageUrl(product.photos[0].photo_name )" /> </div>
            </div>
            
                <div class="text-container">
                    <p class="title">{{ product.title }}</p>
                    <p class="desc">{{ product.desc }}</p>
                    <div>
                        <p class="badge outline-badge-red">Size :{{ product.size }}</p>
                        <p class="badge outline-badge-blue">Quantity:  {{ product.quantity }}</p>
                        <p v-if = "product.is_active == true" class="badge outline-badge-green">Is vissible? {{ product.is_active }}</p>
                        <p v-else class="badge outline-badge-red">Is vissible? {{ product.is_active }}</p>
                        <p class="badge outline-badge-purple" v-if=' product.category && product.category.length > 0 '>Category:  {{ product.category.name }}</p>

                    </div>
                    <p @click="changeStatus" class="click">Click here to change product visibility</p>
                    <p>Posted by: {{ user_name }} {{ user_lastname}}</p>
                </div>
        </div>
        <div class="container  m-t-20 disp-flex-row">
            <div class=" fitContent"><h2>Product Reviews : </h2></div>
            <div class="inputContainer reviews-container">
                <div class="responsiveTable">
                    <product-reviews :reviews="reviews" :no_review="noReviews"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import ProductReviews from "../components/product_reviews";
export default {
    name: 'Product',
    data() {
        return {
            product: {
                posted_by: {
                    email: "test"
                }
            },
            quantityValue: 1,
            photo: "",
            user_name: null,
            user_lastname: null,
            reviews: [],
            noReview: false,
            noReviews: false
        }
    },
    components: {
        ProductReviews
    },
    created() {
        this.getProduct(this.$route.params.id);
    },
    methods: {
        async getProduct(id) {
            await axios.get('admin-api/products/' + id).then(response => {
                console.log(response);
                this.product = response.data.searched_product;
                this.photo = this.product.photos[0].photo_name
                this.user_name = response.data.searched_product.posted_by.first_name
                this.user_lastname = response.data.searched_product.posted_by.last_name
                this.reviews = response.data.reviews;
                this.noReview = true
            })
        },
        async changeStatus() {
            await  axios.patch('admin-api/products/' + this.product._id, {'is_active': !this.product.is_active}).then(response => {
                console.log(response)
                this.getProduct( this.product._id)
                if(response.data.message == "updated"){
                    this.$toast.open({
                        message: 'Status has been changed!',
                        type: 'success',
                    });
                    this.getUsers();
                    setTimeout(() => this.userDetails.show = false, 500)

                }else {
                    this.$toast.open({
                        message: 'Try again later!',
                        type: 'error',
                    });
                }
            })
        },
        getImageUrl(name){
            if(name) return require("../../../client/src/assets/products/" + name);
        }
    }
}
</script>

<style scoped>

.disp-flex-row {
    flex-direction: row !important;
    justify-content: space-between;
    align-items: center;
}
.fitContent{
    width:fit-content
}
.invoice-btn{
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
}
.m-r-20{
    margin-right: 20px !important;
}
.cancel_message{
    width: fit-content;
    margin: 80px auto;
    padding: 10px;
    font-size:16px;

}
</style>