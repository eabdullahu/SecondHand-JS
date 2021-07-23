<template>
    <div>
        <div class="product-container">
            <div class="one-product"  v-for="p in products" v-bind:key='p._id'>
                <div class="image-container"><img :src="getImageUrl(p.photos[0].photo_name )" /> </div>
                <div class="text-product">
                    <p class="font-title">{{ p.title }}</p>
                    <p><span class="font-title">Category: </span> {{  p.category.name }}</p>
                    <p><span class="font-title">Is Visibile?   </span>   
                        <span class="badge outline-badge-green" title="visible" v-if='p.is_active'> True </span>
                        <span class="badge outline-badge-red" title="not visible" v-else>False</span>
                    </p>
                    <span class="badge outline-badge-green stock-av" title="On stock" v-if='p.quantity>0'> Available </span>
                    <span class="badge outline-badge-red stock-out" title="Out of stock" v-else>Sold out</span>
                    <router-link :to="{path:'product/'+ p._id}"><p class="badge outline-badge-blue view-details">VIEW DETAILS</p> </router-link>

                </div>
            </div>

        </div>

    </div>
</template>
<script>
export default {
    name: "products",
    props:{
        products:{
            type: Array
        },
        noProducts:{
            type: Boolean,
            default: true
        },
    },
    methods:{
        getImageUrl(name){
            if(name) return require("../../../client/src/assets/products/" + name);
        },
    }
}
</script>

<style>
    .swal2-show{
            background-color: #060818 !important;
        border: 1px solid #8dbf42 !important;
    }
    #swal2-content{
        color:White !important;
    }
    .swal2-styled.swal2-confirm{
        background:none !important;
        border: 1px solid #e7515a !important;
    }
    .swal2-styled.swal2-cancel{
        background:none !important;
        border: 1px solid #25d5e4 !important;
    }
    .swal2-styled:focus{
        background:none !important;
        border: 1px solid #e7515a !important;
        box-shadow: none !important;
    }
</style>