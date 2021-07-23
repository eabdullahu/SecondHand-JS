<template>
    <div class="all-products">
       <div class="my_products toogle_profile">
            <h3>My Products</h3>
            <p>Feel free to edit or delete any of your products</p>
            <div  v-if="this.error==1" class="no-products">
                <div class=""><p>You never posted a product in our page !</p></div> 
                <p class="click-more" @click="postProduct">CLICK HERE TO POST YOUR FIRST PRODUCT</p>
            </div>
            <div class="available_products" v-else>
                <div class="products-container">
                    <div class="products mtb-50">
                        <div class="item" v-for="p in data" :key="p._id">
                            <a href="javascript:void(0)" p-id="1">
                                <div class="available_product">
                                    <img :src="require('../../assets/products/'+p.photo)"/>
                                    <div class="right products-tooltip">
                                        <router-link :to="{ name: 'Edit', params: { id: p._id } }"><span  class="edit-product" aria-label="Edit" data-microtip-position="left" role="tooltip"><font-awesome-icon :icon="['fas','edit']"/></span></router-link>
                                        <button class="delete_product" v-on:click="fadeMeIn(p._id)" type="button" aria-label="Delete" data-microtip-position="left" role="tooltip"><font-awesome-icon :icon="['fas','trash-alt']"/></button>
                                    </div>
                                </div>
                                <div class="content">
                                    <div class="my-product-title">
                                        <h3>{{p.title}}</h3>
                                    </div>
                                    <div class="price">
                                        <span>{{p.price}} &euro;</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="align-center width100" v-if="data.length > visibleItemsPerPageCount">
                           <Pagination 
                                class="base-pagination"
                                :current-page = "currentPage"
                                :page-count = "pageCount"
                                @nextPage="changeRoute"
                                @previousPage="changeRoute"
                                @loadPage="changeRoute"
                           />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isShowing" class="dpop_container" id="delete_msg">
            <div class="delete_popup">
                <div class="dlt_msg">
                    <span class="exit_delete out-msg"><i class="fas fa-times"></i></span>
                    <div class="delete_confirmation">
                        <span><svg id="Capa_1" enable-background="new 0 0 512 512" height="400" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><g><g><path d="m322.962 72.113h-133.924l16.334-57.169c2.528-8.846 10.612-14.944 19.811-14.944h61.634c9.199 0 17.284 6.098 19.811 14.943z" fill="#c6c5ca"/></g></g><g><g><path d="m266.39 0h-41.207c-9.199 0-17.284 6.098-19.811 14.943l-16.334 57.169h41.207l16.334-57.169c2.528-8.845 10.612-14.943 19.811-14.943z" fill="#acabb1"/></g></g><g><g><path d="m78.82 154.527 23.369 300.455c2.503 32.181 29.346 57.018 61.625 57.018h184.373c32.278 0 59.122-24.837 61.625-57.018l23.369-300.455z" fill="#d8d7da"/></g></g><g><g><path d="m158.922 454.982-17.76-228.342h286.41l5.609-72.113h-354.361l23.369 300.455c2.503 32.181 29.347 57.018 61.625 57.018h56.733c-32.279 0-59.122-24.837-61.625-57.018z" fill="#c6c5ca"/></g></g><g><g><path d="m325.39 348.716c-18.409 0-33.333 14.924-33.333 33.333v109.347c0 11.379-9.225 20.604-20.604 20.604h39.137c21.519 0 39.414-16.558 41.083-38.012l6.95-89.354c1.506-19.369-13.805-35.918-33.233-35.918z" fill="#acabb1"/></g></g><g><g><path d="m219.944 491.396v-109.346c0-18.409-14.924-33.333-33.333-33.333-19.428 0-34.74 16.548-33.233 35.918l6.95 89.354c1.668 21.453 19.564 38.011 41.082 38.011h39.137c-11.379 0-20.603-9.225-20.603-20.604z" fill="#acabb1"/></g></g><g><g><path d="m431.131 185.433h-350.262c-17.069 0-30.905-13.837-30.905-30.905 0-17.069 13.837-30.905 30.905-30.905l175.131-10.303 175.131 10.302c17.069 0 30.905 13.837 30.905 30.905 0 17.069-13.837 30.906-30.905 30.906z" fill="#e8e8e8"/></g></g><g><g><path d="m431.131 123.622h-350.262c-17.069 0-30.905-13.837-30.905-30.905 0-17.069 13.837-30.905 30.905-30.905h350.262c17.069 0 30.905 13.837 30.905 30.905 0 17.068-13.837 30.905-30.905 30.905z" fill="#d8d7da"/></g></g><g><g><path d="m128.016 92.716c0-17.069 13.837-30.905 30.905-30.905h-78.052c-17.069 0-30.905 13.837-30.905 30.905s13.837 30.905 30.905 30.905h78.053c-17.069.001-30.906-13.836-30.906-30.905z" fill="#c6c5ca"/></g></g><g><g><path d="m189.17 154.527c0-17.069 13.837-30.905 30.905-30.905v-8.189l-139.206 8.189c-17.069 0-30.905 13.837-30.905 30.905s13.837 30.905 30.905 30.905h139.206c-17.068.001-30.905-13.836-30.905-30.905z" fill="#d8d7da"/></g></g><g><g><g><g><g><ellipse cx="173.951" cy="275.593" fill="#ffa1af" rx="30.274" ry="24.109"/></g></g></g><g><g><g><ellipse cx="338.049" cy="275.593" fill="#ffa1af" rx="30.274" ry="24.109"/></g></g></g><g><g><g><path d="m280.409 257.069c0-15.085-10.928-16.502-24.409-16.502s-24.409 1.417-24.409 16.502 10.928 27.313 24.409 27.313 24.409-12.229 24.409-27.313z" fill="#495560"/></g></g></g></g><g><g><g><path d="m179.013 254.31c-4.142 0-7.5-3.358-7.5-7.5v-12.362c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5v12.362c0 4.142-3.358 7.5-7.5 7.5z" fill="#495560"/></g></g></g><g><g><g><path d="m332.988 254.31c-4.142 0-7.5-3.358-7.5-7.5v-12.362c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5v12.362c0 4.142-3.358 7.5-7.5 7.5z" fill="#495560"/></g></g></g></g></g></svg></span>
                    </div>
                    <p>Your are about to delete a product</p>
                    <p>This will delete your product from catalog <br>Are you sure?</p>
                    <form>
                        <div class="delete_button">
                            <span class="dlt-prd" v-on:click="deleteProduct">Delete</span>
                            <span class="out-msg" v-on:click="fadeMeOut">Cancel</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
import Pagination from '../Pagination.vue'
export default {
   name: 'UserProducts',
   components:{
        Pagination
   },
    static: {
        visibleItemsPerPageCount: 8
    },
    data() {
        return {
            data: {},
            error:1,
            isShowing: false,
            tobedeleted:0,
            currentPage:0,
            visibleItemsPerPageCount: 8
        }
    },
    created(){
        this.currentPage = parseInt(this.$route.query.page);
        this.getProduct();
    },
    watch: {
        '$route.query.page':function() {
           this.currentPage = parseInt(this.$route.query.page);
           this.getProduct();
        }
    },
    methods: {
        async getProduct(){            
            var start = this.$options.static.visibleItemsPerPageCount * (this.currentPage - 1);
            await axios.get('api/products/mypros',{
                params:{
                    page:start,
                    limit:this.$options.static.visibleItemsPerPageCount
                }
            }).then(response=>{
                    this.data = response.data.myproducts;
                    if(Object.keys(this.data).length === 0){
                        this.error=1;
                    }else{
                        this.error=0;
                        this.pageCount = Math.ceil(response.data.total / this.$options.static.visibleItemsPerPageCount)
                    }
            })
        },
        postProduct(){
            this.$router.push('/user/addProducts');
        },
        deleteProduct:function(){
            const id=this.tobedeleted;
            axios.delete('api/products/'+id).then(() => {
                const index = this.data.findIndex(data => data._id === id) // find the post index 
                this.data.splice(index, 1);
                this.fadeMeOut();
                if(Object.keys(this.data).length === 0){
                        this.error=1;
                }
            });
        },
        fadeMeOut:function(){
            this.isShowing = false
        },
        fadeMeIn:function(tobedeleted){
            this.isShowing = true
            this.tobedeleted=tobedeleted
        },
        changeRoute(page){
            this.$router.push({
                name: 'My Products',
                query: { page: page },
            });
        }
    }
}
</script>

<style scoped>
    .all-products{
        width:100%;
    }
    .edit-product{
        background-color: #fff;
        color: #98d8ca;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-bottom: 5px;
        cursor: pointer;
        border: none;
        outline: none;
        padding:7px;
    }
    .delete_product{
        color:#d3122a  !important;
    }
</style>