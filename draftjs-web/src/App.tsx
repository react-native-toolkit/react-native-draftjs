import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  DefaultDraftBlockRenderMap,
  DraftHandleValue,
  convertToRaw,
  ContentState,
  convertFromRaw,
  convertFromHTML,
} from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
// @ts-ignore
import { stateToMarkdown } from 'draft-js-export-markdown';
import { Map } from 'immutable';
import EditorController from './Components/EditorController/EditorController';
import { ICustomWindow } from './types/ICustomWindow';

declare let window: ICustomWindow;
const blob =
  '{"blocks":[{"key":"bkha4","text":"This is a Main Heading","type":"header-one","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"76ipm","text":"This is a text block.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"ascg","text":"This is a list","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9um5u","text":"With multiple items","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5l5nn","text":"In it","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"c4p9a","text":"This is a sub-heading","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"4vqhn","text":"And this is another text block","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3vknd","text":"This is a numbered","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"56mei","text":"List with about","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"365ag","text":"3 items in it","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"6mtqe","text":"This is a small heading","type":"header-three","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"78d5h","text":"And this is some formatted text","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":4,"length":4,"style":"SUPERSCRIPT"},{"offset":9,"length":2,"style":"STRIKETHROUGH"},{"offset":12,"length":4,"style":"ITALIC"},{"offset":17,"length":9,"style":"BOLD"},{"offset":27,"length":4,"style":"UNDERLINE"}],"entityRanges":[],"data":{}}],"entityMap":{}}';

/**
 * For testing the post messages
 * in web
 */
// window.ReactNativeWebView = {
//   postMessage: (value) => console.log(value),
// };

export type defaultSourceType = 'string';

function App() {

  const _draftEditorRef = useRef<Editor>(null);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [placeholder, setPlaceholder] = useState('');
  const [editorStyle, setEditorStyle] = useState('');
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
      return 'handled';
    }
    return 'not-handled';
  };

  const mapKeyToEditorCommand = (e: KeyboardEvent<{}>) => {
    return getDefaultKeyBinding(e);
  };

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const setDefaultValue = (data: defaultSourceType) => {
    try {
      if (data) {
        const stateFromBlob = convertFromRaw(JSON.parse(data));
        setEditorState(EditorState.createWithContent(stateFromBlob));
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

  const selection = editorState.getSelection();
  const editorBlockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const currentStyle = editorState.getCurrentInlineStyle();

  const setIterartor = currentStyle.values();
  let style = setIterartor.next();
  let styleString = '';
  while (!style.done) {
    if (styleString) styleString += ',' + style.value;
    else styleString = style.value;
    style = setIterartor.next();
  }

  window?.ReactNativeWebView?.postMessage?.(
    JSON.stringify({
      editorState: stateToHTML(editorState.getCurrentContent()),
      rawState: convertToRaw(editorState.getCurrentContent()),
      plainText: editorState.getCurrentContent().getPlainText('\u0001'),
      markdownState: stateToMarkdown(editorState.getCurrentContent()),
      blockType: editorBlockType,
      styles: styleString,
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
        />
      )}
    </>
  );
}

export default App;
