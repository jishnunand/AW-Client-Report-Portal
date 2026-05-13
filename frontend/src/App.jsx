import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import '@/styles/index.css'
import Dashboard from './components/Dashboard'
import ClientList from './components/ClientList'
import ClientForm from './components/ClientForm'
import ClientDetail from './components/ClientDetail'
import AccountForm from './components/AccountForm'

function Navigation({ currentPage, onPageChange }) {
  const isActive = (page) => currentPage === page
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-blue-600">AW Portal</h1>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('dashboard')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onPageChange('clients')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('clients')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Clients
            </button>
            <button
              onClick={() => onPageChange('new-client')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('new-client')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              New Client
            </button>
            <button
              onClick={() => onPageChange('reports')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('reports')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reports
            </button>
            <button className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const navigate = useNavigate()

  const handlePageChange = (page) => {
    setCurrentPage(page)
    switch(page) {
      case 'dashboard':
        navigate('/')
        break
      case 'clients':
        navigate('/clients')
        break
      case 'new-client':
        navigate('/clients/new')
        break
      case 'reports':
        navigate('/reports')
        break
      default:
        navigate('/')
    }
  }

  return (
    <>
      <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {setCurrentPage('dashboard')}
                <Dashboard
                  onManageClients={() => handlePageChange('clients')}
                  onGenerateReport={() => handlePageChange('reports')}
                />
              </>
            }
          />
          <Route
            path="/clients"
            element={
              <>
                {setCurrentPage('clients')}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">Client Management</h1>
                  <ClientList />
                </div>
              </>
            }
          />
          <Route
            path="/clients/new"
            element={
              <>
                {setCurrentPage('new-client')}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Client</h1>
                  <ClientForm onSuccess={() => handlePageChange('clients')} />
                </div>
              </>
            }
          />
          <Route
            path="/clients/:clientId"
            element={<ClientDetail />}
          />
          <Route
            path="/clients/:clientId/edit"
            element={
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Client</h1>
                <ClientForm isEdit onSuccess={() => handlePageChange('clients')} />
              </div>
            }
          />
          <Route
            path="/clients/:clientId/accounts/new"
            element={
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Account</h1>
                <AccountForm />
              </div>
            }
          />
          <Route
            path="/reports"
            element={
              <>
                {setCurrentPage('reports')}
                <div className="bg-white rounded-lg shadow p-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
                  <p className="text-gray-600">Report generation coming soon...</p>
                </div>
              </>
            }
          />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
