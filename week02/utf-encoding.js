/**
 * @author yfmei
 * @date 2020/4/22
 */
const BYTE_LEN = 8

/**
 * 分组
 * @param arr
 * @param childLen
 * @returns {[]}
 */
function groupArr(arr, childLen = BYTE_LEN) {
    let chunkedArr = []
    for (let i = 0; i < arr.length; i++) {
        if (i % childLen === 0) {
            chunkedArr.push([])
        }
        chunkedArr[chunkedArr.length - 1].push(arr[i])
    }
    return chunkedArr
}

/**
 * 正则匹配所有 utf-8 encode 字面量
 * 1. utf-8 针对 unicode 的可变长度字符编码
 * 2. 第一个字节兼容 ASCII 码
 * 3. 根据码点的2进制长度进行补位然后转为16进制
 * @param str
 * @returns {string}
 */
function encode(str) {
    let resultStr = []
    for (let char of str) {
        // 获取字符的 unicode 码点
        let codePoint = char.codePointAt(char)
        console.debug("码点为：" + codePoint)

        // 转为二进制
        let binary = codePoint.toString(2)

        let binaryLen = binary.length
        console.debug("码点二进制为：" + binary + ", " + binaryLen + "字节")
        // 不足8位补0
        let remains = binaryLen % 8

        if (binaryLen > 8 && remains !== 0) {
            console.debug("码点长度不是8的倍数，进行补0：" + remains)

            binary = "0".repeat(BYTE_LEN - remains) + binary
            console.debug("补0后码点二进制为：" + binary)
        }

        binaryLen = binary.length

        // 补位
        let binaryRet = ""
        let firstByteCoverLen = "" // 第1个字节需补位长度
        let secondByteCoverLen = "" // 第2个字节需补位长度
        let thirdByteCoverLen = "" // 第3个字节需补位长度
        let fourthByteCoverLen = "" // 第4个字节需补位长度
        // 补位原则
        // 0xxxxxxx
        // 110xxxxx 10xxxxxx
        // 1110xxxx 10xxxxxx 10xxxxxx
        // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx

        if (codePoint < 128) {
            console.debug(`${char} 占一个字节, 补位为 0xxxxxxx`)
            firstByteCoverLen = BYTE_LEN - 1
            binaryRet = "0" + binary.slice(0, firstByteCoverLen)
            console.debug("补位后结果为：" + binaryRet)
        } else if (codePoint > 127 && codePoint < 2048) {
            firstByteCoverLen = BYTE_LEN - 3
            binaryRet = "110" + binary.slice(0, firstByteCoverLen)
            binaryRet += "10" + binary.slice(firstByteCoverLen, binaryLen - firstByteCoverLen - 1)
        } else if (codePoint > 2047 && codePoint < 65536) {
            firstByteCoverLen = BYTE_LEN - 4
            secondByteCoverLen = firstByteCoverLen + 6
            thirdByteCoverLen = secondByteCoverLen + 6

            binaryRet = "1110" + binary.slice(0, firstByteCoverLen)
            binaryRet += "10" + binary.slice(firstByteCoverLen, secondByteCoverLen)
            binaryRet += "10" + binary.slice(secondByteCoverLen, thirdByteCoverLen)

        } else if (codePoint > 65535 && codePoint <= 1114111) {
            firstByteCoverLen = BYTE_LEN - 5
            secondByteCoverLen = firstByteCoverLen + 6
            thirdByteCoverLen = secondByteCoverLen + 6
            fourthByteCoverLen = thirdByteCoverLen + 6
            binaryRet = "11110" + binary.slice(0, firstByteCoverLen)
            binaryRet += "10" + binary.slice(firstByteCoverLen, secondByteCoverLen)
            binaryRet += "10" + binary.slice(secondByteCoverLen, thirdByteCoverLen)
            binaryRet += "10" + binary.slice(thirdByteCoverLen, fourthByteCoverLen)
        }
        console.debug("补位结果为: " + binaryRet)
        let ret = ""
        // 分组, 每 8 位表示一个字节
        let groupedArr = groupArr(binaryRet)
        // 每个字节转为 2个 16 进制数
        for (let item of groupedArr) {
            let binary = parseInt(item.join(""), 2)
            ret += binary.toString(16)
        }

        resultStr.push(ret)
    }
    return resultStr
}

/**
 * 1. 判断补位格式（几个字节）
 * 2. 反向移除补位
 * 3. 获取码点
 * 4. 转为 unicode 编码
 * @param hexArr 16进制数组
 * @returns {string}
 */
function decode(hexArr) {
    let resultStr = ""
    for (let i = 0; i < hexArr.length; i++) {
        let hexStr = hexArr[i]
        let coverCodePoint = "" // 补位结果
        for (let i = 0; i < hexStr.length; i++) {
            let hexArr = hexStr[i]
            for (let hexChar of hexArr) {
                // console.debug(hexChar)
                // 单个字符的二进制
                let binaryChar = parseInt(hexChar, 16).toString(2)
                // console.debug(binaryChar)
                // 不足4位补位
                binaryChar = "0".repeat(4 - binaryChar.length) + binaryChar
                // console.debug(binaryChar)
                coverCodePoint += binaryChar
            }
        }
        console.debug("解码获取补位结果：" + coverCodePoint)
        // 4位一组划分16进制
        let groupedHexArr = groupArr(coverCodePoint)
        let codePoint = "" // 整个字符对应的码点

        // 第一个字节
        let firstChar = groupedHexArr[0].join("")
        // 转为十进制
        let maskFirstChar = parseInt(firstChar, 2)

        console.debug("firstChar: " + firstChar)
        // console.debug("maskFirstChar: " + maskFirstChar)

        // 根据第一个字节的补位方式反向移除补位，获取码点

        // 10000000 = 128
        // 11000000 = 192
        // 11100000 = 224
        // 11110000 = 240

        if ((maskFirstChar & 240) === 240) {
            console.debug("firstChar: " + 240 .toString(2))
            codePoint = firstChar.slice(5)
            // 第二个字节
            let secondChar = groupedHexArr[1].join("")
            // 第三个字节
            let thirdChar = groupedHexArr[2].join("")
            // 第四个字节
            let fourthChar = groupedHexArr[3].join("")
            console.debug("第一个字符码点: " + codePoint)
            codePoint += secondChar.slice(2)
            codePoint += thirdChar.slice(2)
            codePoint += fourthChar.slice(2)
            console.debug("整个字符码点: " + codePoint)

        } else if ((maskFirstChar & 224) === 224) {
            console.debug("firstChar: " + 224 .toString(2))

            codePoint = firstChar.slice(4)
            let secondChar = groupedHexArr[1].join("")
            let thirdChar = groupedHexArr[2].join("")
            console.debug("第一个字符码点: " + codePoint)
            codePoint += secondChar.slice(2)
            codePoint += thirdChar.slice(2)
            console.debug("整个字符码点: " + codePoint)
        } else if ((maskFirstChar & 192) === 192) {
            console.debug("firstChar: " + 192 .toString(2))

            codePoint = firstChar.slice(3)
            console.debug("第一个字符码点: " + codePoint)
            let secondChar = groupedHexArr[1].join("")
            let thirdChar = groupedHexArr[2].join("")

            codePoint += secondChar.slice(2)
            codePoint += thirdChar.slice(2)
            console.debug("整个字符码点: " + codePoint)

        } else if ((maskFirstChar & 128) === 0) {
            console.debug("firstChar: " + 128 .toString(2))
            codePoint = firstChar.slice(1)
        }
        console.debug("解码获取码点：" + codePoint)
        console.debug("解码获取码点：" + parseInt(codePoint, 2))

        // 码点转字符串
        resultStr += String.fromCodePoint(parseInt(codePoint, 2))

    }
    return resultStr
}


let encodeArr = encode("A")
console.info("UTF-8 编码: " + encodeArr)
console.info("UTF-8 解码: " + decode(encodeArr))

encodeArr = encode("解码获取补位结果")
console.info("UTF-8 编码: " + encodeArr)
console.info("UTF-8 解码: " + decode(encodeArr))

