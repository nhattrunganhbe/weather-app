function SearchBox({ value, onChange, onSearch }) {
  return (
    <div>
      <input
        placeholder="Enter city name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <button onClick={onSearch}>Search</button>
    </div>
  );
}

export default SearchBox;


/* value = {value} là để nó hiện ra cái value
còn onchange(e.targer.value) là app.setCityInput (mục đích là đổi cityInput)
còn onclick thực chất là onsearch (onsearch thì lại gọi setCityToSearch mục đích là đổi cityToSearch */