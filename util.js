import { courseTypesData } from "./data.js";

//insert and fetch localStorage Data
export function set_get_localStorageData(
  insertData,
  key = "unAssignStudentsData"
) {
  if (insertData) {
    localStorage.setItem(key, JSON.stringify(insertData));
  }

  const fetchedData = JSON.parse(localStorage.getItem(key)) || [];

  return fetchedData;
}

export function assignedCoursesCounting(studentData = []) {
  const initValues = { beginner: 0, intermediate: 0, advanced: 0 };

  const totalStudentLvlCountingData = studentData.reduce((acc, curr) => {
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

  return totalStudentLvlCountingData;
}

export function getNoOfCourses() {
  let coursesNamesObj = {};

  courseTypesData.forEach((course) => {
    coursesNamesObj = { ...coursesNamesObj, [course.id]: 0 };
  });

  set_get_localStorageData()?.forEach((stu) => {
    stu.courses.forEach((cou) => {
      coursesNamesObj[cou] += 1;
    });
  });

  return coursesNamesObj;
}

// Create the chart's using this.
export function initRenderBarChart(
  element,
  title,
  dataLabel,
  labels = [],
  data = [],
  chartInstance,
  type = "bar"
) {
  if (chartInstance) {
    chartInstance.destroy();
  }
  const chartContext = element.getContext("2d");

  chartInstance = new Chart(chartContext, {
    type,
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

  return chartInstance;
}

//Render multiple checkBoxes by providing the array to this function
const checkBoxesParentEl = document.getElementById("courseCheckBoxes");
export const renderMultipleChecks = () => {
  courseTypesData.forEach((el) => {
    const checkContainer = document.createElement("div");
    checkContainer.className = "form-check col-md-2";

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

export const renderNoDataFound = (title) => {
  return `<h6>${title}</h6>`;
};

export const renderToaster = (
  title,
  position = "right",
  toastType = "success"
) => {
  const toastify = Toastify({
    text: title,
    duration: 3000,
    gravity: "top",
    position,
    backgroundColor:
      toastType === "success"
        ? "linear-gradient(to right, #00b09b, #96c93d)"
        : "linear-gradient(to right, #ff5f6d, #ffc371)",
    close: true,
  }).showToast();

  return toastify;
};
