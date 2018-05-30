const Router = require('koa-router');

const { join } = require('path');

const router = new Router({
    prefix: '/admin'
});

const islogin = async (ctx, next) => {
    if (ctx.session && ctx.session.login) {
        await next();
        return;
    }
    ctx.body = { success: false, error: 0 };
}

router.post('/init', require('./init'));

router.post('/login', require('./login'));

router.post('/setting', islogin, require('./setting'));

router.post('/userlist', islogin, require('./userlist'));

router.post('/group', islogin, require('./group'));

router.post('/headphoto', islogin, require('./headphoto'));

router.all('/notice', islogin, require('./notice'));

router.get('*', (ctx) => {
    
    ctx.status = 404;
    ctx.body = { error: 404, success: false };
})

module.exports = router;