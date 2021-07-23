<template>
    <div>
        <div class="container m-t-20">
            <div class="form-content">
                <form @submit.prevent="search">
                    <div class="search d-flex">
                        <div class="inputContainer mt-0">
                            <input name="search" class="search-item" v-model="keyword" placeholder="SEARCH">
                            <button  type="submit"  class="input outline-badge-green shadow header m-r-10" >
                                <font-awesome-icon  :icon="['fas','filter']"/>
                            </button>
                        </div>
                        <div class="inputContainer  open-search-filter pointer outline-badge-green shadow" @click="openSearch = !openSearch"> &nbsp;More Options</div>
                    </div>
                    <div class="other-filters transition" :class="{ show: openSearch }">
                        <div class="search d-flex w-100 ">
                            <span >
                                    <label for="start_date">Start Date</label>
                                    <input id="start_date " class="search-item" v-model="startDate" type="date" @change="search">
                                </span>
                                <span>
                                    <label for="end_date">End Date</label>
                                    <input v-model="endDate"  class="search-item" id="end_date" type="date" @change="search">
                                </span>
                                <span>
                                    <label for="status_data">Status Data</label>
                                    <select v-model="productStatus"  class="search-item" name="date" id="status_data" @change="search">
                                        <option value="all"> All </option>
                                        <option value="true"> Active </option>
                                        <option value="false"> Deactivate </option>
                                    </select>
                                </span>
                        </div>
                        <div class="search d-flex w-100 ">
                                 <span>
                                    <label for="status_data">Gender</label>
                                    <select v-model="gender" @change="search"  class="search-item">
                                        <option value=""> All </option>
                                        <option value="M"> Male </option>
                                        <option value="F"> Female </option>
                                    </select>
                                </span>
                                <span>
                                    <label for="status_data" >Category</label>
                                    <select v-model="category_search"  @change="search"  class="search-item">
                                        <option value=""> All </option>
                                        <option v-for="c in category" :key="c._id" :value="c._id">{{ c.name }} </option>
                                    </select>
                                </span>
                                <span>
                                    <label for="user_email">Posted by:</label>
                                    <input id="user_email" v-model="posted_by"  class="search-item" placeholder="User email" @change="search">
                                </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="container m-t-20">
            <h4 class="title"> Products </h4>
            <div class="responsiveTable">
            <Product :products="products" :noProducts = "noProducts"/>
            <Pagination v-if="totalProducts > visibleItemsPerPageCount"
                        :current-page = "page"
                        :page-count = "pageCount"
                        class="search-pagination"
                        @nextPage="changeRoute"
                        @previousPage="changeRoute"
                        @loadPage="changeRoute"
            />
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import Product from "../components/Product";
import Pagination from "../components/Pagination";

export default {
    name: "Products",
    components: {
        Product,
        Pagination
    },
    data(){
        return{
            page:  1 ,
            keyword: '',
            posted_by: '',
            gender: '',
            startDate: null,
            endDate: null,
            changed: null,
            openSearch: false,
            no: 4,
            totalProducts: 0,
            visibleItemsPerPageCount: 5,
            sortByPrice: "",
            noProducts: false,
            productStatus: "all",
            products:[],
            value: [],
            pageCount:0,
            category: [],
            category_search: ''
        }
    },
    created() {
        this.populatePage();
    },
    watch: {
        value(){
            this.changeRoute();
        }
    },
    methods: {
        async populatePage() {
            let filter = {
                keyword: this.keyword,
                page: this.visibleItemsPerPageCount * (this.page - 1),
                limit: this.visibleItemsPerPageCount,
                gender: this.gender,
                endDate: this.endDate,
                startDate: this.startDate,
                productStatus: this.productStatus,
                posted_by: this.posted_by,
                category: this.category_search,
            }

            await axios.post('/admin-api/products/search', filter).then(res => {
                if (res.data.products !== undefined && res.data.products.length > 0) {
                    this.totalProducts = res.data.total;
                    this.pageCount = Math.ceil(res.data.total / this.visibleItemsPerPageCount);
                    this.products = res.data.products;
                    this.noProducts = true
                    this.category = res.data.category
                } else {
                    this.totalProducts = 0;
                    this.products = []
                    this.noProducts = false
                }
            });
        },
        changeRoute(page = 1){
            this.page = page
            this.populatePage()
        },

        onSort(event){
            this.sortByPrice = event.target.value;
            this.populatePage();
        },
        search(){
            this.changeRoute();
        },
        clear() {
            this.page= 1
            this.keyword= ''
            this.gender = ''
            this.startDate = null
            this.endDate = null
            this.posted_by = ''
            this.category_search= ''
            this.productStatus = 'all'
            this.populatePage()
        }
    },
};
</script>
<style scoped>
    .show {
        display: block !important;
    }

    .d-none {
        display: none;
    }

    input::-webkit-calendar-picker-indicator {
        filter: invert(1);
    }
    select option {
        background-color: #060818;
        color: #FFFFFF;
        border: none;
    }
    button:hover {
        cursor: pointer;
    }
    .pointer:hover {
        cursor: pointer;
    }
</style>