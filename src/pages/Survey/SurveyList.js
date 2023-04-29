import { useEffect, useState } from "react";
import style from "./SurveyList.module.scss";
import { host } from "../../Utils/host";
import { useParams, useSearchParams } from "react-router-dom";
import { shamsiDate } from "../../Utils/public";

export default function SurveyList() {
  const { iduser } = useParams();
  const [surveys, setSurveys] = useState([]);
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");

  useEffect(() => {
    const loadData = async () => {
      await fetch(`${host}/users/${iduser}/survey`)
        .then((res) => res.json())
        .then((res) => setSurveys(res.data));
      window.parent.postMessage({ title: "loaded", tabno }, "*");
    };

    loadData();
  }, []);

  const handleSurveyClick = (idsurvey, title) => {
    window.parent.postMessage(
      {
        title: "survey",
        args: { iduser, idsurvey },
        tabTitle: title,
      },
      "*"
    );
  };

  return (
    <div className={style.main}>
      <h1>لیست پرسش نامه ها</h1>
      <div className={`${style.cards} `}>
        {surveys.map((survey) => (
          <div
            key={survey.IdSurvey}
            className={`${style.card} ${
              Date.parse(survey.EndTime) > new Date().getTime()
                ? style.active
                : style.inactive
            }`}
            onClick={() => handleSurveyClick(survey.IdSurvey, survey.Title)}
          >
            <h2>{survey.Title}</h2>
            {Date.parse(survey.EndTime) > new Date().getTime() && (
              <p>مهلت مشارکت: {shamsiDate(survey.EndTime)}</p>
            )}
            {Date.parse(survey.EndTime) <= new Date().getTime() && (
              <p>مهلت مشارکت به پایان رسیده است. برای مشاهده نتایج کلیک کنید</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
