<template>
    <div>
        <div class="container m-t-20">
            <div class="inputContainer justify-content-between align-items-center m-t-0"> 
                <h4 class="title"> Coupons </h4>
                <div class="d-flex widthUnset">
                    <form @submit.prevent="filterCoupons()" autocomplete="off">
                        <div class="inputContainer g33 m-t-0 justify-content-end">
                            <div>
                                <input name="token" type="text" placeholder="Token" class="input filter text-uppercase" v-model="search.token">
                            </div>
                            <div>
                                <select name="status" class="input filter" v-model="search.status">
                                    <option value="">[ Status ]</option>
                                    <option selected value="all"> All </option> 
                                    <option value="true"> Active </option>
                                    <option value="false"> Deactive </option> 
                                </select>
                            </div>
                            <div>
                                <input type="text" name="postedby" placeholder="Posted by" class="input filter" v-model="search.postedby">
                                <input type="hidden" name="page" v-model="pagination.page">
                            </div>
                            <button class="input outline-badge-green shadow header m-r-10">
                                <font-awesome-icon :icon="['fas', 'filter']" />
                            </button>
                        </div>
                    </form>
                    <input type="submit" name="submit" class="input outline-badge-blue shadow header" value="+ New coupon" @click="addNewCoupon()">
                </div>
            </div>
            <div class="responsiveTable">
                <table class="m-t-20">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Discount %</th>
                            <th>Status</th>
                            <th>Created at</th>
                            <th>Posted by</th>
                            <th>Used times</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cp in coupons" :key="cp._id">
                            <td class="text-center text-primary">{{ cp.token }}</td>
                            <td>{{ cp.discount }} %</td>

                            <td>
                                <span class="badge outline-badge-green" v-if="cp.is_active == true">Active</span>
                                <span class="badge outline-badge-red" v-else-if="cp.is_active == false">Deactive</span>
                            </td>

                            <td>{{ new Date(cp.created_at).toLocaleString() }}</td>
                            <td>{{ cp.posted_by.first_name + " " + cp.posted_by.last_name }}</td>
                            <td>{{ cp.times_used }}</td>
                            
                            <td>
                                <div class="icons">
                                    <a href="javascript:void(0)" @click="updateCoupon(cp)" title="edit post">
                                        <font-awesome-icon :icon="['fas', 'edit']" class="green" />
                                    </a>
                                    <button type="submit" name="delete" @click="deleteCoupon(cp._id)">
                                        <font-awesome-icon :icon="['fas', 'trash-alt']" class="red" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="coupons.length < 1">
                            <td colspan="7" class="text-center">No coupons found !</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <form v-on:submit.prevent="handleSubmit" class="p-20 m-t-20 bg" autocomplete="off" v-if="form.isOpened">
                <div class="first width100 m-r-0">
                    <h4 class="title" v-html="form.title"></h4>
                    <div class="inputContainer g33">
                        <div>
                            <p>Token</p>
                            <input type="text" class="input text-uppercase" placeholder="Token" :disabled="this.form.type == 'update'" v-model="$v.coupon.token.$model" :class="{ 'error-input': $v.coupon.token.$error }">
                        </div>
                        <div>
                            <p>Discount</p>
                            <input type="number" class="input" placeholder="Discount %" v-model="$v.coupon.discount.$model" :class="{ 'error-input': $v.coupon.discount.$error }">
                        </div>
                        <div class="radio">
                            <p class="block">Status</p>
                            <div class="custom-control inline">
                                <input type="radio" id="status_active" name="status" value="true" class="input" v-model="$v.coupon.status.$model" :class="{ 'error-input': $v.coupon.status.$error }">
                                <label for="status_active">Active</label>
                            </div>
                            <div class="custom-control inline">
                                <input type="radio" id="status_deactive" name="status" value="false" class="input" v-model="$v.coupon.status.$model" :class="{ 'error-input': $v.coupon.status.$error }">
                                <label for="status_deactive">Deactive</label>
                            </div>
                        </div>
                    </div>

                    <div class="inputContainer g33" v-if="form.type == 'update'">
                        <div>
                            <p>Created by</p>
                            <input type="text" class="input" placeholder="Created by" v-model="coupon.createdBy" disabled>
                        </div>
                        <div>
                            <p>Created at</p>
                            <input type="text" class="input" placeholder="Created at" v-model="coupon.createdAt" disabled>
                        </div>
                        <div>
                            <p>Times used</p>
                            <input type="email" class="input" placeholder="User email" v-model="coupon.timesUsed" disabled>
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
                @nextPage="filterCoupons"
                @previousPage="filterCoupons"
                @loadPage="filterCoupons"
            />
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { required, minLength, minValue } from 'vuelidate/lib/validators'
    import Pagination from "../components/Pagination";
    export default {
        name: "Coupons",
        components: {
            Pagination
        },
        props: {
            token: { type: String, default: null },
            status: { type: String, default: "all" },
            postedby: { type: String, default: null },
            page: { type: Number, default: 1 },
        },
        data() {
            return {
                coupons: [],
                coupon: {
                    id: null,
                    token: "",
                    discount: 0,
                    status: true,
                    createdBy: "",
                    createdAt: "",
                    timesUsed: ""
                },
                form: {
                    isOpened: false,
                    title: null,
                    type: null
                },
                search: { 
                    token: this.token,
                    status: this.status ? this.status : "all",
                    postedby: this.postedby
                },
                pagination: {
                    total: 0,
                    toshow: 10,
                    page: this.page
                }
            }
        },
        created(){
            this.getCoupons();
        },
        watch: {
            $route () {
                this.getCoupons();
            }
        },
        methods: {
            getCoupons(){
                axios.get("/admin-api/coupons/" + JSON.stringify({ ...this.search, ...this.pagination, page: this.pagination.toshow * (this.pagination.page - 1) })).then(response => {
                    this.coupons = response.data.coupons
                    this.pagination.total = response.data.count
                });
            },
            filterCoupons(page = 1){
                this.pagination.page = page;
                this.$router.push({
                    name: 'Coupons',
                    query: { token: this.search.token, status: this.search.status, postedby: this.search.postedby, page: page},
                }, () => {});
            },
            handleSubmit() {
                this.$v.$touch();
                if (this.$v.$pending || this.$v.$error) {
                    return;
                }
                const user = JSON.parse(localStorage.getItem("currentUser"));
                if(this.coupon.id !== null){
                    axios.patch("/admin-api/coupons/" + this.coupon.id, {
                        coupon: this.coupon
                    }).then(response => {
                        if(response.data == "success"){
                            const index = this.coupons.findIndex(c => c._id == this.coupon.id);
                            this.coupons[index].discount = this.coupon.discount;
                            this.coupons[index].is_active = this.coupon.status == "true" ? true : false;
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
                    axios.post("/admin-api/coupons", {
                        coupon: { ...this.coupon, posted_by: user._id }
                    }).then(response => {
                        if(response.data._id){
                            this.$toast.open({
                                message: 'Coupon added successfully!',
                                type: 'success',
                            });
                            this.coupons.push(response.data)
                        }else {
                            this.$toast.open({
                                message: 'Something went wrong, try again!',
                                type: 'error',
                            });
                        }
                    });
                }
            },
            addNewCoupon(){
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
                        title: "You are adding new coupon"
                    }
                }
                this.coupon = {
                    id: null,
                    token: "",
                    discount: 0,
                    status: true
                }
            },
            updateCoupon(coupon){
                if(coupon != null){
                    if(this.form.type == "update" && this.coupon.id == coupon._id) {
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
                            title: "You are editing coupon with token: <span class='blue'>" + coupon.token + "</span>"
                        }
                    }
                    this.coupon = {
                        id: coupon._id,
                        token: coupon.token,
                        discount: coupon.discount,
                        status: coupon.is_active,
                        createdBy: coupon.posted_by.first_name + ' ' + coupon.posted_by.last_name,
                        createdAt: new Date(coupon.created_at).toLocaleString(),
                        timesUsed: coupon.times_used
                    }
                }
            },
            deleteCoupon(id){
                this.$confirm("Are you sure you want to delete this coupon?").then(() => {
                    axios.delete("/admin-api/coupons/" + id).then(response => {
                        if(response.data == "success"){
                            const index = this.coupons.findIndex(c => c._id == id);
                            this.coupons.splice(index, 1);
                            this.$toast.open({
                                message: 'Coupon deleted successfully!',
                                type: 'success',
                            });
                        }else {
                            this.$toast.open({
                                message: 'Couldn\'t delete coupon, try again!',
                                type: 'error',
                            });
                        }
                    });
                });
            }
        },
        validations(){
            return {
                coupon: {
                    token: {required, minLength: minLength(10)},
                    discount: {required, minValue: minValue(1)},
                    status: {required}
                }
            }
        }
    }
</script>