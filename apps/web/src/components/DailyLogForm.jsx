
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const DailyLogForm = ({ onSuccess }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    task_name: '',
    hours_spent: '',
    status: '',
    department: currentUser?.department || '',
    work_detail: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      
      await pb.collection('daily_logs').create({
        employee_id: currentUser.id,
        task_name: formData.task_name,
        hours_spent: parseFloat(formData.hours_spent),
        status: formData.status,
        department: formData.department,
        work_detail: formData.work_detail,
        date_submitted: today,
        manager_id: currentUser.manager_id || ''
      }, { $autoCancel: false });

      toast.success('Daily log submitted successfully');
      
      setFormData({
        task_name: '',
        hours_spent: '',
        status: '',
        department: currentUser?.department || '',
        work_detail: ''
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit daily log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit daily log</CardTitle>
        <CardDescription>Record your work activities for today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task_name">Task name</Label>
              <Input
                id="task_name"
                value={formData.task_name}
                onChange={(e) => handleChange('task_name', e.target.value)}
                placeholder="Enter task name"
                required
                className="text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours_spent">Hours spent</Label>
              <Input
                id="hours_spent"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={formData.hours_spent}
                onChange={(e) => handleChange('hours_spent', e.target.value)}
                placeholder="0.0"
                required
                className="text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)} required>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                placeholder="Enter department"
                required
                className="text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="work_detail">Work detail</Label>
            <Textarea
              id="work_detail"
              value={formData.work_detail}
              onChange={(e) => handleChange('work_detail', e.target.value)}
              placeholder="Describe the work performed"
              rows={4}
              required
              className="text-foreground resize-none"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full transition-all duration-200 active:scale-[0.98]">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit log'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DailyLogForm;
