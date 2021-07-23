<template>
    <div id="app">
        <Header v-if="!$route.meta.hideNavigation"></Header>
        <router-view/>
        <Footer v-if="!$route.meta.hideNavigation"></Footer>
        <Cart v-if="!$route.meta.hideNavigation"></Cart>
        <ChatBox v-if="!$route.meta.hideNavigation" />
    </div>
</template>

<script>
    import Header from '@/components/Header.vue'
    import Footer from '@/components/Footer.vue'
    import Cart from '@/components/Cart.vue'
    import ChatBox from '@/components/ChatBox.vue'

    export default {
        name: 'Home',
        components: {
            Header,
            Footer,
            Cart,
            ChatBox
        }
    }
</script>