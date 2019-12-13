import { Component } from 'react';
import { StyleProp, ViewStyle, } from "react-native";

export enum StyleTypes {
    BOLD = "BOLD", ITALIC = "ITALIC", UNDERLINE = "UNDERLINE", CODE = "CODE"
}
export type StyleType = keyof typeof StyleTypes
export interface RNDraftViewProps {
    defaultValue?: string | undefined;
    onEditorReady: Function;
    style?: StyleProp<ViewStyle>;
    placeholder?: string;
    ref: React.Ref<any>;
    onStyleChanged: Function;
    onBlockTypeChanged: Function;
    styleMap?: object;
    styleSheet?: string;
}

/**
 * The main Draftview class
 */

declare class RNDraftView extends Component<RNDraftViewProps> {
    /**
    * Shift focus to the rich text editor
    */
    focus: () => void;
    /**
     * Remove focus from the rich text editor
     */
    blur: () => void;
    /**
     * Apply a style to the selected/active text. Call again with the same style to remove it
     */
    setStyle: (style: StyleType) => void;
    /**
     * Apply default block types supported by draft.js. Call again to remove the block type style
     */
    setBlockType: (blockType: string) => void;
    /**
     * Return the current editor state as a HTML string exported using `draft-js-export-html`
     */
    getEditorState: () => string;

}
export { RNDraftView };
export default RNDraftView;