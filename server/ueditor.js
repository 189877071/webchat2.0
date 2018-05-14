const Router = require('koa-router');

const { join } = require('path');

const koaueditor = require('ueditor-koa');

const { ueditor, static } = require('./common/config');

const router = new Router();

router.all('/ueditor', async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    const ActionType = ctx.query.action;

    const uedictx = new koaueditor(ctx, next, {
        statc_path: '/static/uploads', //静态目录,文件保存根目录
    });

    if (ActionType == "uploadimage" || ActionType == "uploadvideo" || ActionType == "uploadfile") {
        await uedictx.ue_save();
    }
    else if (ActionType == "listimage") {
        await uedictx.ue_list();
    }
    else {
        ctx.set('Content-Type', 'application/json');
        ctx.body = `${ctx.query.callback}(${JSON.stringify(ueditor)})`;
    }
});

module.exports = router;