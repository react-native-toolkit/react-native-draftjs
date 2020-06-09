import React from "react";
import PropTypes from "prop-types";
import ControllerButton from "./Components/ControllerButton";
import BlockTypes from "../../Constants/BlockTypes";
import InlineStyles from "../../Constants/InlineStyles";
import { DraftInlineStyle } from "draft-js";
import { editorModeType } from "../../App";

export interface EditorControllerProps {
  onToggleBlockType: (type: string) => any;
  onToggleInlineStyle: (type: string) => any;
  currentStyle: DraftInlineStyle;
  editorBlockType: string;
  mode: editorModeType;
  setEditorMode: (editorMode: editorModeType) => any;
}

const EditorController = ({
  onToggleBlockType = () => null,
  onToggleInlineStyle = () => null,
  currentStyle,
  editorBlockType,
  mode,
  setEditorMode,
}: EditorControllerProps) => {
  return (
    <div>
      <span
        style={{
          backgroundColor: "white",
          margin: "4px 8px",
          borderRadius: 2,
          border: "1px solid black",
          padding: "4px 8px",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          mode === "html" ? setEditorMode("md") : setEditorMode("html");
        }}
      >
        {mode}
      </span>
      {InlineStyles.map((styleType, styleTypeIndex) => {
        return (
          <ControllerButton
            key={styleTypeIndex}
            isActive={currentStyle.has(styleType.style)}
            label={styleType.label}
            onToggle={onToggleInlineStyle}
            style={styleType.style}
          />
        );
      })}
      {BlockTypes.map((blockType, blockTypeIndex) => {
        return (
          <ControllerButton
            key={blockTypeIndex}
            isActive={blockType.style === editorBlockType}
            label={blockType.label}
            onToggle={onToggleBlockType}
            style={blockType.style}
          />
        );
      })}
    </div>
  );
};

EditorController.propTypes = {
  editorState: PropTypes.object,
  onToggleBlockType: PropTypes.func,
  onToggleInlineStyle: PropTypes.func,
};

export default EditorController;
