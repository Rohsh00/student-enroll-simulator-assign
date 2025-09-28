import { checkboxesData } from "./data.js";
import { courseLevelsData } from "./data.js";

//insert and fetch localStorage Data
function set_get_localStorageData(insertData, key = "unAssignStudentsData") {
  if (insertData) {
    localStorage.setItem(key, JSON.stringify(insertData));
  }

  const fetchedData = JSON.parse(localStorage.getItem(key)) || [];

  return fetchedData;
}

const checkBoxesParentEl = document.getElementById("courseCheckBoxes");

//Render multiple checkBoxes by providing the array to this function
const renderMultipleChecks = (checkBoxArr) => {
  checkBoxArr.forEach((el) => {
    const checkContainer = document.createElement("div");
    checkContainer.className = "form-check";

    const checkInput = document.createElement("input");
    checkInput.type = "checkbox";
    checkInput.classList.add("form-check-input");

    for (let key in el) {
      if (key !== "label" && key !== "class" && key !== "for") {
        checkInput.setAttribute(key, el[key]);
      }
    }

    const checkLable = document.createElement("label");
    checkLable.textContent = el.id;
    checkLable.classList.add("form-check-label");
    checkLable.setAttribute("for", el.id);

    checkContainer.appendChild(checkInput);
    checkContainer.appendChild(checkLable);
    checkBoxesParentEl.appendChild(checkContainer);
  });
};

renderMultipleChecks(checkboxesData);

//render list of unassigned students
const unAssignStudentListEle = document.getElementById("unAssignStudentList");

function renderUnAssignStudentList(unStudent = []) {
  unAssignStudentListEle.innerHTML = "";

  const studentUnAssigndata = unStudent.filter((st) => !st.assignedCourseID);

  if (!studentUnAssigndata.length) {
    unAssignStudentListEle.innerHTML = `<h6>No Data Found</h6>`;
  }

  const olEle = document.createElement("ul");

  studentUnAssigndata.forEach((el) => {
    const li = document.createElement("li");
    li.classList.add("card", "cursor-grab", "mb-2", "p-3", "text-capitalize");
    li.innerHTML = `
  <div class="card-body p-1">
    <h6 class="card-title mb-1">${el.studentName}</h6>
    <p class="card-text mb-0"><small>ID: ${el.uid}</small></p>
    <p class="card-text"><small>Courses: ${
      el.courses.length ? el.courses.join(", ") : "None"
    }</small></p>
  </div>
`;
    li.setAttribute("draggable", true);
    li.setAttribute("id", el.uid);
    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", li.id);
    });

    olEle.appendChild(li);
  });

  unAssignStudentListEle.appendChild(olEle);
}

//form submit
let studentFormData = set_get_localStorageData() || [];

const initValues = { beginner: 0, intermediate: 0, advanced: 0 };

const totalStudentLvlCountingData = studentFormData.reduce((acc, curr) => {
  switch (curr.assignedCourseID) {
    case "beginner":
      acc.beginner++;
      break;
    case "intermediate":
      acc.intermediate++;
      break;
    case "advanced":
      acc.advanced++;
      break;
    default:
      break;
  }
  return acc;
}, initValues);

renderUnAssignStudentList(studentFormData);

let uid = 0;
let courses = [];
studentFormData.forEach((i) => {
  uid = i.uid;
});

const formContainerEle = document.querySelector("#studentForm");
formContainerEle.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValues = formContainerEle.querySelectorAll("input");
  const studentFormValues = {};
  inputValues.forEach((el) => {
    if (el.type === "checkbox" && el.checked) {
      courses.push(el.id);
    } else if (el.id === "studentName") {
      studentFormValues[el.id] = el.value;
    }
  });

  uid += 1;

  const finalSubmitData = { uid, courses, ...studentFormValues };

  studentFormData.push(finalSubmitData);

  renderUnAssignStudentList(studentFormData);
  set_get_localStorageData(studentFormData, "unAssignStudentsData");

  inputValues.forEach((el) => {
    if (el.type === "checkbox") {
      el.checked = false;
    } else {
      el.value = "";
    }
  });
});

// Course Levels drag and drop

const courseLvlSecEle = document.getElementById("courseLvlSection");

courseLevelsData.forEach((lvl) => {
  const courseLvlMainEle = document.createElement("div");
  courseLvlMainEle.classList.add("col-md-4", "min-vh-50");
  courseLvlMainEle.setAttribute("id", lvl.id);

  courseLvlMainEle.innerHTML = `<div class="card p-3 mb-2">
            <h4>${lvl.title}</h4>
            `;

  courseLvlSecEle.appendChild(courseLvlMainEle);
});

function createCourseLvlCard(cardData) {
  const oldCard = document.getElementById(cardData.uid);
  if (oldCard) {
    oldCard.remove();
  }

  const courseLvlCardEle = document.createElement("div");
  courseLvlCardEle.setAttribute("draggable", true);
  courseLvlCardEle.setAttribute("id", cardData.uid);

  courseLvlCardEle.innerHTML = `<div class="card p-3 mb-2 cursor-grab">
              <h6 class="card-title">Name: ${cardData.studentName}</h6>
              <p class="card-text">ID: ${cardData.uid}</p>
              <p class="card-text">Courses: ${
                cardData.courses.length ? el.courses.join(", ") : "None"
              }</p>
            </div>`;

  courseLvlCardEle.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", cardData.uid);
  });

  return courseLvlCardEle;
}

courseLevelsData.forEach((course) => {
  const sections = document.getElementById(course.id);

  sections.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  sections.addEventListener("drop", (e) => {
    e.preventDefault();
    const uid = +e.dataTransfer.getData("text/plain");

    const singleMatchedData = studentFormData.find((e) => e.uid == uid);

    if (singleMatchedData) {
      sections.appendChild(createCourseLvlCard(singleMatchedData));
    }

    studentFormData.forEach((el, index) => {
      if (el.uid === uid) {
        studentFormData[index] = { ...el, assignedCourseID: course.id };
      }
    });

    set_get_localStorageData(studentFormData);
  });
});

function renderInitAssignedCourseCards() {
  courseLevelsData.forEach((el) => {
    const lvlEl = document.getElementById(el.id);

    set_get_localStorageData().forEach((stu) => {
      if (stu.assignedCourseID === el.id) {
        lvlEl.appendChild(createCourseLvlCard(stu));
      }
    });
  });
}

renderInitAssignedCourseCards();

// render student bar chart
const stuBarChartEle = document.getElementById("studentLvlChart");
const courseLvlsChartLabels = courseLevelsData.map((el) => el.title);
const totalCountingLvl = Object.values(totalStudentLvlCountingData) || [];

function renderBarChart(element, title, dataLabel, labels = [], data = []) {
  new Chart(element, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: dataLabel,
          data,
          backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc"],
          borderColor: ["#2e59d9", "#17a673", "#2c9faf"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, position: "top" },
        title: { display: true, text: title },
      },
      scales: {
        y: { beginAtZero: true, stepSize: 1 },
      },
    },
  });
}

renderBarChart(
  stuBarChartEle,
  "Students per Course Level",
  "Number of Students",
  courseLvlsChartLabels,
  totalCountingLvl
);
