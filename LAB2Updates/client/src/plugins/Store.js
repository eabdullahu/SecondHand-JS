import Vue from "vue";

export const store = Vue.observable({
    isShown: false,
    cartProducts: [],
    productsQuantity: {},
    searchFilter: ''
});

export const mutations = {
    setShown(status) {
        store.isShown = status;
    },
    setProducts(prod) {
        store.cartProducts = prod;
    },
    updateCart(_id, quantity) {
        store.productsQuantity[_id] = quantity;
    },
    setSearch(filter) {
        store.searchFilter = filter
    }
};