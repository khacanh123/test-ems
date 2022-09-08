import NotFound from 'components/NotFound';
import DashboardContainer from 'pages/Dashboard';
import DetailCourse from 'pages/ManageCourse/DetailCourse';
import PreviewCourseHM from 'pages/ManageCourse/PreviewCourseHM';
import { lazy } from 'react';
import { RouteType } from 'types';
import TestLayout from 'layout/Test/index';
const TestDetailContainer = lazy(() => import('pages/Test/TestDetail'));
const ExamDetailContainer = lazy(() => import('pages/Test/Exam'));
const ExamDetailV2Container = lazy(() => import('pages/Test/Exam/DisplayOneQuestion'));
const ResultContainer = lazy(() => import('pages/Test/Result'));
const TestResultContainer = lazy(() => import('pages/Test/ResutlTest'));
const HistoryContainer = lazy(() => import('pages/History'));
const ManageAccountContainer = lazy(() => import('pages/ManageAccount/ManageAccount'));
const ManageTask = lazy(() => import('pages/ManageAccount/ManageTask'));
const ManageCourseContainer = lazy(() => import('pages/ManageCourse'));
const ManageQuestionClassContainer = lazy(() => import('pages/ManageQuestion/Class'));
const ManageQuestionGradeContainer = lazy(() => import('pages/ManageQuestion/Grade'));
const ManageQuestionKnowledgeUnitContainer = lazy(
  () => import('pages/ManageQuestion/KnowledgeUnit')
);
const ManageQuestionContainer = lazy(() => import('pages/ManageQuestion/Question'));
const CreateQuestionContainer = lazy(() => import('pages/ManageQuestion/Question/CreateQuestion'));
const ManageQuestionSubjectContainer = lazy(() => import('pages/ManageQuestion/Subject'));
const ManageQuestionTagContainer = lazy(() => import('pages/ManageQuestion/Tag'));
const ManageTopicContainer = lazy(() => import('pages/ManageTest'));
const CreateTestContainer = lazy(() => import('pages/ManageTest/CreateTest'));
const ReportTestContainer = lazy(() => import('pages/ReportTest'));
const CourseContainer = lazy(() => import('pages/ReportTest/Course'));
const DetailCourseStudent = lazy(() => import('pages/ReportTest/DetailCourseStudent'));
const ImportQuestionContainer = lazy(() => import('pages/ManageQuestion/Question/ImportQuestion'));
const AddTest = lazy(() => import('pages/ManageCourse/AddTest'));
const HSAContainer = lazy(() => import('pages/HSA'));
const ManageQuestionTagTestContainer = lazy(() => import('pages/ManageTest/TagsTest'));
const ManageAddTest = lazy(() => import('pages/ManageCourse/AddTest/AddSimple'));
const ManageAddHSA = lazy(() => import('pages/ManageCourse/AddTest/HSA'));
export const PrivateRouter: RouteType[] = [
  {
    path: '/',
    element: DashboardContainer,
  },
  {
    path: 'dashboard',
    element: DashboardContainer,
  },
  {
    path: 'report-test',
    element: ReportTestContainer,
  },
  {
    path: 'report-test/:idCourse',
    element: CourseContainer,
  },
  {
    path: 'report-test/:idCourse/:id',
    element: DetailCourseStudent,
  },

  {
    path: 'history',
    element: HistoryContainer,
  },
  {
    path: 'manage-account/account',
    element: ManageAccountContainer,
  },
  {
    path: 'manage-account/task',
    element: ManageTask,
  },
  {
    path: 'manage-question/class',
    element: ManageQuestionClassContainer,
  },
  {
    path: 'manage-question/grade',
    element: ManageQuestionGradeContainer,
  },
  {
    path: 'manage-question/tag',
    element: ManageQuestionTagContainer,
  },
  {
    path: 'manage-question/knowlege-unit',
    element: ManageQuestionKnowledgeUnitContainer,
  },
  {
    path: 'manage-question/question',
    element: ManageQuestionContainer,
  },
  {
    path: 'manage-question/question/create',
    element: CreateQuestionContainer,
  },
  {
    path: 'manage-question/question/create/import',
    element: ImportQuestionContainer,
  },
  {
    path: 'manage-question/subject',
    element: ManageQuestionSubjectContainer,
  },
  {
    path: 'manage-topic',
    element: ManageTopicContainer,
  },
  {
    path: 'manage-topic/create',
    element: CreateTestContainer,
  },
  {
    path: '/manage-course',
    element: ManageCourseContainer,
  },
  {
    path: '/de-thi/:slug/:idTest',
    element: TestDetailContainer,
    layout: TestLayout,
  },
  {
    path: '/dap-an/:slug/:idTest',
    element: ResultContainer,
    layout: TestLayout,
  },
  {
    path: '/ket-qua/:slug/:idTest',
    element: TestResultContainer,
    layout: TestLayout,
  },
  {
    path: '/bai-thi/:slug/:idTest',
    element: ExamDetailContainer,
    layout: TestLayout,
  },
  {
    path: '/bai-thi-v2/:slug/:idTest',
    element: ExamDetailV2Container,
    layout: TestLayout,
  },
  {
    path: '/manage-course/:idCourse',
    element: DetailCourse,
  },
  {
    path: '/manage-courseHM/:idCourse',
    element: PreviewCourseHM,
  },
  {
    path: '/manage-course/add-test',
    element: ManageAddTest,
  },
  {
    path: '/manage-course/add-test/:id',
    element: ManageAddTest,
  },
  {
    path: '/manage-course/add-HSA',
    element: ManageAddHSA,
  },
  {
    path: '/manage-course/add-HSA/:id',
    element: ManageAddHSA,
  },
  {
    path: '/manage-course/:idCourse/:type/:id',
    element: AddTest,
  },
  {
    path: '/manage-course/:idCourse/:type/:id/:idBaikiemtra',
    element: AddTest,
  },
  {
    path: 'manage-hsa',
    element: HSAContainer,
  },
  {
    path: 'manage-tag-test',
    element: ManageQuestionTagTestContainer,
  },
  {
    path: '*',
    element: NotFound,
  },
];
