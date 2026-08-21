import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import App from './App.tsx'
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'
import ClientDashboard from './pages/ClientDashboard.tsx'
import CoursePage from './pages/CoursePage.tsx'
import CollaboratorSurvey from './pages/CollaboratorSurvey.tsx'
import Sinapse360PortalPage from './pages/Sinapse360PortalPage.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<App />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/sinapse-360" element={<Sinapse360PortalPage />} />
          <Route path="/empresas-educacao" element={<Sinapse360PortalPage />} />
          <Route path="/pesquisa/:campaignId" element={<CollaboratorSurvey />} />

          {/* Protected - Admin */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Protected - Client */}
          <Route path="/cliente" element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          } />

          <Route path="/curso/:id" element={
            <ProtectedRoute>
              <CoursePage />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
