import type { RouteObject } from 'react-router-dom';
import AdminLayout from '../layouts/admin/admin.layout';

// Teacher components
import TeacherManagement from '../components/admin/teacher/management/teacher';
import TeacherCreate from '../components/admin/teacher/create/teacher.create';
import TeacherUpdate from '../components/admin/teacher/update/teacher.update';

// Student components
import StudentManagement from '../components/admin/student/management/student';
import StudentCreate from '../components/admin/student/create/student.create';
import StudentUpdate from '../components/admin/student/update/student.update';

// Parent components
import ParentManagement from '../components/admin/parent/management/parent';
import ParentCreate from '../components/admin/parent/create/parent.create';
import ParentUpdate from '../components/admin/parent/update/parent.update';

const AdminRoutes: RouteObject = {
  path: 'admin',
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <div>Admin Dashboard</div>
    },
    // Teacher routes
    {
      path: 'teachers',
      element: <TeacherManagement />
    },
    {
      path: 'teachers/create',
      element: <TeacherCreate />
    },
    {
      path: 'teachers/update/:id',
      element: <TeacherUpdate />
    },
    // Student routes
    {
      path: 'students',
      element: <StudentManagement />
    },
    {
      path: 'students/create',
      element: <StudentCreate />
    },
    {
      path: 'students/update/:id',
      element: <StudentUpdate />
    },
    // Parent routes
    {
      path: 'parents',
      element: <ParentManagement />
    },
    {
      path: 'parents/create',
      element: <ParentCreate />
    },
    {
      path: 'parents/update/:id',
      element: <ParentUpdate />
    },
  ],
};

export default AdminRoutes;

