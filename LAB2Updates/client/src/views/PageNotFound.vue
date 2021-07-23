<template>
    <div class="container_404" :style="{'background-image': 'url(' + require('../assets/banner/404-bg.jpg') + ')'}">
    
        <div class="main-container">
            <div class="message_404" >
                <h1>Oops!</h1>
                <h1>Page not found!</h1>
                <p>PLEASE GO BACK TO <router-link to="/"> Homepage </router-link></p>
            </div>
        </div>
    </div>
</template>