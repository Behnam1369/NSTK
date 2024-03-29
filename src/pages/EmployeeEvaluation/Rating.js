import { IoStar } from "react-icons/io5";
import style from "./Rating.module.scss";
import { useState } from "react";

export default function Rating({ question, score, iduser, ratable, onRate }) {
  let numbers = [1,2,3,4,5];
  const [hoveringNumber, setHoveringNumber] = useState(0);
  
  const rate = () => {
    // if (!ratable()) return 0
    // if (question.Manager) return question.Manager
    // if (question.Manager0) return question.Manager0
    // return 0

    if (!score) return 0
    return score
  }

  const handleRate = (val) => {
    if (ratable) onRate(val)
  }

  return (
    <div className={style.main}>
      {numbers.map((number) => (
        <IoStar
          onMouseEnter={() => setHoveringNumber(number)}
          onMouseLeave={() => setHoveringNumber(0)}
          className={`
            ${style.star} 
            ${ratable ? style.ratable : '' } 
            ${number <= rate() ? style.rated : ''} 
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