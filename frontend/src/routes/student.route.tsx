import type { RouteObject } from 'react-router-dom';
import { StudentLayout } from '../layouts/student/student.layout';
import { Dashboard } from '../pages/student/Dashboard';
import { Schedule } from '../pages/student/Schedule';
import { Courses } from '../pages/student/Courses';
import { Grades } from '../pages/student/Grades';
import { Profile } from '../pages/student/Profile';
import ScanQR from '../pages/student/ScanQR';
import { RoleBasedRedirect } from '../components/common/RoleBasedRedirect';
import CourseDetail from '../pages/client/courseDetail';

const StudentRoutes: RouteObject = {
  element: <StudentLayout />,
  path: 'student',
  children: [
    {
      element: <><RoleBasedRedirect allowedRole="STUDENT" redirectTo="/" /><Dashboard /></>,
      index: true,
    },
    {
      path: 'dashboard',
      element: <><RoleBasedRedirect allowedRole="STUDENT" redirectTo="/" /><Dashboard /></>,
    },
    {
      path: 'schedule',
      element: <><RoleBasedRedirect allowedRole="STUDENT" redirectTo="/" /><Schedule /></>,
    },
    {
      path: 'courses',
      element: <><RoleBasedRedirect allowedRole="STUDENT" redirectTo="/" /><Courses /></>,
    },
    {
      path: 'courses/:id',
      element: <><RoleBasedRedirect allowedRole="STUDENT" redirectTo="/" /><CourseDetail /></>,
    },
    {
      path: 'grades',
      element: <><RoleBasedRedirect allowedRole="STUDENT" redirectTo="/" /><Grades /></>,
    },
    {
      path: 'profile',
      element: <><RoleBasedRedirect allowedRole="STUDENT" redirectTo="/" /><Profile /></>,
    },
    {
      path: 'scan-qr',
      element: <><RoleBasedRedirect allowedRole="STUDENT" redirectTo="/" /><ScanQR /></>,
    },
  ],
};

export default StudentRoutes;