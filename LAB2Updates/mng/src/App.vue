<template>
    <div id="app">
        <Header v-if="!$route.meta.hideNavigation" />
        <div class="mobile-disp">
            <router-view />
        </div>
        <Footer v-if="!$route.meta.hideNavigation" />
    </div>
</template>

<script>
    import Header from './components/Header.vue';
    import Footer from './components/Footer.vue';
    export default {
        name: "test",
        components: {
            Header,
            Footer
        }
    };
</script>
