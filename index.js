var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
import React, { Component } from "react";
import { Platform } from "react-native";
import WebView from "react-native-webview";
var draftJsHtml = require("./draftjs-html-source/draftjs-source.html");
var RNDraftView = (function(_super) {
  __extends(RNDraftView, _super);
  function RNDraftView() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.webViewRef = React.createRef();
    _this.state = {
      editorState: ""
    };
    _this.executeScript = function(functionName, parameter) {
      if (_this.webViewRef.current) {
        _this.webViewRef.current.injectJavaScript(
          "window." +
            functionName +
            "(" +
            (parameter ? "'" + parameter + "'" : "") +
            ");true;"
        );
      }
    };
    _this.onMessage = function(event) {
      var _a = _this.props,
        onStyleChanged = _a.onStyleChanged,
        onBlockTypeChanged = _a.onBlockTypeChanged;
      var data = event.nativeEvent.data;
      var _b = JSON.parse(data),
        blockType = _b.blockType,
        styles = _b.styles,
        editorState = _b.editorState,
        isMounted = _b.isMounted;
      if (onStyleChanged) {
        onStyleChanged(styles ? styles.split(",") : []);
      }
      if (blockType) {
        onBlockTypeChanged(blockType);
      }
      if (editorState) {
        _this.setState({
          editorState: editorState.replace(/(\r\n|\n|\r)/gm, "")
        });
      }
      if (isMounted) {
        _this.widgetMounted();
      }
    };
    _this.widgetMounted = function() {
      var _a = _this.props,
        placeholder = _a.placeholder,
        defaultValue = _a.defaultValue,
        styleSheet = _a.styleSheet,
        styleMap = _a.styleMap,
        blockRenderMap = _a.blockRenderMap,
        _b = _a.onEditorReady,
        onEditorReady =
          _b === void 0
            ? function() {
                return null;
              }
            : _b;
      if (defaultValue) {
        _this.executeScript("setDefaultValue", defaultValue);
      }
      if (placeholder) {
        _this.executeScript("setEditorPlaceholder", placeholder);
      }
      if (styleSheet) {
        _this.executeScript("setEditorStyleSheet", styleSheet);
      }
      if (styleMap) {
        try {
          _this.executeScript("setEditorStyleMap", JSON.stringify(styleMap));
        } catch (e) {
          console.error(e);
        }
      }
      if (blockRenderMap) {
        try {
          _this.executeScript(
            "setEditorBlockRenderMap",
            JSON.stringify(blockRenderMap)
          );
        } catch (e) {
          console.error(e);
        }
      }
      onEditorReady();
    };
    _this.focus = function() {
      _this.executeScript("focusTextEditor");
    };
    _this.blur = function() {
      _this.executeScript("blurTextEditor");
    };
    _this.setBlockType = function(blockType) {
      _this.executeScript("toggleBlockType", blockType);
    };
    _this.setStyle = function(style) {
      _this.executeScript("toggleInlineStyle", style);
    };
    _this.getEditorState = function() {
      return _this.state.editorState;
    };
    return _this;
  }
  RNDraftView.prototype.render = function() {
    var _a = this.props.style,
      style = _a === void 0 ? { flex: 1 } : _a;
    return React.createElement(WebView, {
      ref: this.webViewRef,
      style: style,
      source:
        Platform.OS === "ios"
          ? draftJsHtml
          : { uri: "file:///android_asset/draftjs-source.html" },
      keyboardDisplayRequiresUserAction: false,
      originWhitelist: ["*"],
      onMessage: this.onMessage
    });
  };
  return RNDraftView;
})(Component);
export default RNDraftView;
