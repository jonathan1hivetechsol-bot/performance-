
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Home, Users, BarChart, Menu, X, Activity, PieChart, Building2, CheckSquare } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, userRole, logout, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home, show: true },
    { 
      path: userRole === 'Manager' ? '/manager-dashboard' : '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      show: isAuthenticated 
    },
    { path: '/my-performance', label: 'My Performance', icon: Activity, show: isAuthenticated && userRole === 'Employee' },
    { path: '/kpi-dashboard', label: 'KPI Dashboard', icon: PieChart, show: isAuthenticated && userRole === 'Manager' },
    { path: '/all-employees', label: 'Directory', icon: Users, show: isAuthenticated },
    { path: '/reports', label: 'Reports', icon: BarChart, show: isAuthenticated && userRole === 'Manager' },
    { path: '/employees', label: 'Add Employees', icon: Users, show: isAuthenticated && userRole === 'Manager' },
    { path: '/departments', label: 'Departments', icon: Building2, show: isAuthenticated && userRole === 'Manager' },
    { path: '/tasks', label: 'Assign Tasks', icon: CheckSquare, show: isAuthenticated && userRole === 'Manager' },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://horizons-cdn.hostinger.com/945a9ac3-86d1-4391-91a3-db16b6b4c9d0/a85c19b66da0797edd274fe698bfc0b0.png" 
              alt="Future Designz Logo" 
              className="h-8 w-auto object-contain"
            />
            <span className="text-xl font-bold text-foreground hidden sm:block">Performance Portal</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.filter(link => link.show).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}

            {isAuthenticated && currentUser ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-border">
                <Link to={`/employee/${currentUser.id}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {currentUser.name || 'Profile'}
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="pl-4 border-l border-border">
                <Link to="/login">
                  <Button size="sm" className="transition-all duration-200">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border absolute w-full">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.filter(link => link.show).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            ))}
            
            {isAuthenticated && currentUser ? (
              <div className="pt-4 mt-4 border-t border-border">
                <div className="px-3 py-2 text-base font-medium text-foreground">
                  Signed in as <Link to={`/employee/${currentUser.id}`} onClick={() => setIsMobileMenuOpen(false)} className="text-primary">{currentUser.name || 'User'}</Link>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full mt-2 justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="pt-4 mt-4 border-t border-border">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
