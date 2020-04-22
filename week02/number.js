/**
 * @author yfmei
 * @date 2020/4/22
 */

// 正则匹配所有 number 字面量
function numberMatch(number) {
    let decimalReg = /\d/g.test(number)
    let binaryReg = /01/g.test(number)
    let octalReg = /0-7/g.test(number)
    let hexReg = /[0-9A-F]/gi.test(number)
    return decimalReg || binaryReg || octalReg || hexReg
}

let decimalArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

for (let no of decimalArr) {
    console.log(numberMatch(no))
}

let byteArr = [10, 11, 0b01, 0b1100110]

for (let no of byteArr) {
    console.log(numberMatch(no))
}

let hexArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0xA, 0xB, 0xC, 0xD, 0xE, 0xF, 0x10eFA1]

for (let no of hexArr) {
    console.log(numberMatch(no))
}
