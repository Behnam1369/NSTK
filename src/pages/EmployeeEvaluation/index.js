import axios from "axios"
import { useEffect, useState } from "react"
import { host } from "../../Utils/host"
import { useParams, useSearchParams } from "react-router-dom";
import style from "./index.module.scss";
import { IoPrint } from "react-icons/io5";

export default function EmployeeEvaluation() {
  const { iduser } = useParams();
  const [ evaluations, setEvaluations ] = useState([]);
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");

  useEffect(() => {
    const getdate = async () => {
      await axios.get(`${host}/users/${iduser}/employee_evaluations`)
      .then((res) => setEvaluations(
        res.data.sort((a,b) => a.Quarter < b.Quarter)
      ))
      window.parent.postMessage({ title: "loaded", tabno }, "*");
    }
    getdate();
  },[])

  const ratable = (user, quarter) =>{
    if (evaluations[0].Quarter != quarter) return false
    if (iduser == user.IdUser) return false
    return true;
  }

  const handleOpen = (iduser, quarter) => {
    window.parent.postMessage(
      {
        title: "evaluation",
        args: { iduser, quarter },
        tabTitle: `فرم ارزیابی عملکرد`,
        tabno,
      },
      "*"
    );
  }

  const handlePrint = (e, quarter) => {
    e.preventDefault();
    window.parent.postMessage(
      {
        title: "print",
        endpoint: "PrintEmployeeEvaluationList",
        args: { quarter },
        tabTitle: `چاپ نتیجه ارزیابی عملکرد`,
        tabno,
      },
      "*"
    );
  }

  const users = (quarter)  => {
    return JSON.parse(evaluations.find(evaluation => evaluation.Quarter == quarter).Users)
  }

  return (
    <ul className={style.evaluations}>
      {evaluations.sort((a,b) => b.Quarter - a.Quarter)
                  .map((evaluation) => (
        <li key={evaluation.Quarter}>
          <h2>
            ارزیابی {evaluation.FirstDayOfQuarter} لغایت {evaluation.LastDayOfQuarter}
            { ["1", "33", "46", "47", "118"].includes(iduser) &&
              <IoPrint className={style.btnPrint} title="چاپ" onClick={(e) => handlePrint(e, evaluation.Quarter)} />
            }
            
          </h2>
          {evaluation.DaysToGo > 0 && 
              <h4>
                {evaluation.DaysToGo} روز تا پایان دوره ارزیابی
              </h4>
            }
          <ul className={style.Users}>
            {users(evaluation.Quarter).sort((a,b) => a.IdUser < b.IdUser).map(user => (
            <li key={user.IdUser}
              className={ ratable(user, evaluation.Quarter) ? "ratable" : ""}
              onClick={() => handleOpen(user.IdUser, evaluation.Quarter)}
            >
              <h3>{user.FullName}</h3>
                { ratable(user, evaluation.Quarter) && <button className={style.formButton}>ارزیابی</button>}
            </li>))}
          </ul>
        </li>)
      )}
    </ul>
  )
}