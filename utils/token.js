const crypto = require('crypto');
const encode = (obj)=> {
    return Buffer.from(JSON.stringify(obj)).toString('base64');
};
const createSignature = (str)=> {
    const secret = "elric";
    const HmacSHA256 = crypto.createHmac("sha256", secret);
    const content = HmacSHA256.update(str);
    const cryptoContent = content.digest("hex");

    return cryptoContent;
};

module.exports = {
    decode(str) {
        return Buffer.from(str, 'base64').toString('ascii');
    },
    createToken(UID) {
        const header = {
            typ: "JWT",
            alg: "HS256"
        };
        const time = new Date().getTime();
        const payload = {
            iss: "elric todolist server", // 签发者
            iat: time, // 签发时间
            exp: time + 7 * 24 * 60 * 60 * 1000, // 过期时间
            sub: Number(UID), // 面向的用户
            aud: "todolist", // 接收方
            jti: Math.floor(time * Math.random()) // token的唯一标识，用于处理注销问题以及重放攻击
        };
        const str = `${encode(header)}.${encode(payload)}`;
        const signature = createSignature(str);

        return `${str}.${signature}`;
    },
    checkToken(token) {
        const headers = token.split('.')[0];
        const payload = token.split('.')[1];
        const str = `${headers}.${payload}`;
        const signature = createSignature(str);
        const newToken = `${str}.${signature}`;
        const payloadStr = this.decode(payload);
        const exp = JSON.parse(payloadStr)['exp'];

        // 如果token过期或者被篡改都需要重新登陆
        if (token !== newToken) {
            // token被篡改
            return false;
        } else if (exp < new Date().getTime()) {
            // token过期
            return false;
        }
        return true;
    }
}