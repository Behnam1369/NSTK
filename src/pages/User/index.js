import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom"
import { host } from "../../Utils/host";
import { IoSaveOutline, IoTrash } from "react-icons/io5";
import style from "./index.module.scss";
import FormContainer from "../../components/FormContainer";
import Datepicker from "../../components/Datepicker";
import Message from "../../components/Message";

export default function User() {
  const {idwinkart} = useParams();
  const [fullName, setFullName] = useState('');
  const [birthdays, setBirthdays] = useState([]);
  const [birthday, setBirthday] = useState("");
  const [spouse, setSpouse] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [saving, setSaving] = useState(false);
  const [messageText, setMessageText] = useState(false);

  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");
  
  useEffect(() => {
    const getUser = async () => {
      await axios.get(`${host}/personnel/${idwinkart}`).then((res) => {
        let {Fname, Lname} = res.data;
        setFullName(`${Fname} ${Lname}`);
      })
    }

    const getBirthDays = async () => {
      await axios.get(`${host}/personnel/${idwinkart}/birthdays`).then((res) => {
        let birthdays = res.data;
        let bd = res.data.find((bd) => bd.Type == "BirthDay");
        if (!bd)
          birthdays.push({IdBirthDay: new Date().getTime() , Type: "BirthDay"})
        
        let sp = res.data.find((bd) => bd.Type == "Spouse");
        if (!sp)
          birthdays.push({IdBirthDay: new Date().getTime()+1000 , Type: "Spouse"})

        let an = res.data.find((bd) => bd.Type == "Anniversary");
        if (!an)
          birthdays.push({IdBirthDay: new Date().getTime()+2000 , Type: "Anniversary"})

        setBirthdays(birthdays);
        if (birthdays.filter((bd) => bd.Type == "BirthDay").length > 0) 
          setBirthday(birthdays.find((bd) => bd.Type == "BirthDay"))
        if (birthdays.filter((bd) => bd.Type == "Spouse").length > 0) 
          setSpouse(birthdays.find((bd) => bd.Type == "Spouse"))
        if (birthdays.filter((bd) => bd.Type == "Anniversary").length > 0) 
          setAnniversary(birthdays.find((bd) => bd.Type == "Anniversary"))
        
      })

      window.parent.postMessage({ title: "loaded", tabno }, "*");
    }

    getUser();
    getBirthDays();

  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    axios.post(`${host}/personnel/${idwinkart}/save_birthdays`, {birthdays: birthdays.filter(el => el.Date)}).then((res)=> {
      if (res.data == "success") {
        setMessageText("اطلاعات با موفقیت ذخیره شد")
      } else {
        console.log(res);
      }
    }).catch((err) => {
      setMessageText("امکان ثبت اطلاعات وجود ندارد. لطفا اطلاعات فرم را بررسی نمایید")
    }).finally(() => {
      setSaving(false);
    })
  }

  const handleAddChild = (e) => {
    e.preventDefault();
    setBirthdays([...birthdays, {IdBirthDay: new Date().getTime() , Type: "Child"}])
  }
  
  const setDate = (id, val) => {
    setBirthdays([...birthdays.map((bd) => bd.IdBirthDay != id ? bd : {...bd, Date: val})])
  }

  const handleRemove = (e, id) => {
    e.preventDefault();
    setBirthdays(birthdays.filter((bd) => bd.IdBirthDay != id))
  }

  return (
    <div>
      <div className={`${style.operationButtons}`} dir="rtl">
        <button
          className={`${style.operationButton}`}
          disabled={saving}
          onClick={(e) => handleSave(e)}
        >
          <IoSaveOutline />
          <span>{saving ? "درحال ذخیره" : "ذخیره"}</span>
        </button>
        
      </div>
      <FormContainer dir="rtl">
        <h1>پروفایل کاربر</h1>
        <label>نام و نام خانوادگی</label>
        <span>{fullName}</span>
        <label>کد پرسنلی</label>
        <span>{idwinkart}</span>
        <label>تاریخ تولد</label>
        <Datepicker calformat="jalali" value={birthday.Date} onChange={(val) => setDate(birthday.IdBirthDay, val)}/>
        <label>تاریخ تولد همسر</label>
        <Datepicker calformat="jalali" value={spouse.Date} onChange={(val) => setDate(spouse.IdBirthDay, val)}/>
        <label>تاریخ ازدواج</label>
        <Datepicker calformat="jalali" value={anniversary.Date} onChange={(val) => setDate(anniversary.IdBirthDay, val)}/>
        <label>تاریخ تولد فرزندان</label>
        <div>
          {birthdays.filter((bd) => bd.Type == "Child").map((bd) => 
            <div className={style.childDiv} key={bd.IdBirthDay}>
              <Datepicker calformat="jalali" value={bd.Date} onChange={(val) => setDate(bd.IdBirthDay, val)} style={{width: "230px"}}/>
              <button
                className={`${style.operationButton} ${style.btnRemove}`}
                disabled={saving}
                onClick={(e) => handleRemove(e, bd.IdBirthDay)}
              >
                <IoTrash />
                <span>حذف</span>
              </button>
            </div>
          )}
          <button className={style.formButton} onClick={(e) => {
            handleAddChild(e)
          }}>افزودن فرزند جدید</button>
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
    </div>)
}