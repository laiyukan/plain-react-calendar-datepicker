import { useState } from "react";
import "./App.css";
import Calendar, { TODAY, date } from "./Calendar";
import DatePicker from "./DatePicker";

function App() {
  const [calendarDate, setCalendarDate] = useState(TODAY);

  function handleCalendarDateSelect(selectedDate: date) {
    setCalendarDate((cd) => ({
      ...cd,
      year: selectedDate.year,
      month: selectedDate.month,
      day: selectedDate.day,
    }));
  }

  return (
    <>
      <div className="example-page">
        <div className="page-row">
          <div>
            <Calendar onSelect={handleCalendarDateSelect} />
            <p>Result: {JSON.stringify(calendarDate)}</p>
          </div>
          <div>
            <DatePicker />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
