/*查询时间转换*/
import moment from 'moment';

const timerHandle = options => {
  if(options.timeType === 3){
    options.endTime = new Date().valueOf();
    new Date(moment().subtract(2,'d')).setHours(0, 0, 0, 0)
    options.startTime = new Date(moment().subtract(2,'d')).setHours(0, 0, 0, 0);
  } else if(options.timeType !== 2){
    options.endTime = new Date().valueOf();
    options.startTime = new Date().getTime() - options.timeType * 24 * 60 * 1000 * 60;
  }
  if(!options.timeType){
  	options.endTime = options.startTime = ''
  }
  options.timeType = null
  return options
}


export {
  timerHandle
}
