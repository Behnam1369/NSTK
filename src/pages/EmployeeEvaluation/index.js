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
        res.data.sort((a,b) => a.employee_evaluation.IdEmployeeEvaluation < b.employee_evaluation.IdEmployeeEvaluation)
      ))
      window.parent.postMessage({ title: "loaded", tabno }, "*");
    }
    getdate();
  },[])

  const ratable = (user) =>{
    if (iduser == user.IdUser) return false
    if (user.ManagerSubmitDate) return false
    if (user.IdManager0 && iduser == user.IdManager0 &&  user.ManagerSubmitDate0 == null) return true
    if (user.IdManager && iduser == user.IdManager &&  user.ManagerSubmitDate == null && (user.IdManager0 == null || user.ManagerSubmitDate0 != null)) return true
  }

  const handleOpen = (val) => {
    window.parent.postMessage(
      {
        title: "evaluation",
        args: { idemploymeeevaluationuser: val },
        tabTitle: `فرم ارزیابی عملکرد`,
        tabno,
      },
      "*"
    );
  }

  const handlePrint = (e, idemployeeevaluation) => {
    console.log(idemployeeevaluation)
    e.preventDefault();
    if (idemployeeevaluation) {
      window.parent.postMessage(
        {
          title: "print",
          endpoint: "PrintEmployeeEvaluationList",
          args: { idemployeeevaluation },
          tabTitle: `چاپ نتیجه ارزیابی عملکرد`,
          tabno,
        },
        "*"
      );
    } else {
      alert("ابتدا سند را ذخیره کنید");
    }
  }

  return (
    <ul className={style.evaluations}>
      {evaluations.filter(evaluation => evaluation.related_users.length > 0).map((evaluation) => (
        <li key={evaluation.employee_evaluation.IdEmployeeEvaluation}>
          <h2>
            {evaluation.employee_evaluation.Title} 
            { ["1", "33", "46", "47", "118"].includes(iduser) &&
              <IoPrint className={style.btnPrint} title="چاپ" onClick={(e) => handlePrint(e, evaluation.employee_evaluation.IdEmployeeEvaluation)} />
            }
          </h2>
          <ul className={style.users}>
            {evaluation.related_users.sort((a,b) => a.IdUser < b.IdUser).map(user => (
            <li key={user.IdEmployeeEvaluationUser}
              className={ ratable(user) ? "ratable" : ""}
              onClick={() => handleOpen(user.IdEmployeeEvaluationUser)}
            >
              <h3>{user.FullName}</h3>
                { ratable(user) && <button className={style.formButton}>ارزیابی</button>}
                { user.IdManager0 && user.ManagerSubmitDate0 == null && user.IdManager0 != iduser && <span>در انتظار ارزیابی اولیه</span>}
            </li>))}
          </ul>
        </li>)
      )}
    </ul>
  )
}