import { useEffect, useRef, useState } from "react";
import style from "./Timepicker.module.scss";
export default function Timepicker(props) {
  const [time, setTime] = useState(props.value || ":");
  const minuteInput = useRef(null);
  const hourInput = useRef(null);

  useEffect(() => {
    if (props.value != time) props.onChange(time);
  }, [props.value, props.onChange, time]);

  useEffect(() => {
    if (props.value) {
      setTime(props.value);
    }
  }, [props.value]);

  const handleChangeH = (e) => {
    if (isNaN(e.target.value) || e.target.value === "") {
      setTime(":" + time.split(":")[1]);
    } else {
      let val = parseInt(e.target.value);
      if (val > 24) {
        let h = val % 24 >= 10 ? val % 24 : "0" + (val % 24);
        setTime(h + ":" + time.split(":")[1]);
      } else {
        //setHour(e.target.value);
        setTime(e.target.value + ":" + time.split(":")[1]);
      }
    }

    if (e.target.value.length === 2) {
      minuteInput.current.select();
    }
  };

  const handleBlurH = (e) => {
    let val = parseInt(e.target.value);
    if (val < 10)
      //setHour("0" + val);
      setTime("0" + val + ":" + time.split(":")[1]);
  };

  const handleChangeM = (e) => {
    if (isNaN(e.target.value) || e.target.value === "") {
      //setMinute("");
      setTime(time.split(":")[0] + ":");
    } else {
      let val = parseInt(e.target.value);
      if (val > 60) {
        let m = val % 60 >= 10 ? val % 60 : "0" + (val % 60);
        setTime(time.split(":")[0] + ":" + m);
      } else {
        //setMinute(e.target.value);
        setTime(time.split(":")[0] + ":" + e.target.value);
      }
    }

    if (e.target.value.length === 0) {
      hourInput.current.select();
    }
  };

  const handleBlurM = (e) => {
    let val = parseInt(e.target.value);
    if (val < 10)
      //setMinute("0" + val);
      setTime(time.split(":")[0] + ":" + "0" + val);
  };

  return (
    <div className={`${style.timepicker} ${style.txt}`} dir="ltr">
      <input
        type="text"
        className={`${style.hh} ${style.N2}`}
        ref={hourInput}
        min="0"
        max="23"
        placeholder="hh"
        maxLength="2"
        onChange={(e) => handleChangeH(e)}
        onBlur={(e) => handleBlurH(e)}
        value={time.split(":")[0]}
      />
      <span className={style.colon}>:</span>
      <input
        type="text"
        className={`${style.mm} ${style.N2}`}
        ref={minuteInput}
        min="0"
        max="59"
        placeholder="mm"
        maxLength="2"
        onChange={(e) => handleChangeM(e)}
        onBlur={(e) => handleBlurM(e)}
        value={time.split(":")[1]}
      />
    </div>
  );
}
