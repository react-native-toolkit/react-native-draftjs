import React, { Component, createRef } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

const draftJsHtml = require('../draftjs-html-source/draftjs-source.html');

export interface RNDraftViewProps {
  style?: StyleProp<ViewStyle>;
  onStyleChanged?: (styles: string[]) => unknown;
  onBlockTypeChanged?: (blockType: string) => unknown;
  placeholder?: string;
  defaultValue?: string;
  styleSheet?: string;
  styleMap?: object;
  blockRenderMap?: object;
  onEditorReady?: () => unknown;
}

export type WebDraftFunctions =
  | 'toggleBlockType'
  | 'toggleInlineStyle'
  | 'setDefaultValue'
  | 'setEditorPlaceholder'
  | 'setEditorStyleSheet'
  | 'setEditorStyleMap'
  | 'focusTextEditor'
  | 'blurTextEditor'
  | 'setEditorBlockRenderMap';

class RNDraftView extends Component<RNDraftViewProps, { editorState: string }> {
  _webViewRef = createRef<WebView>();
  state = {
    editorState: '',
  };

  executeScript = (functionName: WebDraftFunctions, parameter?: string) => {
    this._webViewRef.current &&
      this._webViewRef.current.injectJavaScript(
        `window.${functionName}(${parameter ? `'${parameter}'` : ''});true;`
      );
  };

  setBlockType = (blockType: string) => {
    this.executeScript('toggleBlockType', blockType);
  };

  setStyle = (style: string) => {
    this.executeScript('toggleInlineStyle', style);
  };

  getEditorState = () => {
    return this.state.editorState;
  };

  _onMessage = (event: WebViewMessageEvent) => {
    const {
      onStyleChanged = () => null,
      onBlockTypeChanged = () => null,
    } = this.props;
    const { data } = event.nativeEvent;
    const { blockType, styles, editorState, isMounted } = JSON.parse(data);
    onStyleChanged(styles ? styles.split(',') : []);
    if (blockType) onBlockTypeChanged(blockType);
    if (editorState)
      this.setState({ editorState: editorState.replace(/(\r\n|\n|\r)/gm, '') });
    if (isMounted) this.widgetMounted();
  };

  widgetMounted = () => {
    const {
      placeholder,
      defaultValue,
      styleSheet,
      styleMap,
      blockRenderMap,
      onEditorReady = () => null,
    } = this.props;
    if (defaultValue) {
      this.executeScript('setDefaultValue', defaultValue);
    }
    if (placeholder) {
      this.executeScript('setEditorPlaceholder', placeholder);
    }
    if (styleSheet) {
      this.executeScript('setEditorStyleSheet', styleSheet);
    }
    if (styleMap) {
      try {
        this.executeScript('setEditorStyleMap', JSON.stringify(styleMap));
      } catch (e) {
        console.error(e);
      }
    }
    if (blockRenderMap) {
      try {
        this.executeScript(
          'setEditorBlockRenderMap',
          JSON.stringify(blockRenderMap)
        );
      } catch (e) {
        console.error(e);
      }
    }
    onEditorReady();
  };

  focus = () => {
    this.executeScript('focusTextEditor');
  };

  blur = () => {
    this.executeScript('blurTextEditor');
  };

  render() {
    const { style = { flex: 1 } } = this.props;
    return (
      <WebView
        ref={this._webViewRef}
        style={style}
        source={draftJsHtml}
        keyboardDisplayRequiresUserAction={false}
        originWhitelist={['*']}
        onMessage={this._onMessage}
      />
    );
  }
}

export default RNDraftView;
