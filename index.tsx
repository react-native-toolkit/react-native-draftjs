import React, { Component } from "react";
import { ViewStyle, Platform } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";

const draftJsHtml = require("./draftjs-html-source/draftjs-source.html");

export type StyleEnum = "BOLD" | "ITALIC" | "UNDERLINE" | "CODE";
export type BlockTypeEnum =
  | "unstyled"
  | "paragraph"
  | "header-one"
  | "header-two"
  | "header-three"
  | "header-four"
  | "header-five"
  | "header-six"
  | "unordered-list-item"
  | "ordered-list-item"
  | "blockquote"
  | "code-block"
  | "atomic";
type PropTypes = {
  style?: ViewStyle;
  defaultValue?: string;
  placeholder?: string;
  styleSheet?: string;
  styleMap?: Record<string, unknown>;
  blockRenderMap?: Record<string, unknown>;
  onEditorReady?: () => void;
  onStyleChanged?: (styles: StyleEnum[]) => void;
  onBlockTypeChanged?: (type: BlockTypeEnum) => void;
};

class RNDraftView extends Component<PropTypes> {
  private webViewRef = React.createRef<WebView>();

  state = {
    editorState: ""
  };

  private executeScript = (functionName: string, parameter?: string) => {
    if (this.webViewRef.current) {
      this.webViewRef.current.injectJavaScript(
        `window.${functionName}(${parameter ? `'${parameter}'` : ""});true;`
      );
    }
  };

  private onMessage = (event: WebViewMessageEvent) => {
    const { onStyleChanged, onBlockTypeChanged } = this.props;
    const { data } = event.nativeEvent;
    const { blockType, styles, editorState, isMounted } = JSON.parse(data);
    if (onStyleChanged) {
      onStyleChanged(styles ? styles.split(",") : []);
    }
    if (blockType) {
      onBlockTypeChanged(blockType);
    }
    if (editorState) {
      this.setState({ editorState: editorState.replace(/(\r\n|\n|\r)/gm, "") });
    }
    if (isMounted) {
      this.widgetMounted();
    }
  };

  private widgetMounted = () => {
    const {
      placeholder,
      defaultValue,
      styleSheet,
      styleMap,
      blockRenderMap,
      onEditorReady = () => null
    } = this.props;
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

  setBlockType = (blockType: BlockTypeEnum) => {
    this.executeScript("toggleBlockType", blockType);
  };

  setStyle = (style: StyleEnum) => {
    this.executeScript("toggleInlineStyle", style);
  };

  getEditorState = () => {
    return this.state.editorState;
  };

  render() {
    const { style = { flex: 1 } } = this.props;
    return (
      <WebView
        ref={this.webViewRef}
        style={style}
        source={
          Platform.OS === "ios"
            ? draftJsHtml
            : { uri: "file:///android_asset/draftjs-source.html" }
        }
        keyboardDisplayRequiresUserAction={false}
        originWhitelist={["*"]}
        onMessage={this.onMessage}
      />
    );
  }
}

export default RNDraftView;
