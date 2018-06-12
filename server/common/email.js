const nodemailer = require("nodemailer");

const { host, port, user, pass } = require('./email.config.json');

// 开启一个 SMTP 连接池
var smtpTransport = nodemailer.createTransport({
    host, // 主机
    secureConnection: true, // 使用 SSL
    port,                   // SMTP 端口
    tls: { rejectUnauthorized: false },
    auth: {
        user, // 账号
        pass  // 密码
    }
});
/**
 * email 收件人地址
 * user 邮箱提示
 * title 标题
 * content 收件人内容
 * */
module.exports = ({ email, user, title, content }) => new Promise((resolve) => {
    // 设置邮件内容
    const mailOptions = {
        from: user + " <postmaster@jsonhappy.com>", // 发件地址
        to: email,      // 收件列表
        subject: title, // 标题
        html: content   // html 内容
    };

    // 发送邮件
    smtpTransport.sendMail(mailOptions, function (error, response) {
        resolve(error ? false : true);
        smtpTransport.close();
    });
});