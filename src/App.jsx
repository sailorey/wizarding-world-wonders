import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import Profile from './components/Profile';
import Home from './components/Home';
import IssueList from './components/IssueList';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserProvider';
import { IssueProvider } from './context/IssueProvider';
import { CommentProvider } from './context/CommentProvider';
import './css/App.css';

const App = () => {
  return (
    <Router>
      <UserProvider>
        <IssueProvider>
          <CommentProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<AuthForm isLogin={true} />} />
              <Route path="/signup" element={<AuthForm isLogin={false} />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/issues" element={
                <ProtectedRoute>
                  <IssueList />
                </ProtectedRoute>
              } />
            </Routes>
          </CommentProvider>
        </IssueProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
