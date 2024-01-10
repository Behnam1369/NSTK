import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { host } from "../../Utils/host";
import Rating from "./Rating";
import style from "./evaluation.module.scss";
import Message from "../../components/Message";
// import { yyyy_mm_ddToDate } from "../../Utils/public";

export default function Evaluation() {
  const [questions, setQuestions] = useState([]);
  const [expired, setExpired] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [activeSubmission, setActiveSubmission] = useState(0); 
  const { iduser, idemployee, quarter } = useParams();
  const [messageText, setMessageText] = useState(false);
  const [searchParams] = useSearchParams();
  const [saving, setSaving] = useState(false);
  const tabno = searchParams.get("tabno");

  const getData = async () => {
    await axios.get(`${host}/users/${iduser}/employee_evaluations/${idemployee}/quarter/${quarter}`).then((res) => {
      console.log(res.data);
      setQuestions(res.data.Questions);
      if (res.data.Submissions.length > 0) {
        setActiveSubmission(res.data.Submissions[res.data.Submissions.length - 1].IdEmployeeEvaluationSubmission);
      }
      setSubmissions(res.data.Submissions);
      setExpired(res.data.Expired);
    });
    window.parent.postMessage({ title: "loaded", tabno }, "*");
  }

  useEffect(()=>{
    getData();
  }, [])

  useEffect(() => {
    console.log('expired', expired)
    if (expired || iduser == idemployee) {
      setSubmissions(submissions.filter(s => s.IdEmployeeEvaluationSubmission != 0))
    } else {
      setSubmissions([...submissions, {IdEmployeeEvaluationSubmission: 0, Scores: [...questions.map(q => ({IdQuestion: q.IdEmpolyeeEvaluationQuestion, Score: 0}))]}])
    }
  }, [expired]);

  const rate = (val, idquestion) => {
    setSubmissions(submissions.map(s => {
      if(s.IdEmployeeEvaluationSubmission == activeSubmission) {
        return {...s, Scores: s.Scores.map(score => {
          if (score.IdQuestion == idquestion) {
            return {...score, Score: val}
          } else {
            return score;
          }
        })}
      } else {
        return s;
      }
    }))
  }

  const score = () => {
    let total = 0;
    questions.forEach(q => {
      total += getScore(q.IdEmpolyeeEvaluationQuestion) * q.Weight;
    })
    return total.toFixed(2);
  }

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    axios.post(
      `${host}/users/${iduser}/employee_evaluations/${idemployee}/quarter/${quarter}/save`, 
      { questions: submissions.find(s => s.IdEmployeeEvaluationSubmission == 0).Scores }
    ).then((res) => {
      setSaving(false);
      getData();
      setMessageText("فرم ارزیابی با موفقیت ذخیره شد");
    });
  }

  const ratable = () =>{
    if (expired) return false;
    if (activeSubmission != 0) return false
    if (iduser == idemployee) return false
    return true;
  }

  const getScore = (idquestion) => {
    let submission = submissions.find(s => s.IdEmployeeEvaluationSubmission == activeSubmission);
    if (!submission) return 0;
    let s = submission.Scores.find(s => s.IdQuestion == idquestion);
    return s?.Score || 0;
  }

  const handlePrint = (e) => {
    e.preventDefault();
    window.parent.postMessage(
      {
        title: "print",
        endpoint: "PrintEmployeeEvaluation",
        args: { quarter, iduser },
        tabTitle: `چاپ ارزیابی عملکرد`,
        tabno,
      },
      "*"
    );
  }

  return (
    <div>
      <div className={style.questions}>
        <div>
          <h1>فرم ارزیابی {questions.length > 0 && questions[0].Fname +" " + questions[0].Lname} </h1>
        </div>
        <div className={style.submissions} >
          <label>ارزیابی های ثبت شده: </label>
          {submissions.map(s => <div key={s.IdEmployeeEvaluationSubmission} onClick={() => setActiveSubmission(s.IdEmployeeEvaluationSubmission)} className={`${style.submissions} ${activeSubmission == s.IdEmployeeEvaluationSubmission ? style.active : ""}`}>
            {s.IdEmployeeEvaluationSubmission == 0 ? 
              <span className={style.manger}>ارزیابی جدید</span> : (<>
                <span className={style.manger}>{s.Manager}</span>
                <span className={style.date}>{s.SubmitDateShamsi}</span>
              </>)}
          </div>)}
          {/* <div onClick={() => setActiveSubmission(null)} className={`${style.submissions} ${activeSubmission == null ? style.active : ""}`}>
            <span className={style.manger}> ارزیابی جدید </span>
          </div> */}
        </div>
        <div className={style.heading} >
          <p></p>
          <div>
            <h2>نمره تراز شده: {score()}</h2>
          </div>
        </div>
        <div className={style.heading} >
          <p></p>
          <div>
            <div>امتیاز</div>
                {/* <div style={{visibility: questions.length > 0 && isExpired()  && iduser != questions[0].IdUser? 'visible' : 'hidden'}}>ضریب</div>  
                <div style={{visibility: questions.length > 0 && isExpired()  && iduser != questions[0].IdUser? 'visible' : 'hidden'}}>امتیاز تراز شده</div> */}
                <div style={{visibility: iduser == 1 ? 'visible' : 'hidden'}}>ضریب</div>  
                <div style={{visibility: iduser == 1 ? 'visible' : 'hidden'}}>امتیاز تراز شده</div>
          </div>
        </div>
        {questions.map((question) => <div className={style.question} key={question.IdEmpolyeeEvaluationQuestion}>
          <p>{question.Title}</p>
          <Rating question={question} score={getScore(question.IdEmpolyeeEvaluationQuestion)} iduser={iduser} isExpired={false} ratable={ratable()} onRate={(val) => rate(val, question.IdEmpolyeeEvaluationQuestion) }/>
        </div>)}
        <div className={style.footer}>
          {ratable() &&  <button className={style.formButton} disabled={saving} onClick={(e) => handleSave(e)}>{saving ? "در حال ذخیره ..." : "ذخیره و ارسال فرم ارزیابی"}</button>}
          <button className={style.formButton} onClick={(e) => handlePrint(e)}>چاپ فرم ارزیابی</button>
        </div>
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