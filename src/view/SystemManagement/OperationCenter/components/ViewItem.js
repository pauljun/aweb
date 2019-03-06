import React from 'react'
export default function(props) {
  return (
    <div className="view-info-part">
      <span className="label">{props.label}：</span>
      <span className="item-value">{props.children}</span>
    </div>
  );
}
