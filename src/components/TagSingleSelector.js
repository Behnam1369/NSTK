import style from "./TagSingleSelector.module.scss";

export default function TagSingleSelector({
  data,
  id,
  title,
  selectedValue,
  onChange,
  disabled
}) {
  const handleClick = (val) => {
    if (!disabled)
      onChange(val);
  };

  return (
    <div className={style.items}>
      {data.map((item) => (
        <div
          key={item[`${id}`]}
          className={`
            ${item[`${id}`] == selectedValue ? style.selected : ``} 
            ${disabled? style.disabled : ``}
          ` }
          onClick={() => handleClick(item[`${id}`])}
        >
          {item[`${title}`]}
        </div>
      ))}
    </div>
  );
}
