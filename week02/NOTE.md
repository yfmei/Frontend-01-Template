# 重学JS
## JS 产生式

### 产生式（BNF-巴科斯范式）
1. 用尖括号括起来
1. 语法结构分成基础结构和需要用基础结构复合的复合结构
  1. 基础结构称终结符
  1. 复合皆否称非终结符
3. 引号与中间的字符表示终结符
3. 可以有括号
3. *表示重复多次
3. |表示或
3. +表示至少一次
#### 示例
```
# 定义语言
# 终结符
"a"
"b"
# 定义 Number 为
<Number> ::= "0" | "1" | "2" |... |"9"
# 任意位的Number
<DecimalNumber> ::= "0" | (("1" | "2" |... |"9") + <Number>*)
# 加法1: 
<AdditiveExpression> ::= <DecimalNumber> "+" <DecimalNumber>

# 加法2: 递归实现加法
<AdditiveExpression> ::= <AdditiveExpression> "+" <DecimalNumber>

# 加法3 合并1与2
<AdditiveExpression> ::= <DecimalNumber> | <AdditiveExpression> "+" <DecimalNumber>

```
#### 四则运算

- 1 + 2 * 3
```
<MutiplicativeExpression> ::= <DecimalNumber> | <MutiplicativeExpression> "*" <DecimalNumber>

<LogicalExpression> ::= <AdditiveExpression> | 
	<LogicalExpression> "||" <AdditiveExpression> |
  <LogicalExpression> "&&" <AdditiveExpression>

# 括号
<PrimaryExpression> ::= <DecimalNumber> |
	"(" <LogicalExpression>")"
```
```


BNF范式是一种用递归的思想来表述计算机语言符号集的定义规范法则：
::=表示定义；
“  ”双引号里的内容表示字符；
<>尖括号里的内容表示必选内容；
| 竖线两边的是可选内容，相当于or；
示例
定义java中的switch语句：
<switch statement> ::= switch ( <expression> ) <switch block><switch block> ::= { <switch block statement groups><switch labels> }<switch block statement groups> ::= <switch block statement group> | <switch block statement groups> <switch block statement group><switch block statement group> ::= <switch labels><block statements><switch labels> ::= <switch label> | <switch labels> <switch label><switch label> ::= case <constant expression> :<……> | default :< ……>
```

## JS词法、类型

### 源字符
> 所有的unicode

1. 基本内容
  1. 使用最广的字符集（现在在推广支持emoji）
  1. 码点-字符在字符集中对应的数字（如：a 的码点 97）
  1. 前128位码点最常用（对应ASCII码的码点-绝对多数字符集都保留了ASCII码的码点）
2. block-默认分组（时间、语种）
  1. 常用在中文字符范围：U+4E00~U+9FFF (cjk：chinese japanese keroa)
  1. BMP （Basic Mutilingual Plane）常用基本多文种平面：4位 unicode
3. category-按使用类型划分
  1. 字符大小写、控制字符、格式字符
4. JS中文变量
```bash
var 厉害 = 1
console.log(厉害)
// 等同于如上, 但是可以避免文件编码问题
var \u5839\u5bb3 = 2 // 这就是厉害两个字
console.log(厉害)
```
### 元素
> 四个顶级输入元素

#### InputElement

- Whitespace-支持unicode的空白
  - tab
  - sp - 排版（缩放屏幕）时换行会分开两个词，html 会自动合并
  - vt - 纵向制表符
  - ff
  - nbsp - 排版（缩放屏幕）使用，连接两个词，不会被换行分开，html 也不会自动合并
  - zwnbsp（微软的txt的BOM）
- LineTerminator
  - LF- line Feed
  - CR - Carriage Return 回车
- Comment - 单行和多行注释
- Token-记号，标号。JS中有效的输入
> punctuator 和 keywords 帮助程序形成结构，literal 和 identifier 代码包含的实际有效信息

  - Punctuator - 符号（> <( ) ）
  - Keywords - 关键字（let var const）



  - Literal - 直接量（true false null 1 0）
    - Number - 了解 IEEE754
      - 10进制 不允许多个0开头
      - 2进制 0b 开头
      - 8进制 0o 开头
      - 16进制 0x 开头
    - String
      - Character
      - Code Point
        - ASCII
        - Unicode
        - USC U+0000~U+FFFF(等价于 BMP)
        - GB-主要是中文
          - GB2312
          - GBK(GB13000)
          - GB18030
        - ISO-8859
        - BIG5
        ```javascript
        97.toString(2) // 错误，和小数 97. 混淆，编译不通过
        97 .toString(2) // 才是正确的
        ```

      - Encoding - 码点的编码形式
        - UTF - Unicode 的编码形式
      - Literal：双引号或单引号包含的字符串，支持任何非双引号和\
      - Grammar: "" '' ``
    - Boolean
    - 0bject
  - Identifier - 标识符（变量名、方法名）
    - 变量部分 - 不可以用关键字
    - 属性部分 - 可以用关键字
  - IdentifierName（举例：document.body.class 可以使用后就合并了 Identifier 和 keywords）
    - Keywords
    - Identifier
    - Future reserve keywords: class(已实现) enum
