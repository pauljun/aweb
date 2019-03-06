import React from 'react';
import { Modal,Button } from 'antd';
import './index.scss'
export default class TagModal extends React.Component {
  /**更新标签与关注状态 */
/*    UpdateAttentionAndTag = () => {
    let { activeKey } = this.state;
    let { LongLivedStore } = this.props;
    if (activeKey == 1) {
      LongLivedStore.getListPersonalInformation(
        LongLivedStore.searchOption
      ).then(res => {
        this.setState({
          LongLiveList: res.list
        });
      });
    } else {
      LongLivedStore.getListPersonalInformation(
        LongLivedStore.searchOptionUnappear
      ).then(res => {
        this.setState({
          RegisUnappList: res.list
        });
      });
    }
  }; */
  render() {
    let {
      visible,
      onOk,
      onCancel,
      title,
      width = 348,
      iconType = 'icon-Delete_Main',
      height = 100,
      arrTag = []
    } = this.props;
    return (
      <Modal title="标签详情" className="tag-modal-handle" width={width} centered visible={visible} onCancel={onCancel} footer={[<Button onClick={onOk} >编辑标签</Button>]}>
       <div>
         {
           arrTag.map((v,i) => <div className="half-circle" key={i}>{v}</div>)
         }
       </div>
      </Modal>
    );
  }
}
