// async-component.js
/**
 * 用于react router4 code splitting
 */
import React, { Component } from 'react'
import Loading from '../components/Loading'

/**
 * @param {Function} loadComponent e.g: () => import('./component')
 * @param {ReactNode} placeholder  未加载前的占位
 */
export default (loadComponent, modName, placeholder = null) => {
  class AsyncComponent extends Component {
    unmount = false

    constructor() {
      super()
      this.state = {
        component: null
      }
    }

    componentWillUnmount() {
      this.unmount = true
    }

    async componentDidMount() {
      let component = null
      const mod = await loadComponent()
      mod.default
        ? (component = mod.default)
        : modName
          ? (component = mod[modName])
          : (component = null)

      this.setState({
        component: component
      })
    }

    render() {
      const Spin = placeholder || Loading
      const C = this.state.component
      return C ? <C {...this.props} /> : <Spin />
    }
  }

  return AsyncComponent
}
