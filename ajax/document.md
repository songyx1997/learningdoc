<table>
    <tr>
        <td>title：ajax</td>
        <td>author：songyx</td>
        <td>date：2023/08/21</td>
    </tr>
</table>

#### 1.Ajax

##### 原生GET

```html
<body>
    <button id="btn">点击发送请求</button>
    <input id="text">
</body>
<script>
    var btn = document.getElementById('btn')
    var text = document.getElementById('text')
    btn.onclick = function () {
        // 创建对象
        const xhr = new XMLHttpRequest()
        // 设置请求方法与url
        xhr.open('GET', 'http://127.0.0.1:8000/getServer')
        // 发送
        xhr.send()
        // 处理返回结果
        xhr.onreadystatechange = function () {
            // 该状态表示解析已完成
            if (xhr.readyState === 4) {
                // 该范围内的状态码均为成功
                if (xhr.status >= 200 && xhr.status < 300) {
                    text.value = xhr.response
                }
            }
        }
    }
</script>
```

##### 传参

```javascript
url = '请求地址' + '?a=100&b=200'
```
