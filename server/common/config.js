const { join } = require('path');

module.exports = {
    "tables": {
        "session": "_mysql_session_store",
        "dbadminUser": "chat_adminuser",
        "dbphoto": "chat_photo",
        "dbuser": "chat_user",
        "dblogin": "chat_socketloginuser",
        "dbautokey": "chat_autologin",
        "dbclass": "chat_class",
        "dbchat": "chat_record",
        "dbnotice": "chat_notice"
    },
    origin: ['http://127.0.0.1:8080'],
    static: join(__dirname, '../static')
}