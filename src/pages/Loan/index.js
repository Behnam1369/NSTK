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
import { shamsiDate, thousandSep, today } from "../../Utils/public";
import AmountInput from "../../components/AmountInput";
import axios from "axios";
let defaultLoan = {
  IdLoan: null,
  IdUser: 1,
  FullName: null,
  PerNo: null,
  IdLoanType: null,
  LoanType: null,
  IdStep: 1,
  Step: "ثبت اولیه",
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
  IdFin: "",
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
  const [userGroups, setUserGroups] = useState([]);
  const [roles, setRoles] = useState([]);
  const [messageText, setMessageText] = useState(false);

  const [saving, setSaving] = useState(false);
  // const [cancelling, setCancelling] = useState(false);
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
            setRoles(JSON.parse(res[0].data)[0].Roles.split(","));
            setUserGroups(JSON.parse(res[0].data)[0].UserGroups.split(","));
          });
        window.parent.postMessage({ title: "loaded", tabno }, "*");
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
              MonthsInCompany: JSON.parse(res[0].data)[0].EmploymentMonth,
              HierarchyScore:
                JSON.parse(res[0].data)[0].HierarchyLevel == 5
                  ? 30
                  : JSON.parse(res[0].data)[0].HierarchyLevel == 4
                  ? 24
                  : JSON.parse(res[0].data)[0].HierarchyLevel == 3
                  ? 18
                  : JSON.parse(res[0].data)[0].HierarchyLevel == 2
                  ? 12
                  : 10,
              RiskScore:
                JSON.parse(res[0].data)[0]
                  .UserGroups.split(",")
                  .includes("11") ||
                JSON.parse(res[0].data)[0]
                  .UserGroups.split(",")
                  .includes("21") ||
                JSON.parse(res[0].data)[0].UserGroups.split(",").includes("82")
                  ? 30
                  : JSON.parse(res[0].data)[0]
                      .UserGroups.split(",")
                      .includes("44") ||
                    JSON.parse(res[0].data)[0]
                      .UserGroups.split(",")
                      .includes("109")
                  ? 20
                  : 10,
            });
          });
        window.parent.postMessage({ title: "loaded", tabno }, "*");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loan.InstallmentFirstMonth && loan.IdStep == 5) {
      let ifm = shamsiDate(today).substring(0, 8);
      installmentLastMonth(ifm);
    }
  }, [loan.IdStep, loan.InstallmentFirstMonth]);

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
    console.log(loan);
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
          endpoint: "PrintLoan",
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
    if (loan.IdStep != 1) return;
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

  const handleUpdateCeoNote = (e) => {
    setLoan({ ...loan, CeoNote: e.target.value });
  };

  const handleUpdateFinNote = (e) => {
    setLoan({ ...loan, FinNote: e.target.value });
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
          PerformanceScore: loan.PerformanceScore,
          Score: loan.Score,
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
          MonthsOtherCompanies: loan.MonthsOtherCompanies,
          Score: loan.Score,
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

  const handleSendToFinance = (e) => {
    e.preventDefault();
    setSaving(true);
    axios
      .patch(`${host}/users/${iduser}/loan/${loan.IdLoan}/send_to_finance`, {
        Note: loan.HrNote,
      })
      .then((res) => {
        setSaving(false);
        setMessageText("اطلاعات با موفقیت ذخیره شد");
        setLoan(res.data.loan);
      });
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    setSaving(true);
    axios
      .patch(`${host}/users/${iduser}/loan/${loan.IdLoan}/confirm_payment`, {
        Note: loan.FinNote,
        InstallmentFirstMonth: loan.InstallmentFirstMonth,
        InstallmentLastMonth: loan.InstallmentLastMonth,
      })
      .then((res) => {
        setSaving(false);
        setMessageText("اطلاعات با موفقیت ذخیره شد");
        setLoan(res.data.loan);
      });
  };

  const rejectByCeo = (e) => {
    e.preventDefault();
    setSaving(true);
    axios
      .patch(`${host}/users/${iduser}/loan/${loan.IdLoan}/reject_by_ceo`, {
        Note: loan.HrNote,
      })
      .then((res) => {
        setSaving(false);
        setMessageText("اطلاعات با موفقیت ذخیره شد");
        setLoan(res.data.loan);
      });
  };

  const handleStartYearChange = (e) => {
    let ifm =
      e.target.value +
      "/" +
      (loan.InstallmentFirstMonth || shamsiDate(today).substring(0, 8)).split(
        "/"
      )[1];
    installmentLastMonth(ifm);
  };

  const handleStartMonthChange = (e) => {
    if (e.target.value > 12) return false;
    let ifm =
      (loan.InstallmentFirstMonth || shamsiDate(today).substring(0, 8)).split(
        "/"
      )[0] +
      "/" +
      e.target.value;
    installmentLastMonth(ifm);
  };

  const installmentLastMonth = (ifm) => {
    let y = parseInt(ifm.split("/")[0]);
    let m = parseInt(ifm.split("/")[1]);
    let qty = loan.Installments;
    let newy = y + Math.floor(qty / 12) + (m + (qty % 12) - 1 > 12 ? 1 : 0);
    let newm = (m + (qty % 12) - 1) % 12;
    newm = newm == 0 ? 12 : newm;
    setLoan({
      ...loan,
      InstallmentFirstMonth: ifm,
      InstallmentLastMonth: newy + "/" + newm,
    });
  };

  useEffect(() => {
    setLoan({
      ...loan,
      Score: Math.round(
        (loan.MonthsInCompany ? loan.MonthsInCompany / 12 : 0) +
          (loan.MonthsOtherCompanies ? loan.MonthsOtherCompanies / 24 : 0) +
          (loan.RiskScore ? loan.RiskScore : 0) +
          (loan.HierarchyScore ? loan.HierarchyScore : 0) +
          (loan.PerformanceScore ? loan.PerformanceScore : 0)
      ),
    });
  }, [
    loan.MonthsInCompany,
    loan.MonthsOtherCompanies,
    loan.RiskScore,
    loan.HierarchyScore,
    loan.PerformanceScore,
  ]);

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
        {loan.IdStep == 1 && loan.IdUser == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleSave(e)}
          >
            <IoSaveOutline />
            <span>{saving ? "درحال ذخیره" : "ذخیره"}</span>
          </button>
        )}
        {loan.IdStep == 1 && loan.IdUser == iduser && (
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
            <span>{deleting ? "درحال حذف" : "حذف"}</span>
          </button>
        )}
        {loan.IdStep == 2 && loan.IdManager == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleSendToHr(e)}
          >
            <span>تایید و ارسال به منابع انسانی</span>
          </button>
        )}
        {loan.IdStep == 2 && loan.IdManager == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => rejectByDeptManager(e)}
          >
            <span>عدم تایید</span>
          </button>
        )}
        {loan.IdStep == 3 && loan.IdHr == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleSendToCeo(e)}
          >
            <span>تایید و ارسال به مدیرعامل</span>
          </button>
        )}
        {loan.IdStep == 3 && loan.IdHr == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => rejectByHr(e)}
          >
            <span>عدم تایید</span>
          </button>
        )}
        {loan.IdStep == 4 &&
          (roles.includes("6") || userGroups.includes("110")) && (
            <button
              className={`${style.operationButton}`}
              disabled={saving}
              onClick={(e) => handleSendToFinance(e)}
            >
              <span>تایید و ارسال به مالی</span>
            </button>
          )}
        {loan.IdStep == 4 &&
          (roles.includes("6") || userGroups.includes("110")) && (
            <button
              className={`${style.operationButton}`}
              disabled={saving}
              onClick={(e) => rejectByCeo(e)}
            >
              <span>عدم تایید</span>
            </button>
          )}
        {loan.IdStep == 5 && loan.IdFin.split(",").includes(iduser) && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleConfirmPayment(e)}
          >
            <span>تایید پرداخت</span>
          </button>
        )}
        {loan.IdStep >= 3 && (
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
        {loan.IdStep > 4 && (
          <>
            <h1>مالی</h1>
            {loan.Installments && (
              <>
                <label>دوره کسر اقساط</label>
                <div>
                  <span>از</span>
                  <span dir="ltr">
                    <input
                      type="text"
                      className={`${style.txt}`}
                      style={{
                        width: "50px",
                        margin: "0 5px",
                        textAlign: "center",
                      }}
                      value={
                        (
                          loan.InstallmentFirstMonth ||
                          shamsiDate(today).substring(0, 8)
                        ).split("/")[0]
                      }
                      placeholder="YYYY"
                      maxLength={4}
                      onChange={(e) => handleStartYearChange(e)}
                      disabled={loan.IdStep > 5}
                    />
                    /
                    <input
                      type="text"
                      className={`${style.txt}`}
                      style={{
                        width: "35px",
                        margin: "0 5px",
                        textAlign: "center",
                      }}
                      value={
                        (
                          loan.InstallmentFirstMonth ||
                          shamsiDate(today).substring(0, 8)
                        ).split("/")[1]
                      }
                      placeholder="MM"
                      max={12}
                      maxLength={2}
                      onChange={(e) => handleStartMonthChange(e)}
                      disabled={loan.IdStep > 5}
                    />
                  </span>
                  <span style={{ marginRight: "50px" }}>تا</span>
                  <span dir="ltr">
                    <input
                      type="text"
                      disabled={true}
                      className={`${style.txt}`}
                      style={{
                        width: "50px",
                        margin: "0 5px",
                        textAlign: "center",
                      }}
                      value={
                        (
                          loan.InstallmentLastMonth ||
                          shamsiDate(today).substring(0, 8)
                        ).split("/")[0]
                      }
                    />
                    /
                    <input
                      type="text"
                      disabled={true}
                      className={`${style.txt}`}
                      style={{
                        width: "35px",
                        margin: "0 5px",
                        textAlign: "center",
                      }}
                      value={
                        (
                          loan.InstallmentLastMonth ||
                          shamsiDate(today).substring(0, 8)
                        ).split("/")[1]
                      }
                    />
                  </span>
                </div>
              </>
            )}
            <label>توضیحات</label>
            <textarea
              type="text"
              className={style.txt}
              value={loan && (loan.FinNote || "")}
              style={{ width: "100%", height: "100px" }}
              name="Note"
              onChange={(e) => handleUpdateFinNote(e)}
              disabled={
                !(loan.IdStep == 5 && loan.IdFin.split(",").includes(iduser))
              }
            ></textarea>
          </>
        )}
        {loan.IdStep > 3 && (
          <>
            <h1>مدیر عامل</h1>
            <label>توضیحات</label>
            <textarea
              type="text"
              className={style.txt}
              value={loan && (loan.CeoNote || "")}
              style={{ width: "100%", height: "100px" }}
              name="Note"
              onChange={(e) => handleUpdateCeoNote(e)}
              disabled={
                !(
                  loan.IdStep == 4 &&
                  (roles.includes("6") || userGroups.includes("110"))
                )
              }
            ></textarea>
          </>
        )}
        {loan.IdStep > 2 && (
          <>
            <h1>مدیر منابع انسانی</h1>
            <label>سابقه کار خارج از شرکت به ماه</label>
            <input
              type="number"
              className={style.txt}
              min={0}
              max="360"
              style={{ width: "70px" }}
              value={loan.MonthsOtherCompanies}
              disabled={!(loan.IdStep == 3 && loan.IdHr == iduser)}
              onChange={(e) =>
                setLoan({ ...loan, MonthsOtherCompanies: e.target.value })
              }
            />
            <label>توضیحات</label>
            <textarea
              type="text"
              className={style.txt}
              value={loan && (loan.HrNote || "")}
              style={{ width: "100%", height: "100px" }}
              name="Note"
              onChange={(e) => handleUpdateHrNote(e)}
              disabled={!(loan.IdStep == 3 && loan.IdHr == iduser)}
            ></textarea>
          </>
        )}
        {loan.IdStep > 1 && (
          <>
            <h1>مدیر واحد</h1>
            <lable>عملکرد متقاضی</lable>
            <div className={style.performance}>
              <div
                onClick={() => {
                  if (loan.IdStep == 2 && loan.IdManager == iduser)
                    setLoan({ ...loan, PerformanceScore: 10 });
                }}
                className={loan.PerformanceScore == 10 ? style.selected : ""}
              >
                خوب
              </div>
              <div
                onClick={() => {
                  if (loan.IdStep == 2 && loan.IdManager == iduser)
                    setLoan({ ...loan, PerformanceScore: 7 });
                }}
                className={loan.PerformanceScore == 7 ? style.selected : ""}
              >
                متوسط
              </div>
              <div
                onClick={() => {
                  if (loan.IdStep == 2 && loan.IdManager == iduser)
                    setLoan({ ...loan, PerformanceScore: 4 });
                }}
                className={loan.PerformanceScore == 4 ? style.selected : ""}
              >
                ضعیف
              </div>
            </div>
            <label>توضیحات</label>
            <textarea
              type="text"
              className={style.txt}
              value={loan && (loan.ManagerNote || "")}
              style={{ width: "100%", height: "100px" }}
              name="Note"
              onChange={(e) => handleUpdateManagerNote(e)}
              disabled={!(loan.IdStep == 2 && loan.IdManager == iduser)}
            ></textarea>
          </>
        )}
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
            disabled={loan.IdStep != 1}
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
                disabled={loan.IdStep != 1}
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
          disabled={
            !(
              loan.IdStep == 1 &&
              (loan.IdUser == iduser || loan.IdUser == null)
            )
          }
        ></textarea>
        <div className={style.scores}>
          <h2> {loan.Score} امتیاز</h2>
          <label>سابقه کار در شرکت</label>
          <label>
            {loan.MonthsInCompany == null
              ? "?"
              : (loan.MonthsInCompany / 12).toFixed(2)}
          </label>
          <label>سابقه کار خارج از شرکت</label>
          <label>
            {loan.MonthsOtherCompanies == null
              ? "?"
              : (loan.MonthsOtherCompanies / 24).toFixed(2)}
          </label>
          <label>جایگاه</label>
          <label>
            {loan.HierarchyScore == null ? "?" : loan.HierarchyScore}
          </label>
          <label>ریسک شغلی</label>
          <label>{loan.RiskScore == null ? "?" : loan.RiskScore}</label>
          <label>عملکرد</label>
          <label>
            {loan.PerformanceScore == null ? "?" : loan.PerformanceScore}
          </label>
        </div>
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
