import React from 'react';
import IconFont from 'src/components/IconFont';
import { Upload, message, Button } from 'antd';
import { observer, inject } from 'mobx-react';

@inject('UserStore')
@observer
export default class ZipUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      lyyUrl:'',
      fileName: '',
      fileList:[]
    }
  }
  
	render() {
    const props = {
			name: 'file',
			multiple: false,
      showUploadList:false,
      beforeUpload: file => {
        let self = this;
        const isZip = file.name.substr(-3) === 'zip';
				const isLt2M = file.size / 1024 / 1024 < 100;
        if (!isLt2M) {
          message.error('压缩包大小不能超过100M!')
          return false
        }
        if (!isZip) {
          message.error('文件格式应为zip，请重新上传!')
          return false
        }
				const formData = new FormData();
				let token = this.props.UserStore.lyToken;
				const lyupload = window.webConfig.uploadDomain;
				formData.append('file', file);
				fetch(`${lyupload}upload2?size=${file.size}&access_token=${token}&expiretype=2`, {
          method: 'POST',
          body: formData
        }).then(
          (response) => response.json()
        ).then((result) => {
          let lyyUrl = `${lyupload}files?obj_id=${result.obj_id}&access_token=${token}&key=${result.key}`;
          message.success('上传成功')
          self.props.uploadZip && self.props.uploadZip(lyyUrl, result.name);
          this.setState({
            loading: false
          })
				})
				return false
			}			
    };
		return (
			<div className="info-upload">
				<Upload {...props} accept="application/zip">
					<Button loading={this.state.loading}>
					<IconFont type={'icon-Zoom__Light'} theme="outlined" />批量导入
					</Button>
				</Upload>
			</div>
		);
	}
}
