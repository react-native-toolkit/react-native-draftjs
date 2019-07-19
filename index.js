import React from "react";
import WebView from "react-native-webview";

const draftJsHtml = require("./draftjs-html-source/index.html");

const RNDraftView = () => {
  return <WebView style={{ flex: 1 }} source={draftJsHtml} />;
};

export default RNDraftView;
