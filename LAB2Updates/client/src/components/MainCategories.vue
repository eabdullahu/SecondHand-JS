<template>
    <div class="category" v-if="five_category.length == 5">
        <div class="left">
            <div class="top-left">
                <router-link :to="{ name: 'Search', query: {  keyword: '' ,category: five_category[0].name } }">
                    <img :src="require('../assets/banner/' + five_category[0].photo_name)" />
                    <div class="category-title">
                        <p v-text="five_category[0].name"></p>
                        <p class="buy"> + Store</p>
                    </div>
                </router-link>
            </div>
            <div class="row">
                <div class="bottom-left-left">
                    <router-link :to="{ name: 'Search', query: {  keyword: '' ,category: five_category[1].name } }">
                        <img :src="require('../assets/banner/' + five_category[1].photo_name)" />
                        <div class="category-title">
                            <p v-text="five_category[1].name"></p>
                            <p class="buy"> + Store</p>
                        </div>
                    </router-link>
                </div>
                <div class="bottom-left-right">
                   <router-link :to="{ name: 'Search', query: {  keyword: '' ,category: five_category[2].name } }">
                        <img :src="require('../assets/banner/' + five_category[2].photo_name)" />
                        <div class="category-title">
                            <p v-text="five_category[2].name"></p>
                            <p class="buy"> + Store</p>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="top-right">
                <router-link :to="{ name: 'Search', query: {  keyword: '' ,category: five_category[3].name } }">
                    <img :src="require('../assets/banner/' + five_category[3].photo_name)" />
                    <div class="category-title">
                        <p v-text="five_category[3].name"></p>
                        <p class="buy"> + Store</p>
                    </div>
                </router-link>
            </div>
            <div class="bottom-right">
                <router-link :to="{ name: 'Search', query: {  keyword: '' ,category: five_category[4].name } }">
                    <img :src="require('../assets/banner/' + five_category[4].photo_name)" />
                    <div class="category-title">
                        <p v-text="five_category[4].name"></p>
                        <p class="buy"> + Store</p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "MainCategories",
        data() {
            return {
                five_category: []
            }
        },
        mounted: async function(){
            const categories = await axios.get('/api/category', {
                params: {
                    is_under_homepage: true
                }
            });
            this.five_category = categories.data;
        }
    };
</script>