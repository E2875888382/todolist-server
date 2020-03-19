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
    pullLibraryList(UID) {
        return `SELECT * FROM libs WHERE UID = "${UID}"`;
    },
    pullLibrary(library) {
        return `SELECT * FROM tasks WHERE library = "${library}";
                SELECT * FROM libs WHERE library = "${library}";
                SELECT * FROM tags WHERE library = "${library}"`;
    },
    pushLibrary: {
        delete(library) {
            return `DELETE FROM tags WHERE library ="${library}";
                    DELETE FROM tasks WHERE library = "${library}"`
        },
        insertTags(tags) {
            let str = 'INSERT INTO tags (id, library, color, NAME, num) VALUES';

            tags.forEach(({name, num, color, id, library}, index)=> {
                str += `("${id}","${library}","${color}","${name}",${num})`;
                if (index < tags.length -1) {
                    str += ',';
                }
            });
            return str;
        },
        insertTasks(tasks) {
            let str = 'INSERT INTO tasks (id, library, content, time, title, tag, done) VALUES';

            tasks.forEach(({id, library, content, time, title, tag, done}, index)=> {
                str += `("${id}","${library}","${content}","${time}","${title}","${tag}",${done})`;
                if (index < tasks.length -1) {
                    str += ',';
                }
            });
            return str;
        }
    },
    newLibrary(UID, update, name) {
        const library = UID + new Date().getTime();

        return `INSERT INTO libs (UID, library, \`update\`, NAME)
                VALUES (${UID}, ${library}, "${update}", "${name}")`;
    },
    deleteLibrary(library) {
        return `DELETE FROM libs WHERE library = "${library}";
                DELETE FROM tags WHERE library = "${library}";
                DELETE FROM tasks WHERE library = "${library}";`
    },
    update(UID, name, theme, avatar) {
        return `UPDATE users SET NAME = "${name}",
                theme = "${theme}",
                avatar = "${avatar}"
                WHERE UID = "${UID}"`;
    }
}