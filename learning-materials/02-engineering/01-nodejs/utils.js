// ============================================
// 自定义工具模块
// 展示Node.js模块化机制
// ============================================

/**
 * 加法函数
 * @param {number} a - 第一个数
 * @param {number} b - 第二个数
 * @returns {number} 两数之和
 */
function add(a, b) {
    return a + b;
}

/**
 * 格式化日期
 * @returns {string} 格式化的日期字符串
 */
function formatDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 生成随机ID
 * @param {number} length - ID长度
 * @returns {string} 随机ID
 */
function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

/**
 * 计算航班折扣价格
 * @param {number} price - 原价
 * @param {number} discount - 折扣率（如0.8表示8折）
 * @returns {number} 折扣后价格
 */
function calculateDiscountedPrice(price, discount) {
    return Math.floor(price * discount);
}

// 导出模块
module.exports = {
    add,
    formatDate,
    generateId,
    calculateDiscountedPrice
};
