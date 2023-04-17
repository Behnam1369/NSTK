import { useState } from "react";
import { thousandSep } from "../../Utils/public";
import style from "./Bl.module.scss";
import Rates from "./Rates";

export default function Bl({ data }) {
  const [showRates, setShowRates] = useState(false);

  console.log("data.Rates: ", data.Rates);
  return (
    <>
      <div className={style.main}>
        <div className={style.data}>
          BL No: <b>{data.ABLDate}</b>
        </div>
        <div className={style.data}>
          BL Date: <b>{data.BlNo}</b>
        </div>
        <div className={style.data}>
          Commodity: <b>{data.Commodity}</b>
        </div>
        <div className={style.data}>
          Qty: <b>{thousandSep(data.Qty)}</b>
        </div>
        <div className={style.data} onClick={() => setShowRates(true)}>
          Unit Price: <b>{thousandSep(data.FinalRate)}</b>
        </div>
        <div className={style.data}>
          Amount: <b>{thousandSep((data.Qty * data.FinalRate).toFixed(2))}</b>
        </div>
        <div className={style.data}>
          CI No: <b>{data.CINo}</b>
        </div>
        <div className={style.data}>
          Country: <b>{data.Country}</b>
        </div>
        <div className={style.data}>
          Vessel: <b>{data.Vessel}</b>
        </div>
      </div>
      {showRates && (
        <Rates
          data={data.Rates}
          onClose={() => setShowRates(false)}
          PlusMinusAmount={data.PlusMinusAmount}
          PlusMinusPercent={data.PlusMinusPercent}
        />
      )}
    </>
  );
}
