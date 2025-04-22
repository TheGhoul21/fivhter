import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import AuthPage from './pages/Auth';
import ProfilePage from './pages/Profile';
import CreateListPage from './pages/CreateList';
import ListDetailPage from './pages/ListDetail';
import DiscoverPage from './pages/Discover';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/create" element={<CreateListPage />} />
              <Route path="/list/:id" element={<ListDetailPage />} />
              <Route path="/lists" element={<DiscoverPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
