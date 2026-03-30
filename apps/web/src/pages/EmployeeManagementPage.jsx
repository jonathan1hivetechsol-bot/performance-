import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { handlePocketBaseError } from '@/lib/utils';
import Header from '@/components/Header.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { AlertCircle, Loader2, Plus, Trash2, Edit2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmployeeManagementPage = () => {
  const { currentUser, userRole } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    department: '',
    role: 'Employee',
  });

  // Check if user is Manager
  if (userRole !== 'Manager') {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
          <Card className="max-w-md w-full border-destructive/50">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">Only managers can access employee management.</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('users').getList(1, 500, {
        filter: `manager_id="${currentUser.id}" || role="Manager"`,
        sort: 'created',
        $autoCancel: false
      });
      setEmployees(records.items);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setError(handlePocketBaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const records = await pb.collection('departments').getFullList({ $autoCancel: false });
      setDepartments(records);
    } catch (err) {
      console.warn('Failed to fetch departments:', handlePocketBaseError(err));
      // Department collection might not exist yet
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      if (!formData.email || !formData.name || !formData.password) {
        alert('Please fill in all required fields');
        return;
      }

      const newEmployee = await pb.collection('users').create({
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.password,
        name: formData.name,
        department: formData.department,
        role: formData.role,
        manager_id: currentUser.id,
      });

      setEmployees([...employees, newEmployee]);
      setFormData({ email: '', name: '', password: '', department: '', role: 'Employee' });
      setIsAddDialogOpen(false);
      alert('Employee added successfully!');
    } catch (err) {
      console.error('Failed to add employee:', err);
      alert('Error: ' + handlePocketBaseError(err));
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await pb.collection('users').delete(id);
        setEmployees(employees.filter(emp => emp.id !== id));
        alert('Employee deleted successfully!');
      } catch (err) {
        alert('Error: ' + handlePocketBaseError(err));
      }
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading employees...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Employee Management - Performance Portal</title>
      </Helmet>
      <Header />
      
      <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold text-foreground">Employee Management</h1>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Employee
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new employee to your team.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAddEmployee} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Full Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter full name"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="employee@company.com"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Password *</label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Enter password"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Department</label>
                      <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Employee">Employee</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex gap-2 justify-end pt-4">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">Add Employee</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-muted-foreground">Manage your team members and their details</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <Input
              placeholder="Search employees by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {error && (
            <Card className="mb-6 border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Employees List */}
          <div className="grid gap-4">
            {filteredEmployees.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">No employees found</p>
                  <p className="text-sm text-muted-foreground">Start by adding your first employee</p>
                </CardContent>
              </Card>
            ) : (
              filteredEmployees.map((employee) => (
                <Card key={employee.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                        <div className="flex gap-4 mt-3">
                          {employee.department && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {departments.find(d => d.id === employee.department)?.name || employee.department}
                            </span>
                          )}
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {employee.role}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert('Edit feature coming soon!')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeManagementPage;
