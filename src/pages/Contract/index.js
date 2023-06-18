import { useParams, useSearchParams } from "react-router-dom";
import style from "./index.module.scss";
import { useEffect, useState } from "react";
import Message from "../../components/Message";
import { shamsiDate, thousandSep, today } from "../../Utils/public";
import FormContainer from "../../components/FormContainer";
import { host } from "../../Utils/host";
import {
  IoAttachOutline,
  IoLockOpenOutline,
  IoLockClosedOutline,
  IoSaveOutline,
  IoBan,
  IoRefreshSharp,
  IoTrash,
} from "react-icons/io5";
import axios from "axios";
import Datepicker from "../../components/Datepicker";
import Selector from "../../components/Selector";
import MultiFileUploader from "../../components/MultiFileUploader";

let defaultContract = {
  IdContract: null,
  HeadLetter: "",
  IdDept: null,
  Dept: null,
  ContractDate: null,
  ContractDateShamsi: null,
  No: null,
  ContractNo: "",
  Contractor: "",
  Subject: "",
  Note: "",
  IdFiles: "",
  IdUser: null,
  Issuer: null,
  State: null,
};

export default function Contract() {
  const { iduser, idcontract } = useParams();
  const [contract, setContract] = useState(defaultContract);
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");
  const [messageText, setMessageText] = useState(false);
  const [depts, setDepts] = useState([]);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAttachment = (e) => {
    e.preventDefault();
    if (idcontract) {
      window.parent.postMessage(
        {
          title: "attachment",
          args: { idform: 150, idvch: contract.IdContract },
          tabTitle: `پیوست های قرارداد ${contract.IdContract}`,
          tabno,
        },
        "*"
      );
    } else {
      setMessageText("ابتدا سند را ذخیره کنید");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${host}/users/${iduser}/contract/${idcontract || "new"}`)
        .then((res) => {
          setDepts(res.data.depts);
          if (idcontract) {
            console.log(res);
            setContract(res.data.contract);
          }
        });
      window.parent.postMessage({ title: "loaded", tabno }, "*");
    };
    fetchData();
  }, []);

  const setDate = (name, val) => {
    setContract({
      ...contract,
      [name]: val,
      [name + "Shamsi"]: shamsiDate(val),
    });
  };

  const handlebtnLockClick = () => {
    setAutoGenerate(false);
  };

  const handlebtnUnLockClick = () => {
    setAutoGenerate(true);
  };

  const setFile = (val) => {
    setContract({ ...contract, IdFiles: val });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!contract.ContractDate) {
      setMessageText("لطفاً تاریخ قرارداد را وارد نمایید");
      return;
    } else if (!contract.IdDept) {
      setMessageText("لطفاً واحد متولی را انتخاب نمایید");
      return;
    } else if (!contract.HeadLetter) {
      setMessageText("لطفاً سربرگ را انتخاب نمایید");
      return;
    }

    setSaving(true);

    if (contract.IdContract) {
      await axios
        .patch(`${host}/users/${iduser}/contract/${contract.IdContract}`, {
          ...contract,
          autoGenerate,
        })
        .then((res) => {
          setSaving(false);
          setContract(res.data);
          setMessageText("اطلاعات با موفقیت ثبت شد");
        });
    } else {
      await axios
        .post(`${host}/users/${iduser}/contract`, { ...contract, autoGenerate })
        .then((res) => {
          setSaving(false);
          setContract(res.data);
          setMessageText("اطلاعات با موفقیت ثبت شد");
        });
    }
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    console.log(contract.IdContract);
    if (!contract.IdContract) {
      setMessageText("این سند ذخیره نشده است. امکان ابطال وجود ندارد.");
      return;
    }
    setCancelling(true);
    await axios
      .patch(
        `${host}/users/${iduser}/contract/${contract.IdContract}/cancel`,
        contract
      )
      .then((res) => {
        setCancelling(false);
        setContract(res.data);
        setMessageText("سند با موفقیت باطل گردید");
      });
  };

  const handleRecover = async (e) => {
    e.preventDefault();
    setCancelling(true);
    await axios
      .patch(
        `${host}/users/${iduser}/contract/${contract.IdContract}/recover`,
        contract
      )
      .then((res) => {
        setCancelling(false);
        setContract(res.data);
        setMessageText("سند با موفقیت از حالت باطل شده خارج گردید");
      });
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    setDeleting(true);
    await axios
      .delete(
        `${host}/users/${iduser}/contract/${contract.IdContract}`,
        contract
      )
      .then(() => {
        setCancelling(false);
        setContract(defaultContract);
        setMessageText("سند با موفقیت حذف گردید");
      });
  };

  return (
    <>
      <div className={`${style.operationButtons}`} dir="rtl">
        <button
          className={`${style.operationButton}`}
          onClick={(e) => handleAttachment(e)}
        >
          <IoAttachOutline />
          <span>پیوست</span>
        </button>
        {!contract.State && (
          <button
            className={`${style.operationButton}`}
            disabled={saving}
            onClick={(e) => handleSave(e)}
          >
            <IoSaveOutline />
            <span>{saving ? "درحال ذخیره" : "ذخیره"}</span>
          </button>
        )}
        {!contract.State && contract.IdContract && (
          <button
            className={`${style.operationButton}`}
            disabled={cancelling}
            onClick={(e) => handleCancel(e)}
          >
            <IoBan />
            <span>{cancelling ? "در حال ابطال" : "ابطال"} </span>
          </button>
        )}
        {contract.State && (
          <button
            className={`${style.operationButton}`}
            disabled={cancelling}
            onClick={(e) => handleRecover(e)}
          >
            <IoRefreshSharp />
            <span>
              {cancelling ? "در حال برگشت از ابطال" : "برگشت از ابطال"}
            </span>
          </button>
        )}
        {contract.IdContract && (
          <button
            className={`${style.operationButton}`}
            disabled={deleting}
            onClick={(e) => handleRemove(e)}
          >
            <IoTrash />
            <span>{deleting ? "در حال حذف" : "حذف"}</span>
          </button>
        )}
      </div>
      <FormContainer dir="rtl">
        <h1>قرارداد</h1>
        <label>سریال</label>
        <label>
          {contract.IdContract}{" "}
          {contract.State == 1 ? (
            <span style={{ color: "red" }}>(باطل شده)</span>
          ) : (
            ""
          )}
        </label>
        <label>تاریخ قرارداد</label>
        <Datepicker
          value={contract.ContractDate}
          onChange={(val) => setDate("ContractDate", val)}
          dir="rtl"
          calforma="jalali"
          name="mission_estimated_start_date"
        />
        <label>سربرگ</label>
        <div className={style.headLetters}>
          <div
            className={`${style.headLetter} ${
              contract.HeadLetter === "SPII" ? style.selected : ""
            }`}
            onClick={(e) => {
              setContract({ ...contract, HeadLetter: "SPII" });
            }}
          >
            SPII
          </div>
          <div
            className={`${style.headLetter} ${
              contract.HeadLetter === "NSTK" ? style.selected : ""
            }`}
            onClick={(e) => {
              setContract({ ...contract, HeadLetter: "NSTK" });
            }}
          >
            NSTK
          </div>
        </div>
        <label>واحد متولی</label>
        <Selector
          data={depts}
          id="IdDl"
          title="Title"
          width={135}
          selectionChanged={(val) => {
            setContract({
              ...contract,
              IdDept: val,
              Dept: depts.find((dept) => dept.IdDl == val)["Title"],
            });
          }}
          dir="rtl"
          value={contract.IdDept}
          fontFamily={"IranSansLight"}
        />
        <label>شماره قرارداد</label>
        <div className={style.contarctNo}>
          <input
            type="text"
            className={style.txt}
            value={contract.ContractNo}
            dir="ltr"
            disabled={autoGenerate}
            onChange={(e) =>
              setContract({ ...contract, ContractNo: e.target.value })
            }
          />
          {autoGenerate && (
            <IoLockOpenOutline
              className={style.btnLock}
              onClick={() => handlebtnLockClick()}
            />
          )}
          {!autoGenerate && (
            <IoLockClosedOutline
              className={style.btnUnLock}
              onClick={() => handlebtnUnLockClick()}
            />
          )}
        </div>
        <label>طرف قرارداد</label>
        <input
          type="text"
          className={style.txt}
          style={{ width: "350px" }}
          value={contract.Contractor}
          onChange={(e) =>
            setContract({ ...contract, Contractor: e.target.value })
          }
        />
        <label>موضوع قرارداد</label>
        <input
          type="text"
          className={style.txt}
          style={{ width: "530px" }}
          value={contract.Subject}
          onChange={(e) =>
            setContract({ ...contract, Subject: e.target.value })
          }
        />
        <label>فایل ها</label>
        <MultiFileUploader
          idfiles={contract.IdFiles}
          onChange={(idfiles) => setFile(idfiles)}
        />
        <label>توضیحات</label>
        <textarea
          className={style.txt}
          name="Note"
          value={contract.Note}
          onChange={(e) => setContract({ ...contract, Note: e.target.value })}
          autoComplete="off"
          style={{
            maxWidth: "530px",
            width: "100%",
            height: "150px",
            boxSizing: "border-box",
          }}
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
