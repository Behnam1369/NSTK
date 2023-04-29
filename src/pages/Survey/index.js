import { useEffect, useState } from "react";
import style from "./index.module.scss";
import { host } from "../../Utils/host";
import { useParams, useSearchParams } from "react-router-dom";
import Message from "../../components/Message";
import axios from "axios";

export default function Survey() {
  const { iduser, idsurvey } = useParams();
  const [survey, setSurvey] = useState(null);
  const [expired, setExpired] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [messageText, setMessageText] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      await fetch(`${host}/users/${iduser}/survey/${idsurvey}`)
        .then((res) => res.json())
        .then((res) => setSurvey(res.data));
    };

    loadData();
  }, [idsurvey, iduser]);

  useEffect(() => {
    if (survey) {
      if (Date.parse(survey.EndTime) <= new Date().getTime()) {
        setExpired(true);
      }
    }
  }, [survey]);

  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");

  useEffect(() => {
    const loadVotes = async () => {
      await fetch(`${host}/users/${iduser}/survey/${idsurvey}/result`)
        .then((res) => res.json())
        .then((res) => setResult(res.data));
      window.parent.postMessage({ title: "loaded", tabno }, "*");
    };

    if (expired) loadVotes();
  }, [expired]);

  const votesNumber = (idquestion, idoption) => {
    if (!result) return 0;
    let options = JSON.parse(
      result.find((q) => q.IdSurveyQuestion == idquestion).Options
    );
    if (!options) return 0;
    return options.find((o) => o.IdSurveyQuestionOption == idoption).Voted;
  };

  const totalVotes = (idquestion, idoption) => {
    if (!result) return 0;
    let options = JSON.parse(
      result.find((q) => q.IdSurveyQuestion == idquestion).Options
    );
    if (!options) return 0;
    return options.find((o) => o.IdSurveyQuestionOption == idoption).TotalVotes;
  };

  const handleSelect = (idquestion, idoption) => {
    if (!expired) {
      setSurvey({
        ...survey,
        survey_questions: survey.survey_questions.map((q) => {
          if (q.IdSurveyQuestion == idquestion) {
            return {
              ...q,
              survey_question_options: q.survey_question_options.map((o) => {
                if (o.IdSurveyQuestionOption == idoption) {
                  return { ...o, selected: true };
                }
                return { ...o, selected: false };
              }),
            };
          }
          return q;
        }),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const answers = [];
    survey.survey_questions.forEach((q) => {
      q.survey_question_options.forEach((o) => {
        if (o.selected) {
          answers.push({
            idsurveyquestion: q.IdSurveyQuestion,
            idsurveyquestionoption: o.IdSurveyQuestionOption,
          });
        }
      });
    });

    await axios
      .post(`${host}/users/${iduser}/survey/${idsurvey}/vote`, {
        answers,
      })
      .then((res) => {
        setSaving(false);
        setMessageText("اطلاعات با موفقیت ثبت شد");
        setSubmitted(true);
      })
      .catch((err) => {
        setSaving(false);
        setMessageText("خطا در ثبت اطلاعات");
      });
  };

  return (
    <div className={style.main}>
      {survey && !submitted && (
        <>
          {/* {JSON.stringify(survey)} */}
          <h1>{survey.Title}</h1>
          <div className={style.questions}>
            {survey.survey_questions.map((question) => (
              <div key={question.IdSurveyQuestion} className={style.question}>
                <h2>{question.Title}</h2>
                <div className={style.options}>
                  {question.survey_question_options.map((option) => (
                    <div
                      key={option.IdSurveyQuestionOption}
                      className={`${style.option} ${
                        expired ? style.expired : ""
                      } ${option.selected ? style.selected : ""}`}
                      onClick={() =>
                        handleSelect(
                          question.IdSurveyQuestion,
                          option.IdSurveyQuestionOption
                        )
                      }
                      style={
                        expired
                          ? {
                              backgroundImage: `linear-gradient(to left, #aba9f9 ${
                                (votesNumber(
                                  question.IdSurveyQuestion,
                                  option.IdSurveyQuestionOption
                                ) *
                                  100) /
                                totalVotes(
                                  question.IdSurveyQuestion,
                                  option.IdSurveyQuestionOption
                                )
                              }%, white ${
                                (votesNumber(
                                  question.IdSurveyQuestion,
                                  option.IdSurveyQuestionOption
                                ) *
                                  100) /
                                totalVotes(
                                  question.IdSurveyQuestion,
                                  option.IdSurveyQuestionOption
                                )
                              }%)`,
                            }
                          : {}
                      }
                    >
                      {option.Title}
                      {expired &&
                        ` -  ${
                          (votesNumber(
                            question.IdSurveyQuestion,
                            option.IdSurveyQuestionOption
                          ) *
                            100) /
                          totalVotes(
                            question.IdSurveyQuestion,
                            option.IdSurveyQuestionOption
                          )
                        }% (${votesNumber(
                          question.IdSurveyQuestion,
                          option.IdSurveyQuestionOption
                        )} رای) `}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {!expired && (
              <button
                onClick={(e) => handleSubmit(e)}
                disabled={saving}
                className={style.formButton}
              >
                {saving ? "در حال ثبت اطلاعات" : "ثبت اطلاعات"}{" "}
              </button>
            )}
          </div>
        </>
      )}
      {submitted && (
        <div className={style.submittedMessage}>
          <p>
            از مشارکت شما سپاسگذاریم. پس از پایان مهلت شرکت در نظرسنجی نتایج
            نهایی قابل مشاهده خواهد بود.
          </p>
        </div>
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
