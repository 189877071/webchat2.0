const { join } = require('path');
const Koa = require('koa');
const static = require('koa-static');
const cors = require('koa2-cors');
const bodyParse = require('koa-bodyparser');
const session = require('./common/session');
const { origin } = require('./common/config');
const adminRouter = require('./adminRouter');
const appRouter = require('./appRouter');
const ueditor = require('./ueditor');
const { udpsend, udpexit } = require('./udpServer');

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

app.use(async (ctx, next) => {
    ctx.oerror = (error = 0) => ctx.body = ({ error, success: false });
    ctx.udpsend = udpsend;
    ctx.udpexit = udpexit;
    await next();
});

app.use(adminRouter.routes());

app.use(adminRouter.allowedMethods());

app.use(appRouter.routes());

app.use(appRouter.allowedMethods());

process.on('message', ({ port }) => app.listen(port));