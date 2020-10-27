import React, { Component, createRef } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import WebView, {
  WebViewMessageEvent,
  WebViewProps,
} from 'react-native-webview';

const draftJsHtml = require('../draftjs-html-source/draftjs-source.html');

export interface RNDraftViewProps extends WebViewProps {
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

class RNDraftView extends Component<
  RNDraftViewProps,
  { editorState: string; rawState: string; markdownState: string }
> {
  _webViewRef = createRef<WebView>();
  state = {
    editorState: '',
    rawState: '',
    markdownState: '',
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

  getRawState = () => {
    return this.state.rawState;
  };

  getMarkdownState = () => {
    return this.state.markdownState;
  };

  _onMessage = (event: WebViewMessageEvent) => {
    const {
      onStyleChanged = () => null,
      onBlockTypeChanged = () => null,
    } = this.props;
    const { data } = event.nativeEvent;
    const {
      blockType,
      styles,
      editorState,
      rawState,
      markdownState,
      isMounted,
    } = JSON.parse(data);
    onStyleChanged(styles ? styles.split(',') : []);
    if (blockType) onBlockTypeChanged(blockType);
    if (editorState) this.setState({ editorState });
    if (rawState) this.setState({ rawState });
    if (markdownState) this.setState({ markdownState });
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
      // TODO: Replace single quotes with double quotes using regex
      this.executeScript(
        'setEditorStyleSheet',
        styleSheet.replace(/(\r\n|\n|\r)/gm, '')
      );
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
    const {
      style = { flex: 1 },
      keyboardDisplayRequiresUserAction = false,
      originWhitelist = ['*'],
      onMessage,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onStyleChanged,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onBlockTypeChanged,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      placeholder,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      defaultValue,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      styleSheet,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      styleMap,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      blockRenderMap,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onEditorReady,
      ...otherProps
    } = this.props;

    const onDraftMessage = (event: WebViewMessageEvent) => {
      this._onMessage(event);
      onMessage && onMessage(event);
    };

    return (
      <WebView
        ref={this._webViewRef}
        style={style}
        source={draftJsHtml}
        keyboardDisplayRequiresUserAction={keyboardDisplayRequiresUserAction}
        originWhitelist={originWhitelist}
        onMessage={onDraftMessage}
        {...otherProps}
      />
    );
  }
}

export default RNDraftView;
