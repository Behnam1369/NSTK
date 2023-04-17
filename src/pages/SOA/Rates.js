import { IoCloseOutline } from "react-icons/io5";
import style from "./Rates.module.scss";

export default function Rates({
  data,
  onClose,
  PlusMinusAmount,
  PlusMinusPercent,
}) {
  console.log("date: ", data);
  return (
    <div className={style.main}>
      <div className={style.modal}>
        <div className={style.header}>
          <h2>Rates</h2>
          <IoCloseOutline onClick={() => onClose()} />
        </div>
        <div className={style.body}>
          <div>
            <div className={style.heading}>Date</div>
            <div className={style.heading}>Magazine</div>
            <div className={style.heading}>Rate</div>
          </div>
          {data.map((el) => (
            <div key={el.Date + el.Magazine}>
              <div>{el.Date}</div>
              <div>{el.Magazine}</div>
              <div>{el.Amount}</div>
            </div>
          ))}
          <div className={style.average}>
            <div>Average</div>
            <div>
              {(
                data.reduce((prev, next) => prev + next.Amount, 0) / data.length
              ).toFixed(2)}
            </div>
          </div>
          <div className={style.alpha}>
            <div>Alpha</div>
            <div>
              {PlusMinusPercent && PlusMinusPercent + "%"}
              {PlusMinusPercent && PlusMinusAmount && "+"}
              {PlusMinusAmount && PlusMinusAmount}
            </div>
          </div>
          <div className={style.finalRate}>
            <div>Final Effective Rate</div>
            <div>
              {(
                (data.reduce((prev, next) => prev + next.Amount, 0) /
                  data.length) *
                  ((100 + PlusMinusPercent) / 100) +
                PlusMinusAmount
              ).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
