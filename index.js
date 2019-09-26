import React, { Component } from "react";
import { ViewPropTypes, Platform } from "react-native";
import WebView from "react-native-webview";
import PropTypes from "prop-types";

const draftJsHtml = require("./draftjs-html-source/draftjs-source.html");

class RNDraftView extends Component {
  static propTypes = {
    sourceType: PropTypes.oneOf(['html','markdown']),
    style: ViewPropTypes.style,
    onStyleChanged: PropTypes.func,
    onBlockTypeChanged: PropTypes.func,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    styleSheet: PropTypes.string,
    styleMap: PropTypes.object,
    blockRenderMap: PropTypes.object,
    onEditorReady: PropTypes.func
  };

  _webViewRef = React.createRef();

  state = {
    editorState: ""
  };

  executeScript = (functionName, parameter) => {
    this._webViewRef.current &&
      this._webViewRef.current.injectJavaScript(
        `window.${functionName}(${parameter ? `'${parameter}'` : ""});true;`
      );
  };

  setBlockType = blockType => {
    this.executeScript("toggleBlockType", blockType);
  };

  setStyle = style => {
    this.executeScript("toggleInlineStyle", style);
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
    const { blockType, styles, editorState, isMounted } = JSON.parse(data);
    onStyleChanged(styles ? styles.split(",") : []);
    if (blockType) onBlockTypeChanged(blockType);
    if (editorState)
      this.setState({ editorState: editorState.replace(/(\r\n|\n|\r)/gm, "") });
    if (isMounted) this.widgetMounted();
  };

  widgetMounted = () => {
    const {
      sourceType = 'html',
      placeholder,
      defaultValue,
      styleSheet,
      styleMap,
      blockRenderMap,
      onEditorReady = () => null
    } = this.props;
    this.executeScript("setSourceType", sourceType);
    if (defaultValue) {
      this.executeScript("setDefaultValue", defaultValue);
    }
    if (placeholder) {
      this.executeScript("setEditorPlaceholder", placeholder);
    }
    if (styleSheet) {
      this.executeScript("setEditorStyleSheet", styleSheet);
    }
    if (styleMap) {
      try {
        this.executeScript("setEditorStyleMap", JSON.stringify(styleMap));
      } catch (e) {
        console.error(e);
      }
    }
    if (blockRenderMap) {
      try {
        this.executeScript(
          "setEditorBlockRenderMap",
          JSON.stringify(blockRenderMap)
        );
      } catch (e) {
        console.error(e);
      }
    }
    onEditorReady();
  };

  focus = () => {
    this.executeScript("focusTextEditor");
  };

  blur = () => {
    this.executeScript("blurTextEditor");
  };

  render() {
    const { style = { flex: 1 } } = this.props;
    return (
      <WebView
        ref={this._webViewRef}
        style={style}
        source={
          Platform.OS === "ios"
            ? draftJsHtml
            : { uri: "file:///android_asset/draftjs-source.html" }
        }
        useWebKit={true}
        keyboardDisplayRequiresUserAction={false}
        originWhitelist={["*"]}
        onMessage={this._onMessage}
      />
    );
  }
}

export default RNDraftView;
