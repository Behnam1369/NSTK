import style from "./Modal.module.scss";

export default function Modal(props) {
  return (
    <div dir={props.dir} className={style.modal}>
      {props.children}
    </div>
  );
}
