<template>
        <div class="d-flex justify-content-end">
            <div class="viewMore pagination-buttons three-dots" @click="(currentPage === 1) ?  '' : previousPage()"
               v-bind:class="{'three-dots-active':(currentPage > 1)}">Prev</div>
            <a class="viewMore pagination-buttons" @click="(1 === currentPage) ?  '' :onLoadPage(1)"
               v-bind:class="{'active_page':(1 === currentPage)}">1</a>
            <div class="viewMore pagination-buttons " v-show="leftEllipse">...</div>
            <a class="viewMore pagination-buttons" v-for="p in filteredNumber" :key="p" @click="(p === currentPage) ?  '' :onLoadPage(p)"
               v-bind:class="{'active_page':(p === currentPage)}">{{ p }}</a>
            <div class="viewMore pagination-buttons three-dots" v-if="rightEllipse">...</div>
            <a class="viewMore pagination-buttons" @click="(pageCount === currentPage) ?  '' :onLoadPage(pageCount)"
               v-bind:class="{'active_page':(pageCount === currentPage)}">{{ pageCount }} </a>
            <div class="viewMore pagination-buttons three-dots" @click="(currentPage === pageCount) ?  '' : nextPage()"
                   v-bind:class="{'three-dots-active':(currentPage < pageCount)}">Next</div>

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
    data() {
        return {
            leftEllipse: false,
            rightEllipse: true,
            radius: 2
        }
    },
    computed: {
        filteredNumber() {
            var pages = [];
            for (var i = 2; i < this.pageCount; i++) {
                (this.currentPage - this.radius < i && this.currentPage >= i) || (this.currentPage + this.radius > i && this.currentPage <= i && this.currentPage != i) ? pages.push(i) : '';
            }
            return pages;
        },
    },
    created() {
        this.checkEllipse()
    },
    watch: {
        '$route.query.page': function () {
            this.checkEllipse()

        }
    },
    methods: {
        nextPage() {
            var page = this.currentPage + 1
            this.$emit('nextPage', page)
        },
        previousPage() {
            var page = this.currentPage - 1
            this.$emit('previousPage', page)
        },
        onLoadPage(value) {
            this.$emit("loadPage", value)
        },
        checkEllipse() {
            this.leftEllipse = (this.currentPage - this.radius >= 2 && this.currentPage != 1) ? true : false;
            this.rightEllipse = (this.currentPage != this.pageCount && this.currentPage + this.radius < this.pageCount) ? true : false;
        }
    }
}
</script>
<style scoped>
    .three-dots {
        display: flex;
        align-items: center;
        padding: 0 5px;
        border-radius: 4px;
        border: 1px solid black;
    }
    .three-dots-active{
        background-color: #060818;
        color: #FFFFFF;
    }
    .three-dots-active:hover {
        background-color: #25d5e4;
        color: #FFFFFF;
        cursor: pointer;
    }
    .active_page{
        background-color: #25d5e4;
        color: #000000;
    }

    a.pagination-buttons,
    div.pagination-buttons {
        width: auto;
        margin-left: 5px;
        height: 30px;
        padding: 0px 14px;
        font-size: 10px;
        margin-top: 10px;
    }
</style>