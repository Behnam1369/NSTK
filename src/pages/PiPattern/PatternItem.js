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
      formula,
      changeTitle,
      changeFormula,
      addItem,
      pi,
      onEdit,
      moveUp,
      moveDown,
      changeType,
      index,
    },
    ref
  ) => {
    const [editing, setEditing] = useState(false);
    const [spannedFormula, setSpannedFormula] = useState(spanned(formula));
    const quillRef = useRef(null);

    const evalFormula = formula.replace(/{([^}]+)}/g, (match, expression) => {
      try {
        const result = eval(expression);
        return result;
      } catch (error) {
        return expression;
      }
    });

    useEffect(() => {
      setSpannedFormula(spanned(formula));
    }, [formula]);

    const handleChangeFormula = (value) => {
      const unSpannedValue = unSpanned(value);
      if (unSpannedValue !== formula) {
        changeFormula(unSpannedValue, evalFormula);
        setSpannedFormula(value);
      }
    };

    const handleInsertExpression = (expression) => {
      const quill = quillRef.current.getEditor();
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
            <select onChange={(e) => changeType(e.target.value)}>
              <option>Normal</option>
              <option>Price</option>
            </select>
          </div>
        </div>
        {editing && (
          <ReactQuill
            theme="snow"
            value={spannedFormula}
            onChange={(val) => handleChangeFormula(val)}
            ref={quillRef}
            onBlur={(e) => handleBlur(e)}
            onFocus={onEdit}
          />
        )}
        {!editing && (
          <div
            className={style.text}
            dangerouslySetInnerHTML={{ __html: evalFormula }}
          />
        )}
        <div class={style.add}>
          <button onClick={(e) => handleAdd(e)}>Add Item ({index + 2}) </button>
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
