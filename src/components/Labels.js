import { useEffect, useRef, useState } from "react";
import style from "./Labels.module.scss";
import { IoCloseOutline } from "react-icons/io5";

export default function Labels(props) {
  const [labels, setLabels] = useState(
    props.values ? props.values.split(",") : []
  );
  const [suggestions, setSuggestions] = useState(props.suggestions || []);

  useEffect(() => {
    setSuggestions(props.suggestions || []);
  }, [props.suggestions]);

  useEffect(() => {
    props.onChange(labels.join(","));
  }, [labels]);

  useEffect(() => {
    setLabels(props.values ? props.values.split(",") : []);
  }, [props.values]);

  const input = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      const value = e.target.innerText;
      if (!value || labels.includes(value)) {
        e.target.innerText = "";
      } else if (value) {
        setLabels([...labels, value]);
        e.target.innerText = "";
      }
    } else if (e.key == "Backspace") {
      if (e.target.innerText == "") {
        setLabels(labels.slice(0, labels.length - 1));
      }
    }
  };

  const handleInput = () => {
    props.onInput(input.current.innerText);
  };

  const handleRemove = (value) => {
    setLabels(labels.filter((label) => label != value));
  };

  const handleLabelsEmptyAreaClick = (e) => {
    if (e.target.tagName == "DIV") input.current.focus();
  };

  const acceptSuggestion = (suggested) => {
    setLabels([...labels, suggested]);
    setSuggestions(suggestions.filter((s) => s != suggested));
    input.current.innerText = "";
    input.current.focus();
  };

  return (
    <div>
      <div
        className={style.labels}
        onClick={(e) => handleLabelsEmptyAreaClick(e)}
      >
        {labels.map((label) => (
          <span key={label} className={style.tag}>
            {label}
            <IoCloseOutline onClick={(label) => handleRemove(label)} />
          </span>
        ))}
        <span
          ref={input}
          className={style.input}
          contentEditable={true}
          onInput={(e) => handleInput(e)}
          onKeyDown={(e) => handleKeyDown(e)}
        ></span>
      </div>
      <div className={style.suggestions}>
        <span>Suggested Items: </span>
        {suggestions
          .filter((suggestion) => !labels.includes(suggestion))
          .map((suggestion) => (
            <span
              key={suggestion}
              className={style.suggestion}
              onClick={() => acceptSuggestion(suggestion)}
            >
              {suggestion}
            </span>
          ))}
      </div>
    </div>
  );
}
