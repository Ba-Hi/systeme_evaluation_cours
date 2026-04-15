import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { LandingPage } from "./components/LandingPage";
import { StudentLogin } from "./components/student/StudentLogin";
import { StudentDashboard } from "./components/student/StudentDashboard";
import { StudentForm } from "./components/student/StudentForm";
import { TeacherLogin } from "./components/teacher/TeacherLogin";
import { TeacherDashboard } from "./components/teacher/TeacherDashboard";
import { FormEditor } from "./components/teacher/FormEditor";
import { FormResponses } from "./components/teacher/FormResponses";
import { FormAnalytics } from "./components/teacher/FormAnalytics";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "student/login", Component: StudentLogin },
      { path: "student/dashboard", Component: StudentDashboard },
      { path: "student/form/:formId", Component: StudentForm },
      { path: "teacher/login", Component: TeacherLogin },
      { path: "teacher/dashboard", Component: TeacherDashboard },
      { path: "teacher/form/new", Component: FormEditor },
      { path: "teacher/form/:formId/edit", Component: FormEditor },
      { path: "teacher/form/:formId/responses", Component: FormResponses },
      { path: "teacher/form/:formId/analytics", Component: FormAnalytics },
    ],
  },
]);
