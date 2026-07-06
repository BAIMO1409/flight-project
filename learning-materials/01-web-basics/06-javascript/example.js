// ============================================
// JavaScript 示例程序
// 涵盖核心知识点：数据类型、函数、闭包、原型链、异步编程
// ============================================

// ============================================
// 1. 数据类型
// ============================================
console.log('=== 1. 数据类型 ===');

// 基本类型
const str = 'Hello World';      // string
const num = 123;                // number
const bool = true;              // boolean
const nullVal = null;           // null
const undef = undefined;        // undefined
const sym = Symbol('key');      // symbol

console.log('String:', str);
console.log('Number:', num);
console.log('Boolean:', bool);
console.log('Null:', nullVal);
console.log('Undefined:', undef);
console.log('Symbol:', sym);

// 引用类型
const arr = [1, 2, 3];          // array（特殊的object）
const obj = { name: 'Tom', age: 25 };  // object
const func = function() { return 'hello'; };  // function

console.log('Array:', arr);
console.log('Object:', obj);
console.log('Function:', func);

// typeof判断类型
console.log('typeof str:', typeof str);      // string
console.log('typeof num:', typeof num);      // number
console.log('typeof bool:', typeof bool);    // boolean
console.log('typeof null:', typeof nullVal); // object（历史遗留bug）
console.log('typeof undef:', typeof undef);  // undefined
console.log('typeof arr:', typeof arr);      // object
console.log('typeof obj:', typeof obj);      // object
console.log('typeof func:', typeof func);    // function

// ============================================
// 2. 函数与作用域
// ============================================
console.log('\n=== 2. 函数与作用域 ===');

// 函数声明
function greet(name) {
    return `Hello, ${name}!`;
}
console.log(greet('World'));

// 函数表达式
const add = function(a, b) {
    return a + b;
};
console.log('add(2, 3):', add(2, 3));

// 箭头函数（ES6+）
const multiply = (a, b) => a * b;
console.log('multiply(4, 5):', multiply(4, 5));

// IIFE（立即执行函数）
const result = (function(x, y) {
    return x + y;
})(10, 20);
console.log('IIFE result:', result);

// 作用域示例
let globalVar = 'global';

function outer() {
    let outerVar = 'outer';
    
    function inner() {
        let innerVar = 'inner';
        // inner可以访问所有外部变量
        console.log('inner scope:', globalVar, outerVar, innerVar);
    }
    
    inner();
    // outer不能访问inner的变量
    // console.log(innerVar); // 报错
}

outer();

// ============================================
// 3. 闭包（Closure）
// ============================================
console.log('\n=== 3. 闭包 ===');

// 闭包示例1：计数器
function createCounter() {
    let count = 0;  // 私有变量，外部无法直接访问
    
    return {
        increment: function() {
            count++;
            return count;
        },
        decrement: function() {
            count--;
            return count;
        },
        getCount: function() {
            return count;
        }
    };
}

const counter = createCounter();
console.log('counter.increment():', counter.increment());  // 1
console.log('counter.increment():', counter.increment());  // 2
console.log('counter.decrement():', counter.decrement());  // 1
console.log('counter.getCount():', counter.getCount());    // 1

// 闭包示例2：函数柯里化
function curryAdd(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        };
    };
}

const add10 = curryAdd(10);
const add10And5 = add10(5);
console.log('curryAdd(10)(5)(3):', add10And5(3));  // 18

// ============================================
// 4. 原型链（Prototype Chain）
// ============================================
console.log('\n=== 4. 原型链 ===');

// 构造函数
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// 在原型上添加方法
Person.prototype.sayHello = function() {
    console.log(`Hello, my name is ${this.name}, I'm ${this.age} years old.`);
};

Person.prototype.species = 'Human';

const person1 = new Person('Alice', 25);
const person2 = new Person('Bob', 30);

person1.sayHello();  // Hello, my name is Alice, I'm 25 years old.
person2.sayHello();  // Hello, my name is Bob, I'm 30 years old.

// 原型链查找
console.log('person1.name:', person1.name);           // 自有属性
console.log('person1.species:', person1.species);     // 原型属性
console.log('person1.toString:', person1.toString);   // Object原型方法

// 原型链结构
// person1.__proto__ === Person.prototype
// Person.prototype.__proto__ === Object.prototype
// Object.prototype.__proto__ === null

console.log('person1.__proto__ === Person.prototype:', person1.__proto__ === Person.prototype);
console.log('Person.prototype.__proto__ === Object.prototype:', Person.prototype.__proto__ === Object.prototype);
console.log('Object.prototype.__proto__:', Object.prototype.__proto__);

// ============================================
// 5. 异步编程
// ============================================
console.log('\n=== 5. 异步编程 ===');

// 回调函数
function fetchData(callback) {
    setTimeout(function() {
        const data = { flights: ['CA1234', 'MU5678'] };
        callback(null, data);
    }, 1000);
}

fetchData(function(err, data) {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Callback data:', data);
    }
});

// Promise
function fetchDataPromise() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            const success = true;
            if (success) {
                resolve({ flights: ['CA1234', 'MU5678'] });
            } else {
                reject(new Error('Failed to fetch data'));
            }
        }, 1000);
    });
}

fetchDataPromise()
    .then(function(data) {
        console.log('Promise data:', data);
        return data.flights;
    })
    .then(function(flights) {
        console.log('Flights:', flights);
    })
    .catch(function(err) {
        console.error('Promise Error:', err);
    });

// async/await
async function fetchDataAsync() {
    try {
        const data = await fetchDataPromise();
        console.log('Async/Await data:', data);
        return data.flights;
    } catch (err) {
        console.error('Async Error:', err);
        throw err;
    }
}

fetchDataAsync().then(function(flights) {
    console.log('Async flights:', flights);
});

// ============================================
// 6. DOM操作示例（浏览器环境）
// ============================================
console.log('\n=== 6. DOM操作（浏览器环境） ===');

// 检查是否在浏览器环境
if (typeof document !== 'undefined') {
    // 获取元素
    const container = document.getElementById('container');
    
    // 创建元素
    const div = document.createElement('div');
    div.textContent = 'Hello from JavaScript';
    div.style.color = '#3b82f6';
    div.style.fontSize = '18px';
    
    // 添加到页面
    container.appendChild(div);
    
    // 事件绑定
    div.addEventListener('click', function() {
        alert('You clicked me!');
    });
} else {
    console.log('Running in non-browser environment (Node.js)');
}

// ============================================
// 7. 模块化示例
// ============================================
console.log('\n=== 7. 模块化 ===');

// 模块导出（Node.js风格）
// module.exports = {
//     fetchData,
//     createCounter,
//     Person
// };

// 模块导入
// const { fetchData, createCounter } = require('./example');

// ============================================
// 8. 实用函数示例
// ============================================
console.log('\n=== 8. 实用函数 ===');

// 防抖函数
function debounce(func, wait) {
    let timeout = null;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle = false;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 深拷贝
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

// 测试深拷贝
const original = { name: 'Tom', age: 25, hobbies: ['reading', 'coding'] };
const cloned = deepClone(original);
cloned.hobbies.push('swimming');
console.log('Original:', original);
console.log('Cloned:', cloned);

console.log('\n=== 学习完成 ===');
