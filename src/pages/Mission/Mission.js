import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import style from "./Mission.module.scss";
import { host } from "../../Utils/host";
import Datepicker from "../../../src/components/Datepicker";
import Timepicker from "../../components/Timepicker";
import MultiFileUploader from "../../components/MultiFileUploader";
import Selector from "../../components/Selector";
import { BsTrash } from "react-icons/bs";
import { IoAttachOutline, IoPrintOutline, IoSaveOutline } from "react-icons/io5";
import Message from "../../components/Message";
import AmountInput from "../../components/AmountInput";
import { shamsiDate } from "../../Utils/public";

const missionTypes = [
  { id: 1, title: "ماموریت داخلی" },
  { id: 2, title: "ماموریت خارجی" },
];

const requirements = [
  { id: 1, title: "دعوت نامه" },
  { id: 2, title: "ویزا" },
  { id: 3, title: "بلیط" },
]

export default function Mission(props) {
  const [messageText, setMessageText] = useState(false);
  const [saving, setSaving] = useState(false);
  const { iduser, idmission } = useParams();
  const [users, setUsers] = useState([]);
  const [curs, setCurs] = useState([]);
  const [objectives, setObjectives] = useState([]);

  const defaultData = {
    IdWorkMission: null,
    Subject: "",
    IdUser: iduser,
    WorkMissioners: "",
    IdWorkMissionObjective: null,
    WorkMissionObjective: null,
    OtherWorkMissionObjective: "",
    IdMissionType: null,
    MissionType: "",
    EstimatedStartDate: "",
    EstimatedStartDateShamsi: "",
    EstimatedStartTime: "",
    EstimatedEndDate: "",
    EstimatedEndDateShamsi: "",
    EstimatedEndTime: null,
    Origin: "",
    Destination: "",
    IdRequirement: "",
    Requirements: "",
    Vehicle: "",
    ResidencePlace: "",
    IdPettyCashHolder: null,
    PettyCashAmount: "",
    IdCur: null,
    Abr: "",
    OtherRequirements: "",
    Note: "",
    CommissionPermit: "",
    ShastanPermit: "",
    LeavePermit:"",
    MissionOrder: "",
    Visa:"",
    Ticket: "",
    Hotel: "",
    Payments: "",
    OtherFiles: "",
  };
  const [data, setData] = useState(defaultData);
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");

  useEffect(() => {
    const loadData = async () => {
      await axios
        .get(`${host}/users/${iduser}/work_missions/${idmission || 'new'}`)
        .then((res) => {
          let loaded_users = res.data.data.users;
          setUsers(loaded_users);
          setObjectives(res.data.data.work_mission_objectives);
          setCurs(res.data.data.currencies);
          
          if (idmission) {
            updateSelectedUsers(res.data.data.work_missioners, loaded_users)
            setData(res.data.data.work_mission);
          }
        });
    };
    loadData();
    window.parent.postMessage({ title: "loaded", tabno }, "*");
  }, [iduser]);

  const updateSelectedUsers = (arr, loaded_users) => {
    arr = arr.map((item) => item.IdUser);
    setUsers(
      loaded_users.map((el) => {
        if (arr.includes(el.IdUser)) {
          return { ...el, selected: true };
        } else {
          return { ...el, selected: false };
        }
      })
    );

    setData({...data, 
      WorkMissioners: arr.filter(user => user.selected).map(
        user => user.Fname + " " + user.Lname
      ).join("، ")
    })
  };

  const handleUpdate = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const setTime = (name, val) => {
    setData({ ...data, [name]: val  });
  };

  const setDate = (name, val) => {
    setData({ ...data, [name]: val, [name+"Shamsi"]: shamsiDate(val) });
  };

  const setFile = (name, val) => {
    setData({ ...data, [name]: val });
  };

  const handleUserSelect = (iduser) => {
    var newArr = [
      ...users.filter((user) => user.IdUser !== iduser),
      ...users
        .filter((user) => user.IdUser === iduser)
        .map((user) => {
          return { ...user, selected: !user.selected };
        }),
    ]
    setUsers(newArr);
    setData({...data, 
      WorkMissioners: newArr.filter(user => user.selected).map(
        user => user.Fname + " " + user.Lname
      ).join("، ")
    })
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let doc = {
      ...data,
      iduser,
      work_missioners: users
        .filter((user) => user.selected)
        .map((user) => {return {IdUser: user.IdUser}} )
    };

    await axios.post(`${host}/work_missions`, doc).then((res) => {
      setSaving(false);
      setData(res.data.work_mission);
      setMessageText("اطلاعات با موفقیت ثبت شد");
    });
  };

  const handleFinance = (e, iduser, idmission, fullname) => {
    e.preventDefault();
    window.parent.postMessage(
      {
        title: "work_mission_payments",
        args: { iduser, idmission },
        tabTitle: `اطلاعات مالی ماموریت ${fullname}`,
      },
      "*"
    );
  };

  const handleMissionReport = (e, iduser, idmission, fullname) => {
    e.preventDefault();
    window.parent.postMessage(
      {
        title: "work_mission_report",
        args: { iduser, idmission },
        tabTitle: `گزارش ماموریت ${fullname}`,
      },
      "*"
    );
  };

  const handleMissionTypeUpdate = (e) => {
    setData({
      ...data,
      IdMissionType: e.target.value,
      MissionType: missionTypes.find((type) => type.id == e.target.value).title,
    });
  };

  const handleRequirementUpdate = (e) => {
    if (data.IdRequirement.split(',').includes(e.target.value.toString())) {
      setData({
        ...data,
        IdRequirement: data.IdRequirement.split(',').filter((item) => item != e.target.value).join(','),
        Requirements: data.Requirements.split(',').filter((item) => item != requirements.find((type) => type.id == e.target.value).title).join(','),
      });
      return;
    } else {
      if (data.IdRequirement == "") {
        setData({
          ...data,
          IdRequirement: e.target.value,
          Requirements: requirements.find((type) => type.id == e.target.value).title,
        });
      } else {
        let id = data.IdRequirement.split(',');
        id.push(e.target.value);
        let title = data.Requirements.split(',');
        title.push(requirements.find((type) => type.id == e.target.value).title);
        setData({
          ...data,
          IdRequirement: id.join(','),
          Requirements: title.join(','),
        });
      }
    }
  }

  const handleAmountChange = (val) => {
    setData({ ...data, PettyCashAmount: val });
  };

  const handleCurSelect = (idcur) => {
    setData({ ...data, IdCur: idcur, Abr: curs.find((cur) => cur.IdCur == idcur).Abr });
  }

  const handlePettyCashHolderSelect = (iduser) => {
    var user = users.find((user) => user.IdUser == iduser);
    var fullname = user.Fname + " " + user.Lname;
    setData({ ...data, IdPettyCashHolder: iduser, PettyCashHolder: fullname });
  }

  const handlePrint = (e) => {
    e.preventDefault();
    if (data.IdWorkMission) {
      window.parent.postMessage(
        {
          title: "print",
          endpoint: "PrintWorkMission",
          args: { idworkmission: data.IdWorkMission},
          tabTitle: `چاپ درخواست ماموریت ${data.IdWorkMission}`,
          tabno,
        },
        "*"
      );
    } else {
      setMessageText("ابتدا سند را ذخیره کنید");
    }
  };



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
        <button
          className={`${style.operationButton}`}
          onClick={(e) => handlePrint(e)}
        >
          <IoPrintOutline />
          <span>چاپ</span>
        </button>
      </div>

      <div dir="rtl" className={style.mission}>
        <h1>متقاضی</h1>
        <label>سریال</label>
        <label>{data.IdWorkMission}</label>
        <label>موضوع ماموریت</label>
        <input
          type="text"
          className={style.txt}
          name="Subject"
          value={data.Subject}
          onChange={(e) => handleUpdate(e)}
          autoComplete="off"
        />
        <label>نوع ماموریت</label>
        <div>
          {missionTypes.map((type) => {
            return (
              <div key={type.id}>
                <label>
                  <input
                    type="radio"
                    value={type.id}
                    onChange={(e) => handleMissionTypeUpdate(e)}
                    checked={data.IdMissionType == type.id}
                  />
                  {type.title}
                </label>
              </div>
            );
          })}
        </div>
        <label>امکانات مورد نیاز</label>
        <div>
          {requirements.map((requirement) => {
            return (
              <div key={requirement.id}>
                <label>
                  <input
                    type="checkbox"
                    value={requirement.id}
                    onChange={(e) => handleRequirementUpdate(e)}
                    checked={data.IdRequirement.split(',').includes(requirement.id.toString())}
                  />
                  {requirement.title}
                </label>
              </div>
            );
          })}
        </div>
        <label>وسیله ایاب و ذهاب</label>
        <input
          type="text"
          className={style.txt}
          name="Vehicle"
          value={data.Vehicle}
          onChange={(e) => handleUpdate(e)}
          autoComplete="off"
          style={{ width: "250px" }}
        />
        <label>محل اقامت</label>
        <input
          type="text"
          className={style.txt}
          name="ResidencePlace"
          value={data.ResidencePlace}
          onChange={(e) => handleUpdate(e)}
          autoComplete="off"
          style={{ width: "250px" }}
        />
        <label>هدف از ماموریت</label>
        <div>
          {objectives.map((objective) => {
            return (
              <label
                key={objective.IdWorkMissionObjective}
                style={{ marginLeft: "10px" }}
              >
                <input
                  type="radio"
                  name="IdWorkMissionObjective"
                  value={objective.IdWorkMissionObjective}
                  onChange={(e) => {
                    setData({...data, 
                      IdWorkMissionObjective: e.target.value,
                      WorkMissionObjective: objectives.find(objective => objective.IdWorkMissionObjective == e.target.value)["Title"] })
                  }}
                  checked={
                    objective.IdWorkMissionObjective ==
                    data.IdWorkMissionObjective
                      ? "checked"
                      : ""
                  }
                />
                {objective.Title}
              </label>
            );
          })}
          {data.IdWorkMissionObjective == 99 && (
            <input
              type="text"
              className={style.txt}
              name="OtherWorkMissionObjective"
              value={data.OtherWorkMissionObjective}
              onChange={(e) => handleUpdate(e)}
              autoComplete="off"
            />
          )}
        </div>
        <label>نفرات اعزامی</label>
        <div>
          {
            <Selector
              data={users
                .filter((user) => user.Lname && !user.selected)
                .map((user) => {
                  return { ...user, FullName: user.Fname + " " + user.Lname };
                })}
              id="IdUser"
              title="FullName"
              width={250}
              selectionChanged={(iduser) => handleUserSelect(iduser)}
              dir="rtl"
              fontFamily={"IranSansLight"}
            />
          }

          {users
            .filter((user) => user.selected)
            .map((user) => {
              return (
                <div key={user.IdUser}>
                  <div
                    key={user.Username}
                    className={style.missioner}
                    style={{ display: "inline-flex" }}
                  >
                    {user.Fname} {user.Lname}
                    <BsTrash
                      className={style.remove}
                      title="Delete"
                      onClick={() => handleUserSelect(user.IdUser)}
                    />
                  </div>
                  <button
                    className={style.formButton}
                    style={{
                      display: "inline",
                      fontSize: "10px",
                      marginRight: "10px",
                    }}
                    onClick={(e) =>
                      handleFinance(
                        e,
                        user.IdUser,
                        data.IdWorkMission,
                        user.Fname + " " + user.Lname
                      )
                    }
                  >
                    اطلاعات مالی
                  </button>
                  {iduser == user.IdUser && (
                    <button
                      className={style.formButton}
                      style={{
                        display: "inline",
                        fontSize: "10px",
                        marginRight: "10px",
                      }}
                      onClick={(e) =>
                        handleMissionReport(
                          e,
                          user.IdUser,
                          data.IdWorkMission,
                          user.Fname + " " + user.Lname
                        )
                      }
                    >
                      گزارش ماموریت
                    </button>
                  )}
                </div>
              );
            })}
        </div>
        <label>تنخواه دار</label>
        <Selector
          data={users
            .filter((user) => user.Lname && user.selected)
            .map((user) => {
              return { ...user, FullName: user.Fname + " " + user.Lname };
            })}
          id="IdUser"
          title="FullName"
          width={250}
          selectionChanged={(iduser) => handlePettyCashHolderSelect(iduser)}
          value={data.IdPettyCashHolder}
          dir="rtl"
          fontFamily={"IranSansLight"}
        />
        <label>مبلغ تنخواه مورد نیاز</label>
        <AmountInput
          width="135px"
          value={data.PettyCashAmount}
          onChange={(val) => handleAmountChange(val)}
        />
        <label>ارز</label>
        <Selector
          data={curs}
          id="IdCur"
          title="Abr"
          width={100}
          selectionChanged={(idcur) => handleCurSelect(idcur)}
          value={data.IdCur}
          dir="rtl"
          fontFamily={"Arial"}
        />
        <label>تاریخ عزیمت</label>
        <Datepicker
          value={data.EstimatedStartDate}
          onChange={(val) => setDate("EstimatedStartDate", val)}
          dir="rtl"
          calforma="jalali"
          name="mission_estimated_start_date"
        />
        <label>ساعت عزیمت</label>
        <Timepicker
          value={data.EstimatedStartTime}
          onChange={(val) => setTime("EstimatedStartTime", val)}
        />
        <label>تاریخ بازگشت</label>
        <Datepicker
          value={data.EstimatedEndDate}
          onChange={(val) => setDate("EstimatedEndDate", val)}
          dir="rtl"
          calforma="jalali"
          name="mission_estimated_end_date"
        />
        <label>ساعت بازگشت</label>
        <Timepicker
          value={data.EstimatedEndTime}
          onChange={(val) => setTime("EstimatedEndTime", val)}
        />
        <label>مبدا</label>
        <input
          type="text"
          className={style.txt}
          name="Origin"
          value={data.Origin}
          onChange={(e) => handleUpdate(e)}
          autoComplete="off"
          style={{ width: "250px" }}
        />
        <label>مقصد</label>
        <input
          type="text"
          className={style.txt}
          name="Destination"
          value={data.Destination}
          onChange={(e) => handleUpdate(e)}
          autoComplete="off"
          style={{ width: "250px" }}
        />
        <label>توضیحات</label>
        <textarea
          className={style.txt}
          name="Note"
          value={data.Note}
          onChange={(e) => handleUpdate(e)}
          autoComplete="off"
          style={{
            maxWidth: "520px",
            width: "100%",
            height: "150px",
            boxSizing: "border-box",
          }}
        ></textarea>
        <label>مجوز کمیته تخصصی / مجوز مدیریت</label>
        <MultiFileUploader
          idfiles={data.CommissionPermit}
          onChange={(idfiles) => setFile("CommissionPermit", idfiles)}
        />
        <h1>منابع انسانی</h1>
        <label>مجوز شستان</label>
        <MultiFileUploader
          idfiles={data.ShastanPermit}
          onChange={(idfiles) => setFile("ShastanPermit", idfiles)}
        />
        <label>مجوز خروج</label>
        <MultiFileUploader
          idfiles={data.LeavePermit}
          onChange={(idfiles) => setFile("LeavePermit", idfiles)}
        />
        <label>حکم ماموریت</label>
        <MultiFileUploader
          idfiles={data.MissionOrder}
          onChange={(idfiles) => setFile("MissionOrder", idfiles)}
        />
        <label>بلیط</label>
        <MultiFileUploader
          idfiles={data.Ticket}
          onChange={(idfiles) => setFile("ticket", idfiles)}
        />
        <label>هتل</label>
        <MultiFileUploader
          idfiles={data.Hotel}
          onChange={(idfiles) => setFile("hotel", idfiles)}
        />
        <label>اسناد پرداخت به مامور</label>
        <MultiFileUploader
          idfiles={data.Payments}
          onChange={(idfiles) => setFile("Payments", idfiles)}
        />
        <label>سایر مدارک</label>
        <MultiFileUploader
          idfiles={data.OtherFiles}
          onChange={(idfiles) => setFile("OtherFiles", idfiles)}
        />
      </div> 
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
