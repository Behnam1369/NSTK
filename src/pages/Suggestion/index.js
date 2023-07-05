import { useParams, useSearchParams } from "react-router-dom";
import style from "./index.module.scss";
import { useEffect, useState } from "react";
import Message from "../../components/Message";
import { shamsiDate, thousandSep, today } from "../../Utils/public";
import FormContainer from "../../components/FormContainer";
import { host } from "../../Utils/host";
import axios from "axios";
import Datepicker from "../../components/Datepicker";
import { IoAttachOutline, IoSaveOutline, IoChevronForward } from "react-icons/io5";
import TagSingleSelector from "../../components/TagSingleSelector";
import TagMultiSelector from "../../components/TagMultiSelector";
import AmountInput from "../../components/AmountInput";

const defaultSuggestion = {
  IdSuggestion: "",
  IdUser: 1,
  FullName: null,
  IdDept: null,
  Dept: null,
  Visibility: 'خیر',
  Title: null,
  Description: null,
  MeasurabilityType: 'کمی',
  SuggestionType: 'پیشنهاد',
  EffectType: null,
  EffectTypeOther: null,
  Scope: "کل سازمان",
  Before: null,
  After: null,
  Budget: null,
  Result: null,
  Bonus: null,
  CashBonus: null,
  NonCashBonus: null,
  State: 'Draft'
};

const scopes = ["بازرگانی", "مالی", "حقوقی", "مطالعه بازار", "برنامه ریزی", "اداری و منابع انسانی", "مدیریت", "کل سازمان" ]

export default function Suggestion() {
  const { iduser, idsuggestion, suggestion_type } = useParams();

  const [suggestion, setSuggestion] = useState(defaultSuggestion);
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");
  const [messageText, setMessageText] = useState(suggestion_type === "پیشنهاد" ? `
  <div dir="rtl" style="padding:30px; ">
    <div style="text-align: right" >همکار محترم</div>
    <p>همانگونه که مستخضرید نيروي انساني به لحاظ برخورداري از قدرت انديشه، خلاقيت و نوآوري بزرگترين دارايي هر سازماني محسوب مي شود، به همین منظور خواهشمند است هرگونه پیشنهاد سازمانی را مطابق پیوست ارسال نمایید.
  لازم به ذکر است به پیشنهادات برگزیده در کمیته منابع انسانی به نحو شایسته تقدیر و تشکر خواهد شد.</p>
    <ul>
      <li>پیشنهادات به صورت کیفی یا کمی (یا هردو) می باشند.</li>
      <li>محدوده پیشنهاد ارایه شده واحد متقاضی، سایر واحد ها و یا کل سازمان می باشد.</li>
      <li>شرح پیشنهاد به صورت کامل نوشته شود.</li>
      <li>مشکلی و یا دلیل ارایه پیشنهاد ذکر گردد.</li>
      <li>نتیجه پیشنهاد ارایه شده.</li>
      <li>بودجه مورد نیاز جهت پیاده سازی پیشنهاد.</li>
    </ul>
    <p>با ارایه پیشنهادات مفید و سازنده می توان به رشد و توسعه سازمانی کمک نمود.</p>
  </div>
  ` : `
  <div dir="rtl" style="padding:30px; ">
    <div style="text-align: right" >همکار گرامی</div>
    <p>بدون شک، انتقاد شما همکار گرامی از شرکت، موجب یافتن نقاط ضعف، تلاش در جهت رفع آن ها می گردد.
لازم به ذکر است به رسم امانت داری اطلاعات شما همکار گرامی در صورت انتخاب انتقاد به صورت ناشناس محفوظ می گردد.</p>
  </div>
  `);
  const [dept, setDept] = useState("");
  const [roles, setRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  
  useEffect(() => {
    const loadData = async () => {
      if (!idsuggestion) {
        await axios.get(`${host}/users/${iduser}/suggestion`).then((res) => {
          setDept(res.data.dept);
          setRoles(res.data.roles); 
          setSuggestion({...suggestion, IdDept: res.data.iddept, Dept: res.data.dept, FullName: res.data.full_name, SuggestionType: suggestion_type })
        });
        window.parent.postMessage({ title: "loaded", tabno }, "*");
      } else {
        await axios.get(`${host}/users/${iduser}/suggestion/${idsuggestion}`).then((res) => {
          setRoles(res.data.roles); 
          setSuggestion(res.data.suggestion);
        });
        window.parent.postMessage({ title: "loaded", tabno }, "*");
      }
    }

    loadData();
  }, []);

  const handleAttachment = (e) => {
    e.preventDefault();
    if (suggestion.IdSuggestion) {
      window.parent.postMessage(
        {
          title: "attachment",
          args: { idform: 151, idvch: suggestion.IdSuggestion },
          tabTitle: `پیوست های پیشنهاد ${suggestion.IdSuggestion}`,
          tabno,
        },
        "*"
      );
    } else {
      setMessageText("ابتدا سند را ذخیره کنید");
    }
  };

  const handleUpdate = (e) => {
    setSuggestion({...suggestion, [e.target.name]: e.target.value })
  }

  const handleSelectedValueChange = (name, val) => {
    setSuggestion({...suggestion, [name]: val })
  }

  const handleAmountChange = (name, val) => {
    setSuggestion({ ...suggestion, [name]: val });
  };

  const isHrManager = () => {
    let hrRole = roles.find((role) => role.IdRole == 55);
    return hrRole != undefined ;
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (suggestion.IdSuggestion) {
      handleUpdateState('Reviewing');
    } else {
      setSaving(true);
      axios.post(`${host}/users/${iduser}/suggestion`, suggestion).then((res) => {
        setSuggestion(res.data);
        setMessageText('اطلاعات با موفقیت ذخیره گردید');
        setSaving(false);
      })
    }
  }

  const handleUpdateState = (state) => {
    console.log(suggestion);
    setSaving(true);
      axios.patch(`${host}/users/${iduser}/suggestion/${suggestion.IdSuggestion}`, {...suggestion, State: state})
      .then((res) => {
        setSuggestion(res.data);
        setMessageText('اطلاعات با موفقیت ذخیره گردید');
        setSaving(false);
      })
  }


  useEffect(() => {
    if (suggestion.Visibility == "بله") {
      setSuggestion({...suggestion, SuggestionType: "انتقاد"});
    }
  }, [suggestion.Visibility]);


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
        {suggestion.State == 'Draft' &&
          <button
            className={`${style.operationButton}`}
            onClick={(e) => handleSave(e)}
          >
            <IoSaveOutline />
            <span>ثبت و ارجاع جهت بررسی</span>
          </button>
        }
        {suggestion.State == 'Reviewing' && isHrManager() &&
          <button
            className={`${style.operationButton}`}
            onClick={(e) => handleUpdateState('Draft')}
          >
            <IoChevronForward />
            <span>ثبت و عودت به ثبت کننده</span>
          </button>
        }
        {suggestion.State == 'Reviewing' && isHrManager() &&
          <button
            className={`${style.operationButton}`}
            onClick={(e) => handleUpdateState('Finished')}
          >
            <IoSaveOutline />
            <span>ثبت و خاتمه</span>
          </button>
        }
        
      </div>
      <FormContainer dir="rtl">
        <h1>{suggestion_type}</h1>
        <label>سریال</label>
        <span>{suggestion.IdSuggestion}</span>
        {suggestion.Visibility == "خیر" && 
        <>
          <label>نام و نام خانوادگی</label>
          <span>{suggestion.FullName}</span>
          <label>واحد سازمانی</label>
          <span>{suggestion.Dept}</span>
        </>
        }
        { suggestion.SuggestionType == "انتقاد" && 
        <>
          <label>ثبت ناشناس</label>
          <TagSingleSelector
            data={[{ Title: "بله" }, { Title: "خیر" }]}
            id="Title"
            title="Title"
            selectedValue={suggestion.Visibility}
            onChange={(val) => handleSelectedValueChange("Visibility" , val)}
            disabled={suggestion.State == "Draft" ? false : true}
          />
        </>
        }
        <label>موضوع</label>
        <input
          type="text"
          className={style.txt}
          value={suggestion.Title}
          style={{ width: "100%", height: "25px" }}
          name="Title"
          onChange={(e) => handleUpdate(e)}
          disabled={suggestion.State == "Draft" ? false : true}
        />
        <label>نوع</label>
        <TagSingleSelector
          data={[{ Title: "کمی" }, { Title: "کیفی" }, { Title: "هر دو" }]}
          id="Title"
          title="Title"
          selectedValue={suggestion.MeasurabilityType}
          onChange={(val) => handleSelectedValueChange("MeasurabilityType" , val)}
          disabled={suggestion.State == "Draft" ? false : true}
        />
        <label>محدوده {suggestion.SuggestionType}</label>
        <TagMultiSelector
          data={scopes.map((el) => ({Title: el}))}
          id="Title"
          title="Title"
          selectedValues={suggestion.Scope}
          onChange={(val) => handleSelectedValueChange("Scope" , val)}
          disabled={suggestion.State == "Draft" ? false : true}
        />
        <label>شرح {suggestion.SuggestionType}</label>
        <textarea
          type="text"
          className={style.txt}
          value={suggestion.Description}
          style={{ width: "100%", height: "100px" }}
          name="Description"
          onChange={(e) => handleUpdate(e)}
          disabled={suggestion.State == "Draft" ? false : true}
        />
        { suggestion.SuggestionType == "پیشنهاد" && 
        <>
          <label>مشکل / پیشینه</label>
          <textarea
            type="text"
            className={style.txt}
            value={suggestion.Before}
            style={{ width: "100%", height: "100px" }}
            name="Before"
            onChange={(e) => handleUpdate(e)}
            disabled={suggestion.State == "Draft" ? false : true}
          />
          <label>نتیجه مورد انتظار</label>
          <TagSingleSelector
            data={[{ Title: "بهبود عملکرد" }, { Title: "تسریع در انجام فرآیند" }, { Title: "صرفه جویی" }, { Title: "سایر" }]}
            id="Title"
            title="Title"
            selectedValue={suggestion.EffectType}
            onChange={(val) => handleSelectedValueChange("EffectType" , val)}
            disabled={suggestion.State == "Draft" ? false : true}
          />
          <label>سایر توضیحات راجع به نتیجه مورد انتظار</label>
          <textarea
            type="text"
            className={style.txt}
            value={suggestion.After}
            style={{ width: "100%", height: "100px" }}
            name="After"
            onChange={(e) => handleUpdate(e)}
            disabled={suggestion.State == "Draft" ? false : true}
          />
          <label>بودجه مورد نیاز برآوردی به ریال</label>
          <AmountInput
            value={suggestion.Budget}
            onChange={(val) => handleAmountChange("Budget", val)}
            min={0}
            disabled={suggestion.State == "Draft" ? false : true}
          />
        
        <h1>نتیجه بررسی</h1>
        <label>نتیجه نهایی</label>
        <textarea
          type="text"
          className={style.txt}
          value={suggestion.Result}
          style={{ width: "100%", height: "100px" }}
          name="Result"
          onChange={(e) => handleUpdate(e)}
          disabled={suggestion.State == "Reviewing" && isHrManager() ? false : true}
        />
        <label>نحوه قدردانی</label>
        <TagSingleSelector
          data={[{ Title: "شفاهی" }, { Title: "پاداش نقدی" }, { Title: "پاداش غیر نقدی" }]}
          id="Title"
          title="Title"
          selectedValue={suggestion.Bonus}
          onChange={(val) => handleSelectedValueChange("Bonus" , val)}
          disabled={suggestion.State == "Reviewing" && isHrManager() ? false : true}
        />
        { suggestion.Bonus == "پاداش نقدی" && <>
          <label>پاداش نقدی (ریال) </label>
          <AmountInput
            value={suggestion.CashBonus}
            onChange={(val) => handleAmountChange("CashBonus", val)}
            min={0}
            disabled={suggestion.State == "Reviewing" && isHrManager() ? false : true}
          />
        </> }
        { suggestion.Bonus == "پاداش غیر نقدی" && 
          <>
            <label>پاداش غیر نقدی</label>
            <input
              type="text"
              className={style.txt}
              value={suggestion.NonCashBonus}
              style={{ width: "450px"}}
              name="NonCashBonus"
              onChange={(e) => handleUpdate(e)}
              disabled={suggestion.State == "Reviewing" && isHrManager() ? false : true}
            />
          </> }
        </>
        }
        <div style={{height: '250px'}}></div>
        <div style={{height: '250px'}}></div>
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
