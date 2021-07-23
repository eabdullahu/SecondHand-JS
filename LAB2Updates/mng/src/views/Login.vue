<template>
  <div class="form-container outer" style="background: #0e1726 !important; margin: 0 -100%">
    <div class="form-form">
      <div class="form-form-wrap">
        <div class="form-container">
          <div class="form-content">
            <h1>Log In</h1>
            <p>Log in to your account to continue.</p>
            <div id="msg" class="error-login" v-if="error">{{ msg }}</div>
            <form class="text-left" @submit.prevent="login">
              <div class="form">
                <div id="username-field" class="field-wrapper input">
                  <label for="username-field">EMAIL</label>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-user"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    v-model="email"
                    class="form-control"
                    placeholder="support@Thredplus.net"
                  />
                </div>

                <div id="password-field" class="field-wrapper input m-b-8">
                  <div class="d-flex justify-content-between">
                    <label for="password">PASSWORD</label>
                  </div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-lock"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    v-model="password"
                    class="form-control"
                    placeholder="Password"
                  />
                </div>

                <div class="d-sm-flex justify-content-between">
                  <div class="field-wrapper">
                    <button
                      type="submit"
                      name="userLogin"
                      class="btn btn-primary"
                      value=""
                    >
                      Log In
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      login_message: "Please enter your credentials to login.",
      loginStage: "login-form",
      currentForm: "login",
      email: "",
      password: "",
      emailPassword: "",
      invalidUser: 0,
      error: false,
      msg: "",
    };
  },
  mounted() {
    //If user logged in do not show login form
    if (localStorage.getItem("currentUser")) {
      this.$router.push("/dashboard");
    }
  },
  methods: {
    async login() {
      await axios
        .post("login/admin", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          if (response.data.error == undefined) {
            localStorage.setItem(
              "currentUser",
              JSON.stringify(response.data.user)
            );
            localStorage.setItem("token", response.data.accessToken);
            var today = new Date();
            today = today.getTime();
            localStorage.setItem("lastActivity", today);
            this.$router.push("/dashboard");
          }
          if (response.data.error == "Invalid Password") {
            this.error = true;
            this.msg = "Incorrect password!";
          } else if (response.data.error == "User does not exist") {
            this.error = true;
            this.msg = "User does not exist";
          }
        });
    },
  },
};
</script>