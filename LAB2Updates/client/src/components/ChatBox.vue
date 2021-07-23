<template>
    <div class="live-chat">
        <div class="icon" v-if="chat_closed" @click="openChat()"></div>
        <div class="chat-room" v-else-if="state == 0">
            <form @submit.prevent="createChat" autocomplete="off">
                <div class="header">
                    <h3>Live chat</h3>
                    <p>Click start conversation</p>
                </div>
                <div class="form-data auto" v-if="user.loggedin == false">
                    <div class="input-fields info">
                        <input type="text" name="fullname" v-model="user.name" required />
                        <span class="input-placeholder">Fullname</span>
                    </div>
                </div>
                <div class="form-data auto" v-if="user.loggedin == false">
                    <div class="input-fields info">
                        <input type="text" name="email" v-model="user.email" required />
                        <span class="input-placeholder">Email</span>
                    </div>
                </div>
                <div class="form-data auto">
                    <div class="input-fields info">
                        <input type="text" name="message" v-model="message" required />
                        <span class="input-placeholder">Message</span>
                    </div>
                </div>
                <button class="submit" type="submit">Start conversation</button>
            </form>
            <button class="close" @click="openChat()"></button>
        </div>
        <div class="chat-room" v-else>
            <form @submit.prevent="sendMessage">
                <div class="header">
                    <h3>Live chat</h3>
                    <p>Click start conversation</p>
                </div>
                <div class="form-data" id="form-data">
                    <div v-for="(m, index) in messages" :key="index" :class="(m.role == 'admin' ? 'message' : 'message reverse')">
                        <div :class="(m.role == 'user' ? 'user-img' : 'admin-img')"></div>
                        <div :class="(m.role == 'user' ? 'user-reply' : 'admin-reply')">
                            {{ m.message }}
                        </div>
                    </div>
                </div>
                
                <div class="send-msg">
                    <input type="text" required v-model="message" placeholder="Message" />
                    <button type="submit" class="send"></button>
                </div>
            </form>
            <button class="close dropdown" @click="openDropDown()"></button>
            <div class="chat-dropdown-items" :class="{ show: chatMenu }">
                <div>
                    <a href="javascript:void(0)" @click="openChat()">Minimize</a>
                </div>
                <div>
                    <a href="javascript:void(0)" @click="leaveChat()">Leave chat</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';
    import axios from 'axios';
    export default {
        data() {
            return {
                message: '',
                messages: [],
                socket: null,
                state: 0,
                chat_closed: true,
                room_id: null,
                user: { loggedin: false, name: '', email: '', role: 'user' },
                chatMenu: false
            }
        },
        methods: {
            openDropDown(){
                this.chatMenu = !this.chatMenu;
            },
            leaveChat(){
                this.socket.emit('leave-chat');
                this.state = 0;
                this.room_id = null;
                this.user = { loggedin: false, name: '', email: '', role: 'user' }
                this.messages = [];
            },
            openChat() {
                this.checkServer();
                this.chatMenu = false;
                setTimeout(() => {
                    this.chat_closed = !this.chat_closed;
                }, 250);
            },
            createChat(refreshed = false){
                this.socket = io('localhost:8989', { transports: ['websocket', 'polling', 'flashsocket'] });
                
                this.socket.on('connect', () => {
                    if(refreshed == true) this.socket.emit('join-again', this.room_id);
                    
                    else this.socket.emit('join', { user: this.user, role: this.user.role, message: this.message, replied_at: new Date().toLocaleTimeString() });
                    this.message = "";
                });

                this.socket.on('message', (data) => {
                    if(Array.isArray(data)) this.messages = data
                    else this.messages.push(data);
                });
                this.chatMenu = false;
                this.state = 1;
            },
            sendMessage() {
                this.socket.emit('message', {
                    role: this.user.role,
                    message: this.message,
                    replied_at: new Date().toLocaleTimeString()
                });
                this.message = ''
            },
            scrollToEnd(){
                var container = document.getElementById("form-data");
                if(container) container.scrollTop = container.scrollHeight;
            },
            async checkServer(){
                var room_user = await axios.get("login/room_and_user").then(res => res.data);
                this.room_id = room_user?.room_id;

                console.log(room_user);

                if(room_user?.user) this.user = room_user.user;
                if(this.room_id) this.createChat(true);
            }
        },
        updated(){
            this.scrollToEnd()
        }
    }
</script>
