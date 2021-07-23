import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8989/';
axios.defaults.withCredentials = true

// Add a request interceptor
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['authorization'] = 'Bearer ' + token;
        }
        // config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        Promise.reject(error)
    }
);
