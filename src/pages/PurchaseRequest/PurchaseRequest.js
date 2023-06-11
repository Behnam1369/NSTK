import { useEffect, useState } from "react";
import Datepicker from "../../components/Datepicker";
import FormContainer from "../../components/FormContainer";
import AmountInput from "../../components/AmountInput";
import { host } from "../../Utils/host";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import style from "./PurchaseRequest.module.scss";
import { thousandSep, shamsiDate } from "../../Utils/public";
import {
  IoSaveOutline,
  IoTrashOutline,
  IoPrintOutline,
  IoAttachOutline,
} from "react-icons/io5";
import {
  IoIosAddCircle,
  IoIosCloseCircleOutline,
  IoIosTrash,
} from "react-icons/io";
import Message from "../../components/Message";
import Selector from "../../components/Selector";
import Timepicker from "../../components/Timepicker";

const headLetterTypes = [
  { id: 1, title: "SPII" },
  { id: 2, title: "نوید ستاره تجارت کیش" },
];

export default function PR() {
  const { iduser, idpurchaserequest } = useParams();
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");
  const defaultState = {
    IdPurchaseRequest: null,
    No: null,
    PurchaseRequestNo: null,
    PurchaseRequestDate: null,
    PurchaseRequestDateShamsi: null,
    IdHeadLetter: null,
    HeadLetter: null,
    IdDept: null,
    Dept: null,
    Amount: null,
    IdCur: null,
    Abr: null,
    Note: null,
    Issuer: null,
    State: null,
    IdTradeSize: null,
    SkipFormalities: false,
    StartTime: "",
    EndTime: "",
  };
  const [data, setData] = useState(defaultState);

  const defaultItems = [
    {
      IdPurchaseRequestItm: new Date().getTime(),
      IdPurchaseRequest: 16,
      Descr: "",
      Unit: "",
      Qty: 0,
      Note: "",
    },
  ];

  const [items, setItems] = useState(defaultItems);
  const [inqueries, setInquiries] = useState([]);

  const [curArr, setCurArr] = useState([]);
  const setDate = (name, val) => {
    setData({ ...data, [name]: val, [name + "Shamsi"]: shamsiDate(val) });
  };
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [messageText, setMessageText] = useState(false);
  const [tradeSizes, setTradeSizes] = useState([]);
  const [idTradeSize, setIdTradeSize] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (idpurchaserequest) {
        await axios
          .get(`${host}/users/${iduser}/purchase_request/${idpurchaserequest}`)
          .then((res) => {
            setCurArr(res.data.data.curArr);
            setData(res.data.data.vch);
            setItems(res.data.data.itms);
            setInquiries(res.data.data.inquiries);
            setTradeSizes(res.data.data.tradeSize);
            window.parent.postMessage({ title: "loaded", tabno }, "*");
          });
      } else {
        await axios
          .get(`${host}/users/${iduser}/purchase_request/new`)
          .then((res) => {
            setCurArr(res.data.data.curArr);
            setData({
              ...data,
              IdDept: res.data.data.idDept,
              Dept: res.data.data.dept,
            });
            setTradeSizes(res.data.data.tradeSize);
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

  const handleUpdate = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!data.PurchaseRequestDate) {
      setMessageText("لطفاً تاریخ را وارد کنید");
      return;
    } else if (!data.IdHeadLetter) {
      setMessageText("لطفاً نوع سربرگ را وارد کنید");
      return;
    } else if (items.length == 0) {
      setMessageText("لطفاً شرح کالا/خدمات را وارد نمایید");
      return;
    } else if (!data.IdDept) {
      setMessageText("واحد سازمانی شما مشخص نمی باشد");
      return;
    }

    setSaving(true);
    await axios
      .post(`${host}/purchase_request`, {
        ...data,
        IdTradeSize: data.IdTradeSize || idTradeSize,
        TradeSize: tradeSizes.find(
          (el) => el.IdTradeSize == (data.IdTradeSize || idTradeSize)
        ).Title,
        purchase_request_itms_attributes: items,
        purchase_request_inquiries_attributes: inqueries,
      })
      .then((res) => {
        setSaving(false);
        setMessageText("اطلاعات با موفقیت ثبت شد");
        setData(res.data.data);
        // console.log(res.data.itms);
        // setItems(res.data.itms);
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
      .patch(
        `${host}/users/${iduser}/purchase_request/${idpurchaserequest}/cancel`,
        data
      )
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
      .patch(
        `${host}/users/${iduser}/purchase_request/${idpurchaserequest}/delete`,
        data
      )
      .then((res) => {
        setDeleting(false);
        setMessageText("سند با موفقیت حذف شد");
        setData({ ...defaultState, IdDept: data.IdDept, Dept: data.Dept });
        setItems(defaultItems);
      })
      .catch((err) => {
        setDeleting(false);
        setMessageText("خطا در انجام درخواست");
      });
  };

  const handlePrint = (e) => {
    e.preventDefault();
    if (data.IdPurchaseRequest) {
      window.parent.postMessage(
        {
          title: "print",
          endpoint: "PrintPurchaseRequest",
          args: {
            idpurchaserequest: data.IdPurchaseRequest,
            PurchaseRequestno: data.PurchaseRequestNo,
          },
          tabTitle: `چاپ درخواست خرید ${data.PurchaseRequestNo}`,
          tabno,
        },
        "*"
      );
    } else {
      setMessageText("ابتدا سند را ذخیره کنید");
    }
  };

  const handlePrint2 = (e) => {
    e.preventDefault();
    if (data.IdPurchaseRequest) {
      window.parent.postMessage(
        {
          title: "print",
          endpoint: "PrintPurchaseRequestCommission",
          args: {
            idpurchaserequest: data.IdPurchaseRequest,
            PurchaseRequestno: data.PurchaseRequestNo,
          },
          tabTitle: `چاپ صورتجلسه کمیسیون معاملات ${data.PurchaseRequestNo}`,
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
    if (idpurchaserequest) {
      window.parent.postMessage(
        {
          title: "attachment",
          args: { idform: 148, idvch: data.IdPurchaseRequest },
          tabTitle: `پیوست های درخواست خرید ${data.PurchaseRequestNo}`,
          tabno,
        },
        "*"
      );
    } else {
      setMessageText("ابتدا سند را ذخیره کنید");
    }
  };

  const handleItemChange = (e, id) => {
    const { name, value } = e.target;
    setItems(
      items.map((item) => {
        if (item.IdPurchaseRequestItm == id) {
          return { ...item, [name]: value };
        }
        return item;
      })
    );
  };

  const handleAdd = () => {
    setItems([
      ...items,
      { ...defaultItems[0], IdPurchaseRequestItm: new Date().getTime() },
    ]);
  };

  const handleRemove = (id) => {
    setItems(items.filter((item) => item.IdPurchaseRequestItm !== id));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const getTradeSize = async (amount, abr) => {
        await axios
          .get(
            `${host}/purchase_request/get_trade_size?abr=${abr}&amount=${amount}`
          )
          .then((res) => {
            setIdTradeSize(res.data.result);
          });
      };

      if (data.Amount && data.Abr) {
        getTradeSize(data.Amount, data.Abr);
      } else {
        setIdTradeSize(null);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [data.Amount, data.Abr]);

  const bigTradeStartInterval = () => {
    return Math.max.apply(
      Math,
      tradeSizes
        .filter((trade) => trade.Amount != null)
        .map((trade) => trade.Amount)
    );
  };

  const hasForeigncur = () => {
    let result = false;
    inqueries.forEach((inquiry) => {
      if (inquiry.IdCur != 99) result = true;
    });
    return result;
  };

  const handleAddInquiry = () => {
    setInquiries([
      ...inqueries,
      {
        IdPurchaseRequestInquiry: new Date().getTime(),
        IdPurchaseRequest: 16,
        Title: "",
        Amount: null,
        IdCur: 99,
        Cur: "IRR",
        ExchangeRate: 1,
        ExchangeRateRevert: 1,
        IRRAmount: null,
        Note: null,
      },
    ]);
  };

  const handleInquiryChange = (e, id) => {
    const { name, value } = e.target;
    setInquiries(
      inqueries.map((inquiry) => {
        if (inquiry.IdPurchaseRequestInquiry == id) {
          return { ...inquiry, [name]: value };
        }
        return inquiry;
      })
    );
  };

  const handleInquiryCurChange = (idcur, id) => {
    setInquiries(
      inqueries.map((inquiry) => {
        if (inquiry.IdPurchaseRequestInquiry == id) {
          return {
            ...inquiry,
            IdCur: idcur,
            Cur: curArr.find((cur) => cur.IdCur == idcur).Abr,
          };
        }
        return inquiry;
      })
    );
  };

  const handleInquiryRemove = (id) => {
    setInquiries(
      inqueries.filter((inquery) => inquery.IdPurchaseRequestInquiry != id)
    );
  };

  const handleInquiryAmountChange = (id, val) => {
    setInquiries(
      inqueries.map((inquiry) => {
        if (inquiry.IdPurchaseRequestInquiry == id) {
          return {
            ...inquiry,
            Amount: val,
            IRRAmount:
              val > 0 && inquiry.ExchangeRate > 0
                ? val * inquiry.ExchangeRate
                : "",
          };
        }
        return inquiry;
      })
    );
  };

  const handleInquiryExchangeRateChange = (id, val) => {
    setInquiries(
      inqueries.map((inquiry) => {
        if (inquiry.IdPurchaseRequestInquiry == id) {
          if (inquiry.IdCur == 99) {
            return {
              ...inquiry,
              ExchangeRate: 1,
              ExchangeRateRevert: 1,
              IRRAmount: inquiry.Amount,
            };
          } else {
            return {
              ...inquiry,
              ExchangeRate: val > 0 ? val : "",
              ExchangeRateRevert: val > 0 ? 1 / val : 1,
              IRRAmount:
                val > 0 && inquiry.Amount > 0 ? val * inquiry.Amount : "",
            };
          }
        }
        return inquiry;
      })
    );
  };

  const handleInquiryExchangeRateRevertChange = (id, val) => {
    setInquiries(
      inqueries.map((inquiry) => {
        if (inquiry.IdPurchaseRequestInquiry == id) {
          if (inquiry.IdCur == 99) {
            return {
              ...inquiry,
              ExchangeRate: 1,
              ExchangeRateRevert: 1,
              IRRAmount: inquiry.Amount,
            };
          } else {
            return {
              ...inquiry,
              ExchangeRate: val > 0 ? 1 / val : "",
              ExchangeRateRevert: val > 0 ? val : 1,
              IRRAmount:
                val > 0 && inquiry.Amount > 0 ? (1 / val) * inquiry.Amount : "",
            };
          }
        }
        return inquiry;
      })
    );
  };

  const toggleSkipFormalities = () => {
    setData({ ...data, SkipFormalities: data.SkipFormalities ? 0 : 1 });
    setInquiries([]);
  };

  const setTime = (name, val) => {
    setData({ ...data, [name]: val });
  };

  return (
    <div className={style.main}>
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
          <span>چاپ درخواست خرید</span>
        </button>
        {data.IdTradeSize > 2 && (
          <button
            className={`${style.operationButton}`}
            onClick={(e) => handlePrint2(e)}
          >
            <IoPrintOutline />
            <span>چاپ صورتجلسه کمیسیون معاملات</span>
          </button>
        )}
      </div>
      <FormContainer dir="rtl" style={{ maxWidth: "1000px" }}>
        <h1>درخواست خرید کالا / خدمات</h1>
        {data.State == 1 && <h2 className={style.cancelled}>ابطال شده</h2>}
        <label>سریال</label>
        <span>{data.IdPurchaseRequest}</span>
        <label>شماره درخواست</label>
        <span>{data.PurchaseRequestNo}</span>
        <label>واحد متقاضی</label>
        <span>{data.Dept}</span>
        <label>تاریخ درخواست</label>
        <Datepicker
          value={data.PurchaseRequestDate}
          onChange={(val) => setDate("PurchaseRequestDate", val)}
          dir="rtl"
          name="purchase_request_purchase_request_date"
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
        <div className={style.grid}>
          <div>
            <div className={style.header}>شرح کالا / خدمات</div>
            <div className={style.header}>واحد سنجش</div>
            <div className={style.header}>مقدار</div>
            <div className={style.header}>توضیحات</div>
            <IoIosAddCircle
              className={style.btnAdd}
              onClick={() => handleAdd()}
            />
          </div>
          {items.map((item) => (
            <div key={item.IdPurchaseRequestItm}>
              <input
                type="text"
                className={style.txt}
                value={item.Descr || ""}
                name="Descr"
                onChange={(e) => handleItemChange(e, item.IdPurchaseRequestItm)}
              />
              <input
                type="text"
                className={style.txt}
                value={item.Unit || ""}
                name="Unit"
                onChange={(e) => handleItemChange(e, item.IdPurchaseRequestItm)}
              />
              <input
                type="number"
                className={style.txt}
                value={item.Qty || ""}
                name="Qty"
                onChange={(e) => handleItemChange(e, item.IdPurchaseRequestItm)}
              />
              <input
                type="text"
                className={style.txt}
                value={item.Note || ""}
                name="Note"
                onChange={(e) => handleItemChange(e, item.IdPurchaseRequestItm)}
              />
              <IoIosTrash
                className={style.btnRemove}
                onClick={() => handleRemove(item.IdPurchaseRequestItm)}
              />
            </div>
          ))}
        </div>
        <label>مبلغ برآوردی</label>
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
        <label>اندازه معامله</label>
        <div className={style.tradeSizes}>
          {tradeSizes.map((trade) => (
            <div
              key={trade.IdTradeSize}
              className={`
              ${style.tradeSize} 
              ${trade.IdTradeSize == idTradeSize ? style.calculated : ""}  
              ${trade.IdTradeSize == data.IdTradeSize ? style.saved : ""} `}
              title={
                trade.Amount == null
                  ? `بیش از ${thousandSep(bigTradeStartInterval())}`
                  : `تا ${thousandSep(trade.Amount)}  ریال`
              }
            >
              {trade.Title}
            </div>
          ))}
        </div>
        <label>توضیحات</label>
        <textarea
          type="text"
          className={style.txt}
          value={data.Note || ""}
          style={{ width: "100%", height: "100px" }}
          name="Note"
          onChange={(e) => handleUpdate(e)}
        ></textarea>
        <label>ترک تشریفات</label>
        <div>
          <input
            type="checkbox"
            checked={data.SkipFormalities}
            onChange={() => toggleSkipFormalities()}
          />
        </div>
        {data.SkipFormalities == true && (
          <>
            <label>گزارش ترک تشریفات</label>
            <textarea
              type="text"
              className={style.txt}
              value={data.SkipFormalitiesNote || ""}
              style={{ width: "100%", height: "150px" }}
              name="SkipFormalitiesNote"
              onChange={(e) => handleUpdate(e)}
            ></textarea>
          </>
        )}
        {(idTradeSize > 2 || data.IdTradeSize > 2) &&
          data.SkipFormalities == false && (
            <>
              <h1>استعلام ها</h1>
              <div className={`${style.grid} ${style.grid2}`}>
                <div>
                  <div className={style.header} style={{ width: "250px" }}>
                    شخص / شرکت
                  </div>
                  <div className={style.header} style={{ width: "120px" }}>
                    مبلغ
                  </div>
                  <div className={style.header} style={{ width: "80px" }}>
                    ارز
                  </div>
                  {hasForeigncur() && (
                    <>
                      <div className={style.header} style={{ width: "90px" }}>
                        نرخ ارز
                      </div>
                      <div className={style.header} style={{ width: "100px" }}>
                        نرخ ارز معکوس
                      </div>
                      <div className={style.header} style={{ width: "100px" }}>
                        مبلغ به ریال
                      </div>
                    </>
                  )}
                  <div className={style.header} style={{ width: "150px" }}>
                    توضیحات
                  </div>
                  <IoIosAddCircle
                    className={style.btnAdd}
                    onClick={() => handleAddInquiry()}
                  />
                </div>
              </div>
              {inqueries.map((inquiry) => (
                <div
                  key={inquiry.IdPurchaseRequestInquiry}
                  className={` ${style.grid2} ${style.inquiry}`}
                >
                  <input
                    type="text"
                    className={style.txt}
                    value={inquiry.Title || ""}
                    name="Title"
                    onChange={(e) =>
                      handleInquiryChange(e, inquiry.IdPurchaseRequestInquiry)
                    }
                    style={{ width: "260px", height: "30px" }}
                  />
                  <AmountInput
                    value={inquiry.Amount || ""}
                    name="Amount"
                    onChange={(val) =>
                      handleInquiryAmountChange(
                        inquiry.IdPurchaseRequestInquiry,
                        val
                      )
                    }
                    width="130px"
                    style={{ height: "30px" }}
                  />
                  <Selector
                    data={curArr}
                    id="IdCur"
                    title="Abr"
                    width={90}
                    selectionChanged={(idcur) =>
                      handleInquiryCurChange(
                        idcur,
                        inquiry.IdPurchaseRequestInquiry
                      )
                    }
                    dir="rtl"
                    value={inquiry.IdCur}
                    fontFamily={"IranSansLight"}
                  />
                  {hasForeigncur() && (
                    <>
                      <AmountInput
                        value={inquiry.ExchangeRate || ""}
                        name="ExchangeRate"
                        onChange={(val) =>
                          handleInquiryExchangeRateChange(
                            inquiry.IdPurchaseRequestInquiry,
                            val
                          )
                        }
                        width="100px"
                        style={{ height: "30px" }}
                      />
                      <AmountInput
                        value={inquiry.ExchangeRateRevert || ""}
                        name="ExchangeRate"
                        onChange={(val) =>
                          handleInquiryExchangeRateRevertChange(
                            inquiry.IdPurchaseRequestInquiry,
                            val
                          )
                        }
                        width="110px"
                        style={{ height: "30px" }}
                      />
                      <AmountInput
                        value={inquiry.IRRAmount || ""}
                        name="ExchangeRate"
                        width="110px"
                        style={{ height: "30px", backgroundColor: "lightblue" }}
                      />
                    </>
                  )}
                  <input
                    type="text"
                    className={style.txt}
                    value={inquiry.Note || ""}
                    name="Note"
                    onChange={(e) =>
                      handleInquiryChange(e, inquiry.IdPurchaseRequestInquiry)
                    }
                    style={{ width: "160px", height: "30px" }}
                  />
                  <IoIosTrash
                    className={style.btnRemove}
                    onClick={() =>
                      handleInquiryRemove(inquiry.IdPurchaseRequestInquiry)
                    }
                  />
                </div>
              ))}
              <h1>کمیسیون معاملات</h1>
              <label>تاریخ برگزاری</label>
              <Datepicker
                value={data.CommissionDate}
                onChange={(val) => setDate("CommissionDate", val)}
                dir="rtl"
                name="purchase_request_pcommission_date"
              />
              <label>زمان شروع</label>
              <Timepicker
                value={data.StartTime}
                onChange={(val) => setTime("StartTime", val)}
              />
              <label>زمان پایان</label>
              <Timepicker
                value={data.EndTime}
                onChange={(val) => setTime("EndTime", val)}
              />
              <label>محل برگزاری</label>
              <input
                type="text"
                className={style.txt}
                value={data.Venue || ""}
                name="Venue"
                onChange={(e) => handleUpdate(e)}
                style={{ width: "260px" }}
              />
              <label>نوع معامله</label>
              <div className={style.subject1}>
                <div
                  onClick={() => setData({ ...data, Subject1: "تامین اقلام" })}
                  className={
                    data.Subject1 == "تامین اقلام" ? style.selected : ""
                  }
                >
                  تامین اقلام
                </div>
                <div
                  onClick={() => setData({ ...data, Subject1: "تامین خدمات" })}
                  className={
                    data.Subject1 == "تامین خدمات" ? style.selected : ""
                  }
                >
                  تامین خدمات
                </div>
                <div
                  onClick={() => setData({ ...data, Subject1: "فروش" })}
                  className={data.Subject1 == "فروش" ? style.selected : ""}
                >
                  فروش
                </div>
              </div>
              <label>موضوع</label>
              <input
                type="text"
                className={style.txt}
                value={data.Subject2 || ""}
                name="Subject2"
                onChange={(e) => handleUpdate(e)}
              />
              <label>مدارک ضمیمه</label>
              <div className={style.attached}>
                <div
                  onClick={() =>
                    setData({
                      ...data,
                      IsPurchaseRequestAttached:
                        data.IsPurchaseRequestAttached == 1 ? 0 : 1,
                    })
                  }
                  className={
                    data.IsPurchaseRequestAttached ? style.selected : ""
                  }
                >
                  درخواست خرید کالا و خدمات
                </div>
                <div
                  onClick={() =>
                    setData({
                      ...data,
                      IsInquiriesAttached:
                        data.IsInquiriesAttached == 1 ? 0 : 1,
                    })
                  }
                  className={data.IsInquiriesAttached ? style.selected : ""}
                >
                  استعلام های جمع آوری شده
                </div>
                <div
                  onClick={() =>
                    setData({
                      ...data,
                      IsOffersTableAttached:
                        data.IsOffersTableAttached == 1 ? 0 : 1,
                    })
                  }
                  className={data.IsOffersTableAttached ? style.selected : ""}
                >
                  جدول مقایسه قیمت
                </div>
                <div
                  onClick={() =>
                    setData({
                      ...data,
                      IsSkippingFormalitiesReportAttached:
                        data.IsSkippingFormalitiesReportAttached == 1 ? 0 : 1,
                    })
                  }
                  className={
                    data.IsSkippingFormalitiesReportAttached
                      ? style.selected
                      : ""
                  }
                >
                  گزارش ترک تشریفات
                </div>
                <input
                  type="text"
                  className={style.txt}
                  value={data.OtherAttachments || ""}
                  name="OtherAttachments"
                  onChange={(e) => handleUpdate(e)}
                  style={{ width: "360px" }}
                />
              </div>
              <label>برنده</label>
              <Selector
                data={inqueries}
                id="Title"
                title="Title"
                width={135}
                selectionChanged={(title) => {
                  setData({ ...data, Winner: title });
                }}
                dir="rtl"
                value={data.Winner}
                fontFamily={"IranSansLight"}
              />
              <label>نحوه معامله</label>
              <div className={style.how}>
                <div
                  onClick={() => setData({ ...data, HowToWork: "عقد قرارداد" })}
                  className={
                    data.HowToWork == "عقد قرارداد" ? style.selected : ""
                  }
                >
                  عقد قرارداد
                </div>
                <div
                  onClick={() =>
                    setData({ ...data, HowToWork: "الحاقیه بر قرارداد قبلی" })
                  }
                  className={
                    data.HowToWork == "الحاقیه بر قرارداد قبلی"
                      ? style.selected
                      : ""
                  }
                >
                  الحاقیه بر قرارداد قبلی
                </div>
                <div
                  onClick={() =>
                    setData({ ...data, HowToWork: "صدور سفارش خرید (فاکتوری)" })
                  }
                  className={
                    data.HowToWork == "صدور سفارش خرید (فاکتوری)"
                      ? style.selected
                      : ""
                  }
                >
                  صدور سفارش خرید (فاکتوری)
                </div>
              </div>
              <label>سایر تصمیمات</label>
              <textarea
                type="text"
                className={style.txt}
                value={data.Desicions || ""}
                style={{ width: "100%", height: "100px" }}
                name="Desicions"
                onChange={(e) => handleUpdate(e)}
              ></textarea>
            </>
          )}
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
