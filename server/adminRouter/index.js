const Router = require('koa-router');

const { join } = require('path');

// const multer = require('koa-multer');

// const upload = multer({ dest: join(__dirname, '../static/uploads/') });

const router = new Router({
    prefix: '/admin'
});

const islogin = (ctx, next) => {
    if (ctx.session && ctx.session.login) {
        next();
        return;
    }
    ctx.body = { success: false, error: 0 };
}

router.post('/init', require('./init'));

router.post('/login', require('./login'));

router.post('/setting', islogin, require('./setting'));

router.post('/userlist', islogin, require('./userlist'));

router.get('*', (ctx) => {
    ctx.body = { error: true };
})

module.exports = router;