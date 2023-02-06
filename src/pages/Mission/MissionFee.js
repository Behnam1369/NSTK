import { useEffect, useState } from "react";
import style from "./MissionFee.module.scss";
import { host } from "../../Utils/host";
import axios from "axios";
import { IoCloseOutline, IoSaveOutline } from "react-icons/io5";
import AmountInput from "../../components/AmountInput";

export default function MissionFee({ idmission, iduser, onClose }) {
  const [data, setData] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const loadData = async () => {
      await axios
        .get(`${host}/users/${iduser}/work_missions/${idmission}/mission_fee`)
        .then((res) => {
          setData(res.data.wm);
        });
    };
    loadData();
  }, [idmission, iduser]);

  const handleClose = () => {
    onClose(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (saving) return;

    setMessage("");
    setSaving(true);
    await axios
      .patch(
        `${host}/users/${iduser}/work_missions/${idmission}/mission_fee`,
        data.map((el) => {
          return {
            IdUser: el.IdUser,
            IdWorkMission: idmission,
            MissionDays: el.MissionDays,
            MissionFeeRate: el.MissionFeeRate,
            ActualMissionFee: el.ActualMissionFee,
          };
        })
      )
      .then((res) => {
        if (res.data.message === "Success") {
          setSaving(false);
          setMessage("اطلاعات با موفقیت ذخیره شد.");
        }
      });
  };

  const handlePrint = (e) => {
    e.preventDefault();
    window.parent.postMessage(
      {
        title: "print",
        endpoint: "PrintWorkMissionFee",
        args: { idworkmission: idmission },
        tabTitle: `چاپ گزارش حق ماموریت ${idmission}`,
      },
      "*"
    );
  };

  const handleChange = (val, id, name) => {
    setData(
      data.map((item) => {
        if (item.IdUser === id) {
          let r = { ...item, [name]: val };
          if (r.MissionFeeRate > 0 && r.MissionDays > 0) {
            r.ActualMissionFee = r.MissionFeeRate * r.MissionDays;
          } else {
            r.ActualMissionFee = "";
          }
          return r;
        }
        return item;
      })
    );
  };

  return (
    <div className={style.main}>
      <div className={style.header}>
        <h1>فرم محاسبه حق ماموریت</h1>
        <IoCloseOutline onClick={() => handleClose()} className={style.close} />
      </div>
      <div className={style.body}>
        <div className={style.row}>
          <div className={style.heading}>نام مامور</div>
          <div className={style.heading}>تاریخ عزیمت</div>
          <div className={style.heading}>تاریخ بازگشت</div>
          <div className={style.heading}>تعداد روز ماموریت</div>
          <div className={style.heading}>فی</div>
          <div className={style.heading}>مبلغ</div>
        </div>
        {data.length > 0 &&
          data.map((item) => (
            <div className={style.row} key={item.IdUser}>
              <div>
                {item.Fname} {item.Lname}
              </div>
              <div>
                {item.StartDateShamsi} {item.StartTime.substr(0, 5)}{" "}
              </div>
              <div>
                {item.EndDateShamsi} {item.EndTime.substr(0, 5)}{" "}
              </div>
              <div>
                <AmountInput
                  type="number"
                  value={item.MissionDays}
                  onChange={(val) =>
                    handleChange(val, item.IdUser, "MissionDays")
                  }
                />
              </div>
              <div>
                <AmountInput
                  type="number"
                  value={item.MissionFeeRate}
                  onChange={(val) =>
                    handleChange(val, item.IdUser, "MissionFeeRate")
                  }
                />
              </div>
              <div>
                <AmountInput type="number" value={item.ActualMissionFee} />
              </div>
            </div>
          ))}
      </div>
      <div className={style.footer}>
        <button className={style.formButton} onClick={(e) => handleSave(e)}>
          <IoSaveOutline />
          <span>{saving ? "درحال ذخیره" : "ذخیره"}</span>
        </button>
        <button className={style.formButton} onClick={(e) => handlePrint(e)}>
          <IoSaveOutline />
          <span>چاپ</span>
        </button>
      </div>
      <div>
        <p>{message}</p>
      </div>
    </div>
  );
}
