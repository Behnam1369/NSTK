import style from "./AmountInput.module.scss";
import proptypes from "prop-types";
import { thousandSep, toNumber } from "../Utils/public";

export default function AmountInput(props) {
  const { width, value, onChange, max, min, disabled } = props;

  const handleChange = (num) => {
    if (
      parseFloat(num.replace(/,/g, "")) > parseFloat(max) ||
      parseFloat(num.replace(/,/g, "")) < parseFloat(min)
    )
      return;
    onChange(toNumber(num));
  };

  return (
    <div>
      <input
        type="text"
        className={style.txt}
        value={thousandSep(value)}
        // onInput={handleChange}
        dir="ltr"
        style={{ width: width, ...props.style }}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}

AmountInput.defaultProps = {
  width: "100px",
};

AmountInput.propTypes = {
  width: proptypes.string,
};
