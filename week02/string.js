/**
 * @author yfmei
 * @date 2020/4/22
 */

// 正则匹配所有字符串字面量
function strMatch(str) {
    let reg = /("[^"]*")|('[^']*')/g
    return str.match(reg)
}

console.log(strMatch('var a = "字符串""字符串""字符串""字符串"'))
console.log(strMatch("var b = 'c' 'b' 'a'"))
