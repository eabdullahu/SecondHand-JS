<template>
    <div>
        <PageBanner />
        <div class="main-container">
            <div class="footer-top contact-top">
                <div class="single one-contact">
                    <h4 class="title"><font-awesome-icon :icon="['fas','map-marker-alt']"/> ADDRESS </h4>
                    <p>Bregu i Diellit, Prishtine 10000</p>
                </div>
                <div class="single one-contact">
                    <h4 class="title"><font-awesome-icon :icon="['fas','phone-alt']"/> CONTACT </h4>
                    <p>Mobile: (+383) – 49 – 555 – 102</p>
                </div>
                <div class="single one-contact">
                    <h4 class="title"><font-awesome-icon :icon="['fas','clock']"/> HOUR OF OPERATIONS</h4>
                    <p>Monday – Friday : 09:00 – 20:00</p>
                </div>
                <div class="single one-contact">
                    <h4 class="title"><font-awesome-icon :icon="['fas','envelope']"/> Email</h4>
                    <p>lezadashopthrift@gmail.com</p>
                </div>
            </div>
        </div>
        <div class="main-container">
            <div class="contact-container">
                <div class="contact-form">
                    <h2 v-if="!send"> GET IN TOUCH </h2>
                    <div v-else  class="success-msg-login"><p>Thank you for your message.</p></div>
                    <form @submit.prevent="formSubmit">
                        <div class="input-fields half">
                            <input type="text"  :class="{ 'error-inputs' : $v.form.first_name.$error  }" v-model ="$v.form.first_name.$model"  />
                            <span class="input-placeholder">First name</span>
                        </div>
                        <div class="input-fields half">
                            <input type="mail"  :class="{ 'error-inputs' : $v.form.email.$error  }" v-model ="$v.form.email.$model"   />
                            <span class="input-placeholder">Email address</span>
                        </div>
                        <div class="input-fields half">
                            <input type="text"  :class="{ 'error-inputs' : $v.form.subject.$error  }" v-model ="$v.form.subject.$model" />
                            <span class="input-placeholder">Subject</span>
                        </div>
                        <div class="input-fields half">
                            <textarea type="text" :class="{ 'error-inputs' : $v.form.message.$error  }" v-model ="$v.form.message.$model" ></textarea>
                            <span class="input-placeholder">Message</span>
                        </div>
                        <div class="input-fields half recaptchaStyle">
                            <vue-recaptcha ref="recaptcha"
                            :loadRecaptchaScript="true"
                                @verify="onVerify" sitekey="6Lc1HLAaAAAAACiED1vyC5G3GYOA5Iqu4OdmNDSR">
                            </vue-recaptcha>
                        </div>
                        <div class="input-fields half">
                            <input type="submit" value="Send mail"/>
                        </div>
                    </form>
                </div>
                <div class="map-container">
                    <GoogleMap />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PageBanner from "../components/PageBanner.vue";
import GoogleMap from '../components/GoogleMap.vue'
import {required,minLength,email} from 'vuelidate/lib/validators'
import axios from 'axios';
import VueRecaptcha from 'vue-recaptcha';
export default {
    components:{
        PageBanner,
        GoogleMap,
        'vue-recaptcha': VueRecaptcha
    },
    data(){
        return{
            form:{
                first_name :'' ,
                email: '',
                subject :'',
                message :'',
                robot: false
            },
            send:false
        }
    },
    methods: {
        async formSubmit(){
            this.$v.$touch();
            if ( (this.$v.$pending || this.$v.$error) || !this.form.robot) {
                this.error = true;
                return;
            }else{
                await axios.post('/api/contact',{
                        from:this.form.email,
                        name:this.form.first_name,
                        subject:this.form.subject,
                        message:this.form.message
                    }).then(res=>{
                        if(res.data.msg == 'Send'){
                            this.send = true
                            setTimeout(() =>this.send = false , 4000)
                        this.resetForm();
                        }
                 });
            }
        },
        resetForm(){
            this.$v.$reset()
            this.form.first_name = "";
            this.form.email = "";
            this.form.subject = "";
            this.form.message = "";
            window.grecaptcha.reset();
            this.form.robot = false;
        },
        onVerify: function (response) {
            if (response) this.form.robot = true;
        }
    },
    validations:{
        form:{
            first_name: {required,minLength: minLength(2)},
            email:  {required,email},
            subject:  {required,minLength: minLength(1)},
            message: {required,minLength: minLength(5)},
        }
    }
}
</script>
<style scoped>

</style>