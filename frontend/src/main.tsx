import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes/route.index.tsx'
import './styles/index.css'
import { ThemeProvider } from "@material-tailwind/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        newestOnTop
        pauseOnFocusLoss={false}
        toastClassName="app-toast"
        style={{ zIndex: 30000 }}
      />
    </ThemeProvider>
  </StrictMode>,
)