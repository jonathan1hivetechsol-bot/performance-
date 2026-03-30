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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2, Plus, Trash2, CheckCircle, Clock, AlertCircle as PriorityIcon } from 'lucide-react';

const TaskAssignmentPage = () => {
  const { currentUser, userRole } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, assigned, completed, pending

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'Medium',
    due_date: '',
    status: 'Pending'
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
              <p className="text-muted-foreground">Only managers can assign tasks.</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('tasks').getList(1, 500, {
        filter: `manager_id="${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setTasks(records.items);
      setError(null);
    } catch (err) {
      console.warn('Tasks collection might not exist:', handlePocketBaseError(err));
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const records = await pb.collection('users').getList(1, 500, {
        filter: `manager_id="${currentUser.id}" && role="Employee"`,
        sort: 'name',
        $autoCancel: false
      });
      setEmployees(records.items);
    } catch (err) {
      console.warn('Failed to fetch employees:', handlePocketBaseError(err));
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.assigned_to) {
        alert('Please fill in title and assign to employee');
        return;
      }

      const newTask = await pb.collection('tasks').create({
        title: formData.title,
        description: formData.description,
        assigned_to: formData.assigned_to,
        manager_id: currentUser.id,
        priority: formData.priority,
        due_date: formData.due_date,
        status: formData.status,
        created_at: new Date().toISOString()
      });

      setTasks([newTask, ...tasks]);
      setFormData({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'Medium',
        due_date: '',
        status: 'Pending'
      });
      setIsAddDialogOpen(false);
      alert('Task assigned successfully!');
    } catch (err) {
      console.error('Failed to assign task:', err);
      alert('Error: ' + handlePocketBaseError(err));
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const updated = await pb.collection('tasks').update(taskId, {
        status: 'Completed',
        completed_at: new Date().toISOString()
      });

      setTasks(tasks.map(t => t.id === taskId ? updated : t));
      alert('Task marked as completed!');
    } catch (err) {
      alert('Error: ' + handlePocketBaseError(err));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await pb.collection('tasks').delete(taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
        alert('Task deleted successfully!');
      } catch (err) {
        alert('Error: ' + handlePocketBaseError(err));
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'In Progress':
        return <Clock className="w-4 h-4" />;
      case 'Pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const employee = (id) => employees.find(e => e.id === id);

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'assigned':
        return task.status === 'Pending' || task.status === 'In Progress';
      case 'completed':
        return task.status === 'Completed';
      case 'pending':
        return task.status === 'Pending';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Task Assignment - Performance Portal</title>
      </Helmet>
      <Header />
      
      <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold text-foreground">Task Assignment</h1>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Assign New Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign New Task</DialogTitle>
                    <DialogDescription>
                      Create and assign a task to your team member.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAssignTask} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Task Title *</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g., Prepare quarterly report"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Task details and requirements..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Assign To *</label>
                      <Select value={formData.assigned_to} onValueChange={(value) => setFormData({...formData, assigned_to: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Priority</label>
                        <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Due Date</label>
                        <Input
                          type="date"
                          value={formData.due_date}
                          onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex gap-2 justify-end pt-4">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">Assign Task</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-muted-foreground">Manage and track tasks assigned to your team</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Tasks ({tasks.length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
            >
              Pending ({tasks.filter(t => t.status === 'Pending').length})
            </Button>
            <Button
              variant={filter === 'assigned' ? 'default' : 'outline'}
              onClick={() => setFilter('assigned')}
            >
              In Progress ({tasks.filter(t => t.status === 'In Progress').length})
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
            >
              Completed ({tasks.filter(t => t.status === 'Completed').length})
            </Button>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">No tasks found</p>
                  <p className="text-sm text-muted-foreground">Assign your first task to get started</p>
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded font-medium flex items-center gap-1 ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          {task.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>
                          <span className="font-medium">Assigned to:</span> {employee(task.assigned_to)?.name || 'Unknown'}
                        </p>
                        {task.due_date && (
                          <p>
                            <span className="font-medium">Due:</span> {new Date(task.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {task.status !== 'Completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteTask(task.id)}
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

export default TaskAssignmentPage;
