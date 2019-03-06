import React from 'react';
import WaterMark from 'src/components/WaterMarkView';
import './index.scss';

const PeopleCard = ({className='', item, showStatus=false, children=null}) => {
  const selfAttr = item.selfAttr || {}
  const infoList = item.infoList.slice()[0] || {}
  let imageUrl = infoList.imageUrl || infoList.image || infoList.url;
  if(showStatus && item.errPicCount === item.infoList.length){
    imageUrl = ''
  }
  const imgCount = item.infoList.length;
  return (
    <div className={`monitee-people-list-item ${className}`}>
      <div className='item-img'>
        <WaterMark top={'50%'} src={imageUrl} type='body'/>
        {imgCount > 1 && <span className='item-img-count'>{`+${imgCount}`}</span>}
        {showStatus && item.saveStatus !== 1 && item.errPicCount && <span className='item-img-count item-img-err'>失败 {item.errPicCount} 张</span>}
      </div>
      <div className="item-info-container">
        <div className="item-info-header">
          <span className='item-name' title={selfAttr.name}>
            {selfAttr.name}
          </span>
          <span className='item-children'>{ children }</span>
        </div>
        <ul className="item-info-content">
          <li>
            <div>
              <div><span>性别 </span> : {selfAttr.gender}</div>
              <div><span>民族 </span> : {selfAttr.nationality}</div>
            </div>
          </li>
          <li><span>手机号 </span> : {selfAttr.mobile}</li>
          <li><span>身份证 </span> : {selfAttr.identityNumber}</li>
          <li title={selfAttr.description}><span>描述 </span> : {selfAttr.description}</li>
        </ul>
      </div>
    </div>
  )
}

export default PeopleCard