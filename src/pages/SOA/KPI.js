import { useEffect, useState } from "react";
import { thousandSep } from "../../Utils/public";
import style from "./KPI.module.scss";

export default function KPI({ title, value, percentage, color, onClick }) {
  const [showingValue, setShowingValue] = useState(0);
  const [progress, setProgress] = useState(0);
  const step = value / 200;

  useEffect(() => {
    if (value == 0) {
      setProgress(0);
      setShowingValue(0);
      return;
    }
    let s = 0;
    let p = 0;
    let timer = setInterval(() => {
      if (s < value) {
        s += Math.floor(step);
        setShowingValue(s);
        p = ((s * 100) / value) * percentage;
        setProgress(p);
      } else {
        setShowingValue(value);
        setProgress(((value * 100) / value) * percentage);
        clearInterval(timer);
      }
    }, 1);

    return () => {
      clearInterval(timer);
    };
  }, [value, percentage]);

  return (
    <div className={style.main} onClick={() => onClick()}>
      <div style={{ color }}>
        <h1>{title}</h1>
        <h2>{thousandSep(Math.floor(showingValue))}</h2>
      </div>
      <div
        className={style.progress}
        style={{
          backgroundImage: `linear-gradient(to right, ${color} ${progress}%, transparent ${progress}%)`,
        }}
      ></div>
    </div>
  );
}
