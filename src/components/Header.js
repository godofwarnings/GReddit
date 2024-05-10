import PropTypes from "prop-types";
import Button from "./Button";

const Header = ({ title, displayText, classes }) => {
  return (
    <div>
      <header className="text-4xl font-bold">
        <h1>{title}</h1>
      </header>
      <p className="mt-10 login_register_prompt">{displayText}</p>
    </div>
  );
};

Header.defaultProps = {
  title: "Login/Register",
};

Header.propTypes = {
  title: PropTypes.string,
};

export default Header;
