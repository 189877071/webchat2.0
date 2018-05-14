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

const app = new Koa();

app.use(cors({
    origin: (ctx) => (origin.indexOf != -1) ? ctx.headers.origin : false,
    credentials: true
}));

app.use(static(join(__dirname, 'static')));

app.use(ueditor.routes());

app.use(bodyParse());

app.use(session());

app.use(adminRouter.routes());

app.use(adminRouter.allowedMethods());

app.use(appRouter.routes());

app.use(appRouter.allowedMethods());

app.listen(3000);