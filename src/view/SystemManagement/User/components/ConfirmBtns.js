import React from 'react';
import { Button } from 'antd'

export default ({className, isView, cancelUserForm, submitUserForm}) => (
  <div className={className}>
    { isView 
        ? <Button 
            key='calcel' 
            type="primary" 
            onClick={() => cancelUserForm()}
          >
            返回
          </Button>
        : <React.Fragment>
            <Button 
              key='calcel' 
              type="cancel" 
              onClick={() => cancelUserForm(true)}
            >
              取消
            </Button>
            <Button
              key='submit'
              type="primary"
              htmlType="submit"
              onClick={submitUserForm}
            >
              保存
            </Button>
          </React.Fragment>
    }
  </div>
)