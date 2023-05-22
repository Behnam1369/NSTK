import { useEffect, useState } from "react";
import { host } from "../../Utils/host";
import { useParams, useSearchParams } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import style from "./index.module.scss";
import {
  IoAttachOutline,
  IoPrintOutline,
  IoSaveOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Message from "../../components/Message";
import { thousandSep } from "../../Utils/public";
import AmountInput from "../../components/AmountInput";
import axios from "axios";
let defaultLoan = {
  IdLoan: null,
  IdUser: 1,
  FullName: null,
  PerNo: null,
  IdLoanType: null,
  LoanType: null,
  Step: 1,
  State: 0,
  RequestDate: null,
  RequestDateShamsi: null,
  Amount: null,
  Installments: null,
  InstallmentAmount: null,
  InstallmentFirstMonth: null,
  InstallmentLastMonth: null,
  IdFiles: null,
  Note: null,
  IdManager: null,
  Manager: null,
  ManagerNote: null,
  ManagerConfirmDate: null,
  ManagerConfirmDateShamsi: null,
  IdHr: null,
  Hr: null,
  HrNote: null,
  HrConfirmDate: null,
  HrConfirmDateShamsi: null,
};

export default function Loan() {
  const [loan, setLoan] = useState(defaultLoan);
  const [loanTypes, setLoanTypes] = useState([]);
  const [loanType, setLoanType] = useState(null);
  const [fullName, setFullName] = useState("");
  const [maxAmount, setMaxAmount] = useState(null);
  const [maxInstallment, setMaxInstallment] = useState(null);
  const [salary, setSalary] = useState(0);
  const [employmentMonth, setEmploymentMonth] = useState(0);
  const [hierarchyLevel, setHierarchyLevel] = useState(0);
  const [activeMonthlyInstallments, setActiveMonthlyInstallments] = useState(0);
  const [messageText, setMessageText] = useState(false);

  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { iduser, idloan } = useParams();

  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");

  useEffect(() => {
    const fetchData = async () => {
      if (idloan) {
        await fetch(`${host}/users/${iduser}/loan/${idloan}/edit`)
          .then((res) => res.json())
          .then((res) => {
            let lt = JSON.parse(res[0].data)[0].LoanTypes;
            let l = JSON.parse(JSON.parse(res[0].data)[0].Loan);
            setLoan(l);
            setLoanTypes(lt);
            setSalary(JSON.parse(res[0].data)[0].GrossSalary);
            setEmploymentMonth(JSON.parse(res[0].data)[0].EmploymentMonth);
            setHierarchyLevel(JSON.parse(res[0].data)[0].HierarchyLevel);
            setActiveMonthlyInstallments(
              JSON.parse(res[0].data)[0].ActiveMonthlyInstallments
            );
            setFullName(JSON.parse(res[0].data)[0].FullName);
            setMaxInstallment(
              lt.find((el) => el.IdLoanType == l.IdLoanType).MaxInstallments
            );
          });
      } else {
        await fetch(`${host}/users/${iduser}/loan/new`)
          .then((res) => res.json())
          .then((res) => {
            setLoanTypes(JSON.parse(res[0].data)[0].LoanTypes);
            setSalary(JSON.parse(res[0].data)[0].GrossSalary);
            setEmploymentMonth(JSON.parse(res[0].data)[0].EmploymentMonth);
            setHierarchyLevel(JSON.parse(res[0].data)[0].HierarchyLevel);
            setActiveMonthlyInstallments(
              JSON.parse(res[0].data)[0].ActiveMonthlyInstallments
            );
            setFullName(JSON.parse(res[0].data)[0].FullName);
            setLoan({
              ...loan,
              FullName: JSON.parse(res[0].data)[0].FullName,
              PerNo: JSON.parse(res[0].data)[0].PerNo,
            });
          });
      }
    };

    fetchData();
  }, []);

  const handleAttachment = (e) => {
    e.preventDefault();
    if (idloan) {
      window.parent.postMessage(
        {
          title: "attachment",
          args: { idform: 149, idvch: loan.IdLoan },
          tabTitle: `پیوست های درخواست وام ${loan.IdLoan}`,
          tabno,
        },
        "*"
      );
    } else {
      setMessageText("ابتدا سند را ذخیره کنید");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!loan.IdLoan) {
      setSaving(true);
      axios.post(`${host}/users/${iduser}/loan`, loan).then((res) => {
        setSaving(false);
        setMessageText("اطلاعات با موفقیت ذخیره شد");
        setLoan(res.data.loan);
      });
    }
  };

  const handleDelete = () => {};

  const handlePrint = (e) => {
    e.preventDefault();
    if (loan.IdLoan) {
      window.parent.postMessage(
        {
          title: "print",
          endpoint: "PrintPr",
          args: { idloan },
          tabTitle: `چاپ درخواست وام ${loan.IdLoan}`,
          tabno,
        },
        "*"
      );
    } else {
      setMessageText("ابتدا سند را ذخیره کنید");
    }
  };

  const handleAmountChange = (val) => {
    setLoan({
      ...loan,
      Amount: val,
      InstallmentAmount:
        loan.Installments > 0 ? (val / loan.Installments).toFixed() : "",
    });
  };

  const handleLoanSelect = (id) => {
    if (loan.Step != 1) return;
    let lt = loanTypes.find((el) => el.IdLoanType == id);
    setLoanType(lt);
    let max = eval(lt.MaxAmountFormula).toFixed(0);
    setMaxAmount(max);
    setMaxInstallment(lt.MaxInstallments);
    setLoan({
      ...loan,
      IdLoanType: lt.IdLoanType,
      LoanType: lt.Title,
      Amount: max,
      Installments: lt.MaxInstallments,
      InstallmentAmount:
        lt.MaxInstallments > 0 ? (max / lt.MaxInstallments).toFixed() : "",
    });
  };

  const handleInstallmentChange = (val) => {
    setLoan({
      ...loan,
      Installments: val,
      InstallmentAmount: val > 0 ? (loan.Amount / val).toFixed() : "",
    });
  };

  const handleUpdateNote = (e) => {
    setLoan({ ...loan, Note: e.target.value });
  };

  const handleUpdateManagerNote = (e) => {
    setLoan({ ...loan, ManagerNote: e.target.value });
  };

  const handleUpdateHrNote = (e) => {
    setLoan({ ...loan, HrNote: e.target.value });
  };

  const handleSendToDeptManager = (e) => {
    e.preventDefault();
    if (loan.IdLoan) {
      setSaving(true);
      axios
        .patch(
          `${host}/users/${iduser}/loan/${loan.IdLoan}/send_to_dept_manager`
        )
        .then((res) => {
          setSaving(false);
          setMessageText("اطلاعات با موفقیت ذخیره شد.");
          setLoan(res.data.loan);
        });
    } else {
      setMessageText("لطفاً ابتدا سند را ذخیره نمایید");
    }
  };

  const handleSendToHr = (e) => {
    e.preventDefault();
    if (loan.IdLoan) {
      setSaving(true);
      axios
        .patch(`${host}/users/${iduser}/loan/${loan.IdLoan}/send_to_hr`, {
          Note: loan.ManagerNote,
        })
        .then((res) => {
          setSaving(false);
          setMessageText("اطلاعات با موفقیت ذخیره شد");
          setLoan(res.data.loan);
        });
    } else {
      setMessageText("لطفاً ابتدا سند را ذخیره نمایید");
    }
  };

  const handleSendToCeo = (e) => {
    e.preventDefault();
    if (loan.IdLoan) {
      setSaving(true);
      axios
        .patch(`${host}/users/${iduser}/loan/${loan.IdLoan}/send_to_ceo`, {
          Note: loan.HrNote,
        })
        .then((res) => {
          setSaving(false);
          setMessageText("اطلاعات با موفقیت ذخیره شد");
          setLoan(res.data.loan);
        });
    } else {
      setMessageText("لطفاً ابتدا سند را ذخیره نمایید");
    }
  };

  const rejectByDeptManager = (e) => {
    e.preventDefault();
    if (loan.IdLoan) {
      setSaving(true);
      axios
        .patch(
          `${host}/users/${iduser}/loan/${loan.IdLoan}/reject_by_dept_manager`,
          {
            Note: loan.ManagerNote,
          }
        )
        .then((res) => {
          setSaving(false);
          setMessageText("اطلاعات با موفقیت ذخیره شد");
          setLoan(res.data.loan);
        });
    } else {
      setMessageText("لطفاً ابتدا سند را ذخیره نمایید");
    }
  };

  const rejectByHr = (e) => {
    e.preventDefault();
    if (loan.IdLoan) {
      setSaving(true);
      axios
        .patch(`${host}/users/${iduser}/loan/${loan.IdLoan}/reject_by_hr`, {
          Note: loan.HrNote,
        })
        .then((res) => {
          setSaving(false);
          setMessageText("اطلاعات با موفقیت ذخیره شد");
          setLoan(res.data.loan);
        });
    } else {
      setMessageText("لطفاً ابتدا سند را ذخیره نمایید");
    }
  };

  return (
    <>
      <div className={`${style.operationButtons}`} dir="rtl">
        {idloan && (
          <button
            className={`${style.operationButton}`}
            onClick={(e) => handleAttachment(e)}
          >
            <IoAttachOutline />
            <span>پیوست</span>
          </button>
        )}
        {loan.Step == 1 && loan.IdUser == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleSave(e)}
          >
            <IoSaveOutline />
            <span>{saving ? "درحال ذخیره" : "ذخیره"}</span>
          </button>
        )}
        {loan.Step == 1 && loan.IdUser == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleSendToDeptManager(e)}
          >
            <span>ارسال به مدیر واحد </span>
          </button>
        )}
        {idloan && loan.IdUser == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={deleting}
            onClick={(e) => handleDelete(e)}
          >
            <IoTrashOutline />
            <span>{deleting ? "درحال خذف" : "حذف"}</span>
          </button>
        )}
        {loan.Step == 2 && loan.IdManager == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleSendToHr(e)}
          >
            <span>تایید و ارسال به منابع انسانی</span>
          </button>
        )}
        {loan.Step == 2 && loan.IdManager == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => rejectByDeptManager(e)}
          >
            <span>عدم تایید</span>
          </button>
        )}
        {loan.Step == 3 && loan.IdHr == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleSendToCeo(e)}
          >
            <span>تایید و ارسال به مدیرعامل</span>
          </button>
        )}
        {loan.Step == 3 && loan.IdHr == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => rejectByHr(e)}
          >
            <span>عدم تایید</span>
          </button>
        )}
        {loan.Step >= 3 && (
          <button
            className={`${style.operationButton}`}
            onClick={(e) => handlePrint(e)}
          >
            <IoPrintOutline />
            <span>چاپ</span>
          </button>
        )}
      </div>
      <FormContainer dir="rtl">
        <h1>درخواست وام</h1>
        <label>سریال</label>
        <span>{loan.IdLoan}</span>
        <label>درخواست کننده</label>
        <span>{fullName}</span>
        <label>حقوق ناخالص</label>
        <span>{thousandSep(salary)} ریال </span>
        <label>سابقه استخدامی</label>
        <span>{employmentMonth} ماه </span>
        <label>میزان اقساط</label>
        <span>
          {activeMonthlyInstallments == 0 && 0}
          {activeMonthlyInstallments > 0 &&
            thousandSep(activeMonthlyInstallments.toFixed()) +
              "ریال معادل" +
              ((activeMonthlyInstallments * 100) / salary).toFixed() +
              "درصد از حقوق ناخالص"}
        </span>
        <label>نوع وام</label>
        <div className={style.loanTypes}>
          {loanTypes.map((lt) => (
            <div
              key={lt.IdLoanType}
              className={`${style.loanType} ${
                loan && loan.IdLoanType == lt.IdLoanType ? style.selected : ""
              }`}
              onClick={() => handleLoanSelect(lt.IdLoanType)}
            >
              {lt.Title}
            </div>
          ))}
        </div>
        <label>مبلغ وام</label>
        <div className={style.inputWrapper}>
          <AmountInput
            value={loan.Amount}
            onChange={(val) => handleAmountChange(val)}
            max={maxAmount}
            min={0}
            disabled={loan.Step != 1}
          />
          <span>ریال</span>
        </div>
        {maxInstallment && (
          <>
            <label>تعداد اقساط</label>
            <div>
              <AmountInput
                value={loan.Installments}
                onChange={(val) => handleInstallmentChange(val)}
                max={maxInstallment}
                min={0}
                disabled={loan.Step != 1}
              />
            </div>
          </>
        )}
        {maxInstallment && (
          <>
            <label>مبلغ هر قسط</label>
            <div className={style.inputWrapper}>
              <AmountInput value={loan.InstallmentAmount} disabled={true} />
              <span>ریال</span>
            </div>
          </>
        )}
        {maxInstallment && (
          <>
            <label>مبلغ هر قسط در صورت اخذ وام</label>
            <span>
              {loan.Amount / loan.Installments > 0 &&
                thousandSep(
                  (
                    activeMonthlyInstallments +
                    loan.Amount / loan.Installments
                  ).toFixed()
                ) +
                  " ریال معادل " +
                  (
                    ((activeMonthlyInstallments +
                      loan.Amount / loan.Installments) *
                      100) /
                    salary
                  ).toFixed() +
                  " درصد از حقوق ناخالص "}
            </span>
          </>
        )}
        <label>توضیحات</label>
        <textarea
          type="text"
          className={style.txt}
          value={loan && (loan.Note || "")}
          style={{ width: "100%", height: "100px" }}
          name="Note"
          onChange={(e) => handleUpdateNote(e)}
          disabled={!(loan.Step == 1 && loan.IdManager == iduser)}
        ></textarea>
        <h1>مدیر واحد</h1>
        <label>توضیحات</label>
        <textarea
          type="text"
          className={style.txt}
          value={loan && (loan.ManagerNote || "")}
          style={{ width: "100%", height: "100px" }}
          name="Note"
          onChange={(e) => handleUpdateManagerNote(e)}
          disabled={!(loan.Step == 2 && loan.IdManager == iduser)}
        ></textarea>
        <h1>مدیر منابع انسانی</h1>
        <label>توضیحات</label>
        <textarea
          type="text"
          className={style.txt}
          value={loan && (loan.HrNote || "")}
          style={{ width: "100%", height: "100px" }}
          name="Note"
          onChange={(e) => handleUpdateHrNote(e)}
          disabled={!(loan.Step == 3 && loan.IdHr == iduser)}
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
    </>
  );
}
