<template>
    <div v-if="Object.keys(data).length != 0">
        <div class="outterContainer">
            <div class="container m-t-20">
                <h2>Client Info </h2>
                <div class="responsiveTable">
                    <table class="m-t-20">
                        <thead>
                            <tr>
                                <th>Info</th>
                                <th>Data</th>
                             </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td>{{ data.client.first_name}}</td>
                            </tr>
                            <tr>
                                <td>Lastname</td>
                                <td>{{ data.client.last_name}}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{{ data.client.email}}</td>
                            </tr>
                            <tr>
                                <td>Phone Number</td>
                                <td>{{ data.client.phone}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="container m-t-20">
                <h2>Delivery Status</h2>
                <div v-if = "(this.data.status == 'Canceled')"  class="w-100"><h2 class="outline-badge-red cancel_message">This order has been canceled!</h2></div>
                <div v-else class="responsiveTable">
                    <table class="m-t-20">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Updated By</th>
                             </tr>
                        </thead>
                        <tbody>
                            <tr v-for="o in data.delivery_status" :key="o._id">
                                <td>
                                    <span   class="badge outline-badge-red" v-if="o.type == 'Opened' ">{{ o.type}}</span>
                                    <span  class="badge outline-badge-green"  v-else-if="o.type == 'Confirmed'">{{ o.type}}</span>
                                    <span   class="badge outline-badge-blue" v-else-if="o.type == 'Shipped'">{{ o.type}}</span>
                                    <span  class="badge outline-badge-purple" v-else >{{ o.type}}</span>
                                </td>


                                <td>{{ new Date(o.created_at).toLocaleString() }}</td>
                                <td>{{ o.updated_by}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="outterContainer justify-content-end disp-flex-row">
                    <div v-if = "(this.data.delivery_status).length == 1  && (this.data.status != 'Canceled')"  class="inputContainer justify-content-end m-t-20 " style="width:fit-content;margin:10px;">
                        <input type="submit" name="submit" class="input outline-badge-red shadow next_phase"  @click="updateStatus()" value="Cancel order">
                    </div>
                    <div v-if = "(this.data.delivery_status).length < 4 && (this.data.status != 'Canceled')"  class="inputContainer justify-content-end m-t-20" style="width:fit-content;margin:10px;">
                        <input type="submit" name="submit" class="input outline-badge-green shadow next_phase"  @click="updateStatus()" value="Update status">
                    </div>
                </div>
            </div>
        </div>
        <div class="container  m-t-20 disp-flex-row">
            <div class=" fitContent"><h2>Order Invoice : </h2></div>
            <div class="fitContent invoice-btn" v-if = "(this.data.status != 'Canceled')">
                <div class="inputContainer fitContent m-r-20 m-t-0">
                        <input type="submit" name="submit" class="input outline-badge-red shadow next_phase" @click="createPDF"  value="Generate PDF">
                </div>
                <div class="inputContainer fitContent m-t-0">
                        <input type="submit" name="submit" class="input outline-badge-blue shadow next_phase" @click="resendInvoice()"  value="Resend Invoice">
                </div>
            </div>
        </div>
        <div class="container m-t-20 row" style="justify-content: center;">
            <div class="invoice-content">
                <div class="invoice-container" ref="document" id="html" style="margin:0px auto !important;padding:0;width:700px;margin:auto;">
                    <table style="width:100%; height:auto;  text-align:center; " BORDER=0 CELLSPACING=0>
                        <thead style="background:#fafafa; padding:8px;">
                            <tr style="font-size: 20px;">
                                <td colspan="4" style="padding:20px 20px;text-align: left;">L E Z A D A</td>
                            </tr>
                        </thead>
                        <tbody style="background:#ffff;padding:20px;">
                            <tr>
                                <td colspan="4" style="padding:20px 0px 0px 20px;text-align:left;font-size: 16px; font-weight: bold;color:#000;">Hello, <br> {{ data.client.first_name}} {{data.client.last_name}}</td>
                            </tr>
                            <tr>
                                <td colspan="4" style="text-align:left;padding:10px 10px 10px 20px;font-size:14px;">Your order details</td>
                            </tr>
                        </tbody>
                    </table>
                    <table style="width:100%; height:auto; background-color:#fff;text-align:center; padding:10px; background:#fafafa">
                        <tbody>
                            <tr style="color:#6c757d; font-size: 20px;">
                                <td style="border-right:1.5px dashed  #DCDCDC; width:25%;font-size:12px;font-weight:700;padding: 0px 0px 10px 0px;">Order Date</td>
                                <td style="border-right: 1.5px dashed  #DCDCDC ;width:25%;font-size:12px;font-weight:700;padding: 0px 0px 10px 0px;">Order No.</td>
                                <td style="border-right:1.5px dashed  #DCDCDC ;width:25%;font-size:12px;font-weight:700;padding: 0px 0px 10px 0px;">Payment</td>
                                <td style="width:25%;font-size:12px;font-weight:700;padding: 0px 0px 10px 0px;">Shipping Address</td>
                            </tr>
                            <tr style="background-color:#fff; font-size:12px; color:#262626;">
                                <td style="border-right:1.5px dashed  #DCDCDC ;width:25%; font-weight:bold;background: #fafafa;">{{ new Date(data.created_at).toLocaleString()}}</td>
                                <td style="border-right:1.5px dashed  #DCDCDC ;width:25% ; font-weight:bold;background: #fafafa;">{{ data._id }}</td>
                                <td style="border-right:1.5px dashed  #DCDCDC ;width:25%; font-weight:bold;background: #fafafa;">CASH</td>
                                <td style="width:25%; font-weight:bold;background: #fafafa;">{{ data.shipping_address }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table style="width:100%; height:auto; background-color:#fff; margin-top:0px;  padding:20px; font-size:12px; border: 1px solid #ebebeb; border-top:0px;">
                        <thead>
                            <tr style=" color: #6c757d;font-weight: bold; padding: 5px;">
                                <td colspan="2" style="text-align: left;">PRODUCT INFORMATION</td>
                                <td style="text-align: center;">SIZE</td>
                                <td style="padding: 10px;text-align:center;">QUANTITY</td>
                                <td style="text-align: right;padding: 10px;">PRICE</td>

                            </tr>
                        </thead>
                        <tbody>
                            <tr  v-for="p in data.products" :key="p._id">
                                <td style="width:10%; ">
                                    <a href=""><img :src="require('../../../client/src/assets/products/' + p.product.photos[0].photo_name)" style="width:100px;" /></a>

                                </td>
                                <td style="width:20%;margin-left:10px;text-align: center;">{{ p.product.title }}</td>
                                <td style="width:20%;padding: 10px; text-align:center;"> {{ p.product.size }} </td>
                                <td style="width:20%;padding: 10px;text-align: center;"> {{ p.quantity}} </td>
                                <td style="width:30%; ;font-weight: bold;font-size: 14px;">
                                    <table style="width:100%;">
                                        <tr>
                                            <td style="text-align:end;font-size:13px;">{{ (p.price / 100).toFixed(2) }} &euro;</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table style="width:100%; height:auto; background-color:#fff;padding:20px; font-size:12px; border: 1px solid #ebebeb; border-top:0">
                        <tbody>
                            <tr style="padding:20px;color:#000;font-size:15px">
                                <td style="font-weight: bold;padding:5px 0px">Total</td>
                                <td style="text-align:right;padding:5px 0px;font-weight: bold;font-size:16px;">{{ data.total.toFixed(2) }} &euro;</td>
                            </tr>

                            <tr>
                                <td colspan="2" style="font-weight:bold;"><span style="color:#c61932;font-weight: bold;">THANK YOU</span> for shipping with us!</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="font-weight:bold;text-align:left;padding:5px 0px 0px 00px;font-size:14px;">THRED<span>+</span> team</td>
                            </tr>
                        </tbody>
                        <tfoot style="padding-top:20px;font-weight: bold;">
                            <tr>
                                <td style="padding-top:20px;">Need help? Contact us <span style="color:#c61932"> info@thred-plus.shop </span></td>
                            </tr>
                        </tfoot>
                    </table>
                   
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import html2pdf from 'html2pdf.js'

export default {

    name: 'orderEdit',
    data(){
        return{
            data: {},
            status : ["Opened", "Confirmed", "Shipped", "Delivered"],
        }
    },

    async created() {
        this.getData();
       
    },

    methods: {
        async getData(){
            await axios.get('/api/mng/order/'+this.$route.query.id).then(resp=>{
                this.data = resp.data;
                console.log(this.data.delivery_status);

            })
        },
        async resendInvoice() {
            var invoiceContent = document.getElementById('html').outerHTML;
            await axios.post('/api/mng/order/resend-invoice',{
                    invoice : invoiceContent,
                    email :  this.data.client.email

            }).then(res=>{
                if(res.data.error == 'Valid'){
                    this.$toast.open({
                        message: "Send successfully!",
                        type: "success",
                        duration: 5000,
                        dismissible: true,
                        position: 'bottom-right'
                    });

                }else{
                     this.$toast.open({
                        message: "This user is no longer member of Lezada!",
                        type: "error",
                        duration: 5000,
                        dismissible: true,
                        position: 'bottom-right'
                    });

                }
            })

        },
        async updateStatus(){

            console.log("Let's do this!");
            var index = (this.data.delivery_status).length;
            const status = this.status[index];
            await axios.post('/api/mng/order/updateStatus',{
                id : this.data._id,
                status : status         
            }).then(res=>{
                console.log(res);
                 this.getData();
            });
        },
        createPDF () {
            html2pdf(this.$refs.document, {
                scrollX: 0,
                scrollY: 0,
                margin: 2,
                filename: 'Invoice-'+this.data._id+'.pdf',
                image: { type: 'jpeg', quality: 0.95},
                html2canvas: { dpi: 192, letterRendering: true, scale: 10 },
                jsPDF: { format: 'letter', orientation: 'portrait', quality:2}
            })
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