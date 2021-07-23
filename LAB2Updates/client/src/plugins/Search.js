// import axios from 'axios';
import { store, mutations } from "./Store";

const Search = {
    install(Vue) {
        Vue.mixin({
            computed: {
                searchFilter: {
                    get() {
                        return store.searchFilter;
                    },
                    set(filter) {
                        this.setSearch(filter);
                    }
                }
            },
            methods: {
                setSearch: mutations.setSearch,

                clearFilter() {
                    this.setSearch('');
                }
            }
        });
    }
}
export default Search;