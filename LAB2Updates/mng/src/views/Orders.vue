<template>
  <div class="container m-t-20">
    <div class="inputContainer justify-content-between align-items-center m-t-0"> 
        <h4 class="title"> Orders </h4>
    </div>
    <div class="responsiveTable" v-if = 'this.orders.length > 0'>
        <table class="m-t-20">
            <thead>
                <tr>
                    <th class="text-center">Order no.</th>
                    <th class="text-center">Client</th>
                    <th>Payment Method</th>
                    <th>Total price</th>
                    <th>Last Update</th>
                    <th>Status</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='o in orders' :key="o._id"> 
                    <td class="text-center">{{o._id}}</td>
                    <td class="text-center">
                        <a href="javascript:void(0)">{{ o.client.first_name}} {{o.client.last_name}}</a>
                    </td>
                    <td>{{o.payment_type}}</td>
                    <td class="text-primary">{{ o.total}}&euro;</td>
                    <td>{{ o.updated_at}}</td>
                    <td v-if ='o.status != "Canceled" '><span class="badge outline-badge-green" >{{ o.delivery_status[(o.delivery_status).length - 1].type}}</span></td>
                    <td v-else><span class="badge outline-badge-red" >{{ o.status}}</span></td>
                    <td>
                        <div class="icons">
                            <router-link :to="{ name: 'orderEdit', query:{ id: o._id }}">
                                <font-awesome-icon :icon="['fas','edit']" class="green" />
                            </router-link>
                        </div>
                    </td>
                </tr>

            </tbody>
        </table>
    </div>
    <div v-else>
        <div class="container m-t-20">
            <h3>There are no orders yet !</h3>
        </div>
    </div>
    <Pagination v-if="totalProducts > pagination.toshow"
        :current-page = "page"
        :page-count = "pagination.total"
        class="search-pagination"
        @nextPage="filterOrders"
        @previousPage="filterOrders"
        @loadPage="filterOrders"
    />
  </div>
</template>
<script>

import axios from 'axios';
import Pagination from "../components/Pagination";

export default {
    name: "dashboard",
    components: {
        Pagination
    },
     props: {
        page: { type: Number, default: 1 },
        id : {type: String},
        status: { type: String, default: "" },
        postedby: { type: String, default: null },
    },
    data(){
        return{
            orders: {},
            filters: '',
            pagination: {
                total: 0,
                toshow: 5,
                page: this.page
            },
            search: { 
                id: this.id,
                status: this.status ? this.status : " ",
                postedby: this.postedby
            },
            totalProducts:0
        }
    },
    watch: {
        $route () {
            this.populatePage()
        },
    },
    created() {
      this.populatePage();
   
    },
    methods: {
        async populatePage(){
            await axios.get('/api/mng/order',{
                params: {
                    page: this.pagination.toshow * (this.page - 1),
                    limit : this.pagination.toshow,
                }
            }).then(resp=>{
                this.orders = resp.data.orders;
                console.log(this.orders );
                this.totalProducts = resp.data.total;
                this.pagination.total = Math.ceil(resp.data.total /  this.pagination.toshow);
            })
        },
        filterOrders(page = 1){
            this.$router.push({
                name: 'Orders',
                query: { id: this.search.id, status: this.search.status, postedby: this.search.postedby, page: page}

            });
        },
    }
};
</script>
