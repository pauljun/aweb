import React, { Component } from 'react';
import { Col, Row, message, Popconfirm } from 'antd';
import { Form, Input, Radio } from 'antd-form-component';
import CustomUpload from 'src/components/Upload/upload.sw';
import IconFont from 'src/components/IconFont';
import WaterMark from 'src/components/WaterMarkView';

import './index.scss';
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const InputItemCol1 = [
  {
    name: "name",
    label: "姓名",
    required: true
  },
  {
    name: "mobile",
    label: "手机号码",
    rules: [{
      pattern: /^1\d{10}$/,
      message: '请输入正确手机号码'
    }]
  },
  {
    name: "birthday",
    label: "出生年月",
  }
]
const InputItemCol2 = [
  {
    name: "nationality",
    label: "民族",
  }, {
    name: "identityNumber",
    label: "身份证号",
    rules: [{
      pattern: /^((\d{18})|([0-9x]{18})|([0-9X]{18}))$/,
      message: '请输入正确的身份证号'
    }]
  }
]

/* 
  本地添加布控人员
  this.isEdit 表明是添加或是编辑
*/
@Form.create()
class FormPeopleInfo extends Component {

  // 预览图片
  viewImg = imageUrl => {
    window.open(imageUrl, '_blank')
  }
  
  beforeUpload = () => {
    const { beforeUpload } = this.props;
    beforeUpload && beforeUpload();
  }

  uploadDone = (file) => {
    if (!file) {
      message.error('上传失败')
    }
    const { uploadDone } = this.props;
    uploadDone && uploadDone(file);
  }

  componentDidMount() {
    const { formRef, form } = this.props;
    formRef && formRef(form);
  }

  render() {
    const { className='', selfAttr={}, infoList, deleteImg, uploadType='local', showStatus=false } = this.props;
    const imgCount = infoList ? infoList.length : 0;
    return (
      <Form 
        className={'monitee-form-people-info-wrapper '+className} 
        layout='horizontal'
      >
        <Row>
          <Col className='img-list-wrapper clearfix'>
            <div className='img-list clearfix fl'>
              {infoList && infoList.map((v,index) => {
                let imgUrl = v.imageUrl || v.image || v.url;
                return (
                  <div key={index} className="img-wrapper fl">
                    <WaterMark top={'50%'} src={imgUrl} />
                    {showStatus && !!v.saveStatus && <span className='img-err'>图片解析失败</span>}
                    <div className='img-btn-wrapper'>
                      <Popconfirm title='确认删除吗' onConfirm={() => deleteImg(v)} okText="确定" cancelText="取消">
                        <IconFont title='删除' type="icon-Delete_Light" />
                      </Popconfirm>
                      {/* <Icon type="eye" title='预览' onClick={() => this.viewImg(imgUrl)} /> */}
                    </div>
                  </div>
                )
              })}
              <div className='upload-div-wrapper fl'>
                { imgCount < 5 
                  ? <CustomUpload
                      expiretype={0}
                      uploadType={uploadType}
                      beforeUpload={this.beforeUpload}
                      uploadDone={this.uploadDone}
                    /> 
                  : <div></div>
                } 
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          {InputItemCol1.map(v => (
            <Col span={24} key={v.name}>
              <Input
                required={v.required || false}
                name={v.name}
                label={v.label}
                placeholder={`请填写${v.label}`}
                value={selfAttr[v.name]}
                rules={v.rules}
              />
            </Col>
          ))}
        </Row>
        <Row gutter={16}>
          {InputItemCol2.map(v => (
            <Col span={24} key={v.name}>
              <Input
                name={v.name}
                label={v.label}
                placeholder={`请填写${v.label}`}
                value={selfAttr[v.name]}
                rules={v.rules}
              />
            </Col>
          ))}
          <Col span={24}>
            <RadioGroup
              name='gender'
              label="性别"
              value={selfAttr.gender || '男'}
              options={[
                { label: '男', value: '男' },
                { label: '女', value: '女' }
              ]}
            />
          </Col>
        </Row>
        {/* <Row> */}
          <Form.Item>
            <TextArea
              name="description"
              className='description'
              label="描述"
              placeholder="请输入布控人员描述文字"
              value={selfAttr.description}
              rules={[
                {max: 200, message: `描述信息不超过${200}个字`}
              ]}
            />
          </Form.Item>
        {/* </Row> */}
      </Form>
    )
  }
}

export default FormPeopleInfo