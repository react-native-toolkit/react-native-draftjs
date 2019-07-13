import React, { useState } from "react";
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from "draft-js";
import EditorController from "./Components/EditorController/EditorController";

function App() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };

  const mapKeyToEditorCommand = e => {
    switch (e.keyCode) {
      case 9: // TAB
        const newEditorState = RichUtils.onTab(
          e,
          editorState,
          4 /* maxDepth */
        );
        if (newEditorState !== editorState) {
          setEditorState(newEditorState);
        }
        return;
    }
    return getDefaultKeyBinding(e);
  };

  const toggleBlockType = blockType => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = inlineStyle => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  return (
    <>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={mapKeyToEditorCommand}
      />
      <EditorController handleKeyCommand={handleKeyCommand} />
    </>
  );
}

export default App;
