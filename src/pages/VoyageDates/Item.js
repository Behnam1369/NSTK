import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineMinus,
} from "react-icons/ai";
import style from "./Item.module.scss";

export default function Item({
  title,
  date,
  dateType,
  onIncrement,
  onDecrement,
  onRegister,
  onClear,
}) {
  const handleIncrement = (e) => {
    e.preventDefault();
    onIncrement();
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    onDecrement();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    onRegister();
  };

  const handleClear = (e) => {
    e.preventDefault();
    onClear();
  };

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className={`${style.main} ${date < currentDate && dateType == "Estimated" ? style.passed : '' }`}>
      <div className={`${style.card} ${style[dateType]}`}>
        {dateType == "Estimated" && (
          <button className={style.btnReg} onClick={(e) => handleRegister(e)}>
            <AiOutlineCheck />
          </button>
        )}
        {dateType == "Actual" && (
          <button className={style.btnClear} onClick={(e) => handleClear(e)}>
            <AiOutlineClose />
          </button>
        )}
        <div>
          <div className={style.title}>{title}</div>
          <div
            className={`${style.date} ${
              dateType == "Actual" ? style.actual : style.estimated
            }`}
          >
            {date}
          </div>
        </div>
      </div>
      {dateType == "Estimated" && (
        <div className={style.buttonContainer}>
          <button
            title="Increment Estimation"
            onClick={(e) => handleIncrement(e)}
          >
            <AiOutlinePlus />
          </button>
          <button
            title="Decrement Estimation"
            onClick={(e) => handleDecrement(e)}
          >
            <AiOutlineMinus />
          </button>
        </div>
      )}
    </div>
  );
}
