# Overview

This exercise involves creating a React Calendar and Date Picker component after three years of exclusively working with Angular.

> Please note that this project is not intended to be developed into a full-fledged library, as there are already production-ready date pickers available for installation :)

![example screenshot](/screenshots/example.png)

### Tools

- React + TypeScript + Vite
- Pure CSS (Grid Layout)
- Dialog HTML Element
- ESLint

### Browser Support

- Chrome 122
- Edge 122
- Safari 17.4
- Firefox 123

## Calendar Features

#### API properties of the Calendar component

| Name       | Type             | Default                                  | Description                               |
| ---------- | ---------------- | ---------------------------------------- | ----------------------------------------- |
| `onSelect` | function(object) | { THIS_YEAR, THIS_MONTH, DATE_OF_TODAY } | Called when the selected date is changed. |

#### Day View

- Grayed-out days represent dates outside the current month.
- Navigate between **months** using ⏴ and ⏵ buttons.
- Selected date is highlighted with a circle.
- Today's date is shown in color.

![day view screenshot 1](/screenshots/day_view_1.png)
![day view screenshot 2](/screenshots/day_view_2.png)

#### Month View

- Clicking the heading switches to Month View from Day View.
- Clicking a month returns to Day View.
- Navigate between **years** using ⏴ and ⏵ buttons.
- Selected month is highlighted with a circle.

![month view sceenshot](/screenshots/month_view.png)

#### Year View

- Clicking the heading switches to Year View from Month View.
- Clicking a year returns to Month View.
- Navigate between **decades** using ⏴ and ⏵ buttons.
- Selected year is highlighted with a circle.

![year view screenshot](/screenshots/year_view.png)

## Date Picker Features

- Clicking the `input` field opens the calendar dropdown dialog.
- The dialog closes upon selecting a date in Day View or when losing focus.

![date picker screenshot](/screenshots/date_picker.png)
