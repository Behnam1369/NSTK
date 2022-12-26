import { useState } from "react";
import style from "./AmountInput.module.scss";
import proptypes from "prop-types";
import { thousandSep, toNumber } from "../Utils/public";

export default function AmountInput(props) {
  const { width, value, onChange } = props;

  const handleChange = (num) => {
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
        style={{ width: width }}
        onChange={(e) => handleChange(e.target.value)}
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
