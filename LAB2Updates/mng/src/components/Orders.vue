<template>
    <div class="container m-t-20">
        <h4 class="title">Latest Orders</h4>
        <div class="responsiveTable">
            <table class="m-t-20">
                <thead>
                    <tr>
                        <th></th>
                        <th class="text-center">Created Date</th>
                        <th>Payment Type</th>
                        <th>Price</th>
                        <th>Timestamp</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>

                    <tr v-for="o in orders" v-bind:key='o._id'>
                        <td style="width: 1px;"></td>
                        <td class="text-center">{{ o.created_at}}</td>
                        <td class="text-primary">{{ o.payment_type }}</td>
                        <td class="text-center">{{ o.total }} &euro;</td>
                        <td>6/3/2020, 11:41:42 AM</td>
                        <td><span class="badge outline-badge-red" title="ready to ship to costumer"> {{ o.status }} </span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-end"><a class="viewMore">View more <i class="fas fa-angle-double-right"></i></a></div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:"Orders",
    props:{
        no:{
            type:Number,
            default:6
        }
    },
    data(){
        return{
            orders:[]
        }
    },
    created(){
        this.populateOrders();
    },
    methods:{
       async populateOrders(){
            await axios.get('api/mng/order').then(res=>{
               this.orders = res.data
               console.log(this.orders);
           });
        }
    }
}

</script>