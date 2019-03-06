import React from 'react';
import { Row, Col,Button} from 'antd';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent'

export default class HeadTitle extends React.Component {
  render() {
    const {goPage,className}=this.props;
    return (
      <div className="head-title">
        <div className="head-title-row">
          <Row type="flex" align="middle">
            <Col span={18}>
              <AuthComponent actionName='UserAdd'>
                <Button
                  type="primary"
                  className={className}
                  icon='plus'
                  onClick={() => goPage()}
                >
                  新建用户
                </Button>
              </AuthComponent>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
