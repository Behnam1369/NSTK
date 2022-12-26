import { useEffect, useRef, useState } from "react";
import style from "./Timepicker.module.scss";
export default function Timepicker(props) {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const minuteInput = useRef(null);
  const hourInput = useRef(null);

  useEffect(() => {
    props.onChange(hour + ":" + minute);
  }, [hour, minute]);

  useEffect(() => {
    if (props.value) {
      setHour(props.value.split(":")[0]);
      setMinute(props.value.split(":")[1]);
    }
  }, [props.value]);

  const handleChangeH = (e) => {
    if (isNaN(e.target.value) || e.target.value === "") {
      setHour("");
    } else {
      let val = parseInt(e.target.value);
      if (val > 24) {
        setHour(val % 24 >= 10 ? val % 24 : "0" + (val % 24));
      } else {
        setHour(e.target.value);
      }
    }

    if (e.target.value.length === 2) {
      minuteInput.current.select();
    }
  };

  const handleBlurH = (e) => {
    let val = parseInt(e.target.value);
    if (val < 10) setHour("0" + val);
  };

  const handleChangeM = (e) => {
    if (isNaN(e.target.value) || e.target.value === "") {
      setMinute("");
    } else {
      let val = parseInt(e.target.value);
      if (val > 60) {
        setMinute(val % 60 >= 10 ? val % 60 : "0" + (val % 60));
      } else {
        setMinute(e.target.value);
      }
    }

    if (e.target.value.length === 0) {
      hourInput.current.select();
    }
  };

  const handleBlurM = (e) => {
    let val = parseInt(e.target.value);
    if (val < 10) setMinute("0" + val);
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
        value={hour}
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
        value={minute}
      />
    </div>
  );
}
