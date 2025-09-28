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

export const renderNoDataFound = (title) => {
  return `<h6>${title}</h6>`;
};
