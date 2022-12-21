import style from "./Message.module.scss";
import { IoCloseOutline } from "react-icons/io5";
export default function Message(props) {
  const handleClose = () => {
    props.setShow(false);
  };

  return (
    <div className={style.bg}>
      <div className={style.box}>
        <div className={style.title}>
          <h2>{props.title}</h2>
          <IoCloseOutline
            onClick={(e) => handleClose(e)}
            className={style.close}
          />
        </div>
        <p>{props.text}</p>
        <buttton onClick={(e) => handleClose(e)}>تایید</buttton>
      </div>
    </div>
  );
}
