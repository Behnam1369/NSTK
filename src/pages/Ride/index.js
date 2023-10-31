import { useParams, useSearchParams } from "react-router-dom";
import style from "./index.module.scss";
import { useEffect, useState } from "react";
import Message from "../../components/Message";
import { shamsiDate, thousandSep, today } from "../../Utils/public";
import FormContainer from "../../components/FormContainer";
import { host } from "../../Utils/host";
import axios from "axios";
import Datepicker from "../../components/Datepicker";
import Timepicker from "../../components/Timepicker";
import TagSingleSelector from "../../components/TagSingleSelector";
import { IoAttachOutline, IoSaveOutline, IoChevronForward } from "react-icons/io5";

const defaultRide = {
  IdRide: null,
  IdUser: null,
  FullName: null,
  IdRole: null,
  Role: null,
  IdDept: null,
  Dept: null,
  IdDriver: null,
  Driver: null,
  IdRideType: null,
  RideType: null,
  Destination: null,
  Date: null,
  ShamsiDate: null,
  StartTime: null,
  EndTime: null,
  Note: null,
  IdState: 0,
  State: 'درخواست شده',
  IdApprovedBy: null,
  ApprovedBy: null
}

const states = [
  {IdState: 0, Title: 'درخواست شده'},
  {IdState: -1, Title: 'حذف شده'},
  {IdState:1, Title: 'تایید توسط پشتیبانی'},
  {IdState:2, Title: 'تایید توسط متقاضی'},
]

const rideTypes= [
  {IdRideType: 1, Title:'خودرو'},
  {IdRideType: 2, Title:'پیک'},
]

const drivers = [
  {IdDriver: 13019, FullName: 'ابوالفضل موحدی', IdRideType:1 },
  {IdDriver: 14069, FullName: 'حمید نیازیان', IdRideType:1 },
  {IdDriver: 14090, FullName: 'ناصر حسین پور', IdRideType:1 },
  {IdDriver: 14015, FullName: 'میرجمال موسوی', IdRideType:2 },
  {IdDriver: 14054, FullName: 'محمدهادی خومرتضایی', IdRideType:2 },
]

const admins = [
  "1", // Aghaali
  "41", // Rayat
  "118", // Afrasiabi
]

export default function Ride() {
  const { iduser, idride} = useParams();
  const [ride, setRide] = useState(defaultRide);
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");
  const [saving, setSaving] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!idride) {
        await axios.get(`${host}/users/${iduser}/rides/new`).then((res) => {
          setRide({...ride, ...res.data});
        });
        window.parent.postMessage({ title: "loaded", tabno }, "*");
      } 
      else {
        await axios.get(`${host}/users/${iduser}/rides/${idride}`).then((res) => {
          setRide({...ride, ...res.data.ride});
        });
        window.parent.postMessage({ title: "loaded", tabno }, "*");
      }
    }

    loadData();
  }, []);

  const handleAttachment = (e) => {
    e.preventDefault();
    if (ride.IdRide) {
      window.parent.postMessage(
        {
          title: "ride",
          args: { idform: 152, idvch: ride.IdRide },
          tabTitle: `پیوست های درخواست ترابری ${ride.IdRide}`,
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
    if (!ride.IdRide) {
      setSaving(true);
      axios.post(`${host}/users/${iduser}/rides`, ride).then((res) => {
        setRide(res.data);
        setMessageText('اطلاعات با موفقیت ذخیره گردید');
        setSaving(false);
      })
    } else {
      setSaving(true);
      axios.patch(`${host}/users/${iduser}/rides/${ride.IdRide}`, ride).then((res) => {
        setRide(res.data);
        setMessageText('اطلاعات با موفقیت ذخیره گردید');
        setSaving(false);
      })
    }
  }

  const handleUpdate = (e) => {
    setRide({...ride, [e.target.name]: e.target.value })
  }

  const setDate = (name, val) => {
    setRide({ ...ride, [name]: val, ["Shamsi"+name]: shamsiDate(val) });
  };

  const setTime = (name, val) => {
    setRide({ ...ride, [name]: val });
  };

  const handleRideTypeChange = (val) => {
    setRide({...ride, IdRideType: val, RideType: rideTypes.find(el => el.IdRideType == val).Title, IdDriver: null, Driver: null })
  }

  const handleDriverChange = (val) => {
    if (!admins.includes(iduser))
      return;
      setRide({...ride, IdDriver: val, Driver: drivers.find(el => el.IdDriver == val).FullName })
  }

  const handleAdminConfirm = (val) => {
    if (!ride.IdRide) {
      setMessageText("این درخواست هنوز ذخیره نشده است.");
    } else {
      if (!ride.IdDriver) {
        setMessageText("لطفاً راننده / پیک را انتخاب نمایید.");
      } else {
        setSaving(true);
      axios.patch(`${host}/users/${iduser}/rides/${ride.IdRide}/admin_confirm`, {...ride,
        IdApprovedBy: iduser,
        IdState: 1,
        State: states.find(el => el.IdState == 1).Title,
      }).then((res) => {
        setRide(res.data);
        setMessageText('اطلاعات با موفقیت ذخیره گردید');
        setSaving(false);
      })
      }
    }
  }

  const handleUserConfirm = (val) => {
    setSaving(true);
    axios.patch(`${host}/users/${iduser}/rides/${ride.IdRide}/user_confirm`, {
      IdState: 2,
      State: states.find(el => el.IdState == 2).Title,
    }).then((res) => {
      setRide(res.data);
      setMessageText('اطلاعات با موفقیت ذخیره گردید');
      setSaving(false);
    })
  }

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

        { ride.IdState == 0 && (
          <button
            className={`${style.operationButton}`}
            onClick={(e) => handleSave(e)}
            disabled={saving}
          >
            <IoSaveOutline />
            <span>ذخیره</span>
          </button>)
        }
        {admins.includes(iduser) && ride.IdState == 0 && ride.IdRide > 0 &&  (
          <>
            <button
              className={`${style.operationButton}`}
              onClick={(e) => handleAdminConfirm(e)}
              disabled={saving}
            >
              <span>تایید پشتیبانی</span>
            </button>
          </>
        )}
        {ride.IdState == 1 && iduser == ride.IdUser && (
          <>
            <button
              className={`${style.operationButton}`}
              onClick={(e) => handleUserConfirm(e)}
              disabled={saving}
            >
              <span>تایید متقاضی</span>
            </button>
          </>
        )}
      </div>
      <FormContainer dir="rtl">
        <h1>درخواست خدمات ترابری</h1>
        <label>سریال</label>
        <span>{ride.IdRide}</span>
        <label>نام و نام خانوادگی</label>
        <span>{ride.FullName}</span>
        <label>سمت</label>
        <span>{ride.Role}</span>
        <label>واحد سازمانی</label>
        <span>{ride.Dept}</span>
        <label>مقصد</label>
        <input
          type="text"
          className={style.txt}
          value={ride.Destination}
          style={{ width: "300px", height: "25px" }}
          name="Destination"
          onChange={(e) => handleUpdate(e)}
        />
        <label>تاریخ</label>
        <Datepicker
          value={ride.Date}
          onChange={(val) => setDate("Date", val)}
          name="ride_date"
        />
        <label>ساعت خروج</label>
        <Timepicker
          value={ride.StartTime}
          onChange={(val) => setTime("StartTime", val)}
        />
        <label>ساعت بازگشت</label>
        <Timepicker
          value={ride.EndTime}
          onChange={(val) => setTime("EndTime", val)}
        />
        <label>نوع وسیله مقلیه</label>
        <TagSingleSelector
          data= {rideTypes}
          id="IdRideType"
          title="Title"
          selectedValue={ride.IdRideType}
          onChange={(val) => handleRideTypeChange(val)}
        />
        <label>توضیحات</label>
        <textarea
          type="text"
          className={style.txt}
          value={ride.Note || ""}
          style={{ width: "100%", height: "100px" }}
          name="Note"
          onChange={(e) => handleUpdate(e)}
        ></textarea>
        {ride.IdRide && admins.includes(iduser) && (
          <>
            <label>راننده / پیک</label>
            <TagSingleSelector
              data= {drivers.filter(el => el.IdRideType == ride.IdRideType )}
              id="IdDriver"
              title="FullName"
              selectedValue={ride.IdDriver}
              onChange={(val) => handleDriverChange(val)}
            />
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
    </>)
}