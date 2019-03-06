import moment from 'moment';

export default function (value) {
  let endTime = new Date()*1;
  let startTime = endTime;
  if(value === 2){ // 自定义时间
    startTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
  }else if(value === 3){ // 3天
    startTime = new Date(moment().subtract(3,'d')).getTime()
  }else {
    // startTime = endTime - value * 24 * 60 * 1000 * 60
    //startTime = new Date(moment().subtract(value - 1,'d')).setHours(0, 0, 0, 0);
    startTime = endTime - value * 24 * 60 * 1000 * 60
  }
  return { startTime, endTime }
}