import React from 'react';
import './index.scss';

export default ({LongLiveTotal,ReUnAppearTotal,type}) => {
    return (
      <div className="community-click">
        <div className="community-handle">
          <div />
          <div />
        </div>
        <div className="community-masword">
          <div className="community-one">
            <span>{type == 1 ? '疑似新居民' : '常住居民'}</span>
            <span>{LongLiveTotal}</span>
          </div>
          <div className="community-two">
            <span>{type == 1 ? '新面孔' : '疑似已迁出'}</span>
            <span>{ReUnAppearTotal}</span>
          </div>
        </div>
      </div>
    );
}
