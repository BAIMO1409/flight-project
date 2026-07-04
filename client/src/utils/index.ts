import { DateItem, Flight } from '../types';

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getWeekDay = (date: Date): string => {
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weeks[date.getDay()];
};

export const getDateLabel = (date: Date): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '明天';
  if (diffDays === 2) return '后天';
  return getWeekDay(date);
};

export const generateDateList = (days: number = 14): DateItem[] => {
  const result: DateItem[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const basePrice = Math.floor(Math.random() * 200) + 350;
    
    result.push({
      date: formatDate(date),
      week: getDateLabel(date),
      price: basePrice,
      isToday: i === 0,
    });
  }
  
  return result;
};

export const generateMockFlights = (basePrice: number = 400): Flight[] => {
  const airlines = ['国航', '东航', '南航', '海航', '吉祥航空', '厦航', '川航', '华夏航空'];
  const departureAirports = ['北京大兴', '首都T1', '首都T2', '首都T3'];
  const arrivalAirports = ['浦东T1', '浦东T2', '虹桥T1', '虹桥T2'];
  const aircrafts = ['波音737(中)', '空客320(中)', '空客330(宽)', '波音777(大)', '空客321(中)'];
  
  const flights: Flight[] = [];
  
  for (let i = 0; i < 10; i++) {
    const departureHour = Math.floor(Math.random() * 12) + 6;
    const duration = Math.floor(Math.random() * 60) + 100;
    const arrivalHour = Math.floor((departureHour * 60 + duration) / 60) % 24;
    const arrivalMinute = (departureHour * 60 + duration) % 60;
    
    const flightPrice = Math.floor(Math.random() * 100) + basePrice - 50;
    
    flights.push({
      id: `flight-${i + 1}`,
      flightNo: `${['CA', 'MU', 'CZ', 'HU', 'HO', 'MF', '3U', 'G5'][Math.floor(Math.random() * 8)]}${Math.floor(Math.random() * 9000) + 1000}`,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      departureTime: `${String(departureHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 6) * 10).padStart(2, '0')}`,
      arrivalTime: `${String(arrivalHour).padStart(2, '0')}:${String(arrivalMinute).padStart(2, '0')}`,
      departureAirport: departureAirports[Math.floor(Math.random() * departureAirports.length)],
      arrivalAirport: arrivalAirports[Math.floor(Math.random() * arrivalAirports.length)],
      price: flightPrice,
      discount: `${(Math.random() * 4 + 3).toFixed(1)}折`,
      duration: `${Math.floor(duration / 60)}时${duration % 60}分`,
      aircraft: aircrafts[Math.floor(Math.random() * aircrafts.length)],
      seats: Math.random() > 0.7 ? '票少' : undefined,
    });
  }
  
  flights.sort((a, b) => a.price - b.price);
  
  return flights;
};
