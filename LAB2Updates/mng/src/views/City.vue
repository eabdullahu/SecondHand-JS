<template>
  <div class="container m-t-20">
           <div class="inputContainer justify-content-between align-items-center m-t-0"> 
                <h4 class="title"> Cities </h4>
                <div class="d-flex widthUnset">
                    <form @submit.prevent="filterCity()" autocomplete="off">
                        <div class="inputContainer g33 m-t-0 justify-content-end">
                            <div>
                                <input name="name" type="text" placeholder="Name" class="input filter text-uppercase" v-model="search.name">
                            </div>
                            <button class="input outline-badge-green shadow header m-r-10">
                                <font-awesome-icon :icon="['fas', 'filter']" />
                            </button>
                        </div>
                    </form>
                    <input type="submit" name="submit" class="input outline-badge-blue shadow header" value="+ New city" @click="addNewCity()">
                </div>
            </div>
        <div class="responsiveTable">
            <table class="m-t-20">
                <thead>
                    <tr>
                        <th class="text-center">Name</th>
                        <th>ZIP CODE </th>
                        <th class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>

                    <tr v-for = 'c in cities' :key="c._id">
                        <td class="text-center">{{ c.name }}</td>
                        <td class="text-primary">{{ c.zipcode }}</td>
                        <td>
                            <div class="icons">
                                <button type="button" @click="updateCity(c)">
                                    <font-awesome-icon :icon="['fas', 'edit']" class="blue" />
                                </button>                                
                                <button type="submit"  @click="deleteCity(c._id)" name="delete"><font-awesome-icon :icon="['fas', 'trash-alt']" class="red" /></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <form v-on:submit.prevent="handleSubmit" class="p-20 m-t-20 bg" autocomplete="off" v-if="form.isOpened">
            <div class="first width100 m-r-0">
                <h4 class="title" v-html="form.title"></h4>
                <div class="inputContainer g33">
                    <div>
                        <p>City Name</p>
                        <input type="text" class="input text-uppercase" placeholder="Name"  v-model="$v.city.name.$model" :class="{ 'error-input': $v.city.name.$error }">
                    </div>
                    <div>
                        <p>ZIP code</p>
                        <input type="number" class="input" placeholder="ZIP CODE" v-model="$v.city.zipcode.$model" :class="{ 'error-input': $v.city.zipcode.$error }">
                    </div>
                </div>
                <div class="inputContainer justify-content-end m-t-20">
                    <input type="submit" name="submit" class="input header outline-badge-green shadow" value="Save Changes">
                </div>
            </div>
        </form>
        <Pagination v-if="pagination.total > pagination.toshow"
            :currentPage="pagination.page"
            :pageCount="Math.ceil(this.pagination.total / this.pagination.toshow)"
            class="search-pagination"
            @nextPage="filterCity"
            @previousPage="filterCity"
            @loadPage="filterCity"
        />
    </div>
</template>

<script>
import axios from 'axios';
import { required, minLength, minValue } from 'vuelidate/lib/validators';
export default {
        name: "City",
        props: {
            name: { type: String, default: null },
            page: { type: Number, default: 1 },
        },
        data() {
            return {
                cities: [],
                form: {
                    isOpened: false,
                    title: null,
                    type: null
                },
                city: {
                    id:null,
                    name: '',
                    zipcode: ''
                },
                search: { 
                    name: this.city,
                    zipcode: this.zipcode
                },
                pagination: {
                    total: 0,
                    toshow: 10,
                    page: this.page
                }
            }
            
        },
        created(){
            this.getCities();
        },
        watch: {
            $route () {
                this.getCities();
            }
        },
        methods: {
            getCities(){
                  axios.get("/admin-api/city/"+ JSON.stringify({ ...this.search, ...this.pagination, page: this.pagination.toshow * (this.pagination.page - 1) })).then(res=>{
                    console.log(res);
                    this.cities = res.data.cities;
                    this.pagination.total = res.data.count;

                  })
            },
            filterCity(page = 1){
                this.pagination.page = page;
                this.$router.push({
                    name: 'City',
                    query: { name: this.search.name, page: page},
                }, () => {});
            },
            deleteCity(id){
                this.$confirm("Are you sure you want to delete this city?").then(() => {
                    axios.delete("/admin-api/city/" + id).then(response => {
                        if(response.data == "success"){
                            const index = this.cities.findIndex(c => c._id == id);
                            this.cities.splice(index, 1);
                            this.$toast.open({
                                message: 'City deleted successfully!',
                                type: 'success',
                            });
                        }else {
                            this.$toast.open({
                                message: 'Couldn\'t delete city, try again!',
                                type: 'error',
                            });
                        }
                    });
                });
            },
            addNewCity(){
                if(this.form.type == "add") {
                    this.form = {
                        ...this.form,
                        type: null,
                        isOpened: false
                    } 
                }else {
                    this.form = {
                        ...this.form,
                        type: "add",
                        isOpened: true,
                        title: "You are adding new city"
                    }
                }
                this.city = {
                    id :null,
                    name: "",
                    zipcode: 0,
                }
            },
            handleSubmit() {
                
                this.$v.$touch();
                if (this.$v.$pending || this.$v.$error) {
                    return;
                }
                console.log(this.city.id);

                if(this.city.id !== null){
                    axios.patch("/admin-api/city/" + this.city.id, {
                        city: this.city
                    }).then(response => {
                        if(response.data == "success"){
                            const index = this.cities.findIndex(c => c._id == this.city.id);
                            this.cities[index].name = this.city.name;
                            this.cities[index].zipcode = this.city.zipcode;
                            this.$toast.open({
                                message: 'Coupon updated successfully!',
                                type: 'success',
                            });
                        }else {
                            this.$toast.open({
                                message: 'Something went wrong, try again!',
                                type: 'error',
                            });
                        }
                    });
                }else {
                    axios.post("/admin-api/city", {
                        city: { ...this.city }
                    }).then(response => {
                        if(response.data._id){
                            this.$toast.open({
                                message: 'City added successfully!',
                                type: 'success',
                            });
                            this.cities.push(response.data)
                        }else {
                            this.$toast.open({
                                message: 'Something went wrong, try again!',
                                type: 'error',
                            });
                        }
                    });
                }
            },
            updateCity(city){
                if(city != null){
                    if(this.form.type == "update" && this.city.id == city._id) {
                        this.form = {
                            ...this.form,
                            type: null,
                            isOpened: false
                        }
                    }else {
                        this.form = {
                            ...this.form,
                            type: "update",
                            isOpened: true,
                            title: "You are editing city with name: <span class='blue'>" + city.name + "</span>"
                        }
                    }
                    this.city = {
                        id:city._id,
                        name: city.name,
                        zipcode: city.zipcode,
                    }
                }
            }
        },
        validations(){
            return {
                city: {
                    name: {required, minLength: minLength(2)},
                    zipcode: {required, minValue: minValue(1)},
                }
            }
        }
    }

</script>