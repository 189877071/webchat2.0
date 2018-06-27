const { join } = require('path');

const Koa = require('koa');

const static = require('koa-static');

const cors = require('koa2-cors');

const bodyParse = require('koa-bodyparser');

const session = require('./common/session');

// const jwt = require('./common/jwt');

const { origin } = require('./common/config');

const adminRouter = require('./adminRouter');

const appRouter = require('./appRouter');

const ueditor = require('./ueditor');

const { udpsend, udpexit, udpsends } = require('./udpServer');

const mysql = require('./common/db');

const { tables } = require('./common/config');

const app = new Koa();

app.use(cors({
    origin: (ctx) => {
        if (!ctx.headers.origin) {
            return '*';
        }
        return (origin.indexOf != -1) ? ctx.headers.origin : false;
    },
    credentials: true
}));

app.use(static(join(__dirname, 'static')));

app.use(ueditor.routes());

app.use(bodyParse());

app.use(session());
// app.use(jwt);

app.use(async (ctx, next) => {
    ctx.oerror = (error = 0) => ctx.body = ({ error, success: false });
    ctx.udpsend = udpsend;
    ctx.udpexit = udpexit;
    ctx.udpsends = udpsends;
    await next();
});

app.use(adminRouter.routes());

app.use(adminRouter.allowedMethods());

app.use(appRouter.routes());

app.use(appRouter.allowedMethods());

process.on('message', ({ port, main }) => {
    app.listen(port);
    if (main) {
        // 清空 登录表数据
        mysql(`TRUNCATE TABLE ${tables.dblogin}`);
    }
});