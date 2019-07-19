import React, { Component } from "react";
import { ViewPropTypes } from "react-native";
import WebView from "react-native-webview";
import PropTypes from "prop-types";

const draftJsHtml = require("./draftjs-html-source/index.html");

class RNDraftView extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    onStyleChanged: PropTypes.func,
    onBlockTypeChanged: PropTypes.func
  };

  _webViewRef = React.createRef();

  setBlockType = blockType => {
    this._webViewRef.current &&
      this._webViewRef.current.injectJavaScript(`
        window.toggleBlockType("${blockType}");
        true;
      `);
  };

  setStyle = style => {
    this._webViewRef.current &&
      this._webViewRef.current.injectJavaScript(`
        window.toggleInlineStyle("${style}");
        true;
      `);
  };

  onMessage = event => {
    const {
      onStyleChanged = () => null,
      onBlockTypeChanged = () => null
    } = this.props;
    const { data } = event.nativeEvent;
    const { blockType, styles } = JSON.parse(data);
    onBlockTypeChanged(blockType);
    onStyleChanged(styles ? styles.split(",") : []);
  };

  render() {
    const { style = { flex: 1 } } = this.props;
    return (
      <WebView
        ref={this._webViewRef}
        style={style}
        source={draftJsHtml}
        onMessage={this.onMessage}
      />
    );
  }
}

export default RNDraftView;
