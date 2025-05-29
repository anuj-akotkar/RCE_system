import PropTypes from "prop-types";

export default function IconBtn({
  text,
  onClick,
  children,
  disabled,
  outline = false,
  customClasses = "",
  type = "button",
  ariaLabel,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center ${
        outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customClasses}`}
      type={type}
      aria-label={ariaLabel || text}
    >
      {children ? (
        <>
          <span className={outline ? "text-yellow-50" : ""}>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
}

IconBtn.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  outline: PropTypes.bool,
  customClasses: PropTypes.string,
  type: PropTypes.string,
  ariaLabel: PropTypes.string,
};