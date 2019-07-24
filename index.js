import React, { Component } from "react";
import { ViewPropTypes } from "react-native";
import WebView from "react-native-webview";
import PropTypes from "prop-types";

const draftJsHtml = require("./draftjs-html-source/index.html");

class RNDraftView extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    onStyleChanged: PropTypes.func,
    onBlockTypeChanged: PropTypes.func,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string
  };

  _webViewRef = React.createRef();

  state = {
    editorState: ""
  };

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

  getEditorState = () => {
    return this.state.editorState;
  };

  _onMessage = event => {
    const {
      onStyleChanged = () => null,
      onBlockTypeChanged = () => null
    } = this.props;
    const { data } = event.nativeEvent;
    const { blockType, styles, editorState } = JSON.parse(data);
    if (blockType) onBlockTypeChanged(blockType);
    if (styles) onStyleChanged(styles ? styles.split(",") : []);
    if (editorState) this.setState({ editorState });
  };

  componentDidMount() {
    const { placeholder, defaultValue } = this.props;
    if (defaultValue) {
      this._webViewRef.current &&
        this._webViewRef.current.injectJavaScript(`
          window.setDefaultValue("${defaultValue}");
          true;
        `);
    }
    if (placeholder) {
      this._webViewRef.current &&
        this._webViewRef.current.injectJavaScript(`
          window.setEditorPlaceholder("${placeholder}");
          true;
        `);
    }
  }

  render() {
    const { style = { flex: 1 } } = this.props;
    return (
      <WebView
        ref={this._webViewRef}
        style={style}
        source={draftJsHtml}
        onMessage={this._onMessage}
      />
    );
  }
}

export default RNDraftView;
