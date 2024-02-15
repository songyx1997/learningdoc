<table>
    <tr>
        <td>title：typescript</td>
        <td>author：songyx</td>
        <td>date：2024/02/15</td>
    </tr>
</table>

#### 类型

##### unknown

`unknown`是类型安全的`any`，不能直接赋值给其他变量。

```typescript
let e: unknown;
let s: string;
e = 'hello';
// 1.判断类型
if (typeof e === 'string') {
    s = e;
}
// 2.类型断言
s = e as string;
```

##### 类型断言

存在两种写法

```typescript
s = e as string;
s = <string>e;
```

##### void、never

前者表示空值，后者表示没有值（不能是任何值）。

```typescript
function fun(): void {
    return undefined;
}
function error(): never {
    throw 'error';
}
```

##### 类型推断

当类型没有给出，`ts`编译器会自动推断类型。若无法推断出类型，则视为动态`any`类型。

```typescript
// 推断出a为number类型
let a = 1;
// 编译错误
a = 'hello';
```

##### 元组

元组就是固定长度的数组，可以使用数组的解构赋值。

```typescript
let a = [1, 'hello', 'yes'];
let [num, ...strs] = a;
```

##### enum

使用枚举，便于统一修改，同时增强了代码可读性。

```typescript
enum Gender {
    Male = 1,
    Female = 0
}
// &表示person需要同时满足
let person: { name: string } & { gender: Gender };
person = { name: 'songyx', gender: Gender.Male };
```

##### 类型别名

```typescript
type letter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
// 编译通过
let str1: letter = 'A';
// 编译错误
let str2: letter = 'H'
```

#### 编译选项