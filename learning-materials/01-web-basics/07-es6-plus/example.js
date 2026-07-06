// ============================================
// ES6+ 示例程序
// 涵盖核心知识点：let/const、解构、箭头函数、Promise、async/await、Class等
// ============================================

// ============================================
// 1. let/const（块级作用域）
// ============================================
console.log('=== 1. let/const ===');

// let: 块级作用域，可重新赋值
let count = 1;
count = 2;
console.log('let count:', count);

// const: 块级作用域，不可重新赋值
const PI = 3.14159;
// PI = 3.14; // 报错：Assignment to constant variable
console.log('const PI:', PI);

// const对象属性可修改
const person = { name: 'Tom', age: 25 };
person.age = 26; // 允许修改属性
console.log('const object modified:', person);

// 块级作用域示例
{
    let blockVar = 'inside block';
    console.log('blockVar inside:', blockVar);
}
// console.log('blockVar outside:', blockVar); // 报错：blockVar is not defined

// ============================================
// 2. 解构赋值（Destructuring）
// ============================================
console.log('\n=== 2. 解构赋值 ===');

// 对象解构
const flight = {
    flightNo: 'CA1234',
    airline: '国航',
    price: 500,
    departure: '北京',
    arrival: '上海'
};

// 基本解构
const { flightNo, airline, price } = flight;
console.log('Object destructuring:', flightNo, airline, price);

// 解构并重命名
const { flightNo: no, airline: company } = flight;
console.log('Renamed:', no, company);

// 解构并设置默认值
const { discount = 1, tax = 0 } = flight;
console.log('Default values:', discount, tax);

// 数组解构
const numbers = [1, 2, 3, 4, 5];

// 基本解构
const [first, second] = numbers;
console.log('Array destructuring:', first, second);

// 跳过元素
const [, , third] = numbers;
console.log('Skip elements:', third);

// 剩余参数
const [a, b, ...rest] = numbers;
console.log('Rest parameters:', a, b, rest);

// ============================================
// 3. 模板字符串（Template Literals）
// ============================================
console.log('\n=== 3. 模板字符串 ===');

const name = 'Alice';
const age = 25;

// 普通字符串拼接
const str1 = 'My name is ' + name + ', I am ' + age + ' years old.';

// 模板字符串
const str2 = `My name is ${name}, I am ${age} years old.`;

console.log('String concat:', str1);
console.log('Template literal:', str2);

// 多行字符串
const multiLine = `
    This is a multi-line string.
    Line 2
    Line 3
`;
console.log('Multi-line string:', multiLine.trim());

// 表达式嵌入
const total = `Total: ${(100 + 200) * 1.08}`;
console.log('Expression:', total);

// ============================================
// 4. 箭头函数（Arrow Functions）
// ============================================
console.log('\n=== 4. 箭头函数 ===');

// 普通函数
const add1 = function(a, b) {
    return a + b;
};

// 箭头函数
const add2 = (a, b) => a + b;

console.log('add1(2, 3):', add1(2, 3));
console.log('add2(2, 3):', add2(2, 3));

// 无参数
const greet = () => 'Hello World';
console.log('greet():', greet());

// 单参数可省略括号
const double = x => x * 2;
console.log('double(5):', double(5));

// 多语句需要花括号和return
const calculate = (a, b) => {
    const sum = a + b;
    const product = a * b;
    return sum + product;
};
console.log('calculate(3, 4):', calculate(3, 4));

// 箭头函数没有自己的this
const obj = {
    name: 'Bob',
    greet: function() {
        setTimeout(() => {
            console.log('Arrow this.name:', this.name); // 继承外层this
        }, 100);
    },
    greet2: function() {
        setTimeout(function() {
            console.log('Function this.name:', this.name); // undefined
        }, 100);
    }
};
obj.greet();
obj.greet2();

// ============================================
// 5. Promise
// ============================================
console.log('\n=== 5. Promise ===');

// 创建Promise
const fetchFlightData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = true;
            if (success) {
                resolve({
                    flights: ['CA1234', 'MU5678', 'CZ9012'],
                    count: 3
                });
            } else {
                reject(new Error('Failed to fetch data'));
            }
        }, 500);
    });
};

// 使用Promise
fetchFlightData()
    .then(data => {
        console.log('Promise resolved:', data);
        return data.flights;
    })
    .then(flights => {
        console.log('Flights:', flights);
    })
    .catch(error => {
        console.error('Promise rejected:', error);
    })
    .finally(() => {
        console.log('Promise finally');
    });

// Promise.all: 等待所有Promise完成
const promise1 = Promise.resolve('A');
const promise2 = new Promise(resolve => setTimeout(() => resolve('B'), 300));
const promise3 = new Promise(resolve => setTimeout(() => resolve('C'), 100));

Promise.all([promise1, promise2, promise3])
    .then(results => console.log('Promise.all:', results));

// Promise.race: 返回第一个完成的Promise
Promise.race([promise2, promise3])
    .then(result => console.log('Promise.race:', result));

// ============================================
// 6. async/await
// ============================================
console.log('\n=== 6. async/await ===');

// async函数返回Promise
async function getData() {
    try {
        console.log('Fetching data...');
        const data = await fetchFlightData();
        console.log('Async data:', data);
        
        // 模拟多个异步操作
        const [a, b] = await Promise.all([promise2, promise3]);
        console.log('Parallel:', a, b);
        
        return data.flights;
    } catch (error) {
        console.error('Async error:', error);
        throw error;
    }
}

getData()
    .then(flights => console.log('Async flights:', flights))
    .catch(err => console.error('getData error:', err));

// ============================================
// 7. Class
// ============================================
console.log('\n=== 7. Class ===');

// 基础类
class Flight {
    // 构造函数
    constructor(flightNo, airline, price) {
        this.flightNo = flightNo;
        this.airline = airline;
        this.price = price;
    }
    
    // 实例方法
    getInfo() {
        return `${this.airline} ${this.flightNo}: ¥${this.price}`;
    }
    
    // 静态方法
    static compare(f1, f2) {
        return f1.price - f2.price;
    }
    
    // getter
    get discountedPrice() {
        return Math.floor(this.price * 0.9);
    }
    
    // setter
    set price(value) {
        if (value < 0) {
            throw new Error('Price cannot be negative');
        }
        this._price = value;
    }
    
    get price() {
        return this._price;
    }
}

const f1 = new Flight('CA1234', '国航', 500);
const f2 = new Flight('MU5678', '东航', 550);

console.log('f1.getInfo():', f1.getInfo());
console.log('f1.discountedPrice:', f1.discountedPrice);
console.log('Flight.compare(f1, f2):', Flight.compare(f1, f2));

// 继承
class InternationalFlight extends Flight {
    constructor(flightNo, airline, price, destination) {
        super(flightNo, airline, price); // 调用父类构造函数
        this.destination = destination;
    }
    
    // 重写方法
    getInfo() {
        return `${super.getInfo()} -> ${this.destination}`;
    }
}

const international = new InternationalFlight('CA9876', '国航', 2000, 'New York');
console.log('International flight:', international.getInfo());

// ============================================
// 8. 模块化
// ============================================
console.log('\n=== 8. 模块化 ===');

// 导出示例
// export const PI = 3.14;
// export function add(a, b) { return a + b; }
// export default class Flight {}

// 导入示例
// import { PI, add } from './module';
// import Flight from './module';

// ============================================
// 9. 可选链与空值合并
// ============================================
console.log('\n=== 9. 可选链与空值合并 ===');

const user = {
    name: 'Tom',
    address: {
        city: 'Beijing'
    }
};

// 可选链：避免空指针异常
const city = user?.address?.city;
console.log('Optional chaining city:', city);

const zipCode = user?.address?.zipCode;
console.log('Optional chaining zipCode:', zipCode);

// 空值合并：仅在null/undefined时返回默认值
const defaultValue = zipCode ?? 'Unknown';
console.log('Nullish coalescing:', defaultValue);

const countValue = 0 ?? 10;
console.log('Nullish with 0:', countValue); // 0（不是null/undefined）

// ============================================
// 10. 展开运算符与剩余参数
// ============================================
console.log('\n=== 10. 展开运算符与剩余参数 ===');

// 数组展开
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log('Array spread:', combined);

// 对象展开
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const merged = { ...obj1, ...obj2 }; // b被覆盖
console.log('Object spread:', merged);

// 函数参数展开
const nums = [1, 2, 3];
const sum = (x, y, z) => x + y + z;
console.log('Function spread:', sum(...nums));

// 剩余参数
const sumAll = (...args) => args.reduce((acc, curr) => acc + curr, 0);
console.log('Rest parameters:', sumAll(1, 2, 3, 4, 5));

// ============================================
// 11. 实用技巧
// ============================================
console.log('\n=== 11. 实用技巧 ===');

// 对象属性简写
const key = 'name';
const value = 'Alice';
const shorthand = { key, value };
console.log('Shorthand:', shorthand);

// 计算属性名
const dynamicKey = 'age';
const dynamicObj = { [dynamicKey]: 25 };
console.log('Dynamic key:', dynamicObj);

// 数组方法
const numbersArray = [1, 2, 3, 4, 5];

// map: 映射
const doubled = numbersArray.map(x => x * 2);
console.log('Array map:', doubled);

// filter: 过滤
const even = numbersArray.filter(x => x % 2 === 0);
console.log('Array filter:', even);

// reduce: 归约
const totalSum = numbersArray.reduce((acc, curr) => acc + curr, 0);
console.log('Array reduce:', totalSum);

// find: 查找
const found = numbersArray.find(x => x > 3);
console.log('Array find:', found);

console.log('\n=== ES6+ 学习完成 ===');
