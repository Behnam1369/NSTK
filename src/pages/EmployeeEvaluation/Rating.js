import { IoStar } from "react-icons/io5";
import style from "./Rating.module.scss";
import { useState } from "react";

export default function Rating({ question, iduser, isExpired, onRate }) {
  let numbers = [1,2,3,4,5];
  const [hoveringNumber, setHoveringNumber] = useState(0);

  const ratable = () => {
    if (question.IdManager0 && iduser == question.IdManager0 &&  question.ManagerSubmitDate0 == null) return true
    if (question.IdManager && iduser == question.IdManager &&  question.ManagerSubmitDate == null && (question.IdManager0 == null || question.ManagerSubmitDate0 != null)) return true
    return false
  }

  const rate = () => {
    // if (!ratable()) return 0
    if (question.Manager) return question.Manager
    if (question.Manager0) return question.Manager0
    return 0
  }

  const handleRate = (val) => {
    if (ratable()) onRate(val)
  }

  return (
    <div className={style.main}>
      {numbers.map((number) => (
        <IoStar
          onMouseEnter={() => setHoveringNumber(number)}
          onMouseLeave={() => setHoveringNumber(0)}
          className={`
            ${style.star} 
            ${ratable() ? style.ratable : '' } 
            ${!question.Manager && question.Manager0 && number <= rate() ? style.prerated : ''} 
            ${(question.Manager || question.Manager0) && number <= rate() ? style.rated : ''} 
            ${number <= rate() ? style.filled : ''} 
            ${number <= hoveringNumber ? style.hovering : ''}
            `
          }
          onClick={() => {handleRate(number)}}
          key={number}
          /> 
      ))}
      <span className={style.rate}>{rate()}</span>
      {iduser == 1 && (<>
        <span className={style.weight}>{question.Weight.toFixed(2)}</span>
        <span className={style.weightedRate}>{(rate()*question.Weight).toFixed(2)}</span>
      </>)}
    </div>
  )
}