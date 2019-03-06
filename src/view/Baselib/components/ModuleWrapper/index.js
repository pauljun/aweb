import React from 'react';
import { Select, Input, Button, Icon } from 'antd';
import CustomPagination from './CustomPagination';
import CustomUpload from 'src/components/Upload/upload.sw'
import './index.scss';
import IconFont from 'src/components/IconFont';
import AuthComponent from '../../../BusinessComponent/AuthComponent';
import ImgStyleSelect from './ImgStyleSelect';

const Option = Select.Option;
const Search = Input.Search;

const defaultPageSizeOptions = [ 24, 36, 48, 72, 96 ]
export const imgSearchPageSizeOptions = [ '24', '36', '48', '72', '96' ]

class ModuleWrapper extends React.Component {

  handlePageSizeChange = (pageSize) => {
    const { current, onPageChange } = this.props;
    onPageChange &&　onPageChange(current, pageSize)
  }

  handleReload = () => {
    const { onReload } = this.props;
    onReload &&　onReload()
  }

  handleSearchChange = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  }

  // 设置图片大中小模式
  handleImgStyleChange = (value) => {
    const { onImgStyleChange } = this.props;
    onImgStyleChange && onImgStyleChange(value)
  }

  render() {
    const { 
      className='', title, total=0, current, onPageChange, 
      pageSizeOptions=defaultPageSizeOptions, 
      onSearch, placeholder, searchValue, onSearchChange,
      onUpload, onImgStyleChange, imgStyle,
      children=null 
    } = this.props;

    const { pageSize=pageSizeOptions[0] } = this.props;
    const BTN = <Button className='search-btn-data-repository'>
      <IconFont type='icon-ImageSearch_Light'/>
      <span>以图搜图</span>
    </Button>
    return (
      <div className={`c-module-wrapper ${className}`}>
        <div className='module-header-warpper'>
          <div className='module-title'>
            { title }
          </div>
          <div className='module-header'>
            <div className='search-input-wrapper'>
              {/* {onSearch && (
                <Search 
                  value={searchValue}
                  enterButton 
                  addonBefore={onUpload ? <Icon type='camera' /> : ''}
                  placeholder={placeholder}
                  onChange={onSearchChange}
                  onSearch={onSearch} 
                />
              )}
              {onUpload && (
                <AuthComponent actionName={'BaselibImgSearch'}>
                  <CustomUpload
                    className='img-upload'
                    expiretype={2}
                    uploadBtn={BTN}
                    uploadTip={false}
                    uploadDone={onUpload}
                  />
                </AuthComponent>
              )} */}
            </div>
            <div className='pagination-wrapper'>
              <span>
                共显示 
                <span className='highlight'>{ total }</span> 
                条资源    
              </span> 
              <span className='page-size-select'>
                <Select value={pageSize} onChange={this.handlePageSizeChange}>
                  {pageSizeOptions.map(v => (
                    <Option key={v} value={v}>{`${v}条/页`}</Option>
                  ))}
                </Select>
              </span>
              <CustomPagination 
                current={current}
                pageSize={pageSize}
                total={total}
                onPageChange={onPageChange}
              />
              {/* {onImgStyleChange && (
                <ImgStyleSelect 
                  className='page-size-select'
                  onChange={this.handleImgStyleChange}
                  value={imgStyle}
                />
              )} */}
              <span className='pagination-btn-container'>
                <Button onClick={this.handleReload}>
                  <IconFont type={'icon-Left_Main'} theme="outlined" />刷新
                </Button>
              </span>
            </div> 
          </div>
        </div>
        <div className='module-content-wrapper'>
          { children }
        </div>
      </div>
    )
  }
}

export default ModuleWrapper;