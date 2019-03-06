import React from 'react';
import IconFont from 'src/components/IconFont';

export default ({ submit, cancel }) => {
  return (
    <div className="submit-container">
      <div className="ic" onClick={() => cancel()}>
        <IconFont type="icon-YesorNo_No_Dark" />
        <div>取消</div>
      </div>
      <div className="io" onClick={() => submit()}>
        <IconFont type="icon-YesorNo_Yes_Light" />
        <div>确定</div>
      </div>
    </div>
  );
};
