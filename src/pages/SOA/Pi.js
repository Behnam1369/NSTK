import style from "./Pi.module.scss";
import KPI from "./KPI";
import { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import Bl from "./Bl";
import { thousandSep } from "../../Utils/public";
import Payment from "./Payment";

export default function Pi({ data }) {
  const [page, setPage] = useState("home");

  const totalCi = JSON.parse(data.Bls)
    ? JSON.parse(data.Bls).reduce(
        (total, num) => parseFloat(total) + parseFloat(num.Qty * num.FinalRate),
        0
      )
    : 0;

  const totalPaid = JSON.parse(data.Payments)
    ? JSON.parse(data.Payments).reduce(
        (total, num) => parseFloat(total) + parseFloat(num.Amount * num.Rate),
        0
      )
    : 0;

  useEffect(() => {
    setPage("home");
  }, [data.IdPi]);

  return (
    <div className={style.main}>
      {page == "home" && (
        <>
          <div className={style.info}>
            <h2>PI Date: {data.PiDate}</h2>
            <h2>Currency: {data.Abr}</h2>
            <h2>Delivery Term: {data.DeliveryTerm}</h2>
          </div>
          <KPI
            title="Total Amount of Invoices"
            value={totalCi}
            percentage={totalCi / Math.max(totalCi, totalPaid)}
            color="#d6fb41"
            onClick={() => setPage("invoices")}
          />
          <KPI
            title="Total Paid Amount"
            value={totalPaid}
            percentage={totalPaid / Math.max(totalCi, totalPaid)}
            color="#e3ff73"
            onClick={() => setPage("payments")}
          />
          <KPI
            title="Balance"
            value={totalCi - totalPaid}
            percentage={
              Math.abs(totalCi - totalPaid) / Math.max(totalCi, totalPaid)
            }
            color="#f1ffb9"
            onClick={() => {}}
          />
        </>
      )}
      {page == "invoices" && (
        <>
          <h2 className={style.pageTitle}>
            <IoChevronBackOutline onClick={() => setPage("home")} /> Invoices
          </h2>
          {JSON.parse(data.Bls) &&
            JSON.parse(data.Bls).map((el) => <Bl key={el.IdBl} data={el} />)}
          <div className={style.footerBl}>
            <div>Total</div>
            <div>
              {JSON.parse(data.Bls) &&
                thousandSep(
                  JSON.parse(data.Bls).reduce(
                    (prev, next) => prev + next.Qty,
                    0
                  )
                )}
            </div>
            <div></div>
            <div>
              {JSON.parse(data.Bls) &&
                thousandSep(
                  JSON.parse(data.Bls).reduce(
                    (prev, next) =>
                      prev + Math.round(next.Qty * next.FinalRate * 100) / 100,
                    0
                  )
                )}
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </>
      )}

      {page == "payments" && (
        <>
          <h2 className={style.pageTitle}>
            <IoChevronBackOutline onClick={() => setPage("home")} /> Payments
          </h2>
          {JSON.parse(data.Payments) &&
            JSON.parse(data.Payments).map((el) => (
              <Payment key={el.IdReceipt} data={el} />
            ))}
          <div className={style.footerPayment}>
            <div>Total</div>
            <div>
              {JSON.parse(data.Payments) &&
                thousandSep(
                  JSON.parse(data.Payments).reduce(
                    (prev, next) => prev + next.Amount * next.Rate,
                    0
                  )
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
