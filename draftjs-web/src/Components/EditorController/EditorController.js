import React from "react";
import PropTypes from "prop-types";
import ControllerButton from "./Components/ControllerButton";
import BlockTypes from "../../Constants/BlockTypes";
import InlineStyles from "../../Constants/InlineStyles";

const EditorController = ({
  editorState = {},
  onToggleBlockType = () => null,
  onToggleInlineStyle = () => null
}) => {
  const selection = editorState.getSelection();
  const editorBlockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div hidden={true}>
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
  onToggleInlineStyle: PropTypes.func
};

export default EditorController;
