import PropTypes from 'prop-types'

function Button({ children, version, type, isDisabled }) {
  return (
    <button type={type} disabled={isDisabled} className={`btn btn-${versionz}`}>
      {children}
    </button>
  );
}

Button.defaultProps = {
    version: 'primary',
    type: 'button',
    isDisabled: false,
};

export default Button;
