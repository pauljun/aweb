import React from 'react';
import IconFont from 'src/components/IconFont';
import { Button } from 'antd';


export default class CustomPagination extends React.Component {
  
  handlePageChange = (type) => {
    let { current, onPageChange, pageSize } = this.props;
    console.log(current,7451)
    current = type === 'prev' ? current-1 : current+1;
    onPageChange &&　onPageChange(current, pageSize, type)
  }

  render() {
    let { current=1, total, pageSize } = this.props;
    const maxPage = Math.ceil(total / pageSize) || 1;
    const disabledPrev = current <= 1;
    const disabledNext = current >= maxPage;
    current = disabledNext ? maxPage : current;
    return [
      <span className='pagination-btn-container' key='prev'>
        {/* <Button block={true} type="primary" onClick={search}>
          <IconFont type={'icon-Left_Main'} theme="outlined" />刷新
        </Button> */}
        <Button 
          className='page-btn' 
          disabled={disabledPrev} 
          onClick={() => this.handlePageChange('prev')}
        >
          <IconFont type={'icon-Arrow_Big_Left_Main'}/>
        </Button>
      </span>,
      <span style={{fontSize: '14px'}} key='current'>
        第{current}页
      </span>,
      <span className='pagination-btn-container' key='next'>
        <Button 
          className='page-btn' 
          disabled={disabledNext} 
          onClick={() => this.handlePageChange('next')}
        >
          <IconFont type={'icon-Arrow_Big_Right_Main'} theme="outlined" />
        </Button>
      </span>
    ]
  }
}
