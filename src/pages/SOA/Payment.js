import { thousandSep } from "../../Utils/public";
import style from "./Payment.module.scss";

export default function Payment({ data }) {
  return (
    <>
      <div className={style.main}>
        <div className={style.data}>
          Receipt Id: <b>{data.IdReceipt}</b>
        </div>
        <div className={style.data}>
          Receipt Date: <b>{data.ReceiptDate}</b>
        </div>
        <div className={style.data}>
          Amount: <b>{thousandSep(data.Amount)}</b>
        </div>
        <div className={style.data}>
          Rate: <b>{thousandSep(data.Rate.toFixed(4))}</b>
        </div>
        <div className={style.data}>
          USD Amount: <b>{thousandSep((data.Amount * data.Rate).toFixed(2))}</b>
        </div>
      </div>
    </>
  );
}
