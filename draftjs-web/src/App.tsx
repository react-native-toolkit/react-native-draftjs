import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  DefaultDraftBlockRenderMap,
  DraftHandleValue,
} from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import { stateToHTML } from "draft-js-export-html";
// @ts-ignore
import { stateFromMarkdown } from "draft-js-import-markdown";
// @ts-ignore
import { stateToMarkdown } from "draft-js-export-markdown";
import { Map } from "immutable";
import EditorController from "./Components/EditorController/EditorController";
import { ICustomWindow } from "./types/ICustomWindow";

declare let window: ICustomWindow;

/**
 * For testing the post messages
 * in web
 */
// window.ReactNativeWebView = {
//   postMessage: (value) => console.log(value)
// };

export type editorModeType = "html" | "md";

export type defaultSourceType = {
  type: editorModeType;
  value: string;
};

function App() {
  const _draftEditorRef = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [mode, setMode] = useState<editorModeType>("html");
  const [placeholder, setPlaceholder] = useState("");
  const [editorStyle, setEditorStyle] = useState("");
  const [styleMap, setStyleMap] = useState({});
  const [blockRenderMap, setBlockRenderMap] = useState(Map({}));
  const [isMounted, setMountStatus] = useState(false);

  useEffect(() => {
    if (!isMounted) {
      setMountStatus(true);
      /**
       * componentDidMount action goes here...
       */
      window?.ReactNativeWebView?.postMessage?.(
        JSON.stringify({
          isMounted: true,
        })
      );
    }
  }, [isMounted]);

  const handleKeyCommand = (
    command: string,
    editorState: EditorState
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const mapKeyToEditorCommand = (e: KeyboardEvent<{}>) => {
    return getDefaultKeyBinding(e);
  };

  const setEditorMode = (editorMode: editorModeType) => {
    setMode(editorMode);
  };

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const setDefaultValue = (data: defaultSourceType) => {
    try {
      if (data.type === "html") {
        setEditorState(
          EditorState.createWithContent(stateFromHTML(data.value))
        );
      } else {
        setEditorState(
          EditorState.createWithContent(stateFromMarkdown(data.type))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const setEditorPlaceholder = (placeholder: string) => {
    setPlaceholder(placeholder);
  };

  const setEditorStyleSheet = (styleSheet: string) => {
    setEditorStyle(styleSheet);
  };

  const setEditorStyleMap = (editorStyleMap: string) => {
    setStyleMap(JSON.parse(editorStyleMap));
  };

  const focusTextEditor = () => {
    _draftEditorRef.current && _draftEditorRef.current.focus();
  };

  const blurTextEditor = () => {
    _draftEditorRef.current && _draftEditorRef.current.blur();
  };

  const setEditorBlockRenderMap = (renderMapString: string) => {
    try {
      setBlockRenderMap(Map(JSON.parse(renderMapString)));
    } catch (e) {
      setBlockRenderMap(Map({}));
      console.error(e);
    }
  };

  window.toggleBlockType = toggleBlockType;
  window.toggleInlineStyle = toggleInlineStyle;
  window.setDefaultValue = setDefaultValue;
  window.setEditorPlaceholder = setEditorPlaceholder;
  window.setEditorStyleSheet = setEditorStyleSheet;
  window.setEditorStyleMap = setEditorStyleMap;
  window.focusTextEditor = focusTextEditor;
  window.blurTextEditor = blurTextEditor;
  window.setEditorBlockRenderMap = setEditorBlockRenderMap;
  window.setEditorMode = setEditorMode;

  const selection = editorState.getSelection();
  const editorBlockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const currentStyle = editorState.getCurrentInlineStyle();

  const setIterartor = currentStyle.values();
  let style = setIterartor.next();
  let styleString = "";
  while (!style.done) {
    if (styleString) styleString += "," + style.value;
    else styleString = style.value;
    style = setIterartor.next();
  }

  window?.ReactNativeWebView?.postMessage?.(
    JSON.stringify({
      editorState:
        mode === "html"
          ? stateToHTML(editorState.getCurrentContent())
          : stateToMarkdown(editorState.getCurrentContent()),
      blockType: editorBlockType,
      styles: styleString,
      mode,
    })
  );

  const customBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

  return (
    <>
      <style>
        {`.public-DraftEditorPlaceholder-root{position: absolute;color: silver;pointer-events: none;z-index: -10000;}${editorStyle}`}
      </style>
      <Editor
        ref={_draftEditorRef}
        customStyleMap={styleMap}
        blockRenderMap={customBlockRenderMap}
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={mapKeyToEditorCommand}
        placeholder={placeholder}
      />
      {window?.ReactNativeWebView ? null : (
        <EditorController
          onToggleBlockType={toggleBlockType}
          onToggleInlineStyle={toggleInlineStyle}
          currentStyle={currentStyle}
          editorBlockType={editorBlockType}
          mode={mode}
          setEditorMode={setEditorMode}
        />
      )}
    </>
  );
}

export default App;
