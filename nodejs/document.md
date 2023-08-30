<table>
    <tr>
        <td>title：nodejs</td>
        <td>author：songyx</td>
        <td>date：2023/08/30</td>
    </tr>
</table>

#### 注意事项

1.Node.js中不能使用BOM和DOM的API，可以使用console和定时器API。

2.Node.js中的顶级对象为global，也可以使用globalThis访问。

#### fs

异步写入

```javascript
// 路径、内容、配置（可选）、回调函数
fs.writeFile('./word.txt', 'my', error => {
    // 失败返回错误对象，成功返回null
    console.log(error);
});
```

异步追加

```javascript
fs.appendFile('./word.txt', '\r\nname', error => {
    console.log(error);
});

fs.writeFile('./word.txt', '\r\nis', { flag: 'a' }, error => {
    console.log(error);
});
```

同步写入、追加

```javascript
// 路径、内容、配置（可选），无回调函数
fs.writeFileSync('./word.txt', '\r\nname');
fs.appendFileSync('./word.txt', '\r\n777');
```