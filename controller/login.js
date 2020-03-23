const db = require('../model/database/databasePromise.js');
const sql = require('../model/sql/loginSql.js');
const token = require('../utils/token.js');

// register，login，getCode，getAvatar不需要校验token
module.exports = {
    register(req, res) {
        req.on('data', async (data)=> {
            const {user, password} = JSON.parse(data.toString());
            const userReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            const pwdReg = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{8,10}$/;

            if (userReg.test(user) && pwdReg.test(password)) {
                try {
                    const checkRes = await db(sql.checkExit(user));

                    if (checkRes.length === 0) {
                        await db(sql.register({user, password}));
                        res.status(200).json({
                            code: 200,
                            msg: 'register success'
                        });
                    } else {
                        res.status(200).json({
                            code: 500,
                            msg: '该账号已被注册'
                        });
                    }
                } catch(e) {
                    console.log(e);
                }
            } else {
                res.status(200).json({
                    code: 500,
                    msg: '账号格式出错'
                });
            }
        })
    },
    login(req, res) {
        req.on('data', async (data)=> {
            const {user, password} = JSON.parse(data.toString());

            try {
                const result = await db(sql.login(user, password));

                if (result.length === 0) {
                    res.status(200).json({msg:'没有数据'});
                } else {
                    const {UID, avatar, name, theme} = result[0];
        
                    res.status(200).json({
                        avatar,
                        name,
                        theme,
                        token: token.createToken(UID)
                    });
                }
            } catch(e) {
                console.log(e);
            }
        })
    },
    getCode(req, res) {
        let n = Math.floor(Math.random() * 10000);

        if (n < 1000) {
            n += 1000;
        }
        res.status(200).json({code: `${n}`});
    },
    getAvatar(req, res) {
        req.on('data', (data)=> {
            const body = JSON.parse(data.toString());
            const user = body.user;

            db(sql.getAvatar(user)).then(result=> {
                if (result.length === 0) {
                    res.status(200).json({msg:'没有数据'});
                } else {
                    res.status(200).json(result[0]);
                }
            }, error=> {
                console.log(error);
            });
        })
    },
    update(req, res) {
        req.on('data', (data)=> {
            const {token} = req.headers;
            const {name, theme, avatar} = JSON.parse(data.toString());
            const payload = token.match(/(?<=\.).*?(?=\.)/)[0];
            const UID = JSON.parse(Token.decode(payload))['sub'];

            if (token && Token.checkToken(token)) {
                db(sql.update(UID, name, theme, avatar)).then(result=> {
                    res.status(200).json(result);
                }, error=> {
                    console.log(error);
                })
            } else {
                res.status(401).json({msg:'token检校失败'});
            }
        })
    }
}