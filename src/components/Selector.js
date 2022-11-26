import React, { useState, useRef, useEffect } from "react";
import { TbChevronDown } from "react-icons/tb";
import style from "./Selector.module.scss";
import PropTypes from "prop-types";

function useOutsideAlerter(ref, value, callback) {
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
  }, [ref, value, callback]);
}

function Selector(props) {
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [visibleData, setVisibleData] = useState(props.data);
  const [showingItems, setShowingItems] = useState(false);
  const input1 = useRef(null);
  const ulContainer = useRef(null);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [value, setValue] = useState(props.value);
  const { selectionChanged } = props;
  const [text, setText] = useState(() => {
    if (value === null) {
      return "";
    } else {
      return visibleData.filter((el) => el[props.id] === value)[0][props.title];
    }
  });
  const [maxRowWidth, setMaxRowWidth] = useState(props.maxRowWidth);
  const container = useRef(null);
  useOutsideAlerter(container, value, () => {
    setShowingItems(false);
    if (value === null) {
      setText("");
      setVisibleData(props.data);
    } else {
      setText(
        visibleData.filter((el) => el[props.id] === value)[0][props.title]
      );
    }
  });

  useEffect(() => {
    selectionChanged(value);
    if (maxRowWidth < props.width) {
      setMaxRowWidth(props.width);
    }
  }, [value]);

  const divStyle = {
    width: props.width + "px",
    fontFamily: props.fontFamily,
    direction: props.dir,
  };

  const inputStyle = {
    fontFamily: props.fontFamily,
    direction: props.dir,
    borderRadius: props.dir === "ltr" ? "4px 0 0 4px" : "0 4px 4px 0",
  };

  const arrowStyle = {
    borderRadius: props.dir === "ltr" ? "0 4px 4px 0" : "4px 0 0 4px",
  };

  const [ulContainerStyle, setUlContainerStyle] = useState({
    width: props.width - 2 + "px",
    top: rect.y + rect.height,
    left: rect.x - props.dir === "ltr" ? 0 : 15,
    maxHeight: props.maxHeight + "px",
  });

  const handleFocus = (e) => {
    let rect = e.target.getBoundingClientRect();
    setRect({ rect });
    setUlContainerStyle({
      ...ulContainerStyle,
      top: rect.y + rect.height,
      left: rect.x - (props.dir === "ltr" ? 0 : 15),
    });
    setShowingItems(true);
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (e.target.value === "") {
      setValue(null);
    }
    setVisibleData(
      props.data.filter((item) =>
        item[props.title].toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setSuggestionIndex(0);
    setShowingItems(true);
  };

  const handleArrowClick = () => {
    setShowingItems(!showingItems);
    input1.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.code === "ArrowDown") {
      e.preventDefault();
      if (suggestionIndex <= visibleData.length - 2) {
        setSuggestionIndex(suggestionIndex + 1);
        let top = ulContainer.current.scrollTop;
        let scrollBarThickness =
          ulContainer.current.offsetHeight - ulContainer.current.clientHeight;
        if (
          (suggestionIndex + 2) * props.rowHeight >
          top + props.maxHeight + 2 - scrollBarThickness
        ) {
          ulContainer.current.scrollTop =
            (suggestionIndex + 2) * props.rowHeight -
            (props.maxHeight + 2 - scrollBarThickness);
        }
      }
    } else if (e.code === "ArrowUp") {
      e.preventDefault();
      if (suggestionIndex >= 1) {
        let top = ulContainer.current.scrollTop;
        if ((suggestionIndex - 1) * props.rowHeight < top) {
          ulContainer.current.scrollTop =
            (suggestionIndex - 1) * props.rowHeight;
        }
        setSuggestionIndex(suggestionIndex - 1);
      }
    } else if (e.code === "Enter") {
      e.preventDefault();
      select();
    }
  };

  const select = () => {
    setValue(visibleData[suggestionIndex][props.id]);
    setText(visibleData[suggestionIndex][props.title]);
    setShowingItems(false);
    setVisibleData(props.data);
  };

  return (
    <div
      style={divStyle}
      className={style.container}
      ref={container}
      value={value}
      selectionChanged={selectionChanged}
    >
      <input
        type="text"
        ref={input1}
        className={style.input}
        placeholder="type to search .... "
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={(e) => handleKeyDown(e)}
        value={text}
        style={inputStyle}
      />
      <TbChevronDown
        className={style.arrow}
        onClick={handleArrowClick}
        style={arrowStyle}
      />
      {showingItems && (
        <div
          className={style.ulContainer}
          ref={ulContainer}
          style={ulContainerStyle}
        >
          <ul className={style.ul}>
            {visibleData.map((item, i) => {
              return (
                <li
                  key={item[props.id]}
                  className={`${style.li} ${
                    i === suggestionIndex ? style.suggestion : ""
                  }`}
                  onMouseOver={() => setSuggestionIndex(i)}
                  onClick={select}
                  style={{
                    height: props.rowHeight - 4 + "px",
                    maxWidth: maxRowWidth + "px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title={item[props.title]}
                >
                  {item[props.title]}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

Selector.defaultProps = {
  maxHeight: 200,
  value: null,
  rowHeight: 25,
  key: "id",
  title: "title",
  fontFamily: "Helvetica",
  dir: "ltr",
  maxRowWidth: 250,
};

Selector.propTypes = {
  key: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.number.isRequired,
  maxHeight: PropTypes.number,
  rowHeight: PropTypes.number,
  fontFamily: PropTypes.string,
  dir: PropTypes.string,
  maxRowWidth: PropTypes.number,
};

export default Selector;
