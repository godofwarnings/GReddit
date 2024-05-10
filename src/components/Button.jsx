const Button = ({ children, iconClass, type, isDisabled }) => {
  return (
    <button type={type} disabled={isDisabled} className={iconClass}>
      {children}
    </button>

  );
};

Button.defaultProps = {
  type: "button",
  isDisabled: false,
};

export default Button;
