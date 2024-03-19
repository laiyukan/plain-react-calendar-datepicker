import { useEffect, useRef, useState } from "react";
import Calendar from "./Calendar";
import { date } from "./Calendar";
import "./DatePicker.css";

export default function DatePicker() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pickedDate, setPickedDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // event delegation
    function handleDocumentClick(e: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        dialogRef.current &&
        !dialogRef.current.contains(e.target as Node)
      ) {
        setIsDialogOpen(() => false);
      }
    }

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);

  function handleDatePick(selectedDate: date) {
    inputRef.current?.blur();
    setIsDialogOpen(() => false);
    setPickedDate(
      () =>
        `${selectedDate.year}-${selectedDate.month
          .toString()
          .padStart(2, "0")}-${selectedDate.day.toString().padStart(2, "0")}`
    );
  }

  function handleDialogEvent() {
    inputRef.current?.focus();
  }

  function handleInputFocus() {
    setIsDialogOpen(() => true);
  }

  return (
    <div className="date-picker-wrapper">
      <input
        id="date"
        type="text"
        value={pickedDate}
        placeholder="YYYY-MM-DD"
        onChange={(e) => e.preventDefault()}
        onFocus={handleInputFocus}
        ref={inputRef}
      />

      <dialog
        {...(isDialogOpen ? { open: true } : {})}
        onClick={handleDialogEvent}
        ref={dialogRef}
      >
        <Calendar onPick={handleDatePick} />
      </dialog>
    </div>
  );
}
