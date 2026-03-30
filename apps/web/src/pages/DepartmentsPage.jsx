import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { handlePocketBaseError } from '@/lib/utils';
import Header from '@/components/Header.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { AlertCircle, Loader2, Plus, Trash2, Edit2, Users } from 'lucide-react';

const DepartmentsPage = () => {
  const { currentUser, userRole } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [customFields, setCustomFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    head: '',
    budget: '',
    custom_fields: {}
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
              <p className="text-muted-foreground">Only managers can manage departments.</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('departments').getFullList({
        sort: 'created',
        $autoCancel: false
      });
      setDepartments(records);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
      // Create collection if it doesn't exist
      setError('No departments found. Create your first department to get started!');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name) {
        alert('Please enter department name');
        return;
      }

      const newDept = await pb.collection('departments').create({
        name: formData.name,
        description: formData.description,
        head: formData.head,
        budget: formData.budget || 0,
        custom_fields: customFields.length > 0 ? customFields : {}
      });

      setDepartments([...departments, newDept]);
      setFormData({ name: '', description: '', head: '', budget: '', custom_fields: {} });
      setCustomFields([]);
      setIsAddDialogOpen(false);
      alert('Department added successfully!');
    } catch (err) {
      console.error('Failed to add department:', err);
      alert('Error: ' + handlePocketBaseError(err));
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await pb.collection('departments').delete(id);
        setDepartments(departments.filter(dept => dept.id !== id));
        alert('Department deleted successfully!');
      } catch (err) {
        alert('Error: ' + handlePocketBaseError(err));
      }
    }
  };

  const addCustomField = () => {
    if (newFieldName.trim()) {
      setCustomFields([...customFields, { name: newFieldName, value: '' }]);
      setNewFieldName('');
    }
  };

  const removeCustomField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateCustomField = (index, value) => {
    const updated = [...customFields];
    updated[index].value = value;
    setCustomFields(updated);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading departments...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Departments - Performance Portal</title>
      </Helmet>
      <Header />
      
      <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold text-foreground">Departments Management</h1>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Department
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Department</DialogTitle>
                    <DialogDescription>
                      Add a new department and customize it with extra fields.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAddDepartment} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Department Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g., Sales, Engineering, HR"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Department description..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Department Head</label>
                      <Input
                        value={formData.head}
                        onChange={(e) => setFormData({...formData, head: e.target.value})}
                        placeholder="Name of department head"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Budget</label>
                      <Input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>

                    {/* Custom Fields Section */}
                    <div className="border-t pt-4">
                      <label className="text-sm font-semibold mb-3 block">Custom Fields</label>
                      
                      <div className="space-y-2 mb-3">
                        {customFields.map((field, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={field.value}
                              onChange={(e) => updateCustomField(idx, e.target.value)}
                              placeholder={`Value for ${field.name}`}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeCustomField(idx)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          value={newFieldName}
                          onChange={(e) => setNewFieldName(e.target.value)}
                          placeholder="Field name (e.g., Team Size)"
                          className="text-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addCustomField}
                        >
                          Add Field
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end pt-4 border-t">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">Create Department</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-muted-foreground">Create and manage departments in your organization</p>
          </div>

          {error && (
            <Card className="mb-6 border-blue-500/50 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-600">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Departments Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.length === 0 ? (
              <Card className="md:col-span-2 lg:col-span-3">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">No departments created yet</p>
                  <p className="text-sm text-muted-foreground">Create your first department to organize your team</p>
                </CardContent>
              </Card>
            ) : (
              departments.map((dept) => (
                <Card key={dept.id} className="hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{dept.name}</CardTitle>
                        {dept.head && (
                          <CardDescription>Head: {dept.head}</CardDescription>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-primary">0</div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {dept.description && (
                      <p className="text-sm text-muted-foreground mb-3">{dept.description}</p>
                    )}
                    {dept.budget && (
                      <p className="text-sm mb-3">Budget: <span className="font-semibold">Rs. {parseInt(dept.budget).toLocaleString()}</span></p>
                    )}
                    
                    {/* Display Custom Fields */}
                    {dept.custom_fields && Object.keys(dept.custom_fields).length > 0 && (
                      <div className="bg-muted p-3 rounded mb-3 text-xs">
                        {Object.entries(dept.custom_fields).map(([key, value]) => (
                          <p key={key}><span className="font-medium">{key}:</span> {value}</p>
                        ))}
                      </div>
                    )}

                    {/* Employees Count */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Members: 0</span>
                    </div>
                  </CardContent>
                  <div className="border-t p-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => alert('Edit feature coming soon!')}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteDepartment(dept.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DepartmentsPage;
