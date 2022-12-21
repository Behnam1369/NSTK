import { useEffect, useState, useRef } from "react";
import { BsCalendar3 } from "react-icons/bs";
import style from "./Datepicker.module.scss";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";

function useOutsideAlerter(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

export default function Datepicker(props) {
  const valueToDate = (value) => {
    if (!value) return null;
    let arr = value.split("-");
    return new Date(arr[0], arr[1] - 1, arr[2]);
  };

  const [inputValue, setInputValue] = useState("");
  const [date, setDate] = useState(
    (props.value && valueToDate(props.value)) || null
  );
  const [year, setYear] = useState(
    date ? date.getFullYear() : new Date().getFullYear()
  );
  const [month, setMonth] = useState(
    date ? date.getMonth() : new Date().getMonth()
  );
  const [calformat, setCalformat] = useState(props.calformat || "jalali");
  const [showCalender, setShowCalendar] = useState(false);
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const calendarInput = useRef(null);
  const [calendarStyle, setCalendarStyle] = useState({});

  const container = useRef(null);
  useOutsideAlerter(container, () => {
    setShowCalendar(false);
  });

  useEffect(() => {
    let cf = calformat;
    if (localStorage[props.name]) {
      setCalformat(localStorage[props.name]);
    }

    if (cf === "gregorian") {
      setYear((date || new Date()).getFullYear());
      setMonth((date || new Date()).getMonth());
    } else if (cf === "jalali") {
      let [y, m] = getShamsiDateFromIndex(dateIndex(date || new Date()));
      setYear(y);
      setMonth(m);
    }
    setInputValue(formatDate(date));
  }, [calformat, props.value, date]);

  useEffect(() => {
    setDate(valueToDate(props.value));
  }, [props.value]);

  useEffect(() => {
    props.onChange(gregorianFormatDate(date));
  }, [date]);

  const months = [
    { name: "January", days: 31 },
    { name: "February", days: 28 },
    { name: "March", days: 31 },
    { name: "April", days: 30 },
    { name: "May", days: 31 },
    { name: "June", days: 30 },
    { name: "July", days: 31 },
    { name: "August", days: 31 },
    { name: "September", days: 30 },
    { name: "October", days: 31 },
    { name: "November", days: 30 },
    { name: "December", days: 31 },
  ];

  const shamsiMonths = [
    { name: "فروردین", days: 31 },
    { name: "اردیبهشت", days: 31 },
    { name: "خرداد", days: 31 },
    { name: "تیر", days: 31 },
    { name: "مرداد", days: 31 },
    { name: "شهریور", days: 31 },
    { name: "مهر", days: 30 },
    { name: "آبان", days: 30 },
    { name: "آذر", days: 30 },
    { name: "دی", days: 30 },
    { name: "بهمن", days: 30 },
    { name: "اسفند", days: 29 },
  ];

  const weekdays = [
    { name: "Sun", index: 1, abr: "Su" },
    { name: "Mon", index: 2, abr: "Mo" },
    { name: "Tue", index: 3, abr: "Tu" },
    { name: "Wed", index: 4, abr: "We" },
    { name: "Thu", index: 5, abr: "Th" },
    { name: "Fri", index: 6, abr: "Fr" },
    { name: "Sat", index: 0, abr: "Sa" },
  ];

  const shamsiWeekdays = [
    { name: "شنبه", index: 1, abr: "ش" },
    { name: "یکشنبه", index: 2, abr: "ی" },
    { name: "دوشنبه", index: 3, abr: "د" },
    { name: "سه شنبه", index: 4, abr: "س" },
    { name: "چهارشنبه", index: 5, abr: "چ" },
    { name: "پنجشنبه", index: 6, abr: "پ" },
    { name: "جمعه", index: 0, abr: "ج" },
  ];

  const dateIndex = (dt) => {
    if (!dt) return null;
    let d = dt.getDate();
    let m = dt.getMonth();
    let y = dt.getFullYear();
    let index =
      (y - 1) * 365 +
      Math.floor((y - 1) / 4) +
      months.filter((month, i) => i < m).reduce((a, b) => a + b.days, 0) +
      (m > 1 && y % 4 === 0 ? 1 : 0) +
      d;
    return index;
  };

  const shamsiDateIndex = (y, m, d) => {
    let index =
      (y - 1) * 365 +
      Math.floor(y / 4) +
      shamsiMonths
        .filter((shamsiMonths, i) => i < m)
        .reduce((a, b) => a + b.days, 0) +
      d;
    return index;
  };

  const getDateFromIndex = (index) => {
    let y = 1;

    y = y + Math.floor(index / 1461) * 4;
    index = index % 1461;

    while (index > (y % 4 === 0 ? 366 : 365)) {
      index -= y % 4 === 0 ? 366 : 365;
      y += 1;
    }

    let m = 0;
    for (let i = 0; i < months.length; i++) {
      if (index > (y % 4 === 0 && i === 1 ? 29 : months[i].days)) {
        index -= months[i].days;
        m += 1;
      } else {
        break;
      }
    }

    let d = index;
    return new Date(y, m, d);
  };

  const diff = 226899;
  const getShamsiDateFromIndex = (index) => {
    let shamsiIndex = index - diff; //226931
    let y = 1;
    while (shamsiIndex > (y % 4 === 3 ? 366 : 365)) {
      shamsiIndex -= y % 4 === 3 ? 366 : 365;
      y += 1;
    }

    let m = 0;
    for (let i = 0; i < shamsiMonths.length; i++) {
      if (shamsiIndex > (y % 4 === 3 && i === 11 ? 30 : shamsiMonths[i].days)) {
        shamsiIndex -= shamsiMonths[i].days;
        m += 1;
      } else {
        break;
      }
    }

    let d = shamsiIndex;
    return [y, m, d];
  };

  const gregorianFormatDate = (date) => {
    if (!date) return "";
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    } else if (calformat === "gregorian") {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    } else if (calformat === "jalali") {
      let [y, m, d] = getShamsiDateFromIndex(dateIndex(date));
      m = "0" + (m + 1);
      d = "0" + d;
      return [y, m.substr(m.length - 2), d.substr(d.length - 2)].join("/");
    }
  };

  const eqDate = () => {
    if (!date) return false;
    if (calformat === "gregorian") {
      let [y, m, d] = getShamsiDateFromIndex(dateIndex(date));
      m = "0" + (m + 1);
      d = "0" + d;
      return [y, m.substr(m.length - 2), d.substr(d.length - 2)].join("/");
    } else if (calformat === "jalali") {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    }
  };

  const getMonthData = (y, m) => {
    if (calformat === "gregorian") {
      let firstDay = new Date(y, m, 1);
      let lastDay = new Date(y, m + 1, 0);
      let firstDayIndex = dateIndex(firstDay);
      let lastDayIndex = dateIndex(lastDay);
      let days = [];
      for (let i = firstDayIndex; i <= lastDayIndex; i++) {
        days.push(getDateFromIndex(i));
      }

      firstDayIndex -= 1;
      firstDay = getDateFromIndex(firstDayIndex);
      while (firstDay.getDay() !== 6) {
        days.unshift(firstDay);
        firstDayIndex -= 1;
        firstDay = getDateFromIndex(firstDayIndex);
      }

      lastDayIndex += 1;
      lastDay = getDateFromIndex(lastDayIndex);
      while (lastDay.getDay() !== 0) {
        days.push(lastDay);
        lastDayIndex += 1;
        lastDay = getDateFromIndex(lastDayIndex);
      }

      return days;
    } else if (calformat === "jalali") {
      let firstDayIndex = shamsiDateIndex(y, m, 1) + diff;
      let firstDay = getDateFromIndex(firstDayIndex);
      let lastDayIndex =
        shamsiDateIndex(
          y,
          m,
          y % 4 === 3 && m === 11 ? 30 : shamsiMonths[m].days
        ) + diff;
      let lastDay = getDateFromIndex(lastDayIndex);

      let days = [];
      for (let i = firstDayIndex; i <= lastDayIndex; i++) {
        days.push({
          date: getDateFromIndex(i),
          shamsiDate: getShamsiDateFromIndex(i),
        });
      }

      firstDayIndex -= 1;
      firstDay = getDateFromIndex(firstDayIndex);
      while (firstDay.getDay() !== 5) {
        days.unshift({
          date: firstDay,
          shamsiDate: getShamsiDateFromIndex(firstDayIndex),
        });
        firstDayIndex -= 1;
        firstDay = getDateFromIndex(firstDayIndex);
      }

      lastDayIndex += 1;
      lastDay = getDateFromIndex(lastDayIndex);
      while (lastDay.getDay() !== 6) {
        days.push({
          date: lastDay,
          shamsiDate: getShamsiDateFromIndex(lastDayIndex),
        });
        lastDayIndex += 1;
        lastDay = getDateFromIndex(lastDayIndex);
      }

      return days;
    }
  };

  useEffect(() => {
    setCalendarStyle({
      top: rect.y + rect.height + window.scrollY,
      left: props.dir === "rtl" ? rect.x + rect.width - 220 : rect.x,
    });
  }, [rect, window.width]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setRect(calendarInput.current.getBoundingClientRect());
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  const handleCalendarIconClick = () => {
    setRect(calendarInput.current.getBoundingClientRect());
    setShowCalendar(!showCalender);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      prevYear();
    } else {
      setMonth(month - 1);
    }
  };

  const nextYear = () => {
    setYear(year + 1);
  };

  const prevYear = () => {
    setYear(year === 0 ? year : year - 1);
  };

  const handleToday = () => {
    let d = new Date();
    setDate(d);
    if (calformat === "gregorian") {
      setYear(d.getFullYear());
      setMonth(d.getMonth());
    } else {
      let [y, m] = getShamsiDateFromIndex(dateIndex(d));
      setYear(y);
      setMonth(m);
    }

    setInputValue(formatDate(d));
    setShowCalendar(false);
  };

  const handleDateClick = (date) => {
    setDate(date);
    if (calformat === "gregorian") {
      setYear(date.getFullYear());
      setMonth(date.getMonth());
    } else {
      let [y, m] = getShamsiDateFromIndex(dateIndex(date));
      setYear(y);
      setMonth(m);
    }
    setInputValue(formatDate(date));
    setShowCalendar(false);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    let text = e.target.value.replace(/\D/g, "");
    if (text.length === 0) {
      setDate(null);
    } else if (text.length === 8) {
      let y = parseInt(text.substring(0, 4));
      let m = parseInt(text.substring(4, 6));
      let d = parseInt(text.substring(6, 8));
      if (calformat === "gregorian") {
        let timestamp = Date.parse(`${y}-${m}-${d}`);
        if (!isNaN(timestamp)) {
          let dt = new Date(timestamp);
          setDate(dt);
          setInputValue(formatDate(dt));
          setYear(dt.getFullYear());
          setMonth(dt.getMonth());
        }
      } else if (calformat === "jalali") {
        if (
          (m <= 12 && d <= shamsiMonths[parseInt(m) - 1].days) ||
          (m === 12 && d === 30 && y % 4 === 3)
        ) {
          let dateIndex =
            parseInt(
              shamsiDateIndex(parseInt(y), parseInt(m - 1), parseInt(d))
            ) + parseInt(diff);
          let dt = getDateFromIndex(dateIndex);
          setDate(dt);
          setInputValue(formatDate(dt));
          setYear(parseInt(y));
          setMonth(parseInt(m) - 1);
        }
      }
    }
  };

  const handleClose = () => {
    setShowCalendar(false);
  };

  const handleSwitch = () => {
    localStorage[props.name] =
      calformat === "gregorian" ? "jalali" : "gregorian";

    setCalformat(calformat === "gregorian" ? "jalali" : "gregorian");
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      var tomorrow = date;
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow);
      if (calformat === "gregorian") {
        setYear(date.getFullYear());
        setMonth(date.getMonth());
      } else {
        let [y, m] = getShamsiDateFromIndex(dateIndex(date));
        setYear(y);
        setMonth(m);
      }
      setInputValue(formatDate(date));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      var yesterday = date;
      yesterday.setDate(yesterday.getDate() - 1);
      setDate(yesterday);
      if (calformat === "gregorian") {
        setYear(date.getFullYear());
        setMonth(date.getMonth());
      } else {
        let [y, m] = getShamsiDateFromIndex(dateIndex(date));
        setYear(y);
        setMonth(m);
      }
      setInputValue(formatDate(date));
    }
  };

  return (
    <div className={`${style.datepicker} ${style[calformat]}`} ref={container}>
      <div className={style.wrapper}>
        <input
          type="text"
          ref={calendarInput}
          value={inputValue}
          onChange={(e) => handleChange(e)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <BsCalendar3
          className={style.calendar_icon}
          onClick={() => {
            handleCalendarIconClick();
          }}
        />
        <span className={style.eqDate}>{eqDate(date)}</span>
      </div>

      {showCalender && (
        <div
          className={style.calendar}
          dir={calformat === "gregorian" ? "ltr" : "rtl"}
          style={calendarStyle}
        >
          <div
            className={style.arrow}
            onClick={() => {
              prevYear();
            }}
          >
            {calformat === "gregorian" && <BsChevronLeft />}
            {calformat === "jalali" && <BsChevronRight />}
          </div>
          <div className={style.year}> {year} </div>
          <div
            className={style.arrow}
            onClick={() => {
              nextYear();
            }}
          >
            {calformat === "gregorian" && <BsChevronRight />}
            {calformat === "jalali" && <BsChevronLeft />}
          </div>
          <div className={style.switch} onClick={() => handleSwitch()}>
            <HiOutlineSwitchHorizontal />
          </div>
          <div className={style.close} onClick={() => handleClose()}>
            <IoCloseOutline />
          </div>

          <div
            className={style.arrow}
            onClick={() => {
              prevMonth();
            }}
          >
            {calformat === "gregorian" && <BsChevronLeft />}
            {calformat === "jalali" && <BsChevronRight />}
          </div>
          <div className={style.month}>
            {calformat === "gregorian" && months[month].name}
            {calformat === "jalali" && shamsiMonths[month].name}
          </div>

          <div
            className={style.arrow}
            onClick={() => {
              nextMonth();
            }}
          >
            {calformat === "gregorian" && <BsChevronRight />}
            {calformat === "jalali" && <BsChevronLeft />}
          </div>
          <div className={style.today} onClick={() => handleToday()}>
            {calformat === "gregorian" ? "Today" : "امروز"}
          </div>
          {calformat === "gregorian" &&
            weekdays.map((day) => {
              return (
                <div key={day.index} className={style.weekday}>
                  {day.abr}
                </div>
              );
            })}
          {calformat === "jalali" &&
            shamsiWeekdays.map((day) => {
              return (
                <div key={day.index} className={style.weekday}>
                  {day.abr}
                </div>
              );
            })}
          {getMonthData(year, month).map((day) => {
            return (
              <div
                key={calformat === "gregorian" ? day : day.date}
                className={`${style.day} 
                ${
                  (calformat === "gregorian"
                    ? day.getMonth()
                    : day.shamsiDate[1]) === month
                    ? style.main
                    : style.other
                } ${
                  calformat === "gregorian" &&
                  day.toDateString() === (date || new Date()).toDateString()
                    ? style.selected
                    : ""
                } ${
                  calformat === "jalali" &&
                  day.date.toDateString() ===
                    (date || new Date()).toDateString()
                    ? style.selected
                    : ""
                }`}
                onClick={() =>
                  handleDateClick(calformat === "gregorian" ? day : day.date)
                }
              >
                {calformat === "gregorian" && day.getDate()}
                {calformat === "jalali" && day.shamsiDate[2]}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
