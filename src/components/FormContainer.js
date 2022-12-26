import style from "./FormContainer.module.scss";

export default function FormContainer(props) {
  return (
    <div dir={props.dir} className={style.formContainer}>
      {props.children}
    </div>
  );
}
