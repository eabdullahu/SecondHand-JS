import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Products from '../views/Products.vue'
import Product from '../views/Product.vue'
import LiveChat from '../views/LiveChat.vue'
import Coupons from '../views/Coupons.vue'
import Categories from '../views/Categories.vue'
import Banners from '../views/Banners.vue'
import Users from '../views/Users.vue'
import Orders from '../views/Orders.vue'
import orderEdit from '../views/EditOrder.vue'
import city from '../views/City.vue'

// import PageNotFound from '../views/PageNotFound.vue'

Vue.use(VueRouter)
const routes = [{
        path: '/',
        name: 'Login',
        component: Login,
        meta: {
            hideNavigation: true
        }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/products',
        name: 'products',
        component: Products,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/product/:id',
        name: 'product',
        component: Product,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/live-chat',
        name: 'Live chat',
        component: LiveChat,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/coupons',
        name: 'Coupons',
        component: Coupons,
        props: (route) => ({
            token: route.query.token,
            status: route.query.status,
            postedby: route.query.postedby,
            page: route.query.page ? parseInt(route.query.page) : 1,
        }),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/categories',
        name: 'Categories',
        component: Categories,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/banners',
        name: 'Banners',
        component: Banners,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/city',
        name: 'City',
        component: city,
        meta: {
            requiresAuth: true
        },
        props: (route) => ({
            name: route.query.name,
            page: route.query.page ? parseInt(route.query.page) : 1,
        }),
    },
    {
        path: '/users',
        name: 'Users',
        component: Users,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/order',
        name: 'Orders',
        component: Orders,
        meta: {
            requiresAuth: true
        },
        props: (route) => ({
            id: route.query.id,
            status: route.query.status,
            postedby: route.query.postedby,
            page: parseInt(route.query.page)
        })

    },
    {
        path: '/orderEdit',
        name: 'orderEdit',
        component: orderEdit,
        meta: {
            requiresAuth: true
        },
        props: {
            id: String
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    const authenticatedUser = localStorage.getItem("token");
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const scrollTop = to.matched.some(record => record.meta.scrollTop);

    if (requiresAuth && !authenticatedUser) next('/')
    if (scrollTop) {
        window.scrollTo(0, 0);
    }
    next();
});
export default router