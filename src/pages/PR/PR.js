import { useEffect, useState } from "react";
import Datepicker from "../../components/Datepicker";
import FormContainer from "../../components/FormContainer";
import AmountInput from "../../components/AmountInput";
import { host } from "../../Utils/host";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import Selector from "../../components/Selector";
import style from "./PR.module.scss";
import { thousandSep, shamsiDate } from "../../Utils/public";
import {
  IoSaveOutline,
  IoTrashOutline,
  IoPrintOutline,
  IoAttachOutline,
} from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Message from "../../components/Message";

const headLetterTypes = [
  { id: 1, title: "SPII" },
  { id: 2, title: "نوید ستاره تجارت کیش" },
];

const paymentTypes = [
  { id: 1, title: "نقدی" },
  { id: 2, title: "حواله بانکی" },
  { id: 3, title: "چک" },
];

const prTypes = [
  { id: 1, title: "تنخواه" },
  { id: 2, title: "حقوق" },
  { id: 3, title: "خرید کالا" },
  { id: 4, title: "خرید خدمات" },
  { id: 5, title: "قرارداد/پیمانکار" },
  { id: 6, title: "تسویه بدهی" },
  { id: 7, title: "سایر" },
];

const pettyCashPaymentTypes = [
  { id: 1, title: "افتتاح تنخواه" },
  { id: 2, title: "ترمیم تنخواه" },
];

const payrollPaymentTypes = [
  { id: 1, title: "علی الحساب" },
  { id: 2, title: "تسویه حقوق ماه " },
];

const purchaseGoodPaymentTypes = [
  { id: 1, title: "پیش پرداخت" },
  { id: 2, title: "تسویه" },
];

const purchaseServicePaymentTypes = [
  { id: 1, title: "پیش پرداخت" },
  { id: 2, title: "تسویه" },
];

const contractPaymentTypes = [
  { id: 1, title: "پیش پرداخت" },
  { id: 2, title: "علی الحساب" },
  { id: 3, title: "صورت وضعیت" },
  { id: 4, title: "تسویه" },
];

export default function PR() {
  const { iduser, idpr } = useParams();
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");
  const defaultState = {
    IdPr: null,
    No: null,
    PrNo: null,
    PrDate: null,
    PrDateShamsi: null,
    IdHeadLetter: null,
    HeadLetter: null,
    IdDept: null,
    Dept: null,
    Amount: null,
    IdCur: null,
    Abr: null,
    Rate: null,
    RevertRate: null,
    AmountIRR: null,
    Payee: "",
    IdPaymentType: null,
    PaymentType: null,
    DestinationAccount: null,
    IdPrType: null,
    PrType: null,
    IdPettyCashPaymentType: null,
    PettyCashPaymentType: null,
    PettyCashNo: null,
    IdPayrollPaymentType: null,
    PayrollPaymentType: null,
    PayrollMonth: null,
    IdPurchaseGoodPaymentType: null,
    PurchaseGoodPaymentType: null,
    GoodTitle: null,
    IdPurchaseServicePaymentType: null,
    PurchaseServicePaymentType: null,
    ServiceTitle: null,
    IdContractPaymentType: null,
    ContractPaymentType: null,
    ContractNo: null,
    ContractDate: null,
    IdCreditorType: null,
    CreditorType: null,
    CreditorTitle: null,
    Other: null,
    Guarantee: null,
    Note: null,
    IdPrOut: null,
    Paid: null,
    Remained: null,
    State: null,
  };

  const [data, setData] = useState(defaultState);
  const [curArr, setCurArr] = useState([]);
  const setDate = (name, val) => {
    setData({ ...data, [name]: val, [name + "Shamsi"]: shamsiDate(val) });
  };
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [messageText, setMessageText] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (idpr) {
        await axios.get(`${host}/users/${iduser}/pr/${idpr}`).then((res) => {
          setCurArr(res.data.data.curArr);
          setData(res.data.data.vch);
          console.log(res.data.data.vch.Rate);
          window.parent.postMessage({ title: "loaded", tabno }, "*");
        });
      } else {
        await axios.get(`${host}/users/${iduser}/pr/new`).then((res) => {
          setCurArr(res.data.data.curArr);
          setData({
            ...data,
            IdDept: res.data.data.idDept,
            Dept: res.data.data.dept,
          });
          window.parent.postMessage({ title: "loaded", tabno }, "*");
        });
      }
    };

    loadData();
  }, []);

  const handleCurChange = (idcur) => {
    const cur = curArr.find((cur) => cur.IdCur === idcur);
    if (cur) setData({ ...data, IdCur: idcur, Abr: cur.Abr });
  };

  const handleAmountChange = (val) => {
    setData({ ...data, Amount: val });
  };

  const handleRateChange = (val) => {
    if (val === "") {
      setData({ ...data, Rate: null, RevertRate: null });
    } else if (val == 0) {
      setData({
        ...data,
        Rate: val,
        RevertRate: 0,
      });
    } else {
      setData({
        ...data,
        Rate: val,
        RevertRate: parseFloat(1 / val).toFixed(10),
      });
    }
  };

  const handleRevertRateChange = (val) => {
    if (val === "") {
      setData({ ...data, Rate: null, RevertRate: null });
    } else if (val == 0) {
      setData({
        ...data,
        Rate: 0,
        RevertRate: val,
      });
    } else {
      setData({
        ...data,
        Rate: parseFloat(1 / val).toFixed(10),
        RevertRate: val,
      });
    }
  };

  const handleUpdate = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handlePaymentTypeUpdate = (e) => {
    setData({
      ...data,
      IdPaymentType: e.target.value,
      PaymentType: paymentTypes.find(
        (type) => type.id.toString() === e.target.value
      ).title,
    });
  };

  const handleHeadLetterTypeUpdate = (e) => {
    setData({
      ...data,
      IdHeadLetter: e.target.value,
      HeadLetter: headLetterTypes.find(
        (type) => type.id.toString() === e.target.value
      ).title,
    });
  };

  const handlePrTypeUpdate = (e) => {
    setData({
      ...data,
      IdPrType: e.target.value,
      PrType: prTypes.find((type) => type.id.toString() === e.target.value)
        .title,
    });
  };

  const handlePettyCashPaymentTypeUpdate = (e) => {
    setData({
      ...data,
      IdPettyCashPaymentType: e.target.value,
      PettyCashPaymentType: pettyCashPaymentTypes.find(
        (type) => type.id.toString() === e.target.value
      ).title,
    });
  };

  const handlePayrollPaymentTypeUpdate = (e) => {
    setData({
      ...data,
      IdPayrollPaymentType: e.target.value,
      PayrollPaymentType: payrollPaymentTypes.find(
        (type) => type.id.toString() === e.target.value
      ).title,
    });
  };

  const handlePurchaseGoodPaymentTypeUpdate = (e) => {
    setData({
      ...data,
      IdPurchaseGoodPaymentType: e.target.value,
      PurchaseGoodPaymentType: purchaseGoodPaymentTypes.find(
        (type) => type.id.toString() === e.target.value
      ).title,
    });
  };

  const handlePurchaseServicePaymentTypeUpdate = (e) => {
    setData({
      ...data,
      IdPurchaseServicePaymentType: e.target.value,
      PurchaseServicePaymentType: purchaseServicePaymentTypes.find(
        (type) => type.id.toString() === e.target.value
      ).title,
    });
  };

  const handleContractPaymentTypeUpdate = (e) => {
    setData({
      ...data,
      IdContractPaymentType: e.target.value,
      ContractPaymentType: contractPaymentTypes.find(
        (type) => type.id.toString() === e.target.value
      ).title,
    });
  };

  useEffect(() => {
    if (data.IdPrType != 1) {
      setData({
        ...data,
        IdPettyCashPaymentType: null,
        PettyCashPaymentType: null,
        PettyCashNo: null,
      });
    }
    if (data.IdPrType !== 2) {
      setData({
        ...data,
        IdPayrollPaymentType: null,
        PayrollPaymentType: null,
        PayrollMonth: null,
      });
    }
    if (data.IdPrType !== 3) {
      setData({
        ...data,
        IdPurchaseGoodPaymentType: null,
        PurchaseGoodPaymentType: null,
        GoodTitle: null,
      });
    }
    if (data.IdPrType !== 4) {
      setData({
        ...data,
        IdPurchaseServicePaymentType: null,
        PurchaseServicePaymentType: null,
        ServiceTitle: null,
      });
    }
    if (data.IdPrType !== 5) {
      setData({
        ...data,
        IdContractPaymentType: null,
        ContractPaymentType: null,
        ContractNo: null,
        ContractDate: null,
      });
    }
    if (data.IdPrType !== 7) {
      setData({
        ...data,
        Other: null,
      });
    }
  }, [data.IdPrType]);

  useEffect(() => {
    if (
      (data.IdHeadLetter == 2 && data.IdCur == 99) ||
      (data.IdHeadLetter == 1 && data.IdCur == 1)
    ) {
      setData({
        ...data,
        Rate: 1,
        RevertRate: 1,
      });
    }
  }, [data.IdCur, data.IdHeadLetter]);

  useEffect(() => {
    if (data.Amount && data.Rate) {
      setData({
        ...data,
        AmountIRR: parseFloat(data.Amount * data.Rate),
      });
    } else {
      setData({
        ...data,
        AmountIRR: null,
      });
    }
  }, [data.Rate, data.Amount]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await axios
      .post(`${host}/pr`, data)
      .then((res) => {
        setSaving(false);
        setMessageText("اطلاعات با موفقیت ثبت شد");
        setData(res.data.data);
      })
      .catch((err) => {
        setSaving(false);
        setMessageText("خطا در ثبت اطلاعات");
      });
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    setCancelling(true);
    await axios
      .patch(`${host}/users/${iduser}/pr/${idpr}/cancel`, data)
      .then((res) => {
        setCancelling(false);
        setMessageText("سند با موفقیت ابطال شد");
        setData(res.data.data);
      })
      .catch((err) => {
        setCancelling(false);
        setMessageText("خطا در انجام درخواست");
      });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleting(true);
    await axios
      .patch(`${host}/users/${iduser}/pr/${idpr}/delete`, data)
      .then((res) => {
        setDeleting(false);
        setMessageText("سند با موفقیت حذف شد");
        setData({ ...defaultState, IdDept: data.IdDept, Dept: data.Dept });
      })
      .catch((err) => {
        setDeleting(false);
        setMessageText("خطا در انجام درخواست");
      });
  };
  const handlePrint = (e) => {
    e.preventDefault();
    if (idpr) {
      window.parent.postMessage(
        {
          title: "print",
          endpoint: "PrintPr",
          args: { idpr, prno: data.PrNo },
          tabTitle: `چاپ درخواست پرداخت ${data.PrNo}`,
          tabno,
        },
        "*"
      );
    } else {
      setMessageText("ابتدا سند را ذخیره کنید");
    }
  };

  const handleAttachment = (e) => {
    e.preventDefault();
    if (idpr) {
      window.parent.postMessage(
        {
          title: "attachment",
          args: { idform: 145, idvch: data.IdPr },
          tabTitle: `پیوست های درخواست پرداخت ${data.PrNo}`,
          tabno,
        },
        "*"
      );
    } else {
      setMessageText("ابتدا سند را ذخیره کنید");
    }
  };

  return (
    <div>
      <div className={`${style.operationButtons}`} dir="rtl">
        <button
          className={`${style.operationButton}`}
          onClick={(e) => handleAttachment(e)}
        >
          <IoAttachOutline />
          <span>پیوست</span>
        </button>
        <button
          className={`${style.operationButton}`}
          disabled={saving}
          onClick={(e) => handleSave(e)}
        >
          <IoSaveOutline />
          <span>{saving ? "درحال ذخیره" : "ذخیره"}</span>
        </button>
        <button
          className={`${style.operationButton}`}
          disabled={cancelling}
          onClick={(e) => handleCancel(e)}
        >
          <IoIosCloseCircleOutline />
          <span>{cancelling ? "درحال ابطال" : "ابطال"}</span>
        </button>
        <button
          className={`${style.operationButton}`}
          disabled={deleting}
          onClick={(e) => handleDelete(e)}
        >
          <IoTrashOutline />
          <span>{deleting ? "درحال خذف" : "حذف"}</span>
        </button>
        <button
          className={`${style.operationButton}`}
          onClick={(e) => handlePrint(e)}
        >
          <IoPrintOutline />
          <span>چاپ</span>
        </button>
      </div>
      <FormContainer dir="rtl">
        <h1>درخواست پرداخت</h1>
        {data.State == 1 && <h2 className={style.cancelled}>ابطال شده</h2>}
        <label>سریال</label>
        <span>{data.IdPr}</span>
        <label>شماره درخواست</label>
        <span>{data.PrNo}</span>
        <label>واحد متقاضی</label>
        <span>{data.Dept}</span>
        <label>تاریخ درخواست</label>
        <Datepicker
          value={data.PrDate}
          onChange={(val) => setDate("PrDate", val)}
          dir="rtl"
          name="pr_prdate"
        />
        <label>چاپ در سربرگ</label>
        <div>
          {headLetterTypes.map((type) => {
            return (
              <div key={type.id}>
                <label>
                  <input
                    type="radio"
                    name="headLetterType"
                    value={type.id}
                    onChange={(e) => handleHeadLetterTypeUpdate(e)}
                    checked={data.IdHeadLetter == type.id}
                  />
                  {type.title}
                </label>
              </div>
            );
          })}
        </div>
        <label>مبلغ</label>
        <AmountInput
          width="135px"
          value={data.Amount}
          onChange={(val) => handleAmountChange(val)}
        />
        <label>ارز</label>
        <Selector
          data={curArr}
          id="IdCur"
          title="Abr"
          width={135}
          selectionChanged={(idcur) => handleCurChange(idcur)}
          dir="rtl"
          value={data.IdCur}
          fontFamily={"IranSansLight"}
        />
        {((data.IdCur && data.IdHeadLetter == 2 && data.IdCur !== 99) ||
          (data.IdCur && data.IdHeadLetter == 1 && data.IdCur !== 1)) && (
          <>
            <label>نرخ ارز</label>
            <div className={style.rateContainer}>
              <span>
                <span>
                  {curArr.find((cur) => cur.IdCur === data.IdCur).Title} به ریال
                </span>
                <AmountInput
                  width="135px"
                  value={data.Rate ? data.Rate : ""}
                  onChange={(val) => handleRateChange(val)}
                />
              </span>
              <span>
                <span>
                  ریال به {curArr.find((cur) => cur.IdCur === data.IdCur).Title}
                </span>
                <AmountInput
                  width="135px"
                  value={data.RevertRate ? data.RevertRate : ""}
                  onChange={(val) => handleRevertRateChange(val)}
                />
              </span>
            </div>
            <label>مبلغ به ریال</label>
            <span>{thousandSep((data.Amount * data.Rate).toFixed(0))}</span>
          </>
        )}
        <label>پرداخت در وجه</label>
        <input
          type="text"
          className={style.txt}
          name="Payee"
          value={data.Payee}
          onChange={(e) => handleUpdate(e)}
          autoComplete="off"
          style={{ maxWidth: "280px" }}
        />
        <label>نحوه پرداخت</label>
        <div>
          {paymentTypes.map((type) => {
            return (
              <div key={type.id}>
                <label>
                  <input
                    type="radio"
                    name="paymentType"
                    value={type.id}
                    onChange={(e) => handlePaymentTypeUpdate(e)}
                    checked={data.IdPaymentType == type.id}
                  />
                  {type.title}
                </label>
              </div>
            );
          })}
        </div>
        {data.IdPaymentType == 2 && (
          <>
            <label>شماره حساب / شبا</label>
            <input
              type="text"
              className={style.txt}
              name="DestinationAccount"
              value={data.DestinationAccount}
              onChange={(e) => handleUpdate(e)}
              autoComplete="off"
              style={{ maxWidth: "280px" }}
              dir="ltr"
            />
          </>
        )}
        <label>بابت</label>
        <div>
          {prTypes.map((type) => {
            return (
              <div key={type.id}>
                <label>
                  <input
                    type="radio"
                    name="prType"
                    value={type.id}
                    onChange={(e) => handlePrTypeUpdate(e)}
                    checked={data.IdPrType == type.id}
                  />
                  {type.title}
                </label>
              </div>
            );
          })}
        </div>
        {data.IdPrType == 1 && (
          <>
            <label></label>
            <div>
              {pettyCashPaymentTypes.map((type) => {
                return (
                  <div key={type.id}>
                    <label>
                      <input
                        type="radio"
                        name="pettyCashPaymentType"
                        value={type.id}
                        onChange={(e) => handlePettyCashPaymentTypeUpdate(e)}
                        checked={data.IdPettyCashPaymentType == type.id}
                      />
                      {type.title}
                    </label>
                    {data.IdPettyCashPaymentType == 2 && type.id === 2 && (
                      <>
                        <label> شماره </label>
                        <input
                          type="number"
                          className={style.txt}
                          value={data.PettyCashNo}
                          style={{ width: "50px" }}
                          onChange={(e) => handleUpdate(e)}
                          name="PettyCashNo"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
        {data.IdPrType == 2 && (
          <>
            <label></label>
            <div>
              {payrollPaymentTypes.map((type) => {
                return (
                  <div key={type.id}>
                    <label>
                      <input
                        type="radio"
                        name="payrollPaymentType"
                        value={type.id}
                        onChange={(e) => handlePayrollPaymentTypeUpdate(e)}
                      />
                      {type.title}
                    </label>
                    {data.IdPayrollPaymentType == 2 && type.id == 2 && (
                      <input
                        type="text"
                        className={style.txt}
                        style={{ width: "80px" }}
                        value={data.PayrollMonth}
                        onChange={(e) => handleUpdate(e)}
                        name="PayrollMonth"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
        {data.IdPrType == 3 && (
          <>
            <label>عنوان کالا</label>
            <input
              type="text"
              className={style.txt}
              value={data.GoodTitle}
              style={{ width: "280px" }}
              name="GoodTitle"
              onChange={(e) => handleUpdate(e)}
            />
            <label></label>
            <div>
              {purchaseGoodPaymentTypes.map((type) => {
                return (
                  <div key={type.id}>
                    <label>
                      <input
                        type="radio"
                        name="purchaseGoodPaymentType"
                        value={type.id}
                        onChange={(e) => handlePurchaseGoodPaymentTypeUpdate(e)}
                        checked={data.IdPurchaseGoodPaymentType == type.id}
                      />
                      {type.title}
                    </label>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {data.IdPrType == 4 && (
          <>
            <label>عنوان خدمات</label>
            <input
              type="text"
              className={style.txt}
              value={data.ServiceTitle}
              style={{ width: "280px" }}
              name="ServiceTitle"
              onChange={(e) => handleUpdate(e)}
            />
            <label></label>
            <div>
              {purchaseServicePaymentTypes.map((type) => {
                return (
                  <div key={type.id}>
                    <label>
                      <input
                        type="radio"
                        name="purchaseServicePaymentType"
                        value={type.id}
                        onChange={(e) =>
                          handlePurchaseServicePaymentTypeUpdate(e)
                        }
                        checked={data.IdPurchaseServicePaymentType == type.id}
                      />
                      {type.title}
                    </label>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {data.IdPrType == 5 && (
          <>
            <label>شماره قرارداد</label>
            <input
              type="text"
              className={style.txt}
              value={data.ContractNo}
              style={{ width: "150px" }}
              name="ContractNo"
              onChange={(e) => handleUpdate(e)}
            />
            <label>تاریخ قرارداد</label>
            <Datepicker
              value={data.ContractDate}
              onChange={(val) => setDate("ContractDate", val)}
              dir="rtl"
              name="pr_contractdate"
            />
            <label></label>
            <div>
              {contractPaymentTypes.map((type) => {
                return (
                  <div key={type.id}>
                    <label>
                      <input
                        type="radio"
                        name="contractPaymentType"
                        value={type.id}
                        onChange={(e) => handleContractPaymentTypeUpdate(e)}
                        checked={data.IdContractPaymentType == type.id}
                      />
                      {type.title}
                    </label>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {data.IdPrType == 7 && (
          <>
            <label></label>
            <input
              type="text"
              className={style.txt}
              value={data.Other}
              style={{ width: "280px" }}
              name="Other"
              onChange={(e) => handleUpdate(e)}
            />
          </>
        )}
        <label>مبلغ و شرایط ضمانت</label>
        <input
          type="text"
          className={style.txt}
          value={data.Guarantee || ""}
          style={{ width: "100%" }}
          name="Guarantee"
          onChange={(e) => handleUpdate(e)}
        />
        <label>توضیحات</label>
        <textarea
          type="text"
          className={style.txt}
          value={data.Note || ""}
          style={{ width: "100%", height: "100px" }}
          name="Note"
          onChange={(e) => handleUpdate(e)}
        ></textarea>
      </FormContainer>
      {messageText && (
        <Message
          text={messageText}
          setShow={(result) => {
            setMessageText(result);
          }}
        />
      )}
    </div>
  );
}
