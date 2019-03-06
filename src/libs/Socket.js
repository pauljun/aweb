import io from './socket.io-1.4.5';
import cookie from 'js-cookie';
import EventEmitter from './EventEmitter';
import { Logger, unenumerable } from '../utils/Decorator';

@Logger('Socket', true)
class Socket extends EventEmitter {
  @unenumerable
  sokect = null;
  connect() {
    if (!this.sokect) {
      let url =
        process.env.NODE_ENV !== 'production'
          ? `${window.location.hostname}:8892/socket.io`
          : '/socket.io';

      const token = cookie.get('token');
      this.Logger.debug('第一次尝试连接socket.io');
      this.sokect = io(`${url}?token=${token}`);
      this.sokect.on('connect', () => {
        this.Logger.success('连接成功');
      });
      this.sokect.on('disconnect', () => {
        this.Logger.warn('断开连接');
      });

      //TODO 订阅所有事件
      this.subscribeAllRealAlarm();
      this.libsImportEvent();
      this.subscribeAlarmNum();
      this.communityPeopleUpload();
    }
  }
  disconnect() {
    this.sokect && this.sokect.disconnect();
    this.sokect = null;
  }
  /**
   * 监听所有报警信息
   * @update hjj 2018年10月15日12:25:36
   */
  subscribeAllRealAlarm() {
      this.sokect.on('alarm', data => {
      let json;
      this.Logger.debug('alarm', data);
      try {
        json = JSON.parse(data);
      } catch (e) {
        data = json;
      }
      this.emit('alarm', json);
    });
  }

  /**
   * 监听布控一体机导入成功事件
   * @update hjj 2018年10月15日12:25:36
   */
  libsImportEvent() {
    this.sokect.on('importLib', data => {
      let json;
      this.Logger.debug('importLib', data);
      try {
        json = JSON.parse(data);
      } catch (e) {
        json = data;
      }
      this.emit('importLib', json);
    });
  }

  /**
   * 监听社区人员导入成功事件
   * @update zcx 2018年11月24日14:02:36
   */
  communityPeopleUpload() {
    this.sokect.on('importVillage', data => {
      let json;
      this.Logger.debug('importVillage', data);
      try {
        json = JSON.parse(data);
      } catch (e) {
        json = data;
      }
      this.emit('importVillage', json);
    });
  }

  /**
   * 推送报警数量
   * @update hjj 2018年10月15日12:25:36
   */
  subscribeAlarmNum() {
    this.sokect.on('alarmNum', data => {
      let json;
      this.Logger.debug('alarmNum', data);
      try {
        json = JSON.parse(data);
      } catch (e) {
        json = data;
      }
      this.emit('alarmNum', json);
    });
  }

}

export default new Socket();
