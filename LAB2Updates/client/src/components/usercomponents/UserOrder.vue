<template>
    <div class="my_products">
        <h3>Orders </h3>
        <p>History of my orders</p>
        <div v-if="noOrder" class="no-products">
            <div class=""><p>Dear user, you don't have any orders yet!</p></div> 
            <p class="click-more"><router-link :to="{ name: 'Home'}">ORDER NOW!</router-link></p>
        </div>
        <div v-else class="view-cart-container usr-order">
            <table>
                <thead>
                    <tr>
                        <th>Order date</th>
                        <th>Payment Method</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="o in myOrders" :key="o._id">
                        <td class="name">{{ new Date(o.created_at).toLocaleString() }}</td>
                        <td >{{ o.payment_type }}</td>
                        <td class="price">  {{ (o.total).toFixed(2) }}  &euro;</td> 
                        <td>{{ o.delivery_status[o.delivery_status.length - 1].type }}</td>
                        <td class="remove-from-cart"><router-link :to="{ name: 'Order',  params: { id: o._id }}">View</router-link></td>
                    </tr>
                </tbody> 
            </table>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default ({
    data(){
        return {
            myOrders: {},
            noOrder:true
        }
    },
    async mounted(){
        await axios.get('api/orders/myOrder')
        .then(response=>{
            console.log(response);
            this.myOrders = response.data;
            if(this.myOrders.length == 0){
                this.noOrder =true;
            }else{
                this.noOrder =false;
                
            }
        })
    },
    
})
</script>