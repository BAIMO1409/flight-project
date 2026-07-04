const express = require('express');
const router = express.Router();
const { generateDateList, generateFlights } = require('../mock/data');

router.get('/api/flights', (req, res) => {
  const { date, sort = 'recommend', page = 1 } = req.query;
  
  const dateList = generateDateList(14);
  
  const selectedDateItem = dateList.find(item => item.date === date);
  const basePrice = selectedDateItem?.price || dateList[0]?.price || 400;
  
  let flights = generateFlights(basePrice);
  
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
