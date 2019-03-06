import React, { Component } from 'react';
import IconFont from 'src/components/IconFont';
import { Button, Select, Input } from 'antd';
import './index.scss';
const Option = Select.Option;
/**
 * 组件： 分页组件
 * 参数： 
 * className (非必传)
 * pageSizeOptions 默认为['10', '20', '30'],
 * infoDIY 默认为 共${maxPage}页 / 共${total}条记录, 可自定义修改
 * current (必传，当前page)
 * total, (必传,总数)
 * pageSize, （必传,每页多少条）
 * onChange (必传) 回调函数，接收page 和pageSize, type('pre'--上一页点击， 'next'--点击下一页， undefined为其他改变时)
 */
export default class PaginationComp extends Component {
  /**
   * infoDIY = "共<%maxPage%> / 共<%total%>条记录"
   */
  state = {
    value: ''
  }
  onPressEnter = (e, maxPage) => {
    
    let { onChange, pageSize } = this.props;
    let value = +e.target.value
    if(value && value > 0){
      if(value <= maxPage){
        onChange && onChange(value, pageSize)
      }else{
        onChange && onChange(maxPage, pageSize)
      }
    }
    this.setState({
      value: ''
    })
  }
  inputChange = (e) => {
    this.setState({
      value: e.target.value
    })
  }
  getListInfo = (total, maxPage) => {
    const { infoDIY } = this.props;
    let info = `共${maxPage}页 / 共${total}条记录`;
    if(infoDIY){
      info = infoDIY.replace('<%maxPage%>', maxPage).replace('<%total%>', total);
    }
    return info
  }
  handlePageChange = (type) => {
    let { current, onChange, pageSize } = this.props;
    current = type === 'prev' ? current-1 : current+1;
    onChange &&　onChange(current, pageSize, type)
  }
  /**
   * 下拉框修改
   */
  pageSizeOptionsHandel = (pageSizeOptions) => {
    let optionsArray = []
    pageSizeOptions.forEach(item => {
      optionsArray.push({
        key: item,
        label: item + '条每/页'
      })
    })
    return optionsArray;
  }
  /**
   * 下拉框选中
   */
  pageSizeChange = (pageSize) => {
    let { current, onChange, total } = this.props;
    // 判断current的数值 --- 如果当前current和pageSize的数据存在,current 保留
    if(total - pageSize * (current - 1) < 0){
      current = Math.ceil(total / pageSize)
    }
    onChange && onChange(current, pageSize)
  }
  render(){
    let { 
      current=1, 
      total=0, 
      pageSize, 
      pageSizeOptions=['10', '20', '30'],
      className=''
     } = this.props;
    const maxPage = Math.ceil(total / pageSize) || 1;
    const disabledPrev = current <= 1;
    const disabledNext = current >= maxPage;
    current = disabledNext ? maxPage : current;
    let selectOptionsArray = this.pageSizeOptionsHandel(pageSizeOptions);
    return <div className={`pagination-box-tlzj ${className}`}>
      <span className="list-info">{this.getListInfo(total, maxPage)}</span>
      <span className='pagination-btn'>
        <Button 
          type='normal'
          className='page-btn'
          disabled={disabledPrev} 
          onClick={() => this.handlePageChange('prev')}
        >
          <IconFont type={'icon-Arrow_Big_Left_Main'}/>
        </Button>
        <span>第{current}页</span>
        <Button 
          type='normal'
          className='page-btn'
          disabled={disabledNext} 
          onClick={() => this.handlePageChange('next')}
        >
          <IconFont type={'icon-Arrow_Big_Right_Main'}/>
        </Button>
      </span>
      <span className='pagination-select'>
        <Select value={pageSize + '' || pageSizeOptions[0].key} onChange={this.pageSizeChange}>
          {
            selectOptionsArray.map(item => {
              return <Option key={item.key} title={item.label}>{item.label}</Option>
            })
          }
        </Select>
      </span>
      <span className='pagination-go'>跳转
        <Input 
          className='input-box' 
          value={this.state.value} 
          onPressEnter={(value) => this.onPressEnter(value, maxPage)}
          onChange={this.inputChange}
        />
      页</span>
    </div>
  }
}