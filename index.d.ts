import { Component } from "react";
import { ViewStyle } from "react-native";
export declare type StyleEnum =
  | "BOLD"
  | "ITALIC"
  | "UNDERLINE"
  | "CODE"
  | string;
export declare type BlockTypeEnum =
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
  | "atomic"
  | string;
declare type PropTypes = {
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
declare class RNDraftView extends Component<PropTypes> {
  private webViewRef;
  state: {
    editorState: string;
  };
  private executeScript;
  private onMessage;
  private widgetMounted;
  focus: () => void;
  blur: () => void;
  setBlockType: (blockType: BlockTypeEnum) => void;
  setStyle: (style: StyleEnum) => void;
  getEditorState: () => string;
  render(): JSX.Element;
}
export default RNDraftView;
