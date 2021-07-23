<template>
    <div>
        <div class="pagination-numbers">
            <ul>
                <li @click="(currentPage === 1) ?  '' : previousPage()" v-bind:class="{'deactivate_button':(currentPage === 1)}">Prev</li>
                <li @click="(1 === currentPage) ?  '' :onLoadPage(1)" v-bind:class="{'active_page':(1 === currentPage)}">1</li>
                <li v-show="leftEllipse" class="deactivate_button">...</li>
                <li v-for="p in filteredNumber" :key="p" @click="(p === currentPage) ?  '' :onLoadPage(p)"  v-bind:class="{'active_page':(p === currentPage)}" >{{ p }}</li>
                <li v-if="rightEllipse" class="deactivate_button">...</li>
                <li @click="(pageCount === currentPage) ?  '' :onLoadPage(pageCount)" v-bind:class="{'active_page':(pageCount === currentPage)}">{{ pageCount }}</li>
                <li @click="(currentPage === pageCount) ?  '' : nextPage()" v-bind:class="{'deactivate_button':(currentPage === pageCount)}">Next</li>
            </ul>  
        </div>
    </div>
</template>
<script>

export default {
    props: {
        currentPage: {
            type: Number,
            required: true
        },
        pageCount: { 
            type: Number,
            required: true
        }
    },
    data(){
        return {
            leftEllipse:false,
            rightEllipse:true,
            radius :2
        }
    },
    computed: {
        filteredNumber() {
            var pages=[];
            for (var i=2; i<this.pageCount; i++) {
                (this.currentPage-this.radius<i && this.currentPage>= i) ||  (this.currentPage+this.radius>i && this.currentPage<= i && this.currentPage != i) ? pages.push(i) :'';
            }
            return pages;
        },
    },
    created(){
        this.checkEllipse()
    },
    watch: {
        '$route.query.page':function() {
            this.checkEllipse()

        }
    },
    methods: {
        nextPage() {
            var page = this.currentPage+1
            this.$emit('nextPage',page)
        },
        previousPage() {
            var page = this.currentPage-1
            this.$emit('previousPage',page)
        },
        onLoadPage(value) {
            this.$emit("loadPage", value)
        },
        checkEllipse(){
            this.leftEllipse = (this.currentPage-this.radius >=2 &&  this.currentPage != 1) ? true : false;
            this.rightEllipse = (this.currentPage != this.pageCount && this.currentPage+this.radius < this.pageCount) ? true : false;
        }
    }
}
</script>
<style scoped>

</style>