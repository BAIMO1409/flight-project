const express = require('express');
const router = express.Router();
const { generateDateList, generateFlights } = require('../mock/data');

function calculateRecommendScore(flight) {
  let score = 0;
  
  const priceWeight = 0.4;
  const durationWeight = 0.3;
  const timeWeight = 0.3;
  
  const avgPrice = 450;
  score += (flight.price / avgPrice) * priceWeight * 100;
  
  const avgDuration = 120;
  const durationMinutes = parseInt(flight.duration) * 60 + parseInt(flight.duration.match(/(\d+)分/)?.[1] || '0');
  score += (durationMinutes / avgDuration) * durationWeight * 100;
  
  const hour = parseInt(flight.departureTime.split(':')[0]);
  if (hour >= 7 && hour <= 9) {
    score += 20 * timeWeight;
  } else if (hour >= 14 && hour <= 16) {
    score += 30 * timeWeight;
  } else if (hour >= 19 && hour <= 21) {
    score += 25 * timeWeight;
  } else {
    score += 50 * timeWeight;
  }
  
  return score;
}

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
      flights = flights.sort((a, b) => {
        const scoreA = calculateRecommendScore(a);
        const scoreB = calculateRecommendScore(b);
        return scoreA - scoreB;
      });
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
