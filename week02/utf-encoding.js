/**
 * @author yfmei
 * @date 2020/4/22
 */

/**
 * 正则匹配所有 utf-8 encoding 字面量
 * 1. utf-8 针对 unicode 的可变长度字符编码
 * 2. 第一个字节兼容 ASCII 码
 * 3. 汉字要
 * @param str
 * @returns {string}
 */
function encoding(str) {
    // 获取字符的 unicode 码点
    let codePoint = str.codePointAt(str)

    // 补位
    if (codePoint > 0 && codePoint < 127) {
        console.log(`${str} 占一个字节, 补位为 0xxxxxxx`)
        // 转为二进制
        let binary = codePoint.toString(2)
        let binaryReverse = "";
        let binaryLen = binary.length
        console.log(binaryLen)
        for(let i = binaryLen - 1; i < binaryLen; i--){
            if (i < 0) {
                break
            }
            binaryReverse += binary[i]
        }
        let binaryRet = "0" + binaryReverse
        console.log(binaryRet)
        let finalByteLen = binaryRet.length
        let bitLen = finalByteLen / 4
        let ret = ""
        let point = 0
        // 每4位转为16进制
        for (let i = 0; i < bitLen; i++) {
            let item = binaryRet[point] + binaryRet[point+1] + binaryRet[point+2] + binaryRet[point+3]
            console.log(item)
            ret += "" + parseInt(item, 2)
            point += 4
        }
        console.log(ret)
        return ret
    }
    return str
}

function decode(hexStr) {
    var rawStr = hexStr.substr(0,2).toLowerCase() === "0x" ? hexStr.substr(2) : hexStr;
    var len = rawStr.length;

    var curCharCode;
    var resultStr = [];
    for(var i = 0; i < len;i = i + 2) {
        curCharCode = parseInt(rawStr.substr(i, 2), 16);
        resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr
}

let encodeStr = encoding("A")
console.log("编码: " + encodeStr)

console.log("解码: " + decode(encodeStr))
