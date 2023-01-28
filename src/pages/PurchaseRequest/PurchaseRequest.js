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
      if (idpurchaserequest) {
        await axios
          .get(`${host}/users/${iduser}/purchase_request/${idpurchaserequest}`)
          .then((res) => {
            setCurArr(res.data.data.curArr);
            setData(res.data.data.vch);
            setItems(res.data.data.itms);
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
    console.log({
      ...data,
      purchase_request_itms_attributes: items,
    });
    await axios
      .post(`${host}/purchase_request`, {
        ...data,
        purchase_request_itms_attributes: items,
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
