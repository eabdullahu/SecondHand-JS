<template>
    <div   v-if="reviews.length > 1" class="review-container"> 
        <div class="review-holder" v-for="r in reviews" v-bind:key='r._id'>
            <p>{{ r.posted_by.email }}</p>
            <p class="user-reviews"> <font-awesome-icon :icon="['fas', 'user']" /></p>
            <p >
                <span v-for="star in 5" :class="{ 'activeStar': star <= r.rated }" :key="star[r.rated]" class="star">
                    <font-awesome-icon :icon="['fas', 'star']" />
                </span>
            </p>
            <p class="review-desc"> {{ r.desc }}</p>
            <p class="time-posted">{{ new Date(r.created_at).toLocaleString() }}</p>
        </div>
    </div>
    <div v-else>  No reviews yet !  </div>
</template>

<script>
    export default {
        name: "product_reviews",
        props:{
            reviews:{
                type: Array
            },
            no_review:{
                type: Boolean,
                default: true
            },
        },
    }
</script>