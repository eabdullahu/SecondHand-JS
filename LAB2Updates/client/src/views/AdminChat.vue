<template>
    <div class="chat-outter-con">
        <div class="chat-container">
            <div class="AdminChatContainer">
                <div class="sidebar">
                    <span class="AdminChat">Users Chat</span>
                    <div class="list-wrap" v-if="rooms.length > 0">
                        <div class="list" v-for="m in rooms" :key="m.replied_at" @click="joinRoom(m)">
                            <img src="../assets/icon/user.svg" alt="User logo" />
                            <div class="info">
                                <span class="user">{{ m }}</span>
                                <span class="text">{{ m ? '12:24:22 AM' : '' }}</span>
                            </div>
                            <span class="time online_icon">2</span>
                        </div>
                    </div>
                    <div class="list-wrap" v-else>
                        <div class="list">
                            <div class="info">
                                <span c  lass="user">No chat rooms opened.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-content">
                    <div class="headercontent">
                        <img src="../assets/icon/user.svg" alt="User logo">
                        <div class="info">
                            <span class="user">{{ room ? room : 'No chat selected' }}</span>
                            <span class="time">{{ room ? '12:24:22 AM' : '' }}</span>
                        </div>
                    </div>
                    <div class="message-wrap" v-if="messages.length > 0">
                        <div class="message-list" v-for="ms in messages" :key="ms.replied_at" :class="{ 'me': ms.role == 'admin' }">
                            <p class="msg">{{ ms.message }}</p>
                            <div :class="{ 'time': ms.role == 'admin', 'Yourtime': ms.role == 'user' }">{{ ms.replied_at }}</div>
                        </div>
                        <!-- <div class="message-list me">
                            <div class="msg">
                                <p>Lorem ipsum dolor sit amet.</p>
                            </div>
                            <div class="time">now</div>
                        </div> -->
                    </div>
                    <div class="message-wrap" v-else></div>
                        <form @submit.prevent="sendMessage">
                    <div class="message-footer">
                            <input type="text" placeholder="Message" v-model="message" required/>
                            <button class="sentmessage"><font-awesome-icon :icon="['fas', 'paper-plane']" /></button>
                    </div>
                        </form>
                </div>
            </div>
        </div>
    </div>
</template>



    <!-- <div class="dflex">
        <div class="list">
            <ul>
                <li v-for="(m, index) in rooms" :key="index" @click="joinRoom(m)"> 
                    {{ m }}
                </li>
            </ul>
        </div>
        <div class="message">
            {{ messages }}
        </div>
        <div class="card-footer">
            <form @submit.prevent="sendMessage">
                <div class="gorm-group pb-3">
                    <label for="message">Message:</label>
                    <input type="text" v-model="message" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-success">Send</button>
            </form>
        </div>
    </div> -->

<script>
    import io from 'socket.io-client';
    export default {
        data() {
            return {
                room: '',
                rooms: [],
                message: [],
                messages: [],
                socket: io('localhost:8989', { transports: ['websocket', 'polling', 'flashsocket'] })
            }
        },
        methods: {
            joinRoom(room) {
                this.messages = [];
                this.room = room;
                this.socket.emit('join-again', this.room, true);

                this.socket.on('message', (data) => {
                    if(Array.isArray(data)) this.messages = data
                    else this.messages.push(data)     
                });
            },
            sendMessage() {
                this.socket.emit('message', {
                    room: this.room,
                    role: "admin",
                    message: this.message,
                    replied_at: new Date().toLocaleTimeString()
                });
                this.message = ''
            }
        },   
        created(){
            this.socket.emit('rooms');
            this.socket.on('rooms', (data) => { this.rooms = data });
        }
    }
</script>

<style scope>
    .chat-outter-con {
        background: #060818 !important;
        max-width: 1600px;
        margin: 0 auto;
    }
    .chat-container {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        background-color: #0e1726;
        margin: 0 32px;
        padding: 20px;
        border-radius: 6px;
        margin-top: 100px;
    }
    .AdminChatContainer {
        display: flex;
    }

    div.sidebar {
        width: 300px;
        min-width: 300px;
        display: flex;
        background: #060818;
        flex-direction: column;
        border-right: 1px solid #191e3a;
        transition: 500ms all;
        border-radius: 6px 0px 0px 6px;
    }
    div.sidebar .AdminChat {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        color: #d3d3d3;
        font-weight: 700;
        font-size: 16px;
        border-bottom: 1px solid #191e3a;
        height: 55px;
        text-transform: uppercase;
    }
    div.sidebar .list-wrap {
        width: 100%;
        overflow: auto;
    }
    div.sidebar .list-wrap .list {
        border-bottom: 1px solid #191e3a;
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
        color: #e0e6ed;
        transition: 0.5s all;
    }
    div.sidebar .list-wrap .list:hover, sidebar .list-wrap .list.active {
        background: #191e3a;
        color: #25d5e4;
    }
    div.sidebar .list-wrap .list img {
        border-radius: 50%;
        width: 35px;
        height: 35px;
        object-fit: cover;
        margin-right: 10px;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.5);
    }
    div.sidebar .list-wrap .list .info {
        flex: 1;
    }
    div.sidebar .list-wrap .list .info .user {
        font-weight: 500;
        font-size: 14px;
    }
    div.sidebar .list-wrap .list .info .text {
        display: flex;
        font-size: 12px;
        line-height: normal;
        opacity: 0.8;
    }
    div.sidebar .list-wrap .list .count {
        font-size: 0.75em;
        background: #bde2f7;
        box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.7);
        padding: 3px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        text-align: center;
        color: #000;
    }

    .list-wrap::-webkit-scrollbar-track{
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: #F5F5F5;
    }
    .list-wrap::-webkit-scrollbar{
        width: 8px;
        background-color: #F5F5F5;
    }
    .list-wrap::-webkit-scrollbar-thumb{
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: darkgray;
    }

    .chat-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        border-right: 2px solid #060818;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;    
    }

    .chat-content .headercontent {
        height: 55px;
        border-bottom: 1px solid #191e3a;
        display: flex;
        padding: 10px;
        align-items: center;
        border-radius: 0px 6px 0 0;
        background: #060818 !important;
        color: #25d5e4;
    }

    .chat-content .headercontent img {
        border-radius: 50%;
        width: 35px;
        height: 35px;
        object-fit: cover;
        margin-right: 10px;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.5);
    }

    .chat-content .headercontent .info {
        flex: 1;
    }

    .chat-content .headercontent .info .user {
        font-weight: 500;
        font-size: 15px;
    }

    .chat-content .headercontent .info .time {
        display: flex;
        font-size: 12px;
        opacity: 0.8;
        line-height: normal;
    }

    .message-wrap {
        display: flex;
        flex-direction: column;
        padding: 15px;
        overflow-y: auto;
        background: #0e1726;
        height: 550px;
    }

    .message-wrap::-webkit-scrollbar-track{
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: #F5F5F5;
    }

    .message-wrap::-webkit-scrollbar{
        width: 8px;
        background-color: #F5F5F5;
    }

    .message-wrap::-webkit-scrollbar-thumb{
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: darkgray;
    }

    .message-wrap .message-list {
        align-self: flex-start;
        max-width: 70%;
    }

    .message-wrap .message-list.me {
        align-self: flex-end;
    }

    .message-wrap .message-list.me .msg {
        color: #e0e6ed;
        background: #1b2e4b;
        border-top-right-radius: 0;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
    }

    .message-wrap .message-list .msg {
        background: #191e3a;
        box-shadow: 0 5px 15px -5px rgb(0 0 0 / 10%);
        padding: 10px 20px;
        border-top-right-radius: 20px;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        font-size: 14px;
        color: #e0e6ed;
    }

    .message-wrap .message-list .time {
        text-align: right;
        margin-right: 15px;
        color: #999;
        font-size: 11px;
    }

    .message-wrap .message-list .Yourtime{
        text-align: left;
        margin-left: 18px;
        color: #999;
        font-size: 11px;
    }

    .message-footer {
        border-top: 1px solid #191e3a;
        display: flex;
        height: 50px; 
    }

    .message-footer input {
        flex: 1;
        padding: 0 20px;
        background: #060818;
        color: #e0e6ed;
        font-size: 15px;
        border: none;
        border-radius: 0;
    }

    .sentmessage{
        color: black;
        padding: 0px 20px;
        background-color: #8dbf42;
        font-size: 18px;
        cursor: pointer;
        border-radius: 0px 0px 6px 0px;
        outline: none;
        border: none;
        transition: background-color 0.5s;
    }

    .sentmessage:hover{
        background-color: #7EAB3B;
    }

    .online_icon {
        display: inline-block;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 4px;
        line-height: 1.4;
        padding: 0px 5px;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.3s ease-out;
        -webkit-transition: all 0.3s ease-out;
        cursor: default;
        color: #8dbf42;
        background-color: transparent;
        border: 1px solid #8dbf42;
    }
    div.sidebar .list-wrap .list:hover .online_icon {
        transition: all 0.3s ease-out;
        -webkit-transition: all 0.3s ease-out;
        -webkit-transform: translateY(-3px);
        transform: translateY(-3px);
        background-color: #8dbf42;
        color: #060818;
        box-shadow: 0 10px 20px -10px rgba(141, 191, 66, 0.59) !important;
    }
</style>