export type webviewPostMessageType = (value: string) => any;

export interface ICustomWindow extends Window {
  ReactNativeWebView?: {
    postMessage: webviewPostMessageType;
  };
  toggleBlockType: (value: string) => any;
  toggleInlineStyle: (value: string) => any;
  setDefaultValue: (value: string) => any;
  setEditorPlaceholder: (value: string) => any;
  setEditorStyleSheet: (value: string) => any;
  setEditorStyleMap: (value: string) => any;
  focusTextEditor: (value: string) => any;
  blurTextEditor: (value: string) => any;
  setEditorBlockRenderMap: (value: string) => any;
}
