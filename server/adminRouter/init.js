module.exports = async (ctx) => {
    if (!ctx.session || !ctx.session.login) {
        ctx.body = { success: false, error: 0 }
    }
    else {
        ctx.body = { success: true };
    }
}