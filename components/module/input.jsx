function Input({ setInput, name, classes, value, type, placeholder, label }) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className={label.classes}>
          {label.text}
        </label>
      )}
      <input
        type={type}
        onChange={(event) => setInput(event)}
        placeholder={placeholder}
        value={value}
        id={name}
        name={name}
        className={classes}
      />
    </div>
  );
}

export default Input;
