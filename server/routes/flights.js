const express = require('express');
const router = express.Router();
const { generateDateList, generateFlights } = require('../mock/data');

router.get('/api/flights', (req, res) => {
  const { date, sort = 'recommend', page = 1 } = req.query;
  
  const dateList = generateDateList(14);
  
  // 如果未传日期，默认使用日期列表中的明天
  const selectedDate = date || dateList[1]?.date || dateList[0]?.date;
  const selectedDateItem = dateList.find(item => item.date === selectedDate);
  const basePrice = selectedDateItem?.price || dateList[0]?.price || 400;
  
  // 基于日期生成确定性航班数据（同一日期返回相同数据）
  let flights = generateFlights(selectedDate, basePrice);
  
  switch (sort) {
    case 'price':
      flights = flights.sort((a, b) => a.price - b.price);
      break;
    case 'time':
      flights = flights.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
      break;
    case 'recommend':
    default:
      flights = flights.sort((a, b) => a.price - b.price);
      break;
  }
  
  const pageSize = 10;
  const total = flights.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  res.json({
    code: 0,
    message: 'success',
    data: {
      flights: flights.slice(start, end),
      total,
      dateList,
    },
  });
});

router.get('/api/dates', (req, res) => {
  const dateList = generateDateList(14);
  
  res.json({
    code: 0,
    message: 'success',
    data: dateList,
  });
});

module.exports = router;
