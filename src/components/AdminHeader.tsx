import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AngularButton from './AngularButton';

const AdminHeader: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  
  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-xl font-bold">Simon Maree Admin</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center space-x-1 hover:text-red-400 transition-colors ${location.pathname === '/admin/dashboard' ? 'text-red-400' : ''}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/admin/questions" 
            className={`flex items-center space-x-1 hover:text-red-400 transition-colors ${location.pathname === '/admin/questions' ? 'text-red-400' : ''}`}
          >
            <MessageSquare size={20} />
            <span>Questions</span>
          </Link>
          
          <AngularButton
            variant="danger"
            onClick={logout}
            className="ml-4"
          >
            <span className="flex items-center">
              <LogOut size={16} className="mr-2" />
              Logout
            </span>
          </AngularButton>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;