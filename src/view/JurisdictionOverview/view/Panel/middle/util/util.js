
export default {
    // /**
    //      * getXAxis（）方法作用：获取开始日期和结束日期之间（包含开始日期和结束日期）的日期数组，可作为时间轴坐标等
    //      * @param  filters: {startTime:开始日期}
    //      */
    // getXAxis: function (filters) {
    //     var startTime = new Date(filters.startTime);
    //     var endTime = new Date();
    //     var length = (endTime.getTime() - startTime.getTime()) / (1000 * 24 * 60 * 60) + 1;
    //     var xAxis = new Array(length);
    //     xAxis[0] = filters.startTime;
    //     for (var i = 1; i < length; i++) {
    //         startTime.setDate(startTime.getDate() + 1);
    //         xAxis[i] = startTime.Format("MM-dd");
    //     }
    //     return xAxis;
    // },
    splitNum : function(data = 0){
        return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    getDay: function (day) {
        var today = new Date();
        var targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetdayMilliseconds); //注意，这行是关键代码  
        // var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        // return tYear + "-" + tMonth + "-" + tDate;
        return tMonth + "-" + tDate;
    },
    getDayYMD: function (day) {
        var today = new Date();
        var targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetdayMilliseconds); //注意，这行是关键代码  
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        return tYear + "-" + tMonth + "-" + tDate;
    },
    get24H: function (hours) {
        var today = new Date();
        var targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * hours;
        today.setTime(targetdayMilliseconds); //注意，这行是关键代码  
        // var tYear = today.getFullYear();
        // var tMonth = today.getMonth();
        // var tDate = today.getDate();
        var tHours = today.getHours();
        tHours = this.doHandleMonth(tHours);
        // tMonth = this.doHandleMonth(tMonth + 1);
        // tDate = this.doHandleMonth(tDate);
        // return tYear + "-" + tMonth + "-" + tDate;
        return tHours+':00';
    },

    doHandleMonth: function (month) {
        var m = month;
        if (month.toString().length === 1) {
            m = "0" + month;
        }
        return m;
    }
}