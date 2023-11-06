import { useEffect, useState } from "react";
import { host } from "../../Utils/host";
import { useParams, useSearchParams } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import TagSingleSelector from "../../components/TagSingleSelector";
import style from "./index.module.scss";
import {
  IoAttachOutline,
  IoPrintOutline,
  IoSaveOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { thousandSep, shamsiMonths } from "../../Utils/public";
import Message from "../../components/Message";
import axios from "axios";
let defaultEmploymentLetter = {
  IdEmploymentLetter: null,
  IdUser: 1,
  FullName: null,
  PerNo: null,
  IdRole: null,
  Role: null,
  IdDept: null,
  Dept: null,
  GrossSalary: null,
  EmploymentMonth: null,
  Recipient: null,
  IdLetterType: null,
  LetterType: null,
  IdStep: 1,
  Step: "ثبت اولیه",
  State: null,
  RequestDate: null,
  RequestDateShamsi: null,
  IsEmploymentLetter: null,
  IsGuarantee: null,
  LoanTaker: null,
  LoanTakerFatherName: null,
  LoanTakerNationalId: null,
  IsDeductionLetter: null,
  IncludePayrolSlips: false,
  IsForCheque: null,
  PayrolSlipsMonth: null,
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
  IdCeo: null,
  Ceo: null,
  CeoNote: null,
  CeoConfirmDate: null,
  CeoConfirmDateShamsi: null
};

export default function EmploymentLetter() {
  const { iduser, idemploymentletter } = useParams();
  const [employmentletter, setEmploymentLetter] = useState({...defaultEmploymentLetter, IdUser: iduser});
  const [userGroups, setUserGroups] = useState([]);
  const [roles, setRoles] = useState([]);
  const [messageText, setMessageText] = useState(false);
  const [saving, setSaving] = useState(false);
  // const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);


  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");

  useEffect(() => {
    const fetchData = async () => {
      if (idemploymentletter) {
        await fetch(`${host}/users/${iduser}/employment_letter/${idemploymentletter}/edit`)
          .then((res) => res.json())
          .then((res) => {
            let data = JSON.parse(JSON.parse(res[0].data)[0].EmploymentLetter);
            setEmploymentLetter({
              ...employmentletter, ...data
            });
            // setRoles(JSON.parse(res[0].data)[0].Roles.split(","));
            // setUserGroups(JSON.parse(res[0].data)[0].UserGroups.split(","));
          });
        window.parent.postMessage({ title: "loaded", tabno }, "*");
      } else {
        await fetch(`${host}/users/${iduser}/employment_letter/new`)
          .then((res) => res.json())
          .then((res) => {
            let data = JSON.parse(res[0].data)[0];
            setEmploymentLetter({
              ...employmentletter, ...data
            });
          });
        window.parent.postMessage({ title: "loaded", tabno }, "*");
      }
    };

    fetchData();
  }, []);

  const handleAttachment = (e) => {
    e.preventDefault();
    if (idemploymentletter) {
      window.parent.postMessage(
        {
          title: "attachment",
          args: { idform: 153, idvch: employmentletter.IdEmploymentLetter },
          tabTitle: `پیوست های درخواست خدمات شرکتی ${employmentletter.IdEmploymentLetter}`,
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
    if (!employmentletter.IdEmploymentLetter) {
      setSaving(true);
      axios.post(`${host}/users/${iduser}/employment_letter`, employmentletter).then((res) => {
        setSaving(false);
        setMessageText("اطلاعات با موفقیت ذخیره شد");
        setEmploymentLetter({...res.data.employment_letter});
      });
    } else {
      setSaving(true);
      axios.patch(`${host}/users/${iduser}/employment_letter/${employmentletter.IdEmploymentLetter}`, employmentletter).then((res) => {
        setSaving(false);
        setMessageText("اطلاعات با موفقیت ذخیره شد");
        setEmploymentLetter({...res.data.employment_letter});
      });
    }
  };

  const handleDelete = () => {};

  const handlePrint = (e) => {
    e.preventDefault();
    if (employmentletter.IdEmploymentLetter) {
      window.parent.postMessage(
        {
          title: "print",
          endpoint: "PrintEmploymentLetter",
          args: { idemploymentletter },
          tabTitle: `چاپ نامه NSTK/EL/${employmentletter.IdEmploymentLetter}`,
          tabno,
        },
        "*"
      );
    } else {
      setMessageText("ابتدا سند را ذخیره کنید");
    }
  };

  const handleAmountChange = (val) => {
    setEmploymentLetter({
      ...employmentletter,
      Amount: val,
      InstallmentAmount:
        employmentletter.Installments > 0 ? (val / employmentletter.Installments).toFixed() : "",
    });
  };

  const handleToggle = (e) => {
    setEmploymentLetter({ ...employmentletter, [e.target.name]: e.target.checked });  
  }

  const handleUpdate = (e) => {
    setEmploymentLetter({ ...employmentletter, [e.target.name]: e.target.value });
  }

  const handleSelectedValueChange = (name, val) => {
    setEmploymentLetter({...employmentletter, [name]: val })
  }

  const handleUpdateNote = (e) => {
    setEmploymentLetter({ ...employmentletter, Note: e.target.value });
  };

  const handleUpdateManagerNote = (e) => {
    setEmploymentLetter({ ...employmentletter, ManagerNote: e.target.value });
  };

  const handleUpdateHrNote = (e) => {
    setEmploymentLetter({ ...employmentletter, HrNote: e.target.value });
  };

  const handleUpdateCeoNote = (e) => {
    setEmploymentLetter({ ...employmentletter, CeoNote: e.target.value });
  };

  const handleUpdateFinNote = (e) => {
    setEmploymentLetter({ ...employmentletter, FinNote: e.target.value });
  };

  const handleSendToDeptManager = (e) => {
    e.preventDefault();
    if (employmentletter.IdEmploymentLetter) {
      setSaving(true);
      axios
        .patch(
          `${host}/users/${iduser}/employment_letter/${employmentletter.IdEmploymentLetter}/send_to_dept_manager`
        )
        .then((res) => {
          setSaving(false);
          setMessageText("اطلاعات با موفقیت ذخیره شد.");
          setEmploymentLetter(res.data.employment_letter);
        });
    } else {
      setMessageText("لطفاً ابتدا سند را ذخیره نمایید");
    }
  };

  const handleSendToHr = (e) => {
    e.preventDefault();
    if (employmentletter.IdEmploymentLetter) {
      setSaving(true);
      axios
        .patch(`${host}/users/${iduser}/employment_letter/${employmentletter.IdEmploymentLetter}/send_to_hr`, {
          Note: employmentletter.ManagerNote,
          PerformanceScore: employmentletter.PerformanceScore,
          Score: employmentletter.Score,
        })
        .then((res) => {
          setSaving(false);
          setMessageText("اطلاعات با موفقیت ذخیره شد");
          setEmploymentLetter(res.data.employment_letter);
        });
    } else {
      setMessageText("لطفاً ابتدا سند را ذخیره نمایید");
    }
  };

  const handleSendToCeo = (e) => {
    e.preventDefault();
    if (employmentletter.IdEmploymentLetter) {
      setSaving(true);
      axios
        .patch(`${host}/users/${iduser}/employment_letter/${employmentletter.IdEmploymentLetter}/send_to_ceo`, {
          Note: employmentletter.HrNote,
          MonthsOtherCompanies: employmentletter.MonthsOtherCompanies,
          Score: employmentletter.Score,
        })
        .then((res) => {
          setSaving(false);
          setMessageText("اطلاعات با موفقیت ذخیره شد");
          setEmploymentLetter(res.data.employment_letter);
        });
    } else {
      setMessageText("لطفاً ابتدا سند را ذخیره نمایید");
    }
  };

  const rejectByDeptManager = (e) => {
    e.preventDefault();
    if (employmentletter.IdEmploymentLetter) {
      setSaving(true);
      axios
        .patch(
          `${host}/users/${iduser}/employment_letter/${employmentletter.IdEmploymentLetter}/reject_by_dept_manager`,
          {
            Note: employmentletter.ManagerNote,
          }
        )
        .then((res) => {
          setSaving(false);
          setMessageText("اطلاعات با موفقیت ذخیره شد");
          setEmploymentLetter(res.data.employment_letter);
        });
    } else {
      setMessageText("لطفاً ابتدا سند را ذخیره نمایید");
    }
  };

  const rejectByHr = (e) => {
    e.preventDefault();
    if (employmentletter.IdEmploymentLetter) {
      setSaving(true);
      axios
        .patch(`${host}/users/${iduser}/employment_letter/${employmentletter.IdEmploymentLetter}/reject_by_hr`, {
          Note: employmentletter.HrNote,
        })
        .then((res) => {
          setSaving(false);
          setMessageText("اطلاعات با موفقیت ذخیره شد");
          setEmploymentLetter(res.data.employment_letter);
        });
    } else {
      setMessageText("لطفاً ابتدا سند را ذخیره نمایید");
    }
  };

  const handleSendToFinance = (e) => {
    e.preventDefault();
    setSaving(true);
    axios
      .patch(`${host}/users/${iduser}/employmen_tletter/${employmentletter.IdEmploymentLetter}/send_to_finance`, {
        Note: employmentletter.HrNote,
      })
      .then((res) => {
        setSaving(false);
        setMessageText("اطلاعات با موفقیت ذخیره شد");
        setEmploymentLetter(res.data.employment_letter);
      });
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    setSaving(true);
    axios
      .patch(`${host}/users/${iduser}/employment_letter/${employmentletter.IdEmploymentLetter}/confirm_payment`, {
        Note: employmentletter.FinNote,
        InstallmentFirstMonth: employmentletter.InstallmentFirstMonth,
        InstallmentLastMonth: employmentletter.InstallmentLastMonth,
      })
      .then((res) => {
        setSaving(false);
        setMessageText("اطلاعات با موفقیت ذخیره شد");
        setEmploymentLetter(res.data.employment_letter);
      });
  };

  const rejectByCeo = (e) => {
    e.preventDefault();
    setSaving(true);
    axios
      .patch(`${host}/users/${iduser}/employmen_tletter/${employmentletter.IdEmploymentLetter}/reject_by_ceo`, {
        Note: employmentletter.HrNote,
      })
      .then((res) => {
        setSaving(false);
        setMessageText("اطلاعات با موفقیت ذخیره شد");
        setEmploymentLetter(res.data.employment_letter);
      });
  };


  return (
    <>
      <div className={`${style.operationButtons}`} dir="rtl">
        {idemploymentletter && (
          <button
            className={`${style.operationButton}`}
            onClick={(e) => handleAttachment(e)}
          >
            <IoAttachOutline />
            <span>پیوست</span>
          </button>
        )}
        {employmentletter.IdStep == 1 && employmentletter.IdUser == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleSave(e)}
          >
            <IoSaveOutline />
            <span>{saving ? "درحال ذخیره" : "ذخیره"}</span>
          </button>
        )}
        {employmentletter.IdStep == 1 && employmentletter.IdUser == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleSendToDeptManager(e)}
          >
            <span>ارسال به مدیر واحد </span>
          </button>
        )}
        {idemploymentletter && employmentletter.IdUser == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={deleting}
            onClick={(e) => handleDelete(e)}
          >
            <IoTrashOutline />
            <span>{deleting ? "درحال حذف" : "حذف"}</span>
          </button>
        )}
        {employmentletter.IdStep == 2 && employmentletter.IdManager == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleSendToHr(e)}
          >
            <span>تایید و ارسال به منابع انسانی</span>
          </button>
        )}
        {employmentletter.IdStep == 2 && employmentletter.IdManager == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => rejectByDeptManager(e)}
          >
            <span>عدم تایید</span>
          </button>
        )}
        {employmentletter.IdStep == 3 && employmentletter.IdHr == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleSendToCeo(e)}
          >
            <span>تایید و ارسال به مدیرعامل</span>
          </button>
        )}
        {employmentletter.IdStep == 3 && employmentletter.IdHr == iduser && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => rejectByHr(e)}
          >
            <span>عدم تایید</span>
          </button>
        )}
        {employmentletter.IdStep == 4 &&
          (roles.includes("6") || userGroups.includes("110")) && (
            <button
              className={`${style.operationButton}`}
              disabled={saving}
              onClick={(e) => handleSendToFinance(e)}
            >
              <span>تایید و ارسال به مالی</span>
            </button>
          )}
        {employmentletter.IdStep == 4 &&
          (roles.includes("6") || userGroups.includes("110")) && (
            <button
              className={`${style.operationButton}`}
              disabled={saving}
              onClick={(e) => rejectByCeo(e)}
            >
              <span>عدم تایید</span>
            </button>
          )}
        {employmentletter.IdStep == 5 && employmentletter.IdFin.split(",").includes(iduser) && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleConfirmPayment(e)}
          >
            <span>تایید پرداخت</span>
          </button>
        )}
        {employmentletter.IdStep >= 3 && (
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
        {employmentletter.IdStep > 3 && (
          <>
            <h1>مدیر عامل</h1>
            <label>توضیحات</label>
            <textarea
              type="text"
              className={style.txt}
              value={employmentletter && (employmentletter.CeoNote || "")}
              style={{ width: "100%", height: "100px" }}
              name="Note"
              onChange={(e) => handleUpdateCeoNote(e)}
              disabled={
                !(
                  employmentletter.IdStep == 4 &&
                  (roles.includes("6") || userGroups.includes("110"))
                )
              }
            ></textarea>
          </>
        )}
        {employmentletter.IdStep > 2 && (
          <>
            <h1>مدیر منابع انسانی</h1>
            <label>توضیحات</label>
            <textarea
              type="text"
              className={style.txt}
              value={employmentletter && (employmentletter.HrNote || "")}
              style={{ width: "100%", height: "100px" }}
              name="Note"
              onChange={(e) => handleUpdateHrNote(e)}
              disabled={!(employmentletter.IdStep == 3 && employmentletter.IdHr == iduser)}
            ></textarea>
          </>
        )}
        {employmentletter.IdStep > 1 && (
          <>
            <h1>مدیر واحد</h1>
            <label>توضیحات</label>
            <textarea
              type="text"
              className={style.txt}
              value={employmentletter && (employmentletter.ManagerNote || "")}
              style={{ width: "100%", height: "100px" }}
              name="Note"
              onChange={(e) => handleUpdateManagerNote(e)}
              disabled={!(employmentletter.IdStep == 2 && employmentletter.IdManager == iduser)}
            ></textarea>
          </>
        )}
        <h1>درخواست دریافت خدمات شرکتی</h1>
        <label>سریال</label>
        <span>{employmentletter.IdEmploymentLetter}</span>
        <label>درخواست کننده</label>
        <span>{employmentletter.FullName}</span>
        <label>سمت</label>
        <span>{employmentletter.Role}</span>
        <label>واحد</label>
        <span>{employmentletter.Dept}</span>
        <label>حقوق ناخالص</label>
        <span>{thousandSep(employmentletter.GrossSalary)} ریال </span>
        <label>سابقه استخدامی</label>
        <span>{employmentletter.EmploymentMonth} ماه </span>
        <label>گیرنده نامه</label>
        <input
          type="text"
          className={style.txt}
          value={employmentletter && (employmentletter.Recipient || "")}
          name="Recipient"
          onChange={(e) => handleUpdate(e)}
          placeholder="مثلاً بانک تجارت، شعبه آپادانا - کد 123"
          disabled={
            !(
              employmentletter.IdStep == 1 &&
              (employmentletter.IdUser == iduser || employmentletter.IdUser == null)
            )
          }
        />
        <label>موارد مورد نیاز </label>
        <div className={style.requirementsDiv}>
          <label>
            <input 
              type="checkbox" 
              checked={employmentletter.IsEmploymentLetter} 
              name="IsEmploymentLetter" 
              onChange={e => handleToggle(e)} 
              disabled={
                !(
                  employmentletter.IdStep == 1 &&
                  (employmentletter.IdUser == iduser || employmentletter.IdUser == null)
                )
              }/> گواهی اشتغال به کار
              
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={employmentletter.IsDeductionLetter}
              name="IsDeductionLetter" 
              onChange={e => handleToggle(e)}
              disabled={
                !(
                  employmentletter.IdStep == 1 &&
                  (employmentletter.IdUser == iduser || employmentletter.IdUser == null)
                )
              } /> گواهی کسر از حقوق
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={employmentletter.IsForCheque}
              name="IsForCheque" 
              onChange={e => handleToggle(e)}
              disabled={
                !(
                  employmentletter.IdStep == 1 &&
                  (employmentletter.IdUser == iduser || employmentletter.IdUser == null)
                )
              } /> معرفی نامه جهت دریافت دسته چک
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={employmentletter.IncludePayrolSlips}
              name="IncludePayrolSlips" 
              onChange={e => handleToggle(e)}
              disabled={
                !(
                  employmentletter.IdStep == 1 &&
                  (employmentletter.IdUser == iduser || employmentletter.IdUser == null)
                )
              } 
              /> فیش حقوقی مهر شده
          </label>
        </div>
        {employmentletter.IncludePayrolSlips > 0 && (<>
          <label>
            ماه فیش حقوقی
          </label>
          <TagSingleSelector
            data={shamsiMonths.map(month => ({Title: month}) )}
            id="Title"
            title="Title"
            selectedValue={employmentletter.PayrolSlipsMonth}
            onChange={(val) => handleSelectedValueChange("PayrolSlipsMonth" , val)}
            disabled={false}
          />
        </>)}
        <label>تضمین  وام دیگران</label>
        <label>
          <input 
            type="checkbox" 
            checked={employmentletter.IsGuarantee}
            name="IsGuarantee" 
            onChange={e => handleToggle(e)}
            disabled={
              !(
                employmentletter.IdStep == 1 &&
                (employmentletter.IdUser == iduser || employmentletter.IdUser == null)
              )
            } 
             /> بله
        </label>
        { employmentletter.IsGuarantee && (<>
          <label>نام وام گیرنده</label>
          <input
            type="text"
            className={style.txt}
            value={employmentletter && (employmentletter.LoanTaker || "")}
            name="LoanTaker"
            onChange={(e) => handleUpdate(e)}
            style={{width: "200px"}}
            disabled={
              !(
                employmentletter.IdStep == 1 &&
                (employmentletter.IdUser == iduser || employmentletter.IdUser == null)
              )
            }
          />
          <label>نام پدر وام گیرنده</label>
          <input
            type="text"
            className={style.txt}
            value={employmentletter && (employmentletter.LoanTakerFatherName || "")}
            name="LoanTakerFatherName"
            onChange={(e) => handleUpdate(e)}
            style={{width: "200px"}}
            disabled={
              !(
                employmentletter.IdStep == 1 &&
                (employmentletter.IdUser == iduser || employmentletter.IdUser == null)
              )
            }
          />
          <label>کد ملی وام گیرنده</label>
          <input
            type="text"
            className={style.txt}
            value={employmentletter && (employmentletter.LoanTakerNationalId || "")}
            name="LoanTakerNationalId"
            style={{width: "200px"}}
            onChange={(e) => handleUpdate(e)}
            disabled={
              !(
                employmentletter.IdStep == 1 &&
                (employmentletter.IdUser == iduser || employmentletter.IdUser == null)
              )
            }
          />
        </>)}
        <label>توضیحات</label>

        <textarea
          type="text"
          className={style.txt}
          value={employmentletter && (employmentletter.Note || "")}
          style={{ width: "100%", height: "100px" }}
          name="Note"
          onChange={(e) => handleUpdateNote(e)}
          disabled={
            !(
              employmentletter.IdStep == 1 &&
              (employmentletter.IdUser == iduser || employmentletter.IdUser == null)
            )
          }
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
