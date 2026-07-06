// ============================================
// Express 示例程序
// 涵盖核心知识点：路由、中间件、CORS、错误处理、RESTful API
// ============================================

// ============================================
// 1. 导入模块
// ============================================
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// 创建Express应用
const app = express();
const PORT = 3003;

// ============================================
// 2. 中间件配置
// ============================================
console.log('=== 2. 中间件配置 ===');

// CORS跨域中间件
app.use(cors());
console.log('✓ CORS中间件已配置');

// 解析JSON请求体
app.use(express.json());
console.log('✓ JSON解析中间件已配置');

// 解析URL编码请求体
app.use(express.urlencoded({ extended: true }));
console.log('✓ URL编码解析中间件已配置');

// 自定义日志中间件
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // 调用下一个中间件
});

// ============================================
// 3. 路由定义
// ============================================
console.log('\n=== 3. 路由定义 ===');

// 3.1 GET请求 - 获取航班列表
app.get('/api/flights', (req, res) => {
    // 获取查询参数
    const { date, sort = 'recommend', page = 1, pageSize = 10 } = req.query;
    
    console.log('查询参数:', { date, sort, page, pageSize });

    // Mock航班数据
    const flights = [
        { id: 1, flightNo: 'CA1234', airline: '国航', price: 500, departure: '北京', arrival: '上海', date: date || '2024-01-15' },
        { id: 2, flightNo: 'MU5678', airline: '东航', price: 550, departure: '北京', arrival: '上海', date: date || '2024-01-15' },
        { id: 3, flightNo: 'CZ9012', airline: '南航', price: 480, departure: '北京', arrival: '上海', date: date || '2024-01-15' },
        { id: 4, flightNo: 'HU7890', airline: '海航', price: 520, departure: '北京', arrival: '上海', date: date || '2024-01-15' },
        { id: 5, flightNo: 'HO1234', airline: '吉祥航空', price: 580, departure: '北京', arrival: '上海', date: date || '2024-01-15' }
    ];

    // 排序处理
    let sortedFlights = [...flights];
    switch (sort) {
        case 'price':
            sortedFlights.sort((a, b) => a.price - b.price);
            break;
        case 'time':
            // 模拟按时间排序
            sortedFlights.sort((a, b) => a.flightNo.localeCompare(b.flightNo));
            break;
        case 'recommend':
        default:
            // 模拟推荐排序（价格低的优先）
            sortedFlights.sort((a, b) => a.price - b.price);
            break;
    }

    // 分页处理
    const total = sortedFlights.length;
    const start = (page - 1) * pageSize;
    const end = start + parseInt(pageSize);
    const paginatedFlights = sortedFlights.slice(start, end);

    // 返回响应
    res.json({
        code: 0,
        message: 'success',
        data: {
            flights: paginatedFlights,
            total,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        }
    });
});

// 3.2 GET请求 - 获取单个航班（动态路由）
app.get('/api/flights/:id', (req, res) => {
    // 获取路由参数
    const { id } = req.params;
    
    console.log('航班ID:', id);

    // Mock数据
    const flight = {
        id: parseInt(id),
        flightNo: 'CA1234',
        airline: '国航',
        price: 500,
        departure: '北京',
        arrival: '上海',
        departureTime: '08:00',
        arrivalTime: '10:00',
        duration: '2小时',
        aircraft: '空客320',
        discount: '8折'
    };

    if (flight) {
        res.json({
            code: 0,
            message: 'success',
            data: flight
        });
    } else {
        res.status(404).json({
            code: 404,
            message: '航班不存在'
        });
    }
});

// 3.3 POST请求 - 创建订单
app.post('/api/orders', (req, res) => {
    // 获取请求体
    const { flightId, passengerName, passengerId, count } = req.body;
    
    console.log('创建订单:', { flightId, passengerName, passengerId, count });

    // 验证请求体
    if (!flightId || !passengerName || !passengerId) {
        return res.status(400).json({
            code: 400,
            message: '缺少必填参数'
        });
    }

    // Mock创建订单
    const order = {
        id: 'ORD' + Date.now(),
        flightId,
        passengerName,
        passengerId,
        count: count || 1,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    res.status(201).json({
        code: 0,
        message: '订单创建成功',
        data: order
    });
});

// 3.4 GET请求 - 获取日期列表
app.get('/api/dates', (req, res) => {
    const dates = [];
    const today = new Date();

    // 生成未来7天日期
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const week = weekDays[date.getDay()];
        
        // 随机价格（300-600元）
        const price = Math.floor(Math.random() * 300) + 300;

        dates.push({
            date: dateStr,
            week,
            price,
            isToday: i === 0
        });
    }

    res.json({
        code: 0,
        message: 'success',
        data: dates
    });
});

// ============================================
// 4. 静态文件服务
// ============================================
app.use(express.static(path.join(__dirname, 'public')));
console.log('✓ 静态文件服务已配置');

// ============================================
// 5. 404处理
// ============================================
app.use((req, res) => {
    res.status(404).json({
        code: 404,
        message: 'Not Found'
    });
});

// ============================================
// 6. 错误处理中间件
// ============================================
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        code: 500,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================
// 7. 启动服务器
// ============================================
app.listen(PORT, () => {
    console.log(`\n=== Express服务器启动成功 ===`);
    console.log(`地址: http://localhost:${PORT}`);
    console.log(`\n可用API接口:`);
    console.log(`  GET  /api/flights - 获取航班列表`);
    console.log(`  GET  /api/flights/:id - 获取单个航班`);
    console.log(`  POST /api/orders - 创建订单`);
    console.log(`  GET  /api/dates - 获取日期列表`);
});
