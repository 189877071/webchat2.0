const Router = require('koa-router');

const router = new Router({
    prefix: '/app'
});

const islogin = (ctx, next) => {
    if (ctx.session && ctx.session.mlogin) {
        next();
        return;
    }
    ctx.body = { success: false, error: 0 };
}

router.post('/init', require('./init'));

router.get('*', (ctx) => {
    ctx.status = 404;
    ctx.body = { error: 404, success: false };
})

module.exports = router;