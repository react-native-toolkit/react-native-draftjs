import React from "react";
import PropTypes from "prop-types";

const ControllerButton = ({ isActive, label, onToggle, style }) => {
  const onClick = e => {
    e.preventDefault();
    onToggle(style);
  };

  return (
    <span
      style={{
        backgroundColor: isActive ? "silver" : "white",
        margin: "4px 8px",
        borderRadius: 2,
        border: "1px solid black",
        padding: "4px 8px"
      }}
      onMouseDown={onClick}
    >
      {label}
    </span>
  );
};

ControllerButton.propTypes = {
  isActive: PropTypes.bool,
  label: PropTypes.string,
  onToggle: PropTypes.func,
  style: PropTypes.string
};

export default ControllerButton;
