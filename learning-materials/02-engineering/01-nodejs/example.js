// ============================================
// Node.js 示例程序
// 涵盖核心知识点：文件系统、HTTP服务器、模块化、异步编程
// ============================================

// ============================================
// 1. 常用模块导入
// ============================================
const fs = require('fs');           // 文件系统模块
const path = require('path');       // 路径处理模块
const http = require('http');       // HTTP模块
const url = require('url');         // URL解析模块
const querystring = require('querystring'); // 查询字符串处理

// ============================================
// 2. 文件系统操作（fs模块）
// ============================================
console.log('=== 2. 文件系统操作 ===');

// 2.1 同步读取文件
try {
    const content = fs.readFileSync(__filename, 'utf8');
    console.log('同步读取文件:', content.slice(0, 50) + '...');
} catch (err) {
    console.error('同步读取错误:', err);
}

// 2.2 异步读取文件
fs.readFile(__filename, 'utf8', (err, data) => {
    if (err) {
        console.error('异步读取错误:', err);
        return;
    }
    console.log('异步读取文件:', data.slice(0, 50) + '...');
});

// 2.3 写入文件
const outputPath = path.join(__dirname, 'output.txt');
const outputContent = 'Hello from Node.js!\n时间: ' + new Date().toISOString();

fs.writeFile(outputPath, outputContent, (err) => {
    if (err) {
        console.error('写入文件错误:', err);
        return;
    }
    console.log('文件写入成功:', outputPath);
});

// 2.4 读取目录
fs.readdir(__dirname, (err, files) => {
    if (err) {
        console.error('读取目录错误:', err);
        return;
    }
    console.log('目录内容:', files);
});

// ============================================
// 3. 路径处理（path模块）
// ============================================
console.log('\n=== 3. 路径处理 ===');

const currentPath = __filename;
console.log('当前文件路径:', currentPath);
console.log('目录名:', __dirname);
console.log('文件名:', path.basename(currentPath));
console.log('扩展名:', path.extname(currentPath));
console.log('路径解析:', path.parse(currentPath));

// 连接路径（跨平台兼容）
const joinedPath = path.join(__dirname, 'data', 'flights.json');
console.log('连接路径:', joinedPath);

// ============================================
// 4. HTTP服务器（http模块）
// ============================================
console.log('\n=== 4. HTTP服务器 ===');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    // 解析URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    console.log(`请求: ${req.method} ${pathname}`);

    // 设置响应头
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // 路由处理
    if (pathname === '/api/flights') {
        // 获取查询参数
        const date = query.date || '2024-01-15';
        const sort = query.sort || 'recommend';

        // Mock航班数据
        const flights = [
            { flightNo: 'CA1234', airline: '国航', price: 500, date },
            { flightNo: 'MU5678', airline: '东航', price: 550, date },
            { flightNo: 'CZ9012', airline: '南航', price: 480, date }
        ];

        // 排序
        if (sort === 'price') {
            flights.sort((a, b) => a.price - b.price);
        }

        // 发送响应
        res.writeHead(200);
        res.end(JSON.stringify({
            code: 0,
            message: 'success',
            data: { flights }
        }));
    } else if (pathname === '/api/dates') {
        // 返回日期列表
        const dates = [
            { date: '2024-01-15', week: '周一', price: 500 },
            { date: '2024-01-16', week: '周二', price: 480 },
            { date: '2024-01-17', week: '周三', price: 520 }
        ];

        res.writeHead(200);
        res.end(JSON.stringify({
            code: 0,
            message: 'success',
            data: dates
        }));
    } else {
        // 404 Not Found
        res.writeHead(404);
        res.end(JSON.stringify({
            code: 404,
            message: 'Not Found'
        }));
    }
});

// 启动服务器
const PORT = 3003;
server.listen(PORT, () => {
    console.log(`HTTP服务器启动成功: http://localhost:${PORT}`);
    console.log('可用接口:');
    console.log('  GET /api/flights?date=2024-01-15&sort=price');
    console.log('  GET /api/dates');
});

// ============================================
// 5. HTTP客户端请求
// ============================================
console.log('\n=== 5. HTTP客户端请求 ===');

// 发送HTTP请求
const options = {
    hostname: 'localhost',
    port: PORT,
    path: '/api/flights?date=2024-01-15',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('HTTP响应:', JSON.parse(data));
    });
});

req.on('error', (e) => {
    console.error('请求错误:', e);
});

req.end();

// ============================================
// 6. 模块化示例
// ============================================
console.log('\n=== 6. 模块化 ===');

// 自定义模块
const utils = require('./utils');
console.log('utils.add(2, 3):', utils.add(2, 3));
console.log('utils.formatDate():', utils.formatDate());

// ============================================
// 7. 异步编程示例
// ============================================
console.log('\n=== 7. 异步编程 ===');

// Promise封装异步操作
function readFilePromise(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// async/await
async function processFiles() {
    try {
        console.log('开始读取文件...');
        const content = await readFilePromise(__filename);
        console.log('文件内容长度:', content.length);
        console.log('异步操作完成');
    } catch (err) {
        console.error('异步错误:', err);
    }
}

processFiles();

// ============================================
// 8. 全局对象
// ============================================
console.log('\n=== 8. 全局对象 ===');

console.log('Node版本:', process.version);
console.log('平台:', process.platform);
console.log('环境变量:', process.env.NODE_ENV);
console.log('当前目录:', process.cwd());

// ============================================
// 9. 事件发射器
// ============================================
console.log('\n=== 9. 事件发射器 ===');

const EventEmitter = require('events');

class FlightEmitter extends EventEmitter {}

const emitter = new FlightEmitter();

// 监听事件
emitter.on('flightUpdate', (data) => {
    console.log('航班更新:', data);
});

// 触发事件
setTimeout(() => {
    emitter.emit('flightUpdate', { flightNo: 'CA1234', status: 'boarding' });
}, 100);

console.log('\n=== Node.js 学习完成 ===');
