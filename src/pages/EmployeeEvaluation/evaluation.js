import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { host } from "../../Utils/host";
import Rating from "./Rating";
import style from "./evaluation.module.scss";
import Message from "../../components/Message";

export default function Evaluation() {
  const [questions, setQuestions] = useState([]);
  const { iduser, idemployeeevaluationuser } = useParams();
  const [messageText, setMessageText] = useState(false);
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");
  
  useEffect(()=>{
    const getData = async () => {
      await axios.get(`${host}/users/${iduser}/employee_evaluations/${idemployeeevaluationuser}`).then((res) => {
        setQuestions(res.data);
      });
      window.parent.postMessage({ title: "loaded", tabno }, "*");
    }
    getData();
  }, [])

  const rate = (val, id) => {
    setQuestions(questions.map((q) => {
      if (q.IdEmpolyeeEvaluationQuestion != id) return q
      else {
        if (iduser == q.IdManager){
          if (val == q.Manager ) return {...q, Manager: 0} 
          return {...q, Manager: val}
        }
        else if (iduser == q.IdManager0) {
          if (val == q.Manager0 ) return {...q, Manager0: 0} 
          return {...q, Manager0: val}
        } else 
        return q
      }
    }))
  }

  console.log(questions);

  const score = () => {
    console.log('score')
    let total = 0;
    questions.forEach(q => {
      if (q.Manager) total += q.Manager * q.Weight;
      else if (q.Manager0) total += q.Manager0 * q.Weight;
    })
    return total.toFixed(2);
  }

  const handleSave = (e) => {
    e.preventDefault();
    axios.post(`${host}/users/${iduser}/employee_evaluations/${idemployeeevaluationuser}/save`, {questions}).then((res) => {
      setMessageText("فرم ارزیابی با موفقیت ذخیره شد");
    });
  }

  const handlePrint = (e) => {
    e.preventDefault();
    if (idemployeeevaluationuser) {
      window.parent.postMessage(
        {
          title: "print",
          endpoint: "PrintEmployeeEvaluation",
          args: { idemployeeevaluationuser },
          tabTitle: `چاپ فرم ارزیابی `,
          tabno,
        },
        "*"
      );
    } else {
      setMessageText("ابتدا سند را ذخیره کنید");
    }
  }

  const ratable = () => {
    if (questions.length == 0) return false
    if (questions[0].IdManager0 && iduser == questions[0].IdManager0 &&  questions[0].ManagerSubmitDate0 == null) return true
    if (questions[0].IdManager && iduser == questions[0].IdManager &&  questions[0].ManagerSubmitDate == null && (questions[0].IdManager0 == null || questions[0].ManagerSubmitDate0 != null)) return true
    return false
  }

  return (
    <div>
      <div className={style.questions}>
        <div>
          <h1>فرم ارزیابی {questions.length > 0 && questions[0].Fname +" " + questions[0].Lname} </h1>
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
            <div>ضریب</div>
            <div>امتیاز تراز شده</div>
          </div>
        </div>
        {questions.map((question) => <div className={style.question} key={question.IdEmpolyeeEvaluationQuestion}>
          <p>{question.Title}</p>
          <Rating question={question} iduser={iduser} onRate={(val) => rate(val, question.IdEmpolyeeEvaluationQuestion) }/>
        </div>)}
        <div className={style.footer}>
          {ratable() &&  <button className={style.formButton} onClick={(e) => handleSave(e)}>ذخیره و ارسال فرم ارزیابی</button>}
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