<template>
    <div>
        <PageBanner />
        <div class="about-container">
            <div class="blck-container">
                <img :src="require('../assets/banner/Black-And-White-Fashion-Trends-2019.jpg')" />
            </div>
            <div class="about-content">
                <h1>Who we are.</h1>
                <p>We believe in a world where you have total freedom to be you, without judgement. To experiment. To express yourself. To be brave and grab life as the extraordinary adventure it is. So we make sure everyone has an equal chance to discover all the amazing things they’re capable of – no matter who they are, where they’re from or what looks they like to boss. We exist to give you the confidence to be whoever you want to be.</p>
                <p>It’s super-important for us to promote a healthy body image – we’re not about conforming to any stereotypes – so we work with more than 200 models to represent our audience. And we’re not in the business of digitally altering their appearance either… there’s no reshaping or removing stretch marks here. Our models are part of the LEZADA family and we support them by following a Model Welfare Policy.</p>
            </div>
        </div>
    </div>
</template>
<script>
import PageBanner from "../components/PageBanner.vue";
export default {
    components:{
        PageBanner,
        
    }
}
</script>