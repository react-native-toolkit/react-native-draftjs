import React from "react";
import PropTypes from "prop-types";
import ControllerButton from "./Components/ControllerButton";

const EditorController = ({ handleKeyCommand = () => null }) => {
  return (
    <div>
      <ControllerButton />
    </div>
  );
};

EditorController.propTypes = {
  handleKeyCommand: PropTypes.func.isRequired
};

export default EditorController;
