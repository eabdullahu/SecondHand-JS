<template>
    <div class="add_product">
        <h3>Add product</h3>
        <p>Adding products to your store</p>
        <div class="success-msg-login" v-show="success"><p>Product added successfully! </p></div> 
        <div class="error-msg-login" v-if="error"><p> Please fill all inputs !</p></div>
        <form  @submit.prevent="handleSubmit">
            <div class="add_products">
                <div v-if="image.length == 0" class="img_add">
                    <div  class="box-img">
                        <input @change="uploadFile" type="file" name="file-5[]" id="file-5" class="inputfile-img inputfile-4" data-multiple-caption="{count} files selected" />
                        <label for="file-5"><figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> <span>Upload image</span></label>
                    </div>
                </div>
                <div v-else class="img-holder">
                    <div class="remove-img" @click=" image = ''">X</div>
                    <img :src="image" />
                </div>
                <div class="inpt_add">
                    <div>
                        <label for="name">Product name</label>
                        <input :class="{ 'error-inputs' : $v.product.title.$error  }" type="text" v-model ="$v.product.title.$model">
                    </div>
                    <div class="two-inpts">
                        <div>
                            <label for="name">Product Price</label>
                            <div class="input-icon">
                                <input :class="{ 'error-inputs' : $v.product.price.$error  }"  class="form-control" placeholder="00.00" v-model ="$v.product.price.$model">
                                <i>€</i>
                            </div>
                        </div>
                        <div>
                            <label for="name">Product size</label>
                            <div class="input-icon">
                                <input :class="{ 'error-inputs' : $v.product.size.$error  }"  type="text" v-model ="$v.product.size.$model"  class="form-control" placeholder="M">
                            </div>
                        </div>
                        <div >
                            <label for="name">Quantity</label>
                            <input :class="{ 'error-inputs' : $v.product.quantity.$error  }" type="text" value="1" v-model ="$v.product.quantity.$model" />
                        </div>
                    </div>
                    <textarea :class="{ 'error-inputs' : $v.product.desc.$error  }"   placeholder="Enter product description" v-model="$v.product.desc.$model"></textarea>
                    <div class="two-inpts mb-20">
                        <div class="w-50">
                            <label for="name">Category</label>
                            <select @change="getCategory($event)">
                                <option v-for="c in categories.children" v-bind:key="c.name" v-bind:value="c._id"> {{ c.name }} </option>
                            </select>
                        </div>
                        <div class="w-50">
                            <label for="name">Sub Category</label>
                            <select @change="product.subcategory = $event.target.value">
                                <option v-for="c in subcategories" v-bind:key="c.name" v-bind:value="c._id"> {{ c.name }} </option>
                            </select>
                        </div>
                    </div>
                    <div class="two-inpts">
                         <div class="w-100">
                            <label for="name">Gender</label>
                            <div class="gender-input"> 
                                <input type="radio" v-model="$v.product.gender.$model" id="size_1" value="U" />
                                <label for="size_1">Universal</label>
                                <input type="radio" v-model="$v.product.gender.$model" id="size_2" value="F" />
                                <label for="size_2">Female</label>
                                <input type="radio" v-model="$v.product.gender.$model" id="size_3" value="M" />
                                <label for="size_3">Male</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button type="submit" class="sign_in_button">Add product</button>
        </form>
    </div>
</template>
<script>
import axios from 'axios'
import {minLength,minValue,required} from 'vuelidate/lib/validators'

export default {
    name:"AddProducts",
    data(){
        return{
            product:{
                title :'' ,
                sale_status: '',
                discount :'',
                size :'',
                quantity :'',
                desc :'',
                price :'',
                category: '',
                subcategory: '',
                gender: ''
            },
            files: null,
            categories:[],
            subcategories: [],
            error:false,
            image: "",
            success: false
        }
    },   
    async created(){
        await axios.get('/api/category', { params: { parentId: 0 } }).then(res => {
            this.categories = res.data[0];
            this.subcategories = this.categories.children[0].children;
            this.product.category = this.categories.children[0]._id;
            this.product.subcategory = this.categories.children[0].children[0]._id;
        });
    },
    methods: {
        //Upload File (fotografine)
        uploadFile(event) {
            this.files = event.target.files[0] ;
            const reader = new FileReader();
            reader.readAsDataURL(this.files);
            reader.onload = () => {
                this.image = reader.result;
            };
        },
        //Post product
        handleSubmit() {
            // stop here if form is invalid
            this.error = false;
            this.$v.$touch();
            if ( this.$v.$pending || this.$v.$error ) {
                this.error = true;
                return;
            }else{
                const formData = new FormData();
                formData.append('file', this.files)
                formData.append('p', JSON.stringify({
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
                axios.post('/api/products/',formData).then(() => {
                    this.success=true;
                    setTimeout(() => this.success = false, 2000)
                    setTimeout( () => this.$router.push({ path: '/user/userProduct'}), 2000);
                })
            }
        },
        //Get emrin e kategorise qe e zgjedhim
        getCategory(event) {
            this.product.category = event.target.value
            this.subcategories = this.categories.children[event.target.selectedIndex].children;
            this.product.subcategory = this.subcategories[0]._id;
        }
    },
    validations: {
        product: {
            title: {required,minLength: minLength(5)},
            desc:  {required,minLength: minLength(10)},
            size:  {required,minLength: minLength(1)},
            price: {required,minLength: minLength(1),minValue: minValue(1)},
            quantity:{required,minLength: minLength(1),minValue: minValue(1)},
            gender: {required}
        }
    }
}
</script>
<style scoped>
    .w-100, .w-50 {
        width:100%;
        display:flex;
        flex-direction: column;
    }
    .w-50 {
        width: 50%;
    }
    .img-holder{
        width: 50%;
        padding: 10px;
        overflow: hidden;
        border: 1px dashed #cecece;
        position:relative;
    }
    .img-holder img{
        width:100%;
    }
    input, textarea, select{
        background:transparent
    }
</style>