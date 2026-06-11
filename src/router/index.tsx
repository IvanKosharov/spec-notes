import { createBrowserRouter } from 'react-router-dom'
import SignUpPage from '../pages/SignUpPage'
import SignInPage from '../pages/SignInPage'
import NotesPage from '../pages/NotesPage'

export const router = createBrowserRouter([
  { path: '/', element: <SignUpPage /> },
  { path: '/signin', element: <SignInPage /> },
  { path: '/notes', element: <NotesPage /> },
])
