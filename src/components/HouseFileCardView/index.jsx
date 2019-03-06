import React from "react";
import { observable, useStrict, action, computed, toJS } from "mobx";
import { observer, inject } from "mobx-react";
import "./index.scss";
import deimg from "../../assets/img/community/userbg1.png";
import WaterMakerView from "../WaterMarkView/index"
import {Row,Col} from "antd"
import { getKeyValue } from "../../libs/Dictionary";
export default class HouseFileCardView extends React.Component {
  gotohouse = index => {
    this.props.goToHousedetails(index);
  };
  render() {
    /* let mesList = this.props.mesList;
      let mesList1 = mesList.familyPeopleVos.filter(
      v => v.identifyType != 114501
    );
    let mesList2 =
      mesList.familyPeopleVos.length > 0 &&
      mesList.familyPeopleVos.filter(v => v.identifyType == 114501)[0] 
    let mesList3 = mesList1.length > 0 && mesList1[0];
    let mesList4 = mesList1.length > 0 && mesList1[1];
    let mesList5 =
      mesList.familyPeopleVos.length > 0 &&
      mesList.familyPeopleVos.filter(v => v.identifyType == 114501)[0]
    let mesList6 = mesList1.length 
    let mesList7 = mesList1.length && mesList1[1]   */
    return (
      <div
        className="card-view"
         onClick={this.gotohouse.bind(this,2000 /* mesList.id */ )} 
      >
      
         <div className="card-view-p-b">
          <p className="card-view-p">{/* mesList.address */}</p>
        </div>
        <div className="card-view-div">
          {/* mesList5 */2 ? (
            <div className="card-view-div-img">
              <WaterMakerView
                src={{} /* mesList5.portraitPicUrl?
                  mesList5.portraitPicUrl:deimg */
                }
              />
              <p className="card-view-bottom-p">{/* mesList2 && mesList2.name */}王璐</p>
              <span className="card-view-bottom-span">业主</span>
            </div>
          ) : (
            <img src={deimg} className="card-view-noimg" />
          )}
          {/* mesList6 */ 3? (
            <div className="card-view-div-img">
              <WaterMakerView
                src={{}/* mesList1.length&& mesList1[0] && mesList1[0].portraitPicUrl?
                   mesList1[0].portraitPicUrl:deimg */
                }
              />
              <div>
              <p className="card-view-bottom-p">{/* mesList3 && mesList3.name */}张路</p>
              <span className="card-view-bottom-span1">{/* getKeyValue("roomMateType", `${mesList3.identifyType}`) */}业主</span>
              </div>
            </div>
          ) : (
            <img src={deimg} className="card-view-noimg" />
          )}
          {/* mesList7 */3 ? (
            <div className="card-view-div-img">
              <WaterMakerView
                src={{}/*  mesList1.length && mesList1[1] && mesList1[1].portraitPicUrl?
                  mesList1[1].portraitPicUrl: deimg */
                }
              />
              <p className="card-view-bottom-p">{/* mesList4 && mesList4.name */}张海</p>
              <span className="card-view-bottom-span1">{/* getKeyValue("roomMateType", `${mesList4.identifyType}`) */}住户</span>
            </div>
          ) : (
            <img src={deimg} className="card-view-noimg" />
          )}
        </div> 
      </div>
    );
  }
}
