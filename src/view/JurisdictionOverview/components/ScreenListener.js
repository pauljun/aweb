import React, { Component } from 'react'
import * as util from 'src/utils/FullScreen'
export function ScreenListen(WrappedComponent){
    return class extends Component {
        state = {
            fullScreenState:false,
        }
        componentWillUnmount() {
            util.fullScreenListener(false, this.fullscreenchange) 
        }
        
          componentDidMount() {
            util.fullScreenListener(true, this.fullscreenchange)
          }
          fullscreenchange = () => {
            if (!util.isFullscreen()) {
              this.fullScreen(null, true)
            }
          }
        
          //全屏
          fullScreen = (ele,exitFullscreen) => {
            let {fullScreenState}=this.state
            if (!fullScreenState && !exitFullscreen){
              util.fullscreen(ele)
              this.setState({
                fullScreenState:true
              })
            }else{
              util.exitFullscreen()
              this.setState({
                fullScreenState:false
              })
            }
          }
        render() {
            const newProps = {
              ...this.props,
              fullScreenState:this.state.fullScreenState,
              fullScreen:this.fullScreen
              }
            return <WrappedComponent {...newProps} />
        }
    }
}
 
 