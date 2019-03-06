import { observable, action } from 'mobx';

class Technology {
  @observable
  currentMenu = 'Test3level';

  @action
  setCurrentMenu(key) {
    console.log(key,'3333333')
    this.currentMenu = key;
  }
}

export default new Technology();
