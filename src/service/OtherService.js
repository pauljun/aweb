import { httpRequest } from '../utils/HttpUtil';

@httpRequest
class OtherService {
  
  upload({ url, formData }) {
    let options = {};
    options.url = url;
    options.method = 'post';
    options.data = formData;
    return this.$httpMultiPart(options).then(res => {
      return res.data;
    });
  }
  getVersion() {
    return this.$httpXMLInstance({url:'/about.json'}).then(res => {
      return res
    })
  }
  getBroadcastInfo() {
    return this.$httpXMLInstance({url:'/broadcast.json'}).then(res => {
      return res
    })
  }
}

export default new OtherService();
