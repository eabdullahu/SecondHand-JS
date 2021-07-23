const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session')
const mongo_session = require('connect-mongodb-session')(session);
/* Chatbox */
const axios = require('axios');
const crypto = require("crypto");
var sharedsession = require("express-socket.io-session");

require('dotenv/config');

const { extend, init_session } = require('../middleware/auth');

const app = express();

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => console.log('connected to db!'));

const store_session = new mongo_session({
    uri: process.env.DB_CONNECTION,
    collection: 'sessions'
})

//Middleware   
var sessionMiddleware = session({
    secret: 'the new key',
    saveUninitialized: false,
    resave: false,
    store: store_session,
    cookie: { secure: false }
});
app.use(sessionMiddleware);

var whitelist = ['http://localhost:8080', 'http://localhost:8081']
var corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
}

app.use(body_parser.json());
app.use(cors(corsOptions));
app.use(extend);
app.use(init_session);

const city = require('./routes/api/city');
app.use('/api/city', city);

const users = require('./routes/api/users');
app.use('/api/users', users);

const banner_content = require('./routes/api/banner_content');
app.use('/api/banner_content', banner_content);

const login = require('./routes/login/login');
app.use('/login', login);

const register = require('./routes/register/register');
app.use('/register', register);

const orders = require('./routes/api/order');
app.use('/api/orders', orders);

const products = require('./routes/api/product');
app.use('/api/products', products);

const category = require('./routes/api/category');
app.use('/api/category', category);

const contact = require('./routes/api/contact');
app.use('/api/contact', contact);

const review = require('./routes/api/review');
app.use('/api/review', review);

const coupon = require('./routes/api/coupon');
app.use('/api/coupon', coupon);

const admin_products = require('./routes/admin-api/api/product');
app.use('/admin-api/products', admin_products);

const admin_orders = require('./routes/admin-api/api/order');
app.use('/api/mng/order', admin_orders);

const admin_chart = require('./routes/admin-api/api/chart');
app.use('/api/mng/chart', admin_chart);

const admin_coupons = require('./routes/admin-api/api/coupon');
app.use('/admin-api/coupons', admin_coupons);

const admin_category = require('./routes/admin-api/api/category');
app.use('/admin-api/category', admin_category);

const admin_banner = require('./routes/admin-api/api/banner_content');
app.use('/admin-api/banners', admin_banner);

const admin_users = require('./routes/admin-api/api/users');
app.use('/admin-api/users', admin_users);

const admin_reviews = require('./routes/admin-api/api/review');
app.use('/admin-api/reviews', admin_reviews);

const admin_city = require('./routes/admin-api/api/city');
app.use('/admin-api/city', admin_city);

const admin_chat = require('./routes/admin-api/api/chat');
app.use('/admin-api/chat', admin_chat);

const port = process.env.PORT || 8989;

const server = app.listen(port, () => console.log(`Server started on port ${port}`));

const io = require('socket.io')(server);
io.use(sharedsession(sessionMiddleware));

const msg = {};
const newmsg = [];
io.on('connection', function(socket) {
    socket.on('join', function(data) {
        var room_id = crypto.randomBytes(20).toString('hex') + "_" + data.user.name;
        socket.handshake.session.chat = { "room_id": room_id, "user": data.user };
        socket.handshake.session.save();

        delete data.user;

        socket.join(room_id);
        socket.room = room_id;

        msg[socket.room] = [];
        msg[socket.room].push(data);
        io.sockets.in(room_id).emit('message', data);
        if (data.role !== "admin") {
            if (newmsg.indexOf(room_id) === -1) newmsg.push(room_id);
            io.sockets.emit('new-message', newmsg)
        }
        io.sockets.emit('rooms', getRoomData(getActiveRooms(io)));
        addToServer("connected");
    });

    socket.on('join-again', async function(room_id, isAdmin = false) {
        if (room_id == socket.handshake.session ?.chat ?.room_id || isAdmin == true) {
            socket.join(room_id);
            socket.room = room_id;
            io.sockets.in(room_id).emit('message', msg[room_id]);
        }
    });

    socket.on('message', function(data) {
        var room = socket.room ? socket.room : socket.handshake.session ?.chat ?.room_id
        msg[room].push(data);
        io.sockets.in(room).emit('message', data);
        if (data.role !== "admin") {
            if (newmsg.indexOf(room) === -1) newmsg.push(room);
            io.sockets.emit('new-message', newmsg)
        }
        io.sockets.emit('rooms', getRoomData(getActiveRooms(io)));
    });

    socket.on('new-message', function() {
        io.sockets.emit('new-message', newmsg)
    });

    socket.on('delete-new-message', function(room) {
        const index = newmsg.indexOf(room);
        if (index > -1) newmsg.splice(index, 1);
        io.sockets.emit('new-message', newmsg)

    });

    socket.on('rooms', function() {
        io.sockets.emit('rooms', getRoomData(getActiveRooms(io)));
    });

    socket.on("leave-chat", () => {
        addToServer("left");
    });

    socket.on("disconnect", (reason) => {
        addToServer(reason);
    });

    const addToServer = (reason) => {
        const chatsess = socket.handshake.session.chat;
        if (chatsess ?.user ?.role == "user") {
            const chat = {
                room_id: socket.room,
                user_name: chatsess.user.name,
                user_email: chatsess.user.email,
                dis_reason: reason,
                message: msg[socket.room]
            };
            axios.post('http://localhost:6069/api/chat', chat);
            if(reason === "left") {
                delete socket.handshake.session.chat;
                socket.handshake.session.save();
                socket.leave(socket.room);
                delete msg[socket.room];
            }
        }
    }
});

function getRoomData(rooms) {
    let roomData = [];
    rooms.map((item, key) => {
        roomData.push({
            room: item,
            name: item.substring(item.indexOf("_") + 1, item.length),
            lastReply: msg[item] ? msg[item][msg[item].length - 1].replied_at : null
        })
    });
    return roomData;
}

function getActiveRooms(io) {
    const arr = Array.from(io.sockets.adapter.rooms);
    const filtered = arr.filter(room => !room[1].has(room[0]))
    const res = filtered.map(i => i[0]);
    return res;
}