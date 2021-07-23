const jwt = require('jsonwebtoken');
function is_auth(req, res, next) {

    if (req.session?.is_auth) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(411)
      
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.sendStatus(433)
            req.user = user
            next();
        })
    } else {
        res.sendStatus(401);
    }
}

function is_admin(req, res, next) {
    if (req.session.user.role === 'admin') {
        next();
    } else {
        res.write('403');
    }
}

function extend(req, res, next) {
    if (req.session && req.session?.is_auth) {
        var today = new Date();
        today = today.getTime();

        if (req.session.lastActivity >= today) {
            req.session.lastActivity = addMinutes(40);
        } else {
            logout_user(req)
        }
    }
    next()
}

function addMinutes(minutes) {
    var today = new Date(new Date().getTime() + minutes * 60000);
    return today.getTime();
}

function logout_user(req) {
    if (req.session) {
        req.session.user = null;
        req.session.is_auth = null;
        req.session.lastActivity = null;
        req.session.accesToken = null;
    }
}


function init_session(req, res, next) {
    req.session.init = 1;
    next();
}

module.exports = {
    is_auth,
    is_admin,
    extend,
    addMinutes,
    logout_user,
    init_session
}