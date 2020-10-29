const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let events = [];

const localEvents = () => {
    localStorage.getItem('events') ? (
      events = JSON.parse(localStorage.getItem('events')),
      drawEvents()
    ) :
    events = [];
  }


const init = () => {
  const dateTitle = new Date();

  titleOfCalendar(dateTitle, months);
  setWeeksGrid(dateTitle);
  prevMonth(dateTitle, months);
  nextMonth(dateTitle, months);
};

const getCalendar = (year, month) => {
  const nowDay = new Date().getDate();
  const nowMonth = new Date().getMonth();
  const nowYear = new Date().getFullYear();
  const startDate = new Date(year, month, 1); /* first day of month */
  const endDate = new Date(year, month + 1, 0); /* last day of month */
  const dayOfStartDay = startDate.getDay(); /* day number of week */
  const currentMonthTotalDays = endDate.getDate(); /* amount days in current month */
  const totalWeeks = Math.ceil(
    (currentMonthTotalDays + dayOfStartDay) / 7
  ); /* total weeks in month */
  const prevMonthEndDate = new Date(
    year,
    month,
    0
  ); /* end day of previous month */
  const dates = [];
  const weeks = [];

  let prevMonthDay =
    prevMonthEndDate.getDate() -
    dayOfStartDay +
    1; /* get first Sunday of first week */
  let nextMonthDay = 1;

  for (let i = 0; i < totalWeeks * 7; i += 1) {
    let date;

    if (i < dayOfStartDay) {
      /* if month does not start on Sunday */
      date = new Date(year, month - 1, prevMonthDay);
      prevMonthDay = prevMonthDay + 1;
    } else if (i > currentMonthTotalDays + (dayOfStartDay - 1)) {
      /* if month does not end on Saturday */
      date = new Date(year, month + 1, nextMonthDay);
      nextMonthDay = nextMonthDay + 1;
    } else {
      date = new Date(
        year,
        month,
        i - dayOfStartDay + 1
      ); /* current month dates */
    }

    dates.push({
      day: date.getDate(),
      dayTS: date.getTime(),
      today:
        date.getDate() === nowDay &&
        date.getMonth() === nowMonth &&
        date.getFullYear() === nowYear
          ? "today"
          : null,
      month:
        date.getMonth() === nowMonth && date.getFullYear() === nowYear
          ? "current"
          : null,
    });
  }

  for (let i = 0; i < Math.ceil(dates.length / 7); i++) {
    const daysPerWeek = dates.slice(i * 7, i * 7 + 7);

    weeks.push({
      days: daysPerWeek,
      dayStart: daysPerWeek[0].day,
      dayEnd: daysPerWeek[6].day,
      dayStartTS: daysPerWeek[0].dayTS,
      dayEndTS: daysPerWeek[6].dayTS,
      a: 100,
      b: 100,
      c: 100,
      visible: [],
      hidden: [],
    });
  }

  return weeks;
};

const setWeeksGrid = (date) => {
  const month = date.getMonth();
  const year = date.getFullYear();
  const weeks = getCalendar(year, month);
  drawCalendar(weeks);
  console.log("weeks", weeks);
};

const drawCalendar = (currentWeek) => {
  const weekAll = document.querySelector(".weekAll");
  weekAll.innerHTML = "";

  currentWeek.forEach((item, index) => {
    weekAll.innerHTML += `<div class="week"></div>`;

    const weeks = [...document.querySelectorAll(".week")];
    weeks[index].innerHTML = "";

    item.days.forEach((it) => {
      if (it.today === "today") {
        weeks[
          index
        ].innerHTML += `<div style ="border: 3px solid #27ae60">${it.day}</div>`;
      } else if (it.month === "current") {
        weeks[index].innerHTML += `<div>${it.day}</div>`;
      } else {
        weeks[index].innerHTML += `<div style ="color: #999">${it.day}</div>`;
      }
    });
  });
};

const titleOfCalendar = (date, months) => {
  const newDate = document.querySelector("#date");
  const nowYear = document.querySelector("#year");

  newDate.innerHTML = `${months[date.getMonth()]}`;
  nowYear.innerHTML = `${date.getFullYear()}`;
};

const drawEvents = (event) => {
  const year = document.querySelector("#year").textContent;
  const month = document.querySelector("#date").textContent;
  let monthIndex;

  months.forEach((elem, index) => {
    month === elem ? (monthIndex = index) : null;
  });

  dataTimeStamp(year, monthIndex, event);
};

const prevMonth = (date, months) => {
  document.querySelector("#prev").addEventListener("click", () => {
    let prevDate = date.setMonth(date.getMonth() - 1);
    titleOfCalendar(date, months);
    setWeeksGrid(date, prevDate);
    drawEvents();
  });
};

const nextMonth = (date, months) => {
  document.querySelector("#next").addEventListener("click", () => {
    let nextDate = date.setMonth(date.getMonth() + 1);
    titleOfCalendar(date, months);
    setWeeksGrid(date, nextDate);
    drawEvents();
  });
};

init();

const addEventBtn = document.querySelector("#addEventBtn");
addEventBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const form = document.querySelector("#form");
  const description = document.querySelector("#description").value;
  const start = document.querySelector("#start").value;
  const finish = document.querySelector("#finish").value;

  if (description && start && finish) {
    const event = {
      description: description,
      start: Date.parse(start) - 3 * 60 * 60 * 1000,
      finish: Date.parse(finish) - 3 * 60 * 60 * 1000,
    };

    const slides = [...document.querySelectorAll(".slide")];
    slides.forEach((event) => event.remove());
    const hiddenSlide = [...document.querySelectorAll(".hidden")];
    hiddenSlide.forEach((event) => event.remove());

    drawEvents(event);
  } else {
    const modalError = document.querySelector("#error-no-value");
    const closeError = document.querySelector("#close-error");
    modalError.style.display = "block";
    closeError.addEventListener("click", () => {
    modalError.style.display = "none";
    });
    console.log("ERROR: empty field"); 
  }

  form.reset();
});

const timestampToDate = (ts) => {
  const d = new Date();
  d.setTime(ts);
  return (
    ("0" + d.getDate()).slice(-2) +
    "." +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "." +
    d.getFullYear()
  );
};

const displayTable = (element) => {
  tbody.innerHTML += `<tr>
    <td class = "description">${element.description}</td>
    <td class = "start">${timestampToDate(element.start)}</td>
    <td class = "finish">${timestampToDate(element.finish)}</td>
  </tr>`;
};

const setEventPosition = (item, j) => {
  const weeks = [...document.querySelectorAll(".week")];

  item.visible.slice(0, 3).forEach((el, index) => {
    let widthEventFree;
    let widthEv;
    let top = 35;
    let widthWeek = 7 * 24 * 60 * 60 * 1000;
    let widthEvent = el.finish - el.start + 24 * 60 * 60 * 1000;
    let eventLeft = ((el.start - item.dayStartTS) / widthWeek) * 100;
    let eventRight = ((item.dayEndTS - el.finish) / widthWeek) * 100;

    if (el.finish < item.dayEndTS) {
      widthEventFree =
        ((el.finish + 24 * 60 * 60 * 1000 - item.dayStartTS) / widthWeek) * 100;
      widthEv =
        ((el.finish - item.dayStartTS + 24 * 60 * 60 * 1000) / widthWeek) * 100;
    } else {
      widthEventFree = 100;
      widthEv = 100;
    }

    if (item.a >= widthEv) {
      top = 35;
      item.a = item.a - widthEventFree;
    } else if (item.b >= widthEv) {
      top = 60;
      item.b = item.b - widthEventFree;
    } else if (item.c >= widthEv) {
      top = 85;
      item.c = item.c - widthEventFree;
    }

    if (eventRight < 0 && eventLeft < 0) {
      widthEvent = widthWeek;
      eventLeft = 0;
    } else if (eventRight < 0) {
      widthEvent = item.dayEndTS - el.start + 24 * 60 * 60 * 1000;
    } else if (eventLeft < 0) {
      eventLeft = 0;
      widthEvent = widthWeek - (item.dayEndTS - el.finish);
    }

    weeks[
      j
    ].innerHTML += `<div class="slide" style="left: ${eventLeft}%; width:${
      (widthEvent * 100) / widthWeek
    }%; top:${top}px;"></div>`;

    const slidesForCurrentWeek = [...weeks[j].querySelectorAll(".slide")];
    slidesForCurrentWeek[index].textContent = el.description;
  });
};

const showMoreBtn = (item, j) => {
  const weeks = [...document.querySelectorAll(".week")];

  weeks[
    j
  ].innerHTML += `<div class="hidden" data-index="${j}" style="left: ${0}%; width:${100}%; top:${110}px; cursor: pointer;"> ${
    item.hidden.length
  } more...</div>`;
};

const setSort = (event, action, weeksTimeStamp) => {
  event.preventDefault();

  let indexOfTable = table.dataset.number;
  weeksTimeStamp[indexOfTable].hidden.sort((a, b) => {
    switch (action) {
      case "upStart":
        return a.start - b.start;
      case "downStart":
        return b.start - a.start;
      case "upFinish":
        return a.finish - b.finish;
      case "downFinish":
        return b.finish - a.finish;
    }
  });

  tbody.innerHTML = "";
  weeksTimeStamp[indexOfTable].hidden.forEach((elem) => {
    displayTable(elem);
  });
};

const showHiddenEvents = (weeksTimeStamp) => {
  const table = document.querySelector("#table");
  const hiddenSlide = [...document.querySelectorAll(".hidden")];
  const modalTable = document.querySelector("#modal-table");
  const closeBtn = document.querySelector("#closeBtn");
  const tbody = document.querySelector("#tbody");
  const sortBtn = [...document.querySelectorAll(".sortBtn")];

  hiddenSlide.forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      let indexOfHiddenSlide = el.dataset.index;
      table.dataset.number = el.dataset.index;
      modalTable.style.display = "block";
      tbody.innerHTML = "";
      weeksTimeStamp[indexOfHiddenSlide].hidden.forEach((elem) => {
        displayTable(elem);
      });
    });
  });

  sortBtn.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const btnId = event.target.id;
      setSort(event, btnId, weeksTimeStamp);
    });
  });

  closeBtn.addEventListener("click", () => {
    modalTable.style.display = "none";
  });
};

const dataTimeStamp = (year, month, eventObject) => {
  if (eventObject !== undefined) {
    events.push(eventObject);
  }

  localStorage.setItem("events", JSON.stringify(events));

  const weeksTimeStamp = getCalendar(year, month);

  weeksTimeStamp.forEach((item, j) => {
    events.forEach((elem) => {
      if (elem.start >= item.dayStartTS && elem.finish <= item.dayEndTS) {
        item.visible.push(elem);
      } else if (elem.start >= item.dayStartTS && elem.start <= item.dayEndTS) {
        item.visible.push(elem);
      } else if (
        elem.finish >= item.dayStartTS &&
        elem.finish <= item.dayEndTS
      ) {
        item.visible.push(elem);
      } else if (elem.start < item.dayStartTS && elem.start > item.dayEndTS) {
        item.visible.push(elem);
      } else if (
        elem.start <= item.dayStartTS &&
        elem.finish >= item.dayEndTS
      ) {
        item.visible.push(elem);
      }
      if (item.visible.length > 3) {
        item.hidden = item.visible.slice(3);
      }
    });

    if (item.hidden.length > 0) {
      showMoreBtn(item, j);
    }

    if (item.visible.length > 0) {
      setEventPosition(item, j);
      showHiddenEvents(weeksTimeStamp);
    }
  });
  
  console.log("weeksTimeStamp", weeksTimeStamp);
};

localEvents();

const clearEventBtn = document.querySelector("#clearEventBtn");
clearEventBtn.addEventListener("click", (event) => {
  event.preventDefault();
  
  const modalClear = document.querySelector("#clear-calendar");
  const yesClear = document.querySelector("#yes-clear");
  const noClear = document.querySelector("#no-clear");

  modalClear.style.display = "block";

  yesClear.addEventListener("click", (ev) => {
    ev.preventDefault();
    localStorage.removeItem("events");
    modalClear.style.display = "none";
    init();
  });

  noClear.addEventListener("click", (ev) => {
    ev.preventDefault();
    modalClear.style.display = "none";
    init();
    drawEvents();
  });
    
})