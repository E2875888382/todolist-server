const db = require('../model/database/databasePromise.js');
const sql = require('../model/sql/syncSql.js');
const Token = require('../utils/token.js');

module.exports = {
    pullLibraryList(req, res) {
        const {token} = req.headers;

        if (token && Token.checkToken(token)) {
            const payload = token.match(/(?<=\.).*?(?=\.)/)[0];
            const UID = JSON.parse(Token.decode(payload))['sub'];

            db(sql.pullLibraryList(UID)).then(result=> {
                if (result.length === 0) {
                    res.status(200).json([]);
                } else {
                    res.status(200).json(result);
                }
            }, e=> {
                console.log(e);
            })
        } else {
            res.status(401).json({msg:'token检校失败'});
        }
    },
    pullLibrary(req, res) {
        req.on('data', async (data)=> {
            const {token} = req.headers;
            const {library} = JSON.parse(data.toString());

            if (token && Token.checkToken(token)) {
                try {
                    const result = await db(sql.pullLibrary(library));

                    if (result.length === 0) {
                        res.status(200).json([]);
                    } else {
                        res.status(200).json({
                            tasks: result[0],
                            library: result[1],
                            tags: result[2]
                        });
                    }
                } catch(e) {
                    console.log(e);
                }
            } else {
                res.status(401).json({msg:'token检校失败'});
            }
        })
    },
    pushLibrary(req, res) {
        req.on('data', async (data)=> {
            const {token} = req.headers;
            let {lib: {library, tags, tasks, doneTasks}} = JSON.parse(data.toString());

            if (token && Token.checkToken(token)) {
                tags.forEach(i=> {
                    i = Object.assign(i, {library: library});
                });
                tasks.forEach(i=> {
                    i = Object.assign(i, {
                        done: 0,
                        library: library
                    })
                });
                doneTasks.forEach(i=> {
                    i = Object.assign(i, {
                        done: 1,
                        library: library
                    })
                });
                // 删除原来库的tags
                // 删除原来库的task（task和donetask）
                await db(sql.pushLibrary.delete(library));
                // 插入新的tags
                await db(sql.pushLibrary.insertTags(tags));
                // 插入新的task
                await db(sql.pushLibrary.insertTasks([...tasks, ...doneTasks]))
                res.status(200).json({msg:'success'});
            } else {
                res.status(401).json({msg:'token检校失败'});
            }
        })
    },
    newLibrary(req, res) {
        req.on('data', async (data)=> {
            const {token} = req.headers;
            const {name, update} = JSON.parse(data.toString());
            const payload = token.match(/(?<=\.).*?(?=\.)/)[0];
            const UID = JSON.parse(Token.decode(payload))['sub'];

            if (token && Token.checkToken(token)) {
                try {
                    const result = await db(sql.newLibrary(UID, update, name));

                    res.status(200).json(result);
                } catch(e) {
                    console.log(e);
                }
            } else {
                res.status(401).json({msg:'token检校失败'});
            }
        })
    },
    deleteLibrary(req, res) {
        req.on('data', async (data)=> {
            const {token} = req.headers;
            const {library} = JSON.parse(data.toString());

            if (token && Token.checkToken(token)) {
                try {
                    const result = await db(sql.deleteLibrary(library));

                    res.status(200).json(result);
                } catch(e) {
                    console.log(e);
                }
            } else {
                res.status(401).json({msg:'token检校失败'});
            }
        })
    }
}