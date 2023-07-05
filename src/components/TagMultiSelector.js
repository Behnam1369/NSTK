import style from "./TagMultiSelector.module.scss";

export default function TagMultiSelector({
  data,
  id,
  title,
  selectedValues,
  onChange,
  disabled
}) {
  const handleClick = (val) => {
    let selectedValuesArr = selectedValues.split(',');
    if (selectedValuesArr.includes(val)){
        onChange(selectedValuesArr.filter((el) => el != val).join(",") );
    } else {
      onChange([...selectedValuesArr,val].join(","));
    }
  };

  return (
    <div className={style.items}>
      {data.map((item) => (
        <div
          key={item[`${id}`]}
          className={`
            ${selectedValues.includes(item[`${id}`]) ? style.selected : ``} 
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
