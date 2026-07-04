// 基于种子的伪随机数生成器（线性同余生成器 LCG）
// 相同种子会产生相同的随机序列，确保同一日期生成相同的航班数据
function createSeededRandom(seed) {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

// 将日期字符串转换为数字种子
function dateToSeed(dateStr) {
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = seed * 31 + dateStr.charCodeAt(i);
  }
  return seed;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDateLabel(date) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (formatDate(date) === formatDate(today)) {
    return '今天';
  } else if (formatDate(date) === formatDate(tomorrow)) {
    return '明天';
  }
  
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekDays[date.getDay()];
}

// 日期列表缓存，避免每次请求都重新生成
let dateListCache = null;

function generateDateList(days = 14) {
  if (dateListCache) {
    return dateListCache;
  }
  
  const result = [];
  const today = new Date();
  // 使用固定种子生成日期价格，确保每次启动服务后日期价格一致
  const random = createSeededRandom(dateToSeed(formatDate(today)));
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const basePrice = Math.floor(random() * 200) + 350;
    
    result.push({
      date: formatDate(date),
      week: getDateLabel(date),
      price: basePrice,
      isToday: i === 0,
    });
  }
  
  dateListCache = result;
  return result;
}

// 航班数据缓存，按日期缓存生成的航班数据
const flightsCache = new Map();

function generateFlights(date, basePrice = 400) {
  // 如果该日期已经生成过航班数据，直接返回缓存
  if (flightsCache.has(date)) {
    return flightsCache.get(date);
  }
  
  // 使用日期作为种子，确保同一日期生成相同的航班数据
  const seed = dateToSeed(date);
  const random = createSeededRandom(seed);
  
  const airlines = ['国航', '东航', '南航', '海航', '吉祥航空', '厦航', '川航', '华夏航空'];
  const departureAirports = ['北京大兴', '首都T1', '首都T2', '首都T3'];
  const arrivalAirports = ['浦东T1', '浦东T2', '虹桥T1', '虹桥T2'];
  const aircrafts = ['波音737(中)', '空客320(中)', '空客330(宽)', '波音777(大)', '空客321(中)'];
  const flightPrefixes = ['CA', 'MU', 'CZ', 'HU', 'HO', 'MF', '3U', 'G5'];
  
  const flights = [];
  
  for (let i = 0; i < 10; i++) {
    const departureHour = Math.floor(random() * 12) + 6;
    const duration = Math.floor(random() * 60) + 100;
    const arrivalHour = Math.floor((departureHour * 60 + duration) / 60) % 24;
    const arrivalMinute = (departureHour * 60 + duration) % 60;
    
    const flightPrice = Math.floor(random() * 100) + basePrice - 50;
    const prefixIndex = Math.floor(random() * flightPrefixes.length);
    
    flights.push({
      id: `flight-${date}-${i + 1}`,
      flightNo: `${flightPrefixes[prefixIndex]}${Math.floor(random() * 9000) + 1000}`,
      airline: airlines[Math.floor(random() * airlines.length)],
      departureTime: `${String(departureHour).padStart(2, '0')}:${String(Math.floor(random() * 6) * 10).padStart(2, '0')}`,
      arrivalTime: `${String(arrivalHour).padStart(2, '0')}:${String(arrivalMinute).padStart(2, '0')}`,
      departureAirport: departureAirports[Math.floor(random() * departureAirports.length)],
      arrivalAirport: arrivalAirports[Math.floor(random() * arrivalAirports.length)],
      price: flightPrice,
      discount: `${(random() * 4 + 3).toFixed(1)}折`,
      duration: `${Math.floor(duration / 60)}时${duration % 60}分`,
      aircraft: aircrafts[Math.floor(random() * aircrafts.length)],
      seats: random() > 0.7 ? '票少' : undefined,
    });
  }
  
  // 缓存该日期的航班数据
  flightsCache.set(date, flights);
  return flights;
}

module.exports = {
  generateDateList,
  generateFlights,
};
