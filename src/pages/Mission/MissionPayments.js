import { useEffect, useState } from "react";
import {
  IoAttachOutline,
  IoSaveOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useParams, useSearchParams } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import style from "./MissionPayments.module.scss";
import { AiOutlineDollarCircle } from "react-icons/ai";
import Modal from "../../components/Modal";
import Datepicker from "../../components/Datepicker";
import { thousandSep, shamsiDate } from "../../Utils/public";
import AmountInput from "../../components/AmountInput";
import Selector from "../../components/Selector";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { host } from "../../Utils/host";
import axios from "axios";
import Message from "../../components/Message";

const paymentTypes = [
  { id: 1, title: "علی الحساب ماموریت" },
  { id: 2, title: "تنخواه ماموریت" },
  { id: 3, title: "هزینه" },
  { id: 4, title: "تسویه حق ماموریت" },
];

export default function MissionPayments(props) {
  const { iduser, idmission, idmissioner } = useParams();
  const idvch = idmission + "0".repeat(4 - idmission.length) + idmissioner;
  const isMissioner = idmissioner == iduser;
  const [payments, setPayments] = useState([]);
  const [saving, setSaving] = useState(false);
  const defaultPayment = {
    IdWorkMissionPayment: null,
    IdWorkMission: idmission,
    IdWorkMissioner: idmissioner,
    IdPaymentType: null,
    PaymentType: null,
    Descr: null,
    PaymentDate: null,
    PaymentDateShamsi: null,
    Amount: null,
    IdCur: null,
    Abr: null,
  };
  const [payment, setPayment] = useState(defaultPayment);
  const [missioner, setMissioner] = useState({
    UserName: "",
    Fname: "",
    Lname: "",
  });
  const [showingModal, setShowingModal] = useState(false);
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");
  const [messageText, setMessageText] = useState(false);

  const loadData = async () => {
    await axios
      .get(
        `${host}/users/${iduser}/work_missions/${idmission}/missioners/${idmissioner}/payments`
      )
      .then((res) => {
        console.log(res.data);
        setMissioner({
          UserName: res.data.missioner.Ahmadi,
          Fname: res.data.missioner.Fname,
          Lname: res.data.missioner.Lname,
        });
        setPayments(res.data.vch);
        window.parent.postMessage({ title: "loaded", tabno }, "*");
      });
  };

  useEffect(() => {
    loadData();
    window.parent.postMessage({ title: "loaded", tabno }, "*");
  }, []);

  const handleAttachment = (e) => {
    e.preventDefault();
    window.parent.postMessage(
      {
        title: "attachment",
        args: { idform: 146, idvch },
        tabTitle: `پیوست های ماموریت ${missioner.Lname} ${missioner.Fname}`,
      },
      "*"
    );
  };

  const handleNewPayment = (e) => {
    e.preventDefault();
    if (isMissioner) {
      const p = paymentTypes.find((payment) => payment.id === 3);
      setPayment({ ...payment, IdPaymentType: p.id, PaymentType: p.title });
    }
    setShowingModal(true);
  };

  const setDate = (name, val) => {
    setPayment({ ...payment, [name]: val, [name + "Shamsi"]: shamsiDate(val) });
  };

  const handleUpdate = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleAmountChange = (val) => {
    setPayment({ ...payment, Amount: val });
  };

  const handlePaymentTypeChange = (val) => {
    const paymentItem = paymentTypes.find((payment) => payment.id === val);
    if (payment)
      setPayment({
        ...payment,
        IdPaymentType: val,
        PaymentType: paymentItem.title,
      });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setPayment(defaultPayment);
    setShowingModal(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await axios
      .post(
        `${host}/users/${iduser}/work_missions/${idmission}/missioners/${idmissioner}/payments`,
        payment
      )
      .then((res) => {
        loadData();
        setSaving(false);
        setShowingModal(false);
        setMessageText("اطلاعات با موفقیت ثبت شد");
        setPayment(defaultPayment);
      })
      .catch((err) => {
        setSaving(false);
        setMessageText("خطا در ثبت اطلاعات");
      });
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    await axios
      .patch(
        `${host}/users/${iduser}/work_missions/${idmission}/missioners/${idmissioner}/payments/${id}`
      )
      .then((res) => {
        setMessageText("سند با موفقیت ابطال شد");
        loadData();
      })
      .catch((err) => {
        setMessageText("خطا در انجام درخواست");
      });
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
          onClick={(e) => handleNewPayment(e)}
        >
          <AiOutlineDollarCircle />
          <span>{isMissioner ? "ثبت خرج جدید" : "ثبت پرداخت جدید"}</span>
        </button>
      </div>
      <FormContainer dir="rtl">
        <h1>عملیات مالی</h1>
        <h2 className={style.h2}>{missioner.Fname + " " + missioner.Lname}</h2>
        <div className={style.grid}>
          <div className={style.header}>تاریخ</div>
          <div className={style.header}>نوع پرداخت</div>
          <div className={style.header}>شرح</div>
          <div className={style.header}>مبلغ</div>
          <div className={style.header}></div>
          {payments.map((payment) => (
            <>
              <div>{payment.PaymentDateShamsi}</div>
              <div>{payment.PaymentType}</div>
              <div>{payment.Descr}</div>
              <div
                style={{
                  color: payment.Amount < 0 ? "red" : "inherit",
                  direction: "ltr",
                }}
              >
                {thousandSep(payment.Amount)}
              </div>
              <div>
                {((!isMissioner && payment.IdPaymentType != 3) ||
                  (isMissioner && payment.IdPaymentType == 3)) && (
                  <button
                    className={`${style.formButton}`}
                    title="حذف"
                    onClick={(e) =>
                      handleDelete(e, payment.IdWorkMissionPayment)
                    }
                    style={{ fontSize: "12px" }}
                  >
                    <IoTrashOutline />
                  </button>
                )}
              </div>
            </>
          ))}
        </div>
      </FormContainer>
      {showingModal && (
        <Modal>
          <div className={style.modalForm}>
            <FormContainer dir="rtl" style={{ marginTop: "0" }}>
              <h1 className={style.h1}>
                {isMissioner ? "ثبت خرج جدید" : "ثبت پرداخت جدید"}
              </h1>
              {!isMissioner && (
                <>
                  <label>نوع پرداخت</label>
                  <Selector
                    data={paymentTypes.filter((payment) => payment.id != 3)}
                    id="id"
                    title="title"
                    width={135}
                    selectionChanged={(val) => handlePaymentTypeChange(val)}
                    dir="rtl"
                    value={payment.IdPaymentType}
                    fontFamily={"IranSansLight"}
                  />
                </>
              )}
              <label>تاریخ</label>
              <Datepicker
                value={payment.PaymentDate}
                onChange={(val) => setDate("PaymentDate", val)}
                dir="rtl"
                name="mission_payment_paymentdate"
              />
              <label>شرح</label>
              <input
                type="text"
                className={style.txt}
                value={payment.Descr || ""}
                style={{ width: "100%" }}
                name="Descr"
                onChange={(e) => handleUpdate(e)}
              />
              <label>مبلغ</label>
              <AmountInput
                width="135px"
                value={payment.Amount}
                onChange={(val) => handleAmountChange(val)}
              />
              <div className={style.formButtons}>
                <button
                  className={style.formButton}
                  onClick={(e) => handleSave(e)}
                >
                  <IoSaveOutline />
                  <span>{saving ? "درحال ذخیره" : "ذخیره"}</span>
                </button>
                <button
                  className={style.formButton}
                  onClick={(e) => handleCancel(e)}
                >
                  <IoIosCloseCircleOutline />
                  <span>انصراف</span>
                </button>
              </div>
            </FormContainer>
          </div>
        </Modal>
      )}
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
