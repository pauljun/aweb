import React from 'react'
import moment from 'moment'

const TrajectoryList = ({list = [], idx, changeIdx, type}) => {
  return(
    <div className='list'>
      <div className='title'>人员轨迹列表</div>
      <ul className={list.length === 1 ? 'just-one-item' : ''}>
        {list.map((v,k) => {
          let className = 'trajectory-list-li'
          if(idx === k){
            className = 'trajectory-list-li active'
          }
          return (
            <li key={k} className={className} onClick={() => changeIdx(k)}>
              <span>{k + 1}</span>
              <div style={{ backgroundImage: `url(${v[type + 'Path']})`}} className='img-content'></div>
              <div>{v.cameraName}</div>
              <div className="time">{moment(parseFloat(v.captureTime)).format('YYYY.MM.DD HH:mm:ss')}</div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TrajectoryList