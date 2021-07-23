<template>
    <div>
        <div class="container m-t-20">
            <div class="inputContainer justify-content-between align-items-center m-t-0"> 
                <h4 class="title"> Categories </h4>
                <div class="d-flex widthUnset">
                    <input type="submit" class="input outline-badge-blue shadow header" value="+ New category" @click="addNewCategory()">
                </div>
            </div>
            <div class="m-t-20">
                <ul class="sitemap">
                    <li>
                        <div class="row">
                            <label>Image</label>
                            <label>Title</label>
                            <label>Order</label>
                            <label class="text-center">Status</label>
                            <label>Under homepage ?</label>
                            <label>Actions</label>
                        </div>
                    </li>
                    <li v-for="(c1, index1) in categories" :key="c1._id" style="padding: 0;"> 
                        <ul>
                            <li>
                                <div class="row">
                                    <label><img :src="getImageUrl(c1.photo_name)" /> </label>
                                    <label class="text-primary">{{ c1.name }}</label>
                                    <label>Order no. {{ c1.order }}</label>
                                    <div>
                                        <span class="badge outline-badge-green" v-if="c1.is_active == true">Active</span>
                                        <span class="badge outline-badge-red" v-else-if="c1.is_active == false">Deactive</span>
                                    </div>
                                    <div>
                                        <span class="badge outline-badge-green" v-if="c1.is_under_homepage == true">Yes</span>
                                        <span class="badge outline-badge-red" v-else-if="c1.is_under_homepage == false">No</span>
                                    </div>
                                    <div class="icons">
                                        <button type="button" name="delete" @click="toggleCategorySubs(c1._id)" v-if="c1.children && c1.children.length > 0">
                                            <font-awesome-icon :icon="['fas', 'sitemap']" class="green" />
                                        </button>
                                        <button type="button" name="delete" @click="updateCategory(c1)">
                                            <font-awesome-icon :icon="['fas', 'edit']" class="blue" />
                                        </button>
                                        <button type="button" name="delete" @click="deleteCategory(c1, index1)">
                                            <font-awesome-icon :icon="['fas', 'trash-alt']" class="red" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                            <li v-for="(c2, index2) in c1.children" :key="c2._id" class="slideup" :class="'cl'+c1._id" style="background: #070A1E; ">
                                <ul>
                                    <li>
                                        <div class="row">
                                            <label><img :src="getImageUrl(c2.photo_name)" /> </label>
                                            <label class="text-primary">{{ c2.name }}</label>
                                            <label>Order no. {{ c2.order }}</label>
                                            <div>
                                                <span class="badge outline-badge-green" v-if="c2.is_active == true">Active</span>
                                                <span class="badge outline-badge-red" v-else-if="c2.is_active == false">Deactive</span>
                                            </div>
                                            <div>
                                                <span class="badge outline-badge-green" v-if="c2.is_under_homepage == true">Yes</span>
                                                <span class="badge outline-badge-red" v-else-if="c2.is_under_homepage == false">No</span>
                                            </div>
                                            <div class="icons">
                                                <button type="button" name="delete" @click="toggleCategorySubs(c2._id)" v-if="c2.children && c2.children.length > 0">
                                                    <font-awesome-icon :icon="['fas', 'sitemap']" class="green" />
                                                </button>
                                                <button type="button" name="delete" @click="updateCategory(c2, index1)">
                                                    <font-awesome-icon :icon="['fas', 'edit']" class="blue" />
                                                </button>
                                                <button type="button" name="delete" @click="deleteCategory(c2, index1, index2)">
                                                    <font-awesome-icon :icon="['fas', 'trash-alt']" class="red" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                    <li v-for="(c3, index3) in c2.children" :key="c3._id" class="slideup" :class="'cl'+c2._id" style="background: #080B24; "> 
                                        <ul>
                                            <li>
                                                <div class="row">
                                                    <label><img :src="getImageUrl(c3.photo_name)" /> </label>
                                                    <label class="text-primary">{{ c3.name }}</label>
                                                    <label>Order no. {{ c3.order }}</label>
                                                    <div>
                                                        <span class="badge outline-badge-green" v-if="c3.is_active == true">Active</span>
                                                        <span class="badge outline-badge-red" v-else-if="c3.is_active == false">Deactive</span>
                                                    </div>
                                                    <div>
                                                        <span class="badge outline-badge-green" v-if="c3.is_under_homepage == true">Yes</span>
                                                        <span class="badge outline-badge-red" v-else-if="c3.is_under_homepage == false">No</span>
                                                    </div>
                                                    <div class="icons">
                                                        <button type="button" name="delete" @click="updateCategory(c3, index1, index2)">
                                                            <font-awesome-icon :icon="['fas', 'edit']" class="blue" />
                                                        </button>
                                                        <button type="button" name="delete" @click="deleteCategory(c3, index1, index2, index3)">
                                                            <font-awesome-icon :icon="['fas', 'trash-alt']" class="red" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <form v-on:submit.prevent="handleSubmit" class="p-20 m-t-20 bg" v-if="form.isShown">
                <div class="first width100 m-r-0">
                    <h4 class="title" v-html="form.title"></h4>
                    <div class="inputContainer g33">
                        <div>
                            <p>Title</p>
                            <input type="text" class="input" placeholder="Title" v-model="$v.category.name.$model" :class="{ 'error-input': $v.category.name.$error }">
                        </div>
                        <div>
                            <p>Parent</p>
                            <select class="input" @change="updateSubParents($event)" v-model="category.parent" :disabled="category.id !== null">
                                <option value="0">Parent 0</option>
                                <option v-for="(c, index) in categories" :data-index="index" :value="c._id" :key="c._id">{{ c.name }}</option>
                            </select>
                        </div>
                        <div>
                            <p>Subparent</p>
                            <select class="input" v-model="category.subparent" :disabled="category.id !== null">
                                <option value="none" selected>Choose [ Not required]</option>
                                <option v-for="c1 in form.subCategories" :value="c1._id" :key="c1._id">{{ c1.name }}</option>
                            </select>
                        </div>
                        <div>
                            <p>Order no.</p>
                            <input type="number" class="input" placeholder="Order no." v-model="$v.category.order.$model" :class="{ 'error-input': $v.category.order.$error }">
                        </div>
                    </div>
                    <div class="inputContainer g33">
                        <div>
                            <p>File</p>
                            <div class="custom-control">
                                <input type="file" class="input" placeholder="File" @change="uploadImage" >
                                <span class="file">
                                    <span>{{ category.photo_name || "No image chosen" }}</span>
                                    <div class="choose"><font-awesome-icon :icon="['fas', 'upload']" /></div>
                                </span>
                            </div>
                        </div>
                        <div class="radio">
                            <p class="block">Status</p>
                            <div class="custom-control inline">
                                <input type="radio" id="status_active" name="status" value="true" class="input" v-model="category.is_active">
                                <label for="status_active">Active</label>
                            </div>
                            <div class="custom-control inline">
                                <input type="radio" id="status_deactive" name="status" value="false" class="input" v-model="category.is_active">
                                <label for="status_deactive">Deactive</label>
                            </div>
                        </div>
                        <div class="radio">
                            <p class="block">Under homepage ?</p>
                            <div class="custom-control inline">
                                <input type="radio" id="under_homepage_yes" name="under_homepage" value="true" class="input" v-model="category.under_homepage">
                                <label for="under_homepage_yes">Yes</label>
                            </div>
                            <div class="custom-control inline">
                                <input type="radio" id="under_homepage_no" name="under_homepage" value="false" class="input" v-model="category.under_homepage">
                                <label for="under_homepage_no">No</label>
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
                categories: [],
                category: {
                    id: null,
                    name: "",
                    parent: '0',
                    subparent: 'none',
                    order: 0,
                    photo_name: null,
                    image: null,
                    is_active: true,
                    under_homepage: false
                },
                form: {
                    subCategories : [],
                    isShown: false,
                    title: null,
                    type: null
                }
            }
        },
        created(){
            this.getCategories();
        },
        methods: {
            updateSubParents(event){
                if(Number.isInteger(event)) return this.form.subCategories = this.categories[event].children;
                this.form.subCategories = this.categories[event.target[event.target.selectedIndex].getAttribute('data-index')].children;
            },
            getCategories(){
                axios.get("/admin-api/category/", {
                    params: {
                        is_active: true,
                        parentId: 0
                    }
                }).then(response => {
                    this.categories = response.data
                });  
            },
            addNewCategory(){
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
                        title: "You are adding new category"
                    }
                }
                this.category = {
                    id: null,
                    name: "",
                    parent: '0',
                    subparent: 'none',
                    order: 0,
                    photo_name: null,
                    image: null,
                    is_active: true,
                    under_homepage: false
                }
            },
            updateCategory(category, id1 = null, id2 = null) {
                if(category != null){
                    if(this.form.type == "update" && this.category.id == category._id) {
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
                            title: "You are editing category with name: <span class='blue'>" + category.name + "</span>"
                        }
                    }

                    if(id2 !== null) this.updateSubParents(id1);

                    this.category = {
                        id: category._id,
                        name: category.name,
                        parent: (id1 !== null) ? this.categories[id1]._id : "0", 
                        subparent: (id2 !== null) ? this.categories[id1].children[id2]._id : "none",
                        order: category.order,
                        photo_name: category.photo_name,
                        image: null,
                        is_active: category.is_active,
                        under_homepage: category.is_under_homepage
                    }
                }
            },
            handleSubmit() {
                this.$v.$touch();
                if (this.$v.$pending || this.$v.$error) {
                    return;
                }
                const formData = new FormData();
                formData.append('file', this.category.image)
                formData.append('category', JSON.stringify(this.category));
                
                if(this.category.id !== null){
                    axios.patch('/admin-api/category/' + this.category.id, formData).then((response) => {
                        if(response.data == "success"){
                            this.$toast.open({
                                message: 'Category updated successfully!',
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
                    axios.post('/admin-api/category/', formData).then((response) => {
                        if(response.data == "success"){
                            this.$toast.open({
                                message: 'Category added successfully!',
                                type: 'success',
                            });
                            location.reload();
                        }else {
                            this.$toast.open({
                                message: 'Something went wrong, try again!',
                                type: 'error',
                            });
                        }
                    })
                }
            },
            deleteCategory(ct, index1 = null, index2 = null, index3 = null) {
                if(Array.isArray(ct.children) && ct.children.length > 0){
                    this.$alert("You have to delete it's child's first.")
                }else {
                    const data = { 
                        parent: this.categories[index1]._id, 
                        subparent: this.categories[index1].children[index2]?._id,
                        subparent2: this.categories[index1].children[index2]?.children[index3]?._id
                    }
                    this.$confirm("Are you sure you want to delete this category?").then(() => {
                        axios.delete("/admin-api/category/" + ct._id, { data: data }).then(response => {
                            if(response.data == "success"){
                                if(index3 !== null){
                                    this.categories[index1].children[index2].children.splice(index3, 1);
                                }else if(index2 !== null){
                                    this.categories[index1].children.splice(index2, 1);
                                }else if(index1 !== null) {
                                    this.categories.splice(index1, 1);
                                }
                                this.$toast.open({
                                    message: 'Category deleted successfully!',
                                    type: 'success',
                                });
                            }else {
                                this.$toast.open({
                                    message: 'Couldn\'t delete category, try again!',
                                    type: 'error',
                                });
                            }
                        });
                    });
                }
            },
            getImageUrl(name){
                if(name) return require("../../../client/src/assets/banner/" + name);
            },
            toggleCategorySubs(id){
                document.querySelectorAll('.cl'+id).forEach(function(el) {
                    el.classList.toggle("slidedown")
                });
            },
            uploadImage(event){
                this.category.photo_name = event.target.files[0].name
                this.category.image = event.target.files[0] 
            }
        },
        validations(){
            return {
                category: {
                    name: { required, minLength: minLength(3) },
                    order: { required, minValue: minValue(1) }
                }
            }
        }
    }
</script>