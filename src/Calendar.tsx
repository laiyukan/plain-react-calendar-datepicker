import { useEffect, useState } from "react";
import "./Calendar.css";

enum ViewType {
  Day,
  Month,
  Year,
}

export type date = {
  year: number;
  month: number;
  day: number;
};

type meta = {
  view: ViewType;
  decade: number;
  year: number;
  month: number;
};

export const THIS_YEAR = +new Date().getFullYear();
export const THIS_MONTH = +new Date().getMonth() + 1;
export const TODAY_DATE = +new Date().getDate();
const THIS_DECADE = Math.floor(THIS_YEAR / 10) * 10;
export const TODAY: date = {
  year: THIS_YEAR,
  month: THIS_MONTH,
  day: TODAY_DATE,
};
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// get number of days of a month of a given year
const getNumberOfDays = (year = THIS_YEAR, month = THIS_MONTH) => {
  const isLeapYear = year % 4 === 0;
  const monthsOf30Days = [4, 6, 9, 11];

  if (isLeapYear && month === 2) return 29;
  if (month === 2) return 28;
  return monthsOf30Days.includes(month) ? 30 : 31;
};

// determine the week day of the first day of a given month of a given year
const getFirstDayOfTheWeek = (year = THIS_YEAR, month = THIS_MONTH) => {
  /*
   *formula for the Gregorian (after 1582-10-15) calendar:
   * W = (k + Math.floor(2.6 * M - 0.2) - 2C + Y + Math.floor(Y / 4) + Math.floor(C / 4)) % 7
   * k: day (1 to 31)
   * M: month (March = 1, ..., December = 10, Jan = 11, Feb = 12)
   * C: century (e.g., 1987 has C = 19)
   * Y: year (e.g., 1987 has Y = 87 except Y = 86 for Jan & Feb)
   * W: week day (0 = Sunday, ..., 6 = Saturday)
   */
  /* const M = month === 1 ? 11 : month === 2? 12 : month - 1;
   const Y = month === 1 || month === 2 ? +(year.toString().slice(-2)) - 1 : +(year.toString().slice(-2));
   const C = Math.floor(year/100);
   return (1 + Math.floor(2.6 * M - 0.2) - 2 * C + Y + Math.floor(Y / 4) + Math.floor(C / 4) % 7); */
  return +new Date(year, month - 1, 1).getDay();
};

interface CalendarHeaderProps {
  calendarMeta: meta;
  onHeadingClick: () => void;
  onLeftArrowClick: () => void;
  onRightArrowClick: () => void;
}

interface DayGridProps {
  selectedDate: date;
  calendarMeta: meta;
  onDayClick: (year: number, month: number, day: number) => void;
}

interface MonthGridProps {
  selectedDate: date;
  onMonthClick: (month: number) => void;
}

interface YearGridProps {
  selectedDate: date;
  calendarMeta: meta;
  onYearClick: (year: number) => void;
}

interface CalendarProps {
  onPick: (selectedDate: date) => void;
}

function CalendarHeader(props: CalendarHeaderProps) {
  const heading: string = (() => {
    switch (props.calendarMeta.view) {
      case ViewType.Day:
        return `${MONTHS[props.calendarMeta.month - 1]} ${
          props.calendarMeta.year
        }`;
      case ViewType.Month:
      default:
        return `${props.calendarMeta.year}`;
      case ViewType.Year:
        return `${props.calendarMeta.decade}-${props.calendarMeta.decade + 9}`;
    }
  })();

  return (
    <div className="header-wrapper">
      <div tabIndex={0} onClick={props.onLeftArrowClick}>
        <div className="arrow-left"></div>
      </div>
      <div tabIndex={0} onClick={props.onHeadingClick}>
        {heading}
      </div>
      <div tabIndex={0} onClick={props.onRightArrowClick}>
        <div className="arrow-right"></div>
      </div>
    </div>
  );
}

function DayGrid(props: DayGridProps) {
  const lastMonthNumberOfDays =
    props.calendarMeta.month === 1
      ? 31
      : getNumberOfDays(props.calendarMeta.year, props.calendarMeta.month - 1);
  const firstWeekDay = getFirstDayOfTheWeek(
    props.calendarMeta.year,
    props.calendarMeta.month
  );
  const numberOfDays = getNumberOfDays(
    props.calendarMeta.year,
    props.calendarMeta.month
  );
  const grid: { year: number; month: number; day: number; class: string }[][] =
    []; // year and month is recorded because day of the last month or the next month is selectable even being "gray" in style

  for (let row = 0; row < 6; row++) {
    grid[row] = [];
    for (let col = 0; col < 7; col++) {
      const day = 7 * row + col - firstWeekDay + 1;

      if (row === 0 && col < firstWeekDay) {
        grid[row][col] = {
          year:
            props.calendarMeta.month === 1
              ? props.calendarMeta.year - 1
              : props.calendarMeta.year,
          month:
            props.calendarMeta.month === 1 ? 12 : props.calendarMeta.month - 1,
          day: lastMonthNumberOfDays - firstWeekDay + 1 + col,
          class: "pale",
        };
      } else if (day > numberOfDays) {
        grid[row][col] = {
          year:
            props.calendarMeta.month === 12
              ? props.calendarMeta.year + 1
              : props.calendarMeta.year,
          month:
            props.calendarMeta.month === 12 ? 1 : props.calendarMeta.month + 1,
          day: day - numberOfDays,
          class: "pale",
        };
      } else {
        const isSelectedDate =
          props.calendarMeta.year === props.selectedDate.year &&
          props.calendarMeta.month === props.selectedDate.month &&
          props.selectedDate.day === day;
        const isToday =
          props.calendarMeta.year === THIS_YEAR &&
          props.calendarMeta.month === THIS_MONTH &&
          day === TODAY_DATE;
        grid[row][col] = {
          year: props.calendarMeta.year,
          month: props.calendarMeta.month,
          day,
          class: isSelectedDate ? "selected" : isToday ? "marked" : "",
        };
      }
    }
  }

  return (
    <div className="grid-container sm-grid-container">
      <div className="row">
        {WEEK_DAYS.map((abbr) => (
          <div key={abbr} className="label">
            {abbr}
          </div>
        ))}
      </div>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((col, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              tabIndex={0}
              className={col.class}
              onClick={() => props.onDayClick(col.year, col.month, col.day)}
            >
              {col.day}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function MonthGrid(props: MonthGridProps) {
  return (
    <div className="grid-container lg-grid-container">
      {MONTHS.reduce((rows: string[][], month, i) => {
        if (i % 4 === 0) rows.push([]);
        rows[rows.length - 1].push(month);
        return rows;
      }, []).map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((month, colIndex) => (
            <div
              key={month}
              tabIndex={0}
              className={
                props.selectedDate.month === 4 * rowIndex + colIndex + 1
                  ? "selected"
                  : undefined
              }
              onClick={() => {
                props.onMonthClick(4 * rowIndex + colIndex + 1);
              }}
            >
              {month}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function YearGrid(props: YearGridProps) {
  const checkClass = (year: number): string => {
    if (year === props.selectedDate.year) return "selected";
    return year < props.calendarMeta.decade ||
      year > props.calendarMeta.decade + 9
      ? "pale"
      : "";
  };

  return (
    <div className="grid-container lg-grid-container">
      {Array.from({ length: 12 }, (_, n) => props.calendarMeta.decade - 1 + n)
        .reduce((rows: number[][], year, i) => {
          if (i % 4 === 0) rows.push([]);
          rows[rows.length - 1].push(year);
          return rows;
        }, [])
        .map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((year) => (
              <div
                key={year}
                tabIndex={0}
                className={checkClass(year)}
                onClick={() => props.onYearClick(year)}
              >
                {year}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

export default function Calendar(props: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [calendarMeta, setCalendarMeta] = useState({
    view: ViewType.Day,
    decade: THIS_DECADE,
    year: THIS_YEAR,
    month: THIS_MONTH,
  });

  useEffect(() => {
    props.onPick(selectedDate);
  }, [selectedDate]);

  function handleHeaderClick() {
    switch (calendarMeta.view) {
      case ViewType.Day:
      default:
        setCalendarMeta((cm) => ({ ...cm, view: ViewType.Month }));
        break;
      case ViewType.Month:
        setCalendarMeta((cm) => ({ ...cm, view: ViewType.Year }));
        break;
    }
  }

  function handleLeftArrowClick() {
    switch (calendarMeta.view) {
      case ViewType.Day:
      default:
        if ((calendarMeta.year - 1) % 10 === 0 && calendarMeta.month === 1) {
          setCalendarMeta((cm) => ({
            ...cm,
            decade: cm.year - 1,
            year: cm.year - 1,
            month: 12,
          }));
        } else if (calendarMeta.month === 1) {
          setCalendarMeta((cm) => ({
            ...cm,
            year: cm.year - 1,
            month: 12,
          }));
        } else {
          setCalendarMeta((cm) => ({ ...cm, month: cm.month - 1 }));
        }
        break;
      case ViewType.Month:
        if ((calendarMeta.year - 1) % 10 === 0) {
          setCalendarMeta((cm) => ({
            ...cm,
            decade: cm.year - 1,
            year: cm.year - 1,
          }));
        } else {
          setCalendarMeta((cm) => ({ ...cm, year: cm.year - 1 }));
        }
        break;
      case ViewType.Year:
        setCalendarMeta((cm) => ({ ...cm, decade: cm.decade - 10 }));
        break;
    }
  }

  function handleRightArrowClick() {
    switch (calendarMeta.view) {
      case ViewType.Day:
      default:
        if ((calendarMeta.year + 1) % 10 === 0 && calendarMeta.month === 12) {
          setCalendarMeta((cm) => ({
            ...cm,
            decade: cm.year + 1,
            year: cm.year + 1,
            month: 1,
          }));
        } else if (calendarMeta.month === 12) {
          setCalendarMeta((cm) => ({
            ...cm,
            year: cm.year + 1,
            month: 1,
          }));
        } else {
          setCalendarMeta((cm) => ({ ...cm, month: cm.month + 1 }));
        }
        break;
      case ViewType.Month:
        if ((calendarMeta.year + 1) % 10 === 0) {
          setCalendarMeta((cm) => ({
            ...cm,
            decade: cm.year + 1,
            year: cm.year + 1,
          }));
        } else {
          setCalendarMeta((cm) => ({ ...cm, year: cm.year + 1 }));
        }
        break;
      case ViewType.Year:
        setCalendarMeta((cm) => ({ ...cm, decade: cm.decade + 10 }));
        break;
    }
  }

  function handleDaySelect(year: number, month: number, day: number) {
    const decade = Math.floor(year / 10) * 10;
    setSelectedDate((sd) => ({ ...sd, year, month, day }));
    setCalendarMeta((cm) => ({ ...cm, decade, year, month }));
  }

  function handleMonthSelect(month: number) {
    if (month === selectedDate.month) {
      setCalendarMeta((cm) => ({ ...cm, view: ViewType.Day }));
      return;
    }
    setSelectedDate((sd) => ({ ...sd, year: calendarMeta.year, month }));
    setCalendarMeta((cm) => ({ ...cm, view: ViewType.Day, month }));
  }

  function handleYearSelect(year: number) {
    if (year === selectedDate.year) {
      setCalendarMeta((cm) => ({ ...cm, view: ViewType.Month }));
      return;
    }
    const decade = Math.floor(year / 10) * 10;
    setSelectedDate((sd) => ({ ...sd, year }));
    setCalendarMeta((cm) => ({
      ...cm,
      view: ViewType.Month,
      decade,
      year,
    }));
  }

  return (
    <div className="calendar-wrapper">
      <CalendarHeader
        calendarMeta={calendarMeta}
        onHeadingClick={handleHeaderClick}
        onLeftArrowClick={handleLeftArrowClick}
        onRightArrowClick={handleRightArrowClick}
      ></CalendarHeader>
      {calendarMeta.view === ViewType.Day ? (
        <DayGrid
          selectedDate={selectedDate}
          calendarMeta={calendarMeta}
          onDayClick={handleDaySelect}
        ></DayGrid>
      ) : null}
      {calendarMeta.view === ViewType.Month ? (
        <MonthGrid
          selectedDate={selectedDate}
          onMonthClick={handleMonthSelect}
        ></MonthGrid>
      ) : null}
      {calendarMeta.view === ViewType.Year ? (
        <YearGrid
          selectedDate={selectedDate}
          calendarMeta={calendarMeta}
          onYearClick={handleYearSelect}
        ></YearGrid>
      ) : null}
    </div>
  );
}
