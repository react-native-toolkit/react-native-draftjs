/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import RNDraftView from 'react-native-draftjs-editor';

export interface ControlButtonProps {
  text: string;
  action: () => unknown;
  isActive: boolean;
}

export interface EditorToolBar {
  activeStyles: string[];
  blockType: string;
  toggleStyle: (style: string) => unknown;
  toggleBlockType: (block: string) => unknown;
}

const ControlButton = ({ text, action, isActive }: ControlButtonProps) => {
  const backgroundColor = { backgroundColor: 'gold' };

  return (
    <TouchableOpacity
      style={[styles.controlButtonContainer, isActive ? backgroundColor : {}]}
      onPress={action}
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

const EditorToolBar = ({
  activeStyles,
  blockType,
  toggleStyle,
  toggleBlockType,
}: EditorToolBar) => {
  return (
    <View style={styles.toolbarContainer}>
      <ControlButton
        text={'B'}
        isActive={activeStyles.includes('BOLD')}
        action={() => toggleStyle('BOLD')}
      />
      <ControlButton
        text={'I'}
        isActive={activeStyles.includes('ITALIC')}
        action={() => toggleStyle('ITALIC')}
      />
      <ControlButton
        text={'H'}
        isActive={blockType === 'header-one'}
        action={() => toggleBlockType('header-one')}
      />
      <ControlButton
        text={'ul'}
        isActive={blockType === 'unordered-list-item'}
        action={() => toggleBlockType('unordered-list-item')}
      />
      <ControlButton
        text={'ol'}
        isActive={blockType === 'ordered-list-item'}
        action={() => toggleBlockType('ordered-list-item')}
      />
      <ControlButton
        text={'--'}
        isActive={activeStyles.includes('STRIKETHROUGH')}
        action={() => toggleStyle('STRIKETHROUGH')}
      />
    </View>
  );
};

const styleMap = {
  STRIKETHROUGH: {
    textDecoration: 'line-through',
  },
};

const App = () => {
  const _draftRef = React.createRef<RNDraftView>();
  const [activeStyles, setActiveStyles] = useState<string[]>([]);
  const [blockType, setActiveBlockType] = useState('unstyled');
  const [editorState, setEditorState] = useState('');

  const defaultValue =
    '<h1>A Full fledged Text Editor</h1><p>This editor is built with Draft.js. Hence should be suitable for most projects. However, Draft.js Isn’t fully compatible with mobile yet. So you might face some issues.</p><p><br></p><p>This is a simple implementation</p><ul>  <li>It contains <strong>Text formatting </strong>and <em>Some blocks formatting</em></li>  <li>Each for it’s own purpose</li></ul><p>You can also do</p><ol>  <li>Custom style map</li>  <li>Own css styles</li>  <li>Custom block styling</li></ol><p>You are welcome to try it!</p>';

  const editorLoaded = () => {
    _draftRef.current?.focus();
  };

  const toggleStyle = (style: string) => {
    _draftRef.current?.setStyle(style);
  };

  const toggleBlockType = (setBlockType: string) => {
    _draftRef.current?.setBlockType(setBlockType);
  };

  const updateActiveStyle = (styles: string[]) => {
    setActiveStyles(styles);
  };

  useEffect(() => {
    /**
     * Get the current editor state in HTML.
     * Usually keep it in the submit or next action to get output after user has typed.
     */
    setEditorState(_draftRef.current ? _draftRef.current.getEditorState() : '');
  }, [_draftRef]);

  console.log(editorState);

  return (
    <SafeAreaView style={styles.containerStyle}>
      <RNDraftView
        defaultValue={defaultValue}
        onEditorReady={editorLoaded}
        placeholder={'Add text here...'}
        ref={_draftRef}
        onStyleChanged={updateActiveStyle}
        onBlockTypeChanged={setActiveBlockType}
        styleMap={styleMap}
      />
      <EditorToolBar
        activeStyles={activeStyles}
        blockType={blockType}
        toggleStyle={toggleStyle}
        toggleBlockType={toggleBlockType}
      />
      {Platform.OS === 'ios' ? <KeyboardSpacer /> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    marginTop: 36,
  },
  toolbarContainer: {
    height: 56,
    flexDirection: 'row',
    backgroundColor: 'silver',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  controlButtonContainer: {
    padding: 8,
    borderRadius: 2,
  },
});

export default App;
