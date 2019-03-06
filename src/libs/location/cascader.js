import { locationList } from './location.js';
/**
 * 封装地质组件 _Cascader
 * 提供方法：
 *   init()
 *   getLevel(value)
 *   getLabel(value,hideParent)
 *   getJson(value,hideParent)
 */
export const _Cascader = ((function(){
  var _cascader = {
    data:[],
    levelData: [],
    originData:[],
    config:{
      data:locationList,
      showParent:true, // showParent: 
      join:"",
    },
    // 初始化
    init:function(config){
      this.dataFormat(this.config.data, true, 3);
      this.dataFormat(this.config.data, true, 2);
      this.dataFormat(this.config.data,false, 3);
    },
    // 根据地址code获取地址文本,返回string
    getLabel:function(value,hideParent){
      let label = "";
      if(!value){
        console.log("地址码不能为空");
        return label=""
      }
      let data = hideParent?this.originData:this.data
      let level= this.getLevel(value)
      let code=value.substring(0,2)+"0000";
      return this.getTxt("label",label,data,value,level,code);
    },
    // 根据value获取地址级别,返回number
    getLevel:function(value){
      let level=0;
      if(value.substring(2,6)==="0000"){
        level=1;
      }else if(value.substring(4,6)!=="00"){
        level=3;
      }else{
        level=2;
      }
      return level
    },
    // 根据key获取所有父元素的value，返回[]
    getParentsValue:function(value){
      let parents = [];
      if(!value){
        console.log("地址码不能为空")
        return parents = ""
      }
      let level = this.getLevel(value);
      let code=value.substring(0,2)+"0000";
      return this.getTxt("parents",parents,this.data,value,level,code);
    },
    // 递归服务于this.getLabel方法
    getTxt:function(type,label,data,value,i,code){
      const temp = data.filter(item => item.value===code)
      if(!temp.length){ 
        console.log("地址码"+code+"不存在")
        return label=""
      }
      switch(type){
        case "label":label = temp[0].label;
        break;
        case "parents":label.push(temp[0].value);
        break;
        default:break;
      }
      i--;
      if(i===0){
        return label
      }else{
        switch(i){
          case 2: code = value.substring(0,4)+"00"
          break;
          case 1: code = value
          break;
          default:break;
        }
        return this.getTxt(type,label,temp[0].children,value,i,code)
      }
    },
    // 根据地址code返回地址的json数据,返回[]
    getJson:function(value,hideParent){
      let data = hideParent?this.originData:this.data
      if(Object.prototype.toString.apply(value) !== '[object Array]'){
        return console.log('getJson方法的第一个参数必须为数组')
      }
      if(!value.length){
        return data
      }
      let result = [];
      value.map(item => {
        let errJson = {
          chilren:[],
          key:item,
          label:"",
          value:item,
        }
        let level = this.getLevel(item)
        // 判断省
        let provinceCode = item.substring(0,2)+"0000";
        let province = data.filter(v => v.value===provinceCode)
        if(!province.length){
          console.log("地址码"+item+"不存在")
          return result.push(errJson)
        }
        if(level===1) {return result.push(province[0])}
        // 判断市
        let cityCode = item.substring(0,4)+"00";
        let city = province[0].children.filter(v => v.value===cityCode)
        if(!city.length){
          console.log("地址码"+item+"不存在")
          return result.push(errJson)
        }
        if(level===2) {return result.push(city[0])}
        // 判断区
        let dist = city[0].chilren.filter(v => v.value===item)
        if(!dist.length){
          console.log("地址码"+item+"不存在")
          return result.push(errJson)
        }
        if(level===3) {return result.push(dist[0])}
      })
      return result
    },
    // 格式化级联数据结构,flag:showParent
    dataFormat:function(data,flag,level){
      let join = this.config.join;
      let dataTemp = [];
      for(var i = 0; i < data.length; i++) {
        if(data[i].level===1){  
          let province = {   
            label:data[i].name,
            value:data[i].code,
            key:data[i].code,
            children:[]
          }
          if(i===data.length-1){     
            dataTemp.push(province); 
          }
          for(var j=i+1; j<data.length; j++) {
            if(data[j].level===2){
              // console.log(flag,province.label,join,99999)
              // let city = {          
              //   label:flag?(province.label+join+data[j].name):data[j].name,
              //   value:data[j].code,
              //   key:data[j].code,
              //   children:[]
              // }
              let city = {          
                label:data[j].name,
                value:data[j].code,
                key:data[j].code,
                children:[]
              }
              for(var k=j+1; k<data.length; k++) {
                if(data[k].level===3){  
                  // let dist = {
                  //   label:flag?(city.label+join+data[k].name):data[k].name,
                  //   value:data[k].code,
                  //   key:data[k].code,
                  // }
                  let dist = {
                    label:data[k].name,
                    value:data[k].code,
                    key:data[k].code,
                  }
                  if(level>2){
                    city.children.push(dist); 
                  }
                }else{
                  if (level > 1) {
                    province.children.push(city);  
                  }
                  j = k-1;
                  k = data.length
                }
              }
            }else{
              dataTemp.push(province); 
              i = j-1;
              j = data.length;
            }
          }
        }
      }
      if(flag){
        this.data = dataTemp
      }else{
        this.originData = dataTemp
      }
      if(level<3){
        this.levelData = dataTemp
      }
    }
  };
  _cascader.init();
  return _cascader;
})())