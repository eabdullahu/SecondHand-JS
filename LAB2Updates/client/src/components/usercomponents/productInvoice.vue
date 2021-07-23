<template>
    <div class="invoice-content" v-if="Object.keys(orderInfo).length != 0">
        <div class="container" style="margin:50px 0px;display:flex;">
            <ul class="progressbar" style="width:100%;margin:auto;">
                <li v-for="status in statusName.length"  :key="status" :class=" status <= deliveryStatus ? 'active': ''"> {{ statusName[status-1] }} </li>
            </ul>
        </div>
        <div class="generate-pdf" @click="createPDF">Generate PDF</div>
        <div class="invoice-container" ref="document" id="html">
            <table style="width:100%; height:auto;  text-align:center; " BORDER=0 CELLSPACING=0>
                <thead style="background:#fafafa; padding:8px;">
                    <tr style="font-size: 20px;">
                        <td colspan="4" style="padding:20px 20px;text-align: left;">L E Z A D A</td>
                    </tr>
                </thead>
                <tbody style="background:#ffff;padding:20px;">
                    <tr>
                        <td colspan="4" style="padding:20px 0px 0px 20px;text-align:left;font-size: 16px; font-weight: bold;color:#000;">Hello, {{this.fullname}}</td>
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
                        <td style="border-right:1.5px dashed  #DCDCDC ;width:25%; font-weight:bold;background: #fafafa;">{{ new Date(orderInfo.created_at).toLocaleString()}}</td>
                        <td style="border-right:1.5px dashed  #DCDCDC ;width:25% ; font-weight:bold;background: #fafafa;">{{ orderInfo._id }}</td>
                        <td style="border-right:1.5px dashed  #DCDCDC ;width:25%; font-weight:bold;background: #fafafa;">CASH</td>
                        <td style="width:25%; font-weight:bold;background: #fafafa;">{{ orderInfo.shipping_address }}</td>
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
                    <tr  v-for="p in orderInfo.products" :key="p._id">
                        <td style="width:10%; ">
                            <a href=""><img :src="require('../../assets/products/' + p.product.photos[0].photo_name)" style="width:100px;" /></a>

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
                        <td style="text-align:right;padding:5px 0px;font-weight: bold;font-size:16px;">{{ orderInfo.total.toFixed(2) }} &euro;</td>
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
</template>


<script>
import axios from 'axios'
import html2pdf from 'html2pdf.js'
export default ({
    name:'Order',
    data(){
        return {
            orderId:'',
            orderInfo: {},
            fullname:'',
            statusName: ["Opened", "Confirmed", "Shipped", "Delivered"],
            deliveryStatus: 0
        }
    },
    created() {

        var user=JSON.parse(localStorage.getItem("currentUser"))
        this.orderId = this.$route.params.id;
        this.getOrderDetail();
        this.fullname = user.first_name +' '+ user.last_name;
    },
    methods: {
        async getOrderDetail() {
            await axios.get("api/orders/"+ this.orderId).then(res=>{
                this.orderInfo = res.data[0];
                this.deliveryStatus = this.orderInfo.delivery_status.length;
            })
        },
        createPDF () {
            html2pdf(this.$refs.document, {
                margin: 1,
                filename: 'Lezada-Invoice.pdf',
                image: { type: 'jpeg', quality: 0.95},
                html2canvas: { dpi: 192, letterRendering: true, scale: 10 },
                jsPDF: { format: 'a4', orientation: 'portrait', quality:2}
            })
        }
    }

})
</script>
<style scoped>
.invoice-content{
    width:100%;
    padding:50px;
    background: #f3f3f3;
}
.invoice-container{
    width: 100%;
    height: 100%;
}
.generate-pdf{
    float:right;
    color: #ababab;
    border: 2px solid #e6e6e6;
    font-size: 16px;
    display: inline-block;
    margin-left: 0;
    padding: 5px;
    transition: 0.8s;
    margin-bottom: 10px;
    cursor:pointer;
}
.generate-pdf:hover{
    color: #c61932;
    border-color: #c61932;
}


/* TEST */

.progressbar li{
    float: left;
    width: 25%;
    position: relative;
    text-align: center;
}
.progressbar li:before{
    content:"1";
    width: 30px;
    height: 30px;
}
.progressbar li:before{
  
    content: "";
    
    width: 35px;
    height: 35px;
    border: 2px solid #fff;
    display: flex;
    justify-content: center;
    margin: 0 auto 10px auto;
    border-radius: 50%;
    line-height: 27px;
    background: white;
    color: #000;
    text-align: center;
    font-weight: bold;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 5%);
    align-items: flex-end;

}
.progressbar li.active:before{
    content: image-set('../../assets/icon/check.png' 25x) ;
    border-color: #3aac5d;
    background: #3aac5d;
    color: white

}
.progressbar li:after{
    content: '';
    position: absolute;
    width:80%;
    height: 3px;
    background: #fff;
    top: 15px;
    left: -40%;
    z-index: 0;
}
.progressbar li:first-child:after{
    display: none;
}
.progressbar li.active:after{
     background: #3aac5d;
}
</style>
