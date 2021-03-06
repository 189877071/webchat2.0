const Router = require('koa-router');

const multiparty = require('koa2-multiparty');

const router = new Router({
    prefix: '/app'
});

const islogin = async (ctx, next) => {
    if (ctx.session && ctx.session.mlogin) {
        await next();
        return;
    }
    ctx.body = { success: false, error: 0 };
}

router.post('/init', require('./init'));

router.post('/login', require('./login'));

router.post('/exit', islogin, require('./exit'));

router.post('/message', islogin, require('./message'));

router.post('/notice', islogin, require('./notice'));

router.post('/setting', islogin, require('./setting'));

router.post('/upload', multiparty(), require('./upload'));

router.post('/test', async (ctx) => {
    ctx.body = { success: true };
})

router.get('*', (ctx) => {
    ctx.status = 404;
    ctx.body = { error: 404, success: false };
})

module.exports = router;