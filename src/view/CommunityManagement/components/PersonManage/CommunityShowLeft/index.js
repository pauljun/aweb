import React from 'react';
import { Popover, Checkbox } from 'antd';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import CommunityShow from '../CommunityShow/index';
import { observer } from 'mobx-react';
import InputAfter from 'src/components/InputAfter';
@BusinessProvider(
  'LongLivedStore',
  'FloatPersonStore',
  'CommunityEntryStore',
  'TabStore'
)
@observer
export default class CommunityShowLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIf: true,
      choseId: undefined,
      show: false,
      villageList: [],
      value: '',
      passVillageList: [],
      otherCommunityData:[]
    };
    this.requestVillage();
    this.i = 0;
  }
  requestVillage = () => {
    const { CommunityEntryStore,type } = this.props;
    CommunityEntryStore.getVillagesForShortInfo({ page: 1, pageSize: 1000 }).then(
      res => {
        this.setState({
          villageList: res.list,
          passVillageList: res.list
        });
        let arr=[]
        res.list.map(v => arr.push(v.id))
        if(arr.length==0){
          return 
        }
        if(type==2)
        {CommunityEntryStore.getPermanentInfoByVillageIds({villageIds:arr}).then(res => {
          this.setState({
            otherCommunityData:res
          })
        })} else {
          CommunityEntryStore.getFlowInfoByVillageIds({villageIds:arr}).then(res => {
            this.setState({
              otherCommunityData:res
            })
          })
        }
      }
    );
  };
  handleVillageSelect = id => {
    const { LongLivedStore, type, FloatPersonStore } = this.props;
    const { passVillageList, choseId } = this.state;
    this.props.handleSelctId();
    if (type == 2) {
      LongLivedStore.initSearchData(1);
      LongLivedStore.editSearchData({ villageIds: [id] }, 1);
      LongLivedStore.initSearchData(2);
      LongLivedStore.editSearchData({ villageIds: [id] }, 2);
    } else {
      FloatPersonStore.initSearchData(1);
      FloatPersonStore.editSearchData({ villageIds: [id] }, 1);
      FloatPersonStore.initSearchData(2);
      FloatPersonStore.editSearchData({ villageIds: [id] }, 2);
    }
    /**点击选中的社区，全选按钮选中 */
    if (id == choseId) {
      this.setState({
        choseId: undefined,
        selectIf: true
      });
      this.props.requestUnappear();
      this.props.requestData();
      return;
    }
    this.props.requestUnappear(true);
    this.props.requestData(true);
    if (passVillageList.length > 1) {
      this.setState({
        selectIf: false
      });
    } else {
      this.setState({
        selectIf: true
      });
    }
    this.setState({
      choseId: id,
      show: true
    });
  };
  /**条件搜索社区 */
  handleAnotherInput = e => {
    clearTimeout(this.SearchVillage);
    const {
      CommunityEntryStore,
      LongLivedStore,
      FloatPersonStore,
      type
    } = this.props;
    this.setState({
      value: e.target.value
    });
    let keyWord = e.target.value;
    const { passVillageList } = this.state;
    this.props.handleSelctId();
    this.SearchVillage = setTimeout(() => {
      CommunityEntryStore.getVillagesForShortInfo({
        page: 1,
        pageSize: 1000,
        keyWord
      }).then(res => {
        if (res.list.length == passVillageList.length) {
          this.setState({
            selectIf: true
          });
        } else {
          this.setState({
            selectIf: false
          });
        }
        this.setState({
          choseId: undefined,
          villageList: res.list
        });
        if (res.list.length == 0) {
          this.props.HandleNoVillageData();
          return;
        }
        if (keyWord.length == 0) {
          this.setState({
            selectIf: true
          });
        }
        if (type == 2) {
          LongLivedStore.initSearchData(1);
          LongLivedStore.editSearchData(
            { villageIds: res.list.map(v => v.id) },
            1
          );
          LongLivedStore.initSearchData(2);
          LongLivedStore.editSearchData(
            { villageIds: res.list.map(v => v.id) },
            2
          );
        } else {
          FloatPersonStore.initSearchData(1);
          FloatPersonStore.editSearchData(
            { villageIds: res.list.map(v => v.id) },
            1
          );
          FloatPersonStore.initSearchData(2);
          FloatPersonStore.editSearchData(
            { villageIds: res.list.map(v => v.id) },
            2
          );
        }
        this.props.requestUnappear(true);
        this.props.requestData(true);
      });
    }, 500);
  };
  handleSelect = e => {
    const { LongLivedStore, type, FloatPersonStore } = this.props;
    this.props.handleSelctId();
    if (type == 2) {
      LongLivedStore.initSearchData(1);
      LongLivedStore.initSearchData(2);
    } else {
      FloatPersonStore.initSearchData(1);
      FloatPersonStore.initSearchData(2);
    }
    this.setState({
      selectIf: true,
      choseId: undefined
    });
    this.requestVillage();
    if (!this.state.selectIf) {
      this.props.requestData(true);
      this.props.requestUnappear(true);
      this.setState({
        value: ''
      });
    }
  };
  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.choseId && nextProps.selectIf == false) {
      if (this.i < 1) {
        this.setState({
          choseId: nextProps.choseId,
          selectIf: nextProps.selectIf
        });
      }
      this.i = this.i + 1;
    }
  }
  onCancel = () => {
    this.setState({
      value: '',
      selectIf: true
    });
    this.requestVillage();
    this.props.requestData();
    this.props.requestUnappear();
  };
  render() {
    const { selectIf, choseId, villageList,otherCommunityData } = this.state;
    const { type } = this.props;
    return (
      <React.Fragment>
        <div className="community-title-real" style={{ margin: 0 }}>
          <div>{type == 2 ? '常住人口管理' : '流动人口管理'}</div>
          <div className="community-checkbox">
            全部显示
            <span style={{ paddingLeft: '6px' }}>
              <Popover
                overlayClassName={'checkbox-span-pop-community'}
                placement="bottom"
                content={
                  selectIf ? (
                    <span>
                      {type == 2
                        ? '请选择下面列表查看单个小区常住人口'
                        : '请选择下面列表查看单个小区流动人口'}
                    </span>
                  ) : (
                    <span>
                      {type == 2
                        ? '全部显示小区常住人口'
                        : '全部显示小区流动人口'}
                    </span>
                  )
                }
              >
                <Checkbox
                  onChange={this.handleSelect}
                  checked={this.state.selectIf}
                />
              </Popover>
            </span>
          </div>
        </div>
        <div className="community-input">
          <InputAfter
            placeholder="请输入小区名称搜索"
            size={'lg'}
            style={{ color: 'rgba(0,0,0,.25)' }}
            value={this.state.value}
            onChange={this.handleAnotherInput}
            onCancel={this.onCancel}
          />
        </div>
        <div className="community-exp">
          {villageList.map((v, index) => (
            <CommunityShow
              type={type}
              key={index}
              data={v}
              otherData={otherCommunityData.filter(a => a.villageId==v.id)}
              choseId={choseId}
              handleVillageSelect={this.handleVillageSelect}
            />
          ))}
        </div>
      </React.Fragment>
    );
  }
}
