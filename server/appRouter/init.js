module.exports = async (ctx) => {
    if (!ctx.session || !ctx.session.mlogin) {
        ctx.body = { success: false, error: 0 }
    }
    else {
        ctx.body = { success: true };
    }
}