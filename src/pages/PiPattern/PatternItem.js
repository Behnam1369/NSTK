import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import style from "./PatternItem.module.scss";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

const PatternItem = forwardRef(
  (
    {
      title,
      text,
      changeTitle,
      changeText,
      addItem,
      pi,
      onEdit,
      moveUp,
      moveDown,
    },
    ref
  ) => {
    const [editing, setEditing] = useState(false);
    const [spannedText, setSpannedText] = useState(spanned(text));
    const quillRef = useRef(null);

    const evalTExt = text.replace(/{([^}]+)}/g, (match, expression) => {
      try {
        const result = eval(expression);
        return result;
      } catch (error) {
        return expression;
      }
    });

    useEffect(() => {
      setSpannedText(spanned(text));
    }, [text]);

    const handleChangeText = (value) => {
      const unSpannedValue = unSpanned(value);
      if (unSpannedValue !== text) {
        changeText(unSpannedValue);
        setSpannedText(value);
      }
    };

    const handleInsertExpression = (expression) => {
      const quill = quillRef.current.getEditor();
      // const selectionIndex = quill.getSelection();
      // // console.log(quillRef.current);
      if (selection) {
        quill.deleteText(selection.index, selection.length);
        quill.insertText(selection.index, `{${expression}}`);
        quill.setSelection(selection.index + expression.length + 2);
      }
    };

    useImperativeHandle(ref, () => ({
      handleInsertExpression,
      quillRef,
    }));

    const handleAdd = (e) => {
      e.preventDefault();
      addItem();
    };

    const handleEdit = () => {
      setEditing(!editing);
      onEdit();
    };

    const [selection, setSelection] = useState(null);
    const handleBlur = (e) => {
      setSelection(e);
      console.log(e);
    };

    return (
      <div className={style.main}>
        <div>
          <input
            type="text"
            value={title}
            onChange={changeTitle}
            placeholder="title"
          />
          <div>
            <button onClick={() => handleEdit()}>
              {editing ? "Confirm" : "Edit"}
            </button>
            <button onClick={moveUp}>
              <FiChevronUp />
            </button>
            <button onClick={moveDown}>
              <FiChevronDown />
            </button>
          </div>
        </div>
        {editing && (
          <ReactQuill
            theme="snow"
            value={spannedText}
            onChange={(val) => handleChangeText(val)}
            ref={quillRef}
            onBlur={(e) => handleBlur(e)}
            onFocus={onEdit}
          />
        )}
        {!editing && <div dangerouslySetInnerHTML={{ __html: evalTExt }} />}
        <div class={style.add}>
          <button onClick={(e) => handleAdd(e)}>Add Item</button>
        </div>
      </div>
    );
  }
);

export default PatternItem;

const spanned = (t) => {
  return t.replace(/{([^}]+)}/g, `<span style="color: blue;">{$1}</span>`);
};

const unSpanned = (t) => {
  const spanRegex = new RegExp(
    `<span style="color: blue;"[^>]*>(.*?)</span>`,
    "g"
  );
  return t.replace(spanRegex, "$1");
};
