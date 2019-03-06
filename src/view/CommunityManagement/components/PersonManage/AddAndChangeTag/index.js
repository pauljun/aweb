import React from 'react';
import { Modal, Checkbox, Row, Col, Input } from 'antd';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';

const CheckboxGroup = Checkbox.Group;

@BusinessProvider('TabStore', 'CommunityDetailStore', 'UserStore')
export default class AddAndchangeTagMadal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personnelList: [],
      behaviorList: [],
      personvalue: '',
      actionvalue: ''
    };
  }
  onPersonnelChange = checkvalues => {
    this.setState({
      personnelList: checkvalues
    });
  };
  componentWillReceiveProps(nextProps) {
    this.setState({
      personnelList: nextProps.personnelList,
      behaviorList: nextProps.behaviorList,
      personvalue: nextProps.personvalue,
      actionvalue: nextProps.actionvalue
    });
  }
  onBehaviorChange = checkvalues => {
    this.setState({
      behaviorList: checkvalues
    });
  };
  // 修改人员标签
  tipHandleOk = () => {
    let { CommunityDetailStore, peopleId, details,personType } = this.props;
    let { personnelList, behaviorList, personvalue, actionvalue } = this.state;
    let options = {
      details,
      peopleTags: [
        { tagType: 118600, tagCode: 118601, tagName: '外卖', isDeleted: true },
        {
          tagType: 118600,
          tagCode: 118602,
          tagName: '空巢老人',
          isDeleted: true
        },
        {
          tagType: 118600,
          tagCode: 118603,
          tagName: '工作人员',
          isDeleted: true
        },
        { tagType: 118600, tagCode: 118604, tagName: '快递', isDeleted: true },
        { tagType: 118600, tagCode: 0, tagName: '', isDeleted: true },
        {
          tagType: 118700,
          tagCode: 118701,
          tagName: '昼伏夜出',
          isDeleted: true
        },
        {
          tagType: 118700,
          tagCode: 118702,
          tagName: '早出晚归',
          isDeleted: true
        },
        {
          tagType: 118700,
          tagCode: 118703,
          tagName: '足不出户',
          isDeleted: true
        },
        { tagType: 118700, tagCode: 0, tagName: '', isDeleted: true }
      ]
    };
    options.peopleTags.map(v => {
      if (v.tagType == 118600) {
        for (let i = 0; i < personnelList.length; i++) {
          if (v.tagCode == personnelList[i]) {
            v.isDeleted = false;
            if (!v.isDeleted && personnelList[i] == 0) {
              if (personvalue) {
                v.tagName = personvalue;
              } else {
                v.isDeleted = true;
                personnelList.splice(i, 1);
              }
            }
          }
        }
      }
      if (v.tagType == 118700) {
        for (let i = 0; i < behaviorList.length; i++) {
          if (v.tagCode == behaviorList[i]) {
            v.isDeleted = false;
            if (!v.isDeleted && behaviorList[i] == 0) {
              if (actionvalue) {
                v.tagName = actionvalue;
              } else {
                v.isDeleted = true;
                behaviorList.splice(i, 1);
              }
            }
          }
        }
      }
    });
    if(personType){
      options.type = 'flow';
    }
    CommunityDetailStore.updatePeopleTags(options).then(() => {
      this.props.onCancel();
    });
  };
  inputChange = (type, e) => {
    if (type == 0) {
      this.setState({
        personvalue: e.target.value
      });
    } else {
      this.setState({
        actionvalue: e.target.value
      });
    }
  };
  render() {
    let { id, tipVisible } = this.props;
    let { personnelList, behaviorList, personvalue, actionvalue } = this.state;
    return (
      <div className="community_residence">
        <Modal
          centered
          wrapClassName={'residence_detail_modal'}
          width={600}
          key={id}
          title="编辑标签"
          visible={tipVisible}
          onOk={this.tipHandleOk}
          onCancel={this.props.onCancel}
        >
          <div className="residence_detail_modal_content">
            <div className="modal_radio">
              <div className="radio_label">人员属性：</div>
              <CheckboxGroup
                defaultValue={personnelList}
                onChange={this.onPersonnelChange}
              >
                <Row>
                  <Col span={6}>
                    <Checkbox value={118601}>外卖</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value={118602}>空巢老人</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value={118603}>工作人员</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value={118604}>快递</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value={0} >自定义</Checkbox>
                  </Col>
                  <Col span={22} offset={1}>
                    {personnelList &&
                      personnelList.length > 0 &&
                      personnelList.filter(v => v === 0).length > 0 && (
                        <Input
                          value={personvalue}
                          onChange={this.inputChange.bind(this, 0)}
                          placeholder="请输入人员属性标签，多个标签以“；”分隔"
                        />
                      )}
                  </Col>
                </Row>
              </CheckboxGroup>
            </div>
            <div className="modal_radio">
              <div className="radio_label">行为属性：</div>
              <CheckboxGroup
                defaultValue={behaviorList}
                onChange={this.onBehaviorChange}
              >
                <Row>
                  <Col span={6}>
                    <Checkbox value={118701}>昼伏夜出</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value={118702}>早出晚归</Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value={118703}>足不出户</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value={0}>自定义</Checkbox>
                  </Col>
                  <Col span={22} offset={1}>
                    {behaviorList &&
                      behaviorList.length > 0 &&
                      behaviorList.filter(v => v === 0).length > 0 && (
                        <Input
                          value={actionvalue}
                          onChange={this.inputChange.bind(this, 1)}
                          placeholder="请输入行为属性标签，多个标签以“；”分隔"
                        />
                      )}
                  </Col>
                </Row>
              </CheckboxGroup>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
