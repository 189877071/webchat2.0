const Router = require('koa-router');

const router = new Router({
    prefix: '/app'
});

router.get('/', async (ctx) => {
    ctx.body = '啦啦啦啦';
});

module.exports = router;