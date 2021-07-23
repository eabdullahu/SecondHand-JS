<template>
    <transition-group name="main__slide-image" tag="div" class="banner" mode="out-in">
        <div class="items" v-for="i in [currentIndex]" :key="i" v-bind:style="{ backgroundImage: 'url(' + currentImg.img + ')' }">
            <div class="content">
                <p v-text="currentImg.category"></p>
                <h3 v-text="currentImg.name"></h3>
                <router-link :to="{ name: 'Search', query: {  keyword: '' ,category: currentImg.categoryId } }">
                    Shop spring style
                </router-link>
            </div>
            <div class="owl-nav">
                <div class="owl-prev" style="" @click="prev">
                    <i class="flaticon-left-arrow"></i>
                </div>
                <div class="owl-next" style="" @click="next">
                    <i class="flaticon-right-arrow-angle"></i>
                </div>
            </div>
        </div>
    </transition-group>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "Slider",
        data() {
            return {
                images: null,
                timer: null,
                currentIndex: 0
            };
        },
        mounted: function() {
            this.getImages();
            this.startSlide();
        },
        methods: {
            startSlide: function() {
                this.timer = setInterval(this.next, 4000);
            },
            next: function() {
                this.currentIndex += 1;
                this.resetInterval();
            },
            prev: function() {
                this.currentIndex -= 1;
                this.resetInterval();
            },
            getImages: async function(){
                await axios.get('/api/banner_content').then((response) => {
                    this.images = response.data;
                    // console.log(this.images);
                });
            },
            resetInterval: function (){
                clearInterval(this.timer);
                setTimeout(() => this.startSlide(), 4000);
            }
        },
        computed: {
            currentImg: function() {
                if(this.images){
                    var index = Math.abs(this.currentIndex) % this.images.length;
                    // console.log(index);s
                    return {
                        category: this.images[index].category.name,
                        categoryId: this.images[index].category._id,
                        name: this.images[index].name,
                        img: require(`../assets/banner/` + this.images[index].photo_name)
                    };
                }
                return {category: "", categoryId: "", name: "", img: ""};
            }
        }
    };
</script>