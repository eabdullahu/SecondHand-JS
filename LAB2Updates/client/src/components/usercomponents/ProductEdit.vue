<template>
    <div class="add_product">
        <h3>Edit Product</h3>
        <div class="success-msg-login" v-show="success"><p>Product edited successfully! </p></div> 
        <form @submit.prevent="editProduct">
            <div class="edit_products">
                <div class="img_add">
                    <div class="box-img" >
                        <img :src="getImgPath(product.photos)" />
                    </div>
                </div>
                <div class="inpt_add">
                    <div>
                        <label for="name">Product name</label>
                        <input :class="{ 'error-inputs' : $v.product.title.$error  }" type="text" v-model.lazy ="$v.product.title.$model">
                    </div>
                    <div class="three-inpts">
                        <div>
                            <label for="name">Product Price</label>
                            <div class="input-icon">
                                <input :class="{ 'error-inputs' : $v.product.price.$error  }" type="text" class="form-control" placeholder="00.00" v-model.lazy ="$v.product.price.$model">
                                <i>€</i>
                            </div>
                        </div>
                            <div>
                            <label for="name">Discount (%)</label>
                            <div class="input-icon">
                                <input :class="{ 'error-inputs' : $v.product.discount.$error  }" type="text"  class="form-control" placeholder="00.00" v-model.lazy ="$v.product.discount.$model">
                            </div>
                        </div>
                        <div>
                            <label for="name">Size</label>
                            <div class="input-icon">
                                <input :class="{ 'error-inputs' : $v.product.size.$error  }" type="text"  class="form-control" placeholder="M" v-model.lazy ="$v.product.size.$model">
                            </div>
                        </div>
                        <div >
                            <label for="name">Quantity</label>
                            <input :class="{ 'error-inputs' : $v.product.quantity.$error  }" type="text" value="1" v-model ="$v.product.quantity.$model" />
                        </div>
                    </div>
                    <label for="name">Description</label>
                    <textarea :class="{ 'error-inputs' : $v.product.desc.$error  }" type="number"  placeholder="Enter product description" v-model="$v.product.desc.$model"></textarea>
                    
                    <div class="two-inpts mb-20">
                        <div class="w-50">
                            <label for="name">Category</label>
                            <select v-model="product.category" @change="getCategory($event)">
                                <option v-for="c in categories.children" v-bind:key="c.name" v-bind:value="c._id"> {{ c.name }} </option>
                            </select>
                        </div>
                        <div class="w-50">
                            <label for="name">Sub Category</label>
                            <select v-model="product.subcategory" @change="product.subcategory = $event.target.value">
                                <option v-for="c in subcategories" v-bind:key="c.name" v-bind:value="c._id"> {{ c.name }} </option>
                            </select>
                        </div>
                    </div>
                    <div class="two-inpts">
                         <div class="w-100">
                            <label for="name">Gender</label>
                            <div class="gender-input"> 
                                <input type="radio" name="gender" v-model="$v.product.gender.$model" id="size_1" value="U"  checked/>
                                <label for="size_1">Universal</label>
                                <input type="radio" name="gender" v-model="$v.product.gender.$model" id="size_2" value="F" />
                                <label for="size_2">Female</label>
                                <input type="radio" name="gender" v-model="$v.product.gender.$model" id="size_3" value="M" />
                                <label for="size_3">Male</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="buttons-edit">
                <div v-bind:style="{ position: 'relative' }">
                    <span class="sign_in_button chng_img"><font-awesome-icon :icon="['fas','camera']"/></span>
                    <input @change="uploadFile" class="chng-inp" type="file"  />
                </div>
                <button type="submit" class="sign_in_button">Save changes</button>
            </div>
        </form>
    </div>
</template>
<script>
import axios from 'axios'
import {required, minLength, minValue} from 'vuelidate/lib/validators'
export default {
    name: "UserEdit",
    data(){
        return{
            id:null,
            product:{},
            files: null,
            submitted: false,
            categories:[],
            subcategories:[],
            success: false
        }
    },
    async created() {
        this.id = this.$route.params.id
        await axios.get('/api/products/'+this.id).then(resp=>{
            this.product.title = resp.data.title,
            this.product.sale_status = resp.data.sale_status,
            this.product.discount = (resp.data.discount/100).toFixed(0),
            this.product.size = resp.data.size,
            this.product.quantity = resp.data.quantity,
            this.product.desc = resp.data.desc,
            this.product.price = (resp.data.price/100).toFixed(2),
            this.product.photos = resp.data.photos[0].photo_name,
            this.product.gender = resp.data.gender,
            this.product.subcategory = resp.data.category
        })
        this.loadCategory()
    },
    
    methods:{
        uploadFile (event) {
            this.files = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(this.files);
            reader.onload = () => {
                this.product.photos = reader.result;
            };
        },
        async editProduct(){
            this.submitted = true;
             // stop here if form is invalid
            this.$v.$touch();
            if (this.$v.$pending || this.$v.$error) {
                return;
            }else{
                const formData = new FormData();
                formData.append('file', this.files)
                formData.append('p', JSON.stringify( {
                    title: this.product.title,        
                    sale_status:this.product.sale_status,
                    discount: this.product.discount,
                    size: this.product.size,
                    quantity: this.product.quantity,
                    desc: this.product.desc,
                    price:this.product.price,
                    category:this.product.category,
                    subcategory:this.product.subcategory,
                    gender: this.product.gender
                 }));
                await axios.patch('/api/products/'+ this.id,formData).then(() => {
                    this.success=true;
                    setTimeout(() => this.success = false, 2000)
                    setTimeout( () => this.$router.push({ path: '/user/userProduct'}), 2000);
                });
            }
        },
        getImgPath (name) {
            return name ? require('../../assets/products/'+name) : ''
        },
        async loadCategory(){
            await axios.get('/api/category', { params: { parentId: 0 } }).then(res=> {
                this.categories = res.data[0];
                this.subcategories = this.categories.children;
                var ind = 0; 
                this.subcategories.forEach((item, index) => {
                    if((item.children.findIndex(data => data._id === this.product.subcategory)) != -1){
                        ind = index;
                        return;
                    }
                });
                this.subcategories = this.categories.children[ind].children;
                this.product.category = this.categories.children[ind]._id;
            });
        },
        getCategory(event) {
            this.product.category = event.target.value
            this.subcategories = this.categories.children[event.target.selectedIndex].children;
            this.product.subcategory = this.subcategories[0]._id;
        }
    },
    validations:{
        product:{
            title: {minLength: minLength(4)},
            sale_status: {minLength: minLength(1)},
            discount: {minLength: minLength(1),minValue: minValue(0)},
            desc:{minLength: minLength(10)},
            size:{minLength: minLength(1)},
            price:{minLength: minLength(1)},
            quantity:{minLength: minLength(1),minValue: minValue(1)},
            gender: {required}
        }
    }
}
</script>


<style scoped>
.box-img{
    padding:0px;
    width: 100%;
    overflow: hidden;
}
.img_add{
    width:50%;
}
.box-img img{
    width:100%;
}
.chng_img{
    background-color: #98d8ca;
}
.inpt_add{
    position:relative;
    width:70%;
}
.sign_in_button{
    margin-top:10px;
}
.chng-inp{
    position: absolute;
    z-index: 5;
    left: 0;
    /* visibility: hidden; */
    opacity: 0;
    cursor: pointer;
}
input, textarea, select{
    background:transparent;
    width: 100%;
}
.q-inputs div{
    width:100%
}
</style>

