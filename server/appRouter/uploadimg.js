const { rename, mkdir, exists, chmod } = require('fs');

const { static } = require('../common/config');

const { join } = require('path');

const { getVerify, grayImg } = require('../common/fn');

module.exports = async (ctx) => {

    if (!ctx.req.files || !ctx.req.files['image']) {
        ctx.oerror();
        return;
    }

    // 判断文件夹是否存在 如果不存在就创建
    const cfDir = (dir) => new Promise(reslove => {
        exists(dir, (onoff) => {
            if (onoff) {
                reslove(true);
                return;
            }
            mkdir(dir, (err) => {
                if (err) {
                    reslove(false);
                    return;
                }
                chmod(dir, 0777, (err) => reslove(err ? false : true))
            });
        })
    });

    const orename = (file, newfile) => new Promise(reslove => {
        rename(file, newfile, (err) => reslove(err ? false : true));
    })

    const d = new Date();

    // /uploads/image/2018-6-12
    let name = join('/uploads/image', `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);

    const dir = join(static, name);

    const onoff = await cfDir(dir);

    if (!onoff) {
        ctx.oerror();
        return;
    }

    const file = ctx.req.files['image'].path;

    let newflie = file.match(/(?:[^\/]{1,})$/);

    if (!newflie) {
        newflie = d.now() + getVerify(6) + '.jpg';
    }
    else {
        newflie = newflie[0];
    }

    const grayname = join(name, `grad-${newflie}`);

    name = join(name, newflie);

    newflie = join(static, name);

    const rnonof = await orename(file, newflie);

    if (!rnonof) {
        ctx.oerror();
        return;
    }

    const grayOnoff = await grayImg(newflie, join(static, grayname));

    if (!grayOnoff) {
        ctx.oerror();
        return;
    }

    ctx.body = { success: true, name, grayname };
}