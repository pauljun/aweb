import React from "react";
import UploadComponent from "../Upload";
import './index.scss'
export default class FormUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || null
    };
  }
  onChange = value => {
    this.setState({ value });
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  };
  componentWillReceiveProps(nextProps) {
    if ("value" in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }
  render() {
    return (
      <div className="formUpload">
        <UploadComponent {...this.props}
          changeheadImg={this.onChange}
          imageUrl={this.props.value || this.props.defaultValue}
        />
      </div>
    );
  }
}
