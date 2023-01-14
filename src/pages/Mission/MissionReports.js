import { useContext, useEffect, useState } from "react";
import {
  IoAttachOutline,
  IoSaveOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useParams, useSearchParams } from "react-router-dom";
import FormContainer from "../../components/FormContainer";
import style from "./MissionReports.module.scss";
import Modal from "../../components/Modal";
import Datepicker from "../../components/Datepicker";
import { shamsiDate } from "../../Utils/public";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { host } from "../../Utils/host";
import axios from "axios";
import Message from "../../components/Message";
import Timepicker from "../../components/Timepicker";
import MultiFileUploader from "../../components/MultiFileUploader";
import { AppContext } from "../../App";

const roleTypes = [
  { id: 1, title: "مامور" },
  { id: 2, title: "رئیس هیئت" },
];

export default function MissionReports(props) {
  const { iduser, idmission, idmissioner } = useParams();
  const isMissioner = idmissioner == iduser;
  const { isMobile } = useContext(AppContext);

  const defaultAchievement = {
    IdWorkMissionAchievement: null,
    IdWorkMission: idmission,
    IdWorkMissioner: idmissioner,
    Descr: null,
  };
  const [acheievements, setAchievements] = useState([]);

  const [saving, setSaving] = useState(false);
  const defaultReport = {
    IdWorkMissionReport: null,
    IdWorkMission: idmission,
    IdWorkMissioner: idmissioner,
    Subject: null,
    Date: null,
    DateShamsi: null,
    Venue: null,
    Done: null,
    ToDo: null,
    Follower: null,
    Note: null,
  };
  const [report, setReport] = useState(defaultReport);
  const [reports, setReports] = useState([]);

  const defaultMisisoner = {
    IdWorkMissioner: idmissioner,
    StartDate: null,
    StartDateShamsi: null,
    StartTime: null,
    EndDate: null,
    EndDateShamsi: null,
    EndTime: null,
    IdRoleType: null,
    RoleType: null,
    Note: null,
    Files: [],
  };
  const [missioner, setMissioner] = useState(defaultMisisoner);

  const [showingModal, setShowingModal] = useState(false);
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");
  const [messageText, setMessageText] = useState(false);

  const loadData = async () => {
    await axios
      .get(
        `${host}/users/${iduser}/work_missions/${idmission}/missioners/${idmissioner}/reports`
      )
      .then((res) => {
        setReports(res.data.reports);
        setAchievements(res.data.achievements);
        window.parent.postMessage({ title: "loaded", tabno }, "*");
      });
  };

  useEffect(() => {
    loadData();
    window.parent.postMessage({ title: "loaded", tabno }, "*");
  }, []);

  const handleNewReport = (e) => {
    e.preventDefault();
    setReport(defaultReport);
    setShowingModal(true);
  };

  const setDateMissioner = (name, val) => {
    setMissioner({
      ...missioner,
      [name]: val,
      [name + "Shamsi"]: shamsiDate(val),
    });
  };

  const setDate = (name, val) => {
    setReport({ ...report, [name]: val, [name + "Shamsi"]: shamsiDate(val) });
  };

  const setTime = (name, val) => {
    setMissioner({ ...missioner, [name]: val });
  };

  const handleUpdate = (e) => {
    setReport({ ...report, [e.target.name]: e.target.value });
  };
  const handleCancel = (e) => {
    e.preventDefault();
    setReport(defaultReport);
    setShowingModal(false);
  };

  const handleSaveReport = async (e) => {
    e.preventDefault();
    setReports([...reports, { ...report, AddDate: new Date() }]);
    setReport(defaultReport);
    setShowingModal(false);
  };

  const handleAddReport = (e) => {
    e.preventDefault();
    setReport(defaultReport);
    setShowingModal(true);
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    await axios
      .patch(
        `${host}/users/${iduser}/work_missions/${idmission}/missioners/${idmissioner}/reports/${id}`
      )
      .then((res) => {
        setMessageText("سند با موفقیت ابطال شد");
        loadData();
      })
      .catch((err) => {
        setMessageText("خطا در انجام درخواست");
      });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    axios
      .post(
        `${host}/users/${iduser}/work_missions/${idmission}/missioners/${idmissioner}/reports`,
        {
          ...missioner,
          work_mission_reports_attributes: reports,
          work_mission_achievements_attributes: acheievements,
        }
      )
      .then((res) => {
        setMessageText("سند با موفقیت ذخیره شد");
        loadData();
      })
      .catch((err) => {
        setMessageText("خطا در انجام درخواست");
      });
  };

  const handleRoleTypeUpdate = (e) => {
    setMissioner({
      ...missioner,
      IdRoleType: e.target.value,
      RoleType: roleTypes.find((type) => type.id == e.target.value).title,
    });
  };

  const handleRemoveReport = (e, id) => {
    e.preventDefault();
    setReports(
      reports.filter((report) => {
        if (report.IdWorkMissionReport == id || report.AddDate == id)
          return false;
        else return true;
      })
    );
  };

  const handleAchievementUpdate = (e, id) => {
    setAchievements(
      acheievements.map((ach) => {
        if (ach.IdWorkMissionAchievement == id || ach.AddDate == id) {
          return { ...ach, Descr: e.target.value };
        } else return ach;
      })
    );
  };

  const handleAddAchievement = (e) => {
    e.preventDefault();
    setAchievements([
      ...acheievements,
      { ...defaultAchievement, AddDate: new Date() },
    ]);
  };

  const handleRemoveAchievement = (e, id) => {
    e.preventDefault();
    setAchievements(
      acheievements.filter((ach) => {
        if (ach.IdWorkMissionAchievement == id || ach.AddDate == id)
          return false;
        else return true;
      })
    );
  };

  // const setFile = (name, val) => {
  //   setMissioner({ ...missioner, [name]: val });
  // };

  return (
    <div>
      <div className={`${style.operationButtons}`} dir="rtl">
        <button
          className={`${style.operationButton}`}
          onClick={(e) => handleSave(e)}
        >
          <IoSaveOutline />
          <span>ذخیره</span>
        </button>
      </div>
      <FormContainer dir="rtl" style={{ marginBottom: "150px" }}>
        <h1>گزارش ماموریت</h1>
        <label>نقش مامور</label>
        <div>
          {roleTypes.map((type) => {
            return (
              <div key={type.id}>
                <label>
                  <input
                    type="radio"
                    name="roleType"
                    value={type.id}
                    onChange={(e) => handleRoleTypeUpdate(e)}
                    checked={missioner.IdRoleType == type.id}
                  />
                  {type.title}
                </label>
              </div>
            );
          })}
        </div>
        <label>تاریخ عزیمت</label>
        <Datepicker
          value={missioner.StartDate}
          onChange={(val) => setDateMissioner("StartDate", val)}
          dir="rtl"
          name="mission_report_start_date"
        />
        <label>ساعت عزیمت</label>
        <Timepicker
          value={missioner.StartTime}
          onChange={(val) => setTime("StartTime", val)}
        />
        <label>تاریخ بازگشت</label>
        <Datepicker
          value={missioner.EndDate}
          onChange={(val) => setDateMissioner("EndDate", val)}
          dir="rtl"
          calforma="jalali"
          name="mission_report_end_date"
        />
        <label>ساعت بازگشت</label>
        <Timepicker
          value={missioner.EstimatedEndTime}
          onChange={(val) => setTime("EndTime", val)}
        />
        <h2 className={style.h2}>فعالیت ها و اقدامات</h2>
        <div className={style.reports}>
          {reports.map((report) => (
            <div
              key={report.IdWorkMissionReport || report.AddDate}
              className={style.report}
            >
              <label>موضوع</label>
              <span>{report.Subject}</span>
              <label>تاریخ</label>
              <span>{report.DateShamsi}</span>
              <label>محل</label>
              <span>{report.Venue}</span>
              <label>اقدامات انجام شده</label>
              <span>{report.Done}</span>
              <label>اقدامات نیازمند پیگیری</label>
              <span>{report.ToDo}</span>
              <label>مسئول پیگیری</label>
              <span>{report.Follower}</span>
              <label>ملاحظات</label>
              <span>{report.Note}</span>
              <button
                className={`${style.formButton} ${style.removeReport}`}
                onClick={(e) =>
                  handleRemoveReport(
                    e,
                    report.IdWorkMissionReport || report.AddDate
                  )
                }
              >
                <IoTrashOutline />
              </button>
            </div>
          ))}
        </div>
        <button
          className={`${style.formButton} ${style.addReport}`}
          onClick={(e) => {
            handleAddReport(e);
          }}
        >
          <IoIosAddCircleOutline />
          <span>افزودن فعالیت و اقدام جدید</span>
        </button>
        <h2 className={style.h2}>نتایج و دستاوردها</h2>
        <div className={style.achievements}>
          {acheievements.map((acheivement) => (
            <div
              key={acheivement.IdWorkMissionAchievement || acheivement.AddDate}
            >
              <input
                type="text"
                className={style.txt}
                value={acheivement.Descr}
                onChange={(e) =>
                  handleAchievementUpdate(
                    e,
                    acheivement.IdWorkMissionAchievement
                  )
                }
              />
              <button
                className={`${style.formButton} ${style.removeAchievement}`}
                onClick={(e) =>
                  handleRemoveAchievement(
                    e,
                    acheivement.IdWorkMissionAchievement || acheivement.AddDate
                  )
                }
              >
                <IoTrashOutline />
              </button>
            </div>
          ))}
        </div>
        <button
          className={`${style.formButton} ${style.addAchievement}`}
          onClick={(e) => {
            handleAddAchievement(e);
          }}
        >
          <IoIosAddCircleOutline />
          <span>افزودن نتیجه و دستاورد جدید</span>
        </button>
        <label>مجوز کمیسیون</label>
        {/* <MultiFileUploader
          files={missioner.Files}
          onChange={(files) => setFile("Files", files)}
        /> */}
      </FormContainer>
      {showingModal && (
        <Modal>
          <div className={style.modalForm}>
            <FormContainer
              dir="rtl"
              style={{
                marginTop: "0",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 4fr",
              }}
            >
              <h1 className={style.h1}>ثبت فعالیت جدید</h1>
              <label>موضوع</label>
              <input
                type="text"
                className={style.txt}
                value={report.Subject || ""}
                style={{ width: "100%" }}
                name="Subject"
                onChange={(e) => handleUpdate(e)}
              />
              <label>تاریخ</label>
              <Datepicker
                value={report.Date}
                onChange={(val) => setDate("Date", val)}
                dir="rtl"
                name="mission_report_date"
              />
              <label>محل</label>
              <input
                type="text"
                className={style.txt}
                value={report.Venue || ""}
                style={{ width: "100%" }}
                name="Venue"
                onChange={(e) => handleUpdate(e)}
              />
              <label>اقدامات انجام شده</label>
              <textarea
                type="text"
                className={style.txt}
                value={report.Done || ""}
                style={{ width: "100%" }}
                name="Done"
                onChange={(e) => handleUpdate(e)}
              />
              <label>اقدامات نیازمند پیگیری</label>
              <textarea
                type="text"
                className={style.txt}
                value={report.ToDo || ""}
                style={{ width: "100%" }}
                name="ToDo"
                onChange={(e) => handleUpdate(e)}
              />
              <label>مسئول پیگیری</label>
              <input
                type="text"
                className={style.txt}
                value={report.Follower || ""}
                style={{ width: "100%" }}
                name="Follower"
                onChange={(e) => handleUpdate(e)}
              />
              <label>ملاحظات</label>
              <input
                type="text"
                className={style.txt}
                value={report.Note || ""}
                style={{ width: "100%" }}
                name="Note"
                onChange={(e) => handleUpdate(e)}
              />
              <div className={style.formButtons}>
                <button
                  className={style.formButton}
                  onClick={(e) => handleSaveReport(e)}
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
