import React from 'react'
import { Spin } from 'antd'
import './index.scss'

export default ({ length = 20, size = 'large' }) => {
  let a = Array.from({length})
  return <div style={{position:'absolute',top:'8%',left:'50%',transform:'translateX(-50%)'}}><Spin size={size}>{a.map((v, k) => <br key={k} />)}</Spin></div>
}
// export default ({ length = 20, size = 'large' }) => {
//   let a = Array.from({length})
//   return <div style={{position:'absolute',top:'8%',left:'50%',transform:'translateX(-50%)'}}><Spinner size={size}>{a.map((v, k) => <br key={k} />)}</Spinner></div>
// }

// function Spinner () {
//   return (
//     <div className="spinner">
//       <div className="box"></div>
//       <div className="box"></div>
//       <div className="box"></div>
//       <div className="box"></div>
//     </div>
//   )
// }