import { courseLevelsData } from "./data.js";
import {
  assignedCoursesCounting,
  getNoOfCourses,
  initRenderBarChart,
  renderMultipleChecks,
  renderNoDataFound,
  set_get_localStorageData,
  renderToaster,
} from "./util.js";

const stuBarChartEle = document.getElementById("studentLvlChart");
const studentCoursesChartEle = document.getElementById("studentCoursesChart");

const courseLvlsChartLabels = courseLevelsData.map((el) => el.title);

let stuLvlChartIns = null;
let courselvlsChartIns = null;

renderMultipleChecks();

const deleteStudents = (studentName, uid) => {
  const allStudentsData = set_get_localStorageData();

  const confirmPopup = confirm(
    `Are you sure to delete ${studentName} student?`
  );

  if (confirmPopup) {
    const filteredStu = allStudentsData.filter((stu) => stu.uid !== +uid);
    renderUnAssignStudentList(filteredStu);
    set_get_localStorageData(filteredStu, "unAssignStudentsData");

    renderAllCharts();
    const deletedEle = document.getElementById(uid);
    if (deletedEle) {
      deletedEle.remove();
    }
    renderToaster(`Successfully deleted ${studentName}!`);
  }
};

//render list of unassigned students
const unAssignStudentListEle = document.getElementById("unAssignStudentList");

function renderUnAssignStudentList(unStudent = []) {
  unAssignStudentListEle.innerHTML = "";

  const studentUnAssigndata = unStudent.filter((st) => !st.assignedCourseID);

  if (!studentUnAssigndata.length) {
    unAssignStudentListEle.innerHTML = renderNoDataFound("No Data Found!");
  }

  const ulEle = document.createElement("ul");

  studentUnAssigndata.forEach((el) => {
    ulEle.classList.add("row");
    const li = document.createElement("li");
    const liCardEle = document.createElement("div");
    liCardEle.classList.add("card");
    li.classList.add(
      "cursor-grab",
      "mb-2",
      "p-3",
      "text-capitalize",
      "col-lg-3",
      "gap-3"
    );

    li.innerHTML = `
  <div class="p-1 card h-100">
  <div class="card-body d-flex justify-content-between">
    <div>
    <h6 class="card-title mb-1">${el.studentName}</h6>
    <p class="card-text mb-0"><small>ID: ${el.uid}</small></p>
    <p class="card-text"><small>Courses: ${
      el.courses.length ? el.courses.join(", ") : "None"
    }</small></p>
    </div>
    <i class="bi bi-trash text-danger delete-btn" role="button" id=${
      el.uid
    } title=${el.studentName}></i>
    </div>
  </div>
`;
    li.setAttribute("draggable", true);
    li.setAttribute("id", el.uid);
    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", li.id);
    });

    ulEle.appendChild(li);

    li.querySelector(".delete-btn").addEventListener("click", (e) => {
      deleteStudents(e.target.title, e.target.id);
    });
  });
  unAssignStudentListEle.appendChild(ulEle);
}

//form submit
let studentFormData = set_get_localStorageData() || [];

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
  let isCourseSelected = false;

  inputValues.forEach((el) => {
    if (el.type === "checkbox" && el.checked) {
      isCourseSelected = true;
      courses.push(el.id);
    } else if (el.id === "studentName") {
      studentFormValues[el.id] = el.value;
    }
  });

  if (!studentFormValues.studentName) {
    return renderToaster("Please enter student name!", "", "error");
  } else if (!/^[A-Za-z ]+$/.test(studentFormValues.studentName)) {
    return renderToaster("Please enter a valid name!", "", "error");
  } else if (!isCourseSelected) {
    return renderToaster("Please select atleast one course!", "", "error");
  }

  uid += 1;

  const finalSubmitData = { uid, courses, ...studentFormValues };

  studentFormData.push(finalSubmitData);

  renderUnAssignStudentList(studentFormData);
  set_get_localStorageData(studentFormData, "unAssignStudentsData");

  renderToaster("Student added successfully!");

  courselvlsChartIns = initRenderBarChart(
    studentCoursesChartEle,
    "Student Courses Counting",
    "Number of Courses",
    Object.keys(getNoOfCourses()),
    Object.values(getNoOfCourses()),
    courselvlsChartIns
  );

  inputValues.forEach((el) => {
    if (el.type === "checkbox") {
      el.checked = false;
    } else {
      el.value = "";
    }
  });
  courses = [];
});

// Course Levels drag and drop
const courseLvlSecEle = document.getElementById("courseLvlSection");

courseLevelsData.forEach((lvl) => {
  const courseLvlMainEle = document.createElement("div");
  courseLvlMainEle.classList.add("col-md-4");

  courseLvlMainEle.innerHTML = `
  <div class="card p-3 mb-2 h-100" id="${lvl.id}" style="min-height: 150px;">
    <h4>${lvl.title}</h4>
  </div>
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
              <div class = 'd-flex justify-content-between'>
              <div>
              <h6 class="card-title">Name: ${cardData.studentName}</h6>
              <p class="card-text">ID: ${cardData.uid}</p>
              <p class="card-text">Courses: ${
                cardData.courses.length ? cardData.courses.join(", ") : "None"
              }</p>
              </div>
               <i class="bi bi-trash text-danger delete-btn" role="button" id=${
                 cardData.uid
               } title=${cardData.studentName}></i>
              </div>
            </div>`;

  courseLvlCardEle.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", cardData.uid);
  });

  courseLvlCardEle
    .querySelector(".delete-btn")
    .addEventListener("click", (e) => {
      deleteStudents(e.target.title, e.target.id);
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

    const fetchedData = set_get_localStorageData(studentFormData);

    renderUnAssignStudentList(fetchedData);

    const totalCountingLvl = Object.values(
      assignedCoursesCounting(fetchedData)
    );

    stuLvlChartIns = initRenderBarChart(
      stuBarChartEle,
      "Students per Course Level",
      "Number of Students",
      courseLvlsChartLabels,
      totalCountingLvl,
      stuLvlChartIns
    );
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

const totalCountingLvl = Object.values(
  assignedCoursesCounting(set_get_localStorageData())
);

function renderAllCharts() {
  stuLvlChartIns = initRenderBarChart(
    stuBarChartEle,
    "Student Count by Course Level",
    "Number of Students",
    courseLvlsChartLabels,
    totalCountingLvl,
    stuLvlChartIns
  );

  courselvlsChartIns = initRenderBarChart(
    studentCoursesChartEle,
    "Course Enrollment Overview",
    "Number of Enrollments",
    Object.keys(getNoOfCourses()),
    Object.values(getNoOfCourses()),
    courselvlsChartIns
  );
}

renderAllCharts();
