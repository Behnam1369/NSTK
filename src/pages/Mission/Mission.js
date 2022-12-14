import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import style from "./Mission.module.scss";
import { host } from "../../Utils/host";
import Datepicker from "../../../src/components/Datepicker";
import Timepicker from "../../components/Timepicker";
import MultiFileUploader from "../../components/MultiFileUploader";
import Selector from "../../components/Selector";
import { BsTrash } from "react-icons/bs";
import { IoSaveOutline } from "react-icons/io5";
import Message from "../../components/Message";

export default function Mission(props) {
  const [messageText, setMessageText] = useState(false);
  const [saving, setSaving] = useState(false);
  const { iduser, idmission } = useParams();
  const [users, setUsers] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const defaultData = {
    IdWorkMission: "",
    Subject: "",
    IdUser: iduser,
    IdWorkMissionObjective: null,
    OtherWorkMissionObjective: "",
    EstimatedStartDate: "",
    EstimatedStartTime: "",
    EstimatedEndDate: "",
    EstimatedEndTime: null,
    Origin: "",
    Destination: "",
    Note: "",
    CommissionPermit: [],
    ShastanPermit: [],
    MissionOrder: [],
    Ticket: [],
    Hotel: [],
    Payments: [],
    OtherFiles: [],
  };
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    const loadData = async () => {
      await axios
        .get(`${host}/users/${iduser}/work_missions/new`)
        .then((res) => {
          let loaded_users = res.data.data.users;
          setUsers(loaded_users);
          setObjectives(res.data.data.work_mission_objectives);
          if (idmission) {
            axios
              .get(`${host}/users/${iduser}/work_missions/${idmission}`)
              .then((res) => {
                let loadedDate = res.data.data;
                loadedDate.CommissionPermit = loadedDate.commission_permit;
                loadedDate.ShastanPermit = loadedDate.shastan_permit;
                loadedDate.MissionOrder = loadedDate.mission_order;
                loadedDate.Ticket = loadedDate.ticket;
                loadedDate.Hotel = loadedDate.hotel;
                loadedDate.Payments = loadedDate.payments;
                loadedDate.OtherFiles = loadedDate.other_files;
                setData(loadedDate);
                updateSelectedUsers(
                  res.data.data.work_missioners,
                  loaded_users
                );
              });
          }
        });
    };
    loadData();
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
  };

  const handleUpdate = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const setTime = (name, val) => {
    setData({ ...data, [name]: val });
  };

  const setDate = (name, val) => {
    // setData({ ...data, [name]: val });
  };

  const setFile = (name, val) => {
    setData({ ...data, [name]: val });
  };

  const handleUserSelect = (iduser) => {
    setUsers([
      ...users.filter((user) => user.IdUser !== iduser),
      ...users
        .filter((user) => user.IdUser === iduser)
        .map((user) => {
          return { ...user, selected: !user.selected };
        }),
    ]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let doc = {
      ...data,
      iduser,
      missioners: users
        .filter((user) => user.selected)
        .map((user) => user.IdUser)
        .join(","),
    };

    await axios.post(`${host}/work_missions`, doc).then((res) => {
      setSaving(false);
      setMessageText("?????????????? ???? ???????????? ?????? ????");
    });
  };

  console.log(data.ShastanPermit);

  return (
    <div>
      <div className={`${style.operationButtons}`} dir="rtl">
        <button
          className={`${style.operationButton}`}
          disabled={saving}
          onClick={(e) => handleSave(e)}
        >
          <IoSaveOutline />
          <span>{saving ? "?????????? ??????????" : "??????????"}</span>
        </button>
      </div>

      <div dir="rtl" className={style.mission}>
        <h1>????????????</h1>
        <label>??????????</label>
        <label>{data.IdWorkMission}</label>
        <label>?????????? ??????????????</label>
        <input
          type="text"
          className={style.txt}
          name="Subject"
          value={data.Subject}
          onChange={(e) => handleUpdate(e)}
          autoComplete="off"
        />
        <label>?????? ???? ??????????????</label>
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
                    handleUpdate(e);
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
        <label>?????????? ????????????</label>
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
                <div key={user.Username} className={style.missioner}>
                  {user.Fname} {user.Lname}
                  <BsTrash
                    className={style.remove}
                    title="Delete"
                    onClick={() => handleUserSelect(user.IdUser)}
                  />
                </div>
              );
            })}
        </div>
        <label>?????????? ??????????</label>
        <Datepicker
          value={data.EstimatedStartDate}
          onChange={(val) => setDate("EstimatedStartDate", val)}
          dir="rtl"
          name="mission_estimated_start_date"
        />
        <label>???????? ??????????</label>
        <Timepicker
          value={data.EstimatedStartTime}
          onChange={(val) => setTime("EstimatedStartTime", val)}
        />
        <label>?????????? ????????????</label>
        <Datepicker
          value={data.EstimatedEndDate}
          onChange={(val) => setDate("EstimatedEndDate", val)}
          dir="rtl"
          calforma="jalali"
          name="mission_estimated_end_date"
        />
        <label>???????? ????????????</label>
        <Timepicker
          value={data.EstimatedEndTime}
          onChange={(val) => setTime("EstimatedEndTime", val)}
        />
        <label>????????</label>
        <input
          type="text"
          className={style.txt}
          name="Origin"
          value={data.Origin}
          onChange={(e) => handleUpdate(e)}
          autoComplete="off"
          style={{ width: "250px" }}
        />
        <label>????????</label>
        <input
          type="text"
          className={style.txt}
          name="Destination"
          value={data.Destination}
          onChange={(e) => handleUpdate(e)}
          autoComplete="off"
          style={{ width: "250px" }}
        />
        <label>??????????????</label>
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
        <label>???????? ??????????????</label>
        <MultiFileUploader
          files={data.CommissionPermit}
          onChange={(files) => setFile("CommissionPermit", files)}
        />
        <h1>?????????? ????????????</h1>
        <label>???????? ??????????</label>
        <MultiFileUploader
          files={data.ShastanPermit}
          onChange={(f) => setFile("ShastanPermit", f)}
        />
        <label>?????? ??????????????</label>
        <MultiFileUploader
          files={data.MissionOrder}
          onChange={(f) => setFile("MissionOrder", f)}
        />
        <label>????????</label>
        <MultiFileUploader
          files={data.Ticket}
          onChange={(f) => setFile("ticket", f)}
        />
        <label>??????</label>
        <MultiFileUploader
          files={data.Hotel}
          onChange={(f) => setFile("hotel", f)}
        />
        <label>?????????? ???????????? ???? ??????????</label>
        <MultiFileUploader
          files={data.Payments}
          onChange={(f) => setFile("Payments", f)}
        />
        <label>???????? ??????????</label>
        <MultiFileUploader
          files={data.OtherFiles}
          onChange={(f) => setFile("OtherFiles", f)}
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
