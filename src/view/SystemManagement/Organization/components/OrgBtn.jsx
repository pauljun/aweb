import React from 'react';
import { Row, Col,Button } from 'antd';

export default class HeadTitle extends React.Component {
  getCurrentCode(type, code) {
    for (let i = 0; i < type.length; i++) {
      if (type[i].value === code) {
        return type[i].label
      }
    }
  }
  render() {
    const {className,loading = false, type = null, icon = null,disabled = false,children ,onClick}=this.props;
    return (
      <div className="head-title">
        <div className="head-title-row">
          <Row type="flex" align="middle">
            <Col span={18}>
              <Button
                className={className}
                loading={loading}
                type={type}
                icon={icon}
                onClick={() => onClick()}
                disabled={disabled}
              >
                新建直属组织
                {children}
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
