module.exports = {
    checkExit(user) {
        return `SELECT * FROM users WHERE USER = "${user}"`;
    },
    register({user, password}) {
        const name = `user${new Date().getTime()}`;
        return `INSERT INTO users (USER,PASSWORD,NAME) VALUES ("${user}","${password}","${name}")`;
    },
    login(user, password) {
        return `SELECT * FROM users WHERE user ="${user}"AND password = "${password}"`;
    },
    getAvatar(user) {
        return `SELECT avatar FROM users WHERE USER = "${user}"`;
    },
    update(UID, name, theme, avatar) {
        return `UPDATE users SET NAME = "${name}",
                theme = "${theme}",
                avatar = "${avatar}"
                WHERE UID = "${UID}"`;
    }
}