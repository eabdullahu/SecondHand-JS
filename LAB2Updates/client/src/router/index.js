import Vue from 'vue'
import VueRouter from 'vue-router'

// import VueRouteMiddleware from 'vue-route-middleware';
import Home from '../views/Home.vue'

import AdminChat from '../views/AdminChat.vue'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Wishlist from '../views/Wishlist.vue'
import User from '../views/User.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import OverView from '../components/usercomponents/ProfileOverview.vue'
import EditProfile from '../components/usercomponents/ProfileEdit.vue'
import ChangePassword from '../components/usercomponents/ChangePassword.vue'
import UserProducts from '../components/usercomponents/UserProducts.vue'
import AddProducts from '../components/usercomponents/AddProducts.vue'
import editProduct from '../components/usercomponents/ProductEdit.vue'
import Product from '../views/Product.vue'
import Search from '../views/Search.vue'
import forgetPassword from '../components/ForgetPassword.vue'
import Orders from '../components/usercomponents/UserOrder.vue'
import InvoiceOrder from '../components/usercomponents/productInvoice.vue'
import PageNotFound from '../views/PageNotFound.vue'
import ContactPage from '../views/Contact.vue'
import AboutUs from '../views/AboutUs.vue'

Vue.use(VueRouter)
const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/AdminChat',
        /* It needs changes */
        name: 'Admin Chat',
        component: AdminChat,
        meta: {
            hideNavigation: true,
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/forgetPassword/:random_token',
        name: 'forgetPassword',
        component: forgetPassword
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/product/:id',
        name: 'Product',
        component: Product,
        props: {
            id: String
        },
        meta: {
            scrollTop: true
        }
    },
    {
        // path: '/search/(page=:page?&)?(keyword=:keyword?&)?(category=:category?&)?(gender=:gender?&)?(priceStart=:start?&)?(priceEnd=:end?&)',
        path: '/search',
        name: 'Search',
        props: (route) => ({
            page: parseInt(route.query.page),
            keyword: route.query.keyword,
            category: route.query.category,
            gender: route.query.gender,
            priceStart: parseInt(route.query.priceStart),
            priceEnd: parseInt(route.query.priceEnd),
            changed: Boolean(route.query.changed)
        }),
        component: Search,
    },
    {
        path: '/wishlist',
        name: 'Wishlist',
        component: Wishlist
    },
    {
        path: '/cart',
        name: 'Cart',
        component: Cart
    },
    {
        path: '/Checkout',
        name: 'Checkout',
        component: Checkout,
        meta: {
            hideNavigation: true,
        }
    },
    {
        path: '/user',
        name: 'user',
        component: User,
        redirect: '/user/overview',
        meta: {
            requiresAuth: true
        },
        children: [{
                path: 'overview',
                component: OverView,
                name: 'Account Overview'
            },
            {
                path: 'profile',
                component: EditProfile,
                name: 'My profile'
            },
            {
                path: 'changePasword',
                component: ChangePassword,
                name: 'Change password'
            },
            {
                path: 'userProduct',
                component: UserProducts,
                name: 'My Products',
                props: (route) => ({
                    page: parseInt(route.query.page)
                }),
            },
            {
                path: 'addProducts',
                component: AddProducts,
                name: 'Add New Product'
            },
            {
                path: 'myOrders',
                component: Orders,
                name: 'My Orders'

            },
            {
                path: '/invoice/:id',
                component: InvoiceOrder,
                name: 'Order',
                props: {
                    id: String
                }
            },
            {
                path: '/edit/:id',
                name: 'Edit',
                meta: {
                    requiresAuth: true,
                    // reload: true
                },
                component: editProduct
            }
        ]
    },
    {
        path: '/contact',
        name: 'Contact',
        component: ContactPage
    },
    {
        path: '/aboutUs',
        name: 'About Us',
        component: AboutUs
    },
    {
        path: "*",
        name: '404',
        component: PageNotFound,
        meta: {
            hideNavigation: true,
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

    if (requiresAuth && !authenticatedUser) next('login')
    if (scrollTop) {
        window.scrollTo(0, 0);
    }
    next();
});
export default router