<template>
    <div>
        <div class="container m-t-20">
            <div class="inputContainer justify-content-between align-items-center m-t-0"> 
                <h4 class="title"> Homepage banners </h4>
                <div class="d-flex widthUnset">
                    <input type="submit" class="input outline-badge-blue shadow header" value="+ New banner" @click="addNewBanner()">
                </div>
            </div>
            <div class="responsiveTable">
                <table class="m-t-20">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Order</th>
                            <th>Category</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(banner, index) in banners" :key="banner._id">
                            <td>
                                <img :src="getImageUrl(banner.photo_name)"/>
                            </td>
                            <td class="text-primary">{{ banner.name }}</td>
                            <td>Order no. {{ banner.order }}</td>
                            <td>{{ banner.category.name }}</td>
                            
                            <td>
                                <div class="icons">
                                    <button type="button" name="update" @click="updateBanner(banner)">
                                        <font-awesome-icon :icon="['fas', 'edit']" class="blue" />
                                    </button>
                                    <button type="button" name="delete" @click="deleteBanner(banner._id, index)">
                                        <font-awesome-icon :icon="['fas', 'trash-alt']" class="red" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="banners.length < 1">
                            <td colspan="5" class="text-center">No banners found !</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <form v-on:submit.prevent="handleSubmit" class="p-20 m-t-20 bg" v-if="form.isShown">
                <div class="first width100 m-r-0">
                    <h4 class="title" v-html="form.title"></h4>
                    <div class="inputContainer g33">
                        <div>
                            <p>Title</p>
                            <input type="text" class="input" placeholder="Title" v-model="$v.banner.title.$model" :class="{ 'error-input': $v.banner.title.$error }">
                        </div>
                        <div>
                            <p>Category</p>
                            <select class="input" v-model="$v.banner.category.$model" :class="{ 'error-input': $v.banner.category.$error }">
                                <option value=''>Choose</option>
                                <option v-for="c in categories" :value="c._id" :key="c._id">{{ c.name }}</option>
                            </select>
                        </div>
                        <div>
                            <p>Order no.</p>
                            <input type="number" class="input" placeholder="Order no." v-model="$v.banner.order.$model" :class="{ 'error-input': $v.banner.order.$error }">
                        </div>
                        <div>
                            <p>Image</p>
                            <div class="custom-control">
                                <input type="file" class="input" placeholder="File" @change="uploadImage">
                                <span class="file" :class="{ 'error-input': $v.banner.photo_name.$error }">
                                    <span>{{ banner.photo_name || "No image chosen" }}</span>
                                    <div class="choose"><font-awesome-icon :icon="['fas', 'upload']" /></div>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="inputContainer justify-content-end m-t-20">
                        <input type="submit" name="submit" class="input header outline-badge-green shadow" value="Save Changes">
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { required, minLength, minValue } from 'vuelidate/lib/validators'
    export default {
        name: "Coupons",
        data() {
            return {
                banners: [],
                categories: [],
                banner: {
                    id: null,
                    title: '',
                    category: "",
                    order: 0,
                    photo_name: null,
                    image: null
                },
                form: {
                    isShown: false,
                    title: null,
                    type: null
                }
            }
        },
        created(){
            this.getBanners();
        },
        methods: {
            getBanners(){
                axios.get("/admin-api/banners/").then(response => {
                    this.banners = response.data.banners
                    this.categories = response.data.category;
                });
            },
            handleSubmit(){
                this.$v.$touch();
                if (this.$v.$pending || this.$v.$error) {
                    return;
                }
                const formData = new FormData();
                formData.append('file', this.banner.image)
                formData.append('banner', JSON.stringify(this.banner));

                if(this.banner.id !== null){
                    axios.patch("/admin-api/banners/" + this.banner.id, formData).then((response) => {
                        if(response.data == "success"){
                            this.$toast.open({
                                message: 'Banner added successfully!',
                                type: 'success',
                            });
                            location.reload();
                        }else {
                            this.$toast.open({
                                message: 'Something went wrong, try again!',
                                type: 'error',
                            });
                        }
                    });
                }else {
                    axios.post("/admin-api/banners/", formData).then((response) => {
                        if(response.data == "success"){
                            this.$toast.open({
                                message: 'Banner added successfully!',
                                type: 'success',
                            });
                            location.reload();
                        }else {
                            this.$toast.open({
                                message: 'Something went wrong, try again!',
                                type: 'error',
                            });
                        }
                    });
                }
            },
            addNewBanner(){
                if(this.form.type == "add") {
                    this.form = {
                        ...this.form,
                        type: null,
                        isShown: false
                    }
                }else {
                    this.form = {
                        ...this.form,
                        type: "add",
                        isShown: true,
                        title: "You are adding new banner"
                    }
                }
                this.banner = {
                    id: null,
                    title: "",
                    category: '',
                    order: 0,
                    photo_name: null,
                    image: null
                }
            },
            updateBanner(banner){
                if(banner != null){
                    if(this.form.type == "update" && this.banner.id == banner._id) {
                        this.form = {
                            ...this.form,
                            type: null,
                            isShown: false
                        }
                    }else {
                        this.form = {
                            ...this.form,
                            type: "update",
                            isShown: true,
                            title: "You are editing banner with title: <span class='blue'>" + banner.name + "</span>"
                        }
                    }

                    this.banner = {
                        id: banner._id,
                        title: banner.name,
                        category: banner.category._id,
                        order: banner.order,
                        photo_name: banner.photo_name,
                        image: null
                    }
                }
            },
            deleteBanner(id, index) {
                this.$confirm("Are you sure you want to delete this banner?").then(() => {
                    axios.delete("/admin-api/banners/" + id).then((response) => {
                        if(response.data === "success"){
                            this.$toast.open({
                                message: 'Banner deleted successfully!',
                                type: 'success',
                            });
                            this.banners.splice(index, 1);
                        }else {
                            this.$toast.open({
                                message: 'Couldn\'t delete banner, try again!',
                                type: 'error',
                            });
                        }
                    })
                });
            },
            getImageUrl(name){
                if(name) return require("../../../client/src/assets/banner/" + name);
            },
            uploadImage(event){
                this.banner.photo_name = event.target.files[0].name
                this.banner.image = event.target.files[0] 
            }
        },
        validations(){
            return {
                banner: {
                    title: { required, minLength: minLength(3) },
                    photo_name: { required },
                    order: { required, minValue: minValue(1) },
                    category: { required }
                }
            }
        }
    }
</script>