# 🧪 Testing Guide - Manager Features

## Quick Test Cases

### ✅ Test Case 1: Add Employee
**Expected**: Employee appears in list
```
1. Login as manager@company.com
2. Go to "Add Employees"
3. Click "Add New Employee"
4. Enter:
   - Name: Test User
   - Email: test@company.com
   - Password: Test123!
   - Department: Sales
   - Role: Employee
5. Click "Add Employee"
6. Should see success message
7. Employee appears in list
✓ PASS
```

### ✅ Test Case 2: Search Employee
**Expected**: Filter by name/email
```
1. On /employees page
2. Type in search: "alice"
3. Should show only Alice Smith
4. Clear search
5. All employees show again
✓ PASS
```

### ✅ Test Case 3: Create Department with Custom Fields
**Expected**: Department saves with custom fields
```
1. Go to "Departments"
2. Click "New Department"
3. Name: "Engineering"
4. Head: "Martin"
5. Budget: "2000000"
6. Add Custom Field:
   - Field: "Tech Stack"
   - Value: "React, Node, PostgreSQL"
7. Add another:
   - Field: "Team Size"
   - Value: "20"
8. Click "Create Department"
9. Verify custom fields shown on card
✓ PASS
```

### ✅ Test Case 4: Assign High Priority Task
**Expected**: Task shows with red badge
```
1. Go to "Assign Tasks"
2. Click "Assign New Task"
3. Title: "Urgent: Fix Production Bug"
4. Assign to: "Hassan Ali"
5. Priority: "High"
6. Due: "2026-03-31"
7. Click "Assign Task"
8. Task appears with RED priority badge
✓ PASS
```

### ✅ Test Case 5: Complete Task
**Expected**: Mark task as completed
```
1. On /tasks page
2. Find a task with status "Pending"
3. Click "Complete" button
4. Checkbox shows completed
5. Task moves to "Completed" tab
✓ PASS
```

### ✅ Test Case 6: Filter Tasks
**Expected**: Show only selected status
```
1. On /tasks page
2. Click "Pending" button
3. Show only pending tasks
4. Click "In Progress"
5. Show only in progress tasks
6. Click "All Tasks"
7. Show everything
✓ PASS
```

### ✅ Test Case 7: Delete with Confirmation
**Expected**: Confirm dialog appears
```
1. On /employees page
2. Click Delete on an employee
3. Confirmation dialog appears
4. Click Cancel - nothing happens
5. Click Delete again
6. This time click Confirm
7. Employee removed from list
✓ PASS
```

### ✅ Test Case 8: Mobile Responsive
**Expected**: Works on mobile
```
1. Open in browser
2. Press F12 (DevTools)
3. Toggle device toolbar
4. Select iPhone 12
5. All menus work
6. Navigation collapses to hamburger
7. Forms are responsive
✓ PASS
```

### ✅ Test Case 9: Access Control
**Expected**: Employees cannot access
```
1. Login as alice.smith@company.com
2. Try to access /employees
3. Should see: "Access Denied - Only managers"
4. Try to access /departments
5. Same error message
6. Try to access /tasks
7. Same error message
✓ PASS
```

### ✅ Test Case 10: Form Validation
**Expected**: Required fields enforced
```
1. Go to "Add Employees"
2. Click "Add Employee" without filling
3. Should see: "Please fill in all required fields"
4. Fill only Name, click Add
5. Same error
6. Fill all required fields (Name, Email, Password)
7. Accepted and saved
✓ PASS
```

---

## 🔍 Edge Cases to Test

### Empty States
```
NEW USER (no employees yet):
- Go to /employees
- Should show: "No employees found"
- "Start by adding your first employee"

NEW DEPARTMENTS:
- Go to /departments
- Should show empty message
- Can click "New Department"

NO TASKS:
- Go to /tasks
- Should show empty message
```

### Duplicate Email
```
1. Add employee: test@company.com
2. Try to add same email again
3. Should show error: "Email already exists"
4. Or create process silently fails
```

### Special Characters
```
1. Add employee with name: "José García"
2. Should save correctly
3. Add department: "R&D / Innovation"
4. Should save correctly
5. Add task with emoji: "🔥 Critical Task"
6. May or may not save - test behavior
```

### Very Long Text
```
1. Add employee name: "Muhammad Abdullah Al-Mansouri Al-Rashidi"
2. Should fit or truncate gracefully
3. Long email: "very.long.email.address@subdomain.company.com"
4. Add long description in task
5. Should wrap properly
```

### Navigation Flow
```
1. Add Employee → Success → List updates
2. Add Department → Success → Grid shows card
3. Add Task → Success → Appears in list
4. Search → Filters live
5. Click links → Routes change
```

---

## 🎨 UI/UX Tests

### Visual Checks
```
✓ Buttons are clickable size
✓ Text is readable
✓ Colors are consistent
✓ Icons display correctly
✓ Spacing is balanced
✓ Dialogs center properly
✓ Forms are organized
✓ Lists are scrollable
✓ Mobile menu works
✓ No overlapping text
```

### Interactive Checks
```
✓ Click buttons - response immediate
✓ Type in search - live filter
✓ Select dropdowns - options show
✓ Date picker - calendar appears
✓ Close dialog - background blurs/unblurs
✓ Error message - appears/disappears
✓ Success message - auto-dismisses
✓ Hover effects - subtle and visible
```

---

## 🚨 Error Scenarios

### PocketBase Down
```
1. Stop PocketBase (Ctrl+C in Terminal 1)
2. Try to add employee
3. Should show: "Error: Failed to add employee"
4. Start PocketBase again
5. Try again - should work
```

### Network Error
```
1. Unplug internet / disable WiFi
2. Try to add employee
3. Should show timeout/network error
4. Reconnect
5. Should work again
```

### Missing Fields
```
1. Add employee with missing Password
2. Should show: "Please fill in all required fields"
3. Add department with missing Name
4. Should show error
5. Add task with missing Title
6. Should show error
```

---

## 📊 Performance Tests

### Load Times
```
/employees page:
- With 10 employees: < 1 second
- With 100 employees: < 2 seconds
- With 1000 employees: < 5 seconds

/departments page:
- With 5 departments: < 1 second
- With 50 departments: < 2 seconds

/tasks page:
- With 20 tasks: < 1 second
- With 200 tasks: < 2 seconds
```

### Search Performance
```
Search 100 employees:
- Type first letter: Instant
- Type full name: Instant
- Clear search: Instant

No lag or delay observed
```

---

## 🔐 Security Tests

### Access Control
```
As Employee (alice@company.com):
- ✓ Can access /dashboard
- ✓ Can access /all-employees
- ✓ Can access /my-performance
- ✗ Cannot access /employees (redirects)
- ✗ Cannot access /departments (redirects)
- ✗ Cannot access /tasks (redirects)

As Manager (manager@company.com):
- ✓ Can access all of above
- ✓ Can access /employees
- ✓ Can access /departments
- ✓ Can access /tasks
```

### Data Integrity
```
1. Add employee
2. Refresh page
3. Employee still there (persistence)
4. Delete employee
5. Refresh page
6. Employee gone (deletion persisted)
```

---

## 📱 Browser Compatibility

### Desktop Browsers
```
✓ Chrome (latest)
✓ Firefox (latest)
✓ Safari (latest)
✓ Edge (latest)
```

### Mobile Browsers
```
✓ Chrome Mobile
✓ Safari Mobile
✓ Firefox Mobile
✓ Samsung Internet
```

### Features to Check Per Browser
```
✓ Dialogs open/close
✓ Forms submit
✓ Search filters
✓ Buttons responsive
✓ Layout responsive
✓ Dropdowns work
✓ Date picker functions
✓ Tooltips appear
```

---

## ♿ Accessibility Tests

### Keyboard Navigation
```
✓ Tab through fields
✓ Enter to submit forms
✓ Space to click buttons
✓ Escape to close dialogs
✓ Arrow keys in dropdowns
```

### Screen Reader (Voiceover/NVDA)
```
✓ Form labels read correctly
✓ Button purposes clear
✓ Error messages announced
✓ Success messages announced
✓ Table data accessible
```

### Color Contrast
```
✓ Text readable on background
✓ Red badges visible
✓ Yellow badges visible
✓ Green badges visible
✓ Links understandable
```

---

## 📋 Complete Test Checklist

Core Features:
- [ ] Add employee
- [ ] Delete employee
- [ ] Search employee
- [ ] Create department
- [ ] Delete department
- [ ] Add custom fields to department
- [ ] Assign task
- [ ] Complete task
- [ ] Delete task
- [ ] Filter tasks by status

UI/UX:
- [ ] All buttons clickable
- [ ] All fields editable
- [ ] All dialogs working
- [ ] Mobile responsive
- [ ] Colors correct
- [ ] Spacing consistent
- [ ] Icons display
- [ ] Text readable

Navigation:
- [ ] Header links work
- [ ] Back buttons work
- [ ] Route changes smooth
- [ ] Mobile menu works
- [ ] Desktop menu works

Error Handling:
- [ ] Missing fields show error
- [ ] Duplicate emails handled
- [ ] Delete confirms first
- [ ] Network errors handled
- [ ] Success messages show

Security:
- [ ] Managers can access all
- [ ] Employees blocked from mgmt
- [ ] Data persists after refresh
- [ ] Delete actually removes
- [ ] Passwords hashed

---

## 🎯 Acceptance Criteria

### Feature Complete When:
```
✓ All 3 systems functional
✓ All CRUD operations working
✓ No console errors
✓ No broken navigation
✓ Mobile responsive
✓ Forms validate
✓ Data persists
✓ Access control enforced
✓ UI polished
✓ User feedback clear
```

### Ready to Deploy When:
```
✓ All tests passing
✓ No critical bugs
✓ No security issues
✓ Performance acceptable
✓ Documentation complete
✓ Users trained
✓ Backup plan ready
✓ Monitoring active
```

---

## 📊 Test Results Template

```
Date: 2026-03-30
Tester: [Your Name]
Environment: Local Dev
Browser: Chrome 120

TEST RESULTS:
✓ Add Employee: PASS
✓ Search Employee: PASS
✓ Create Department: PASS
✓ Custom Fields: PASS
✓ Assign Task: PASS
✓ Filter Tasks: PASS
✓ Mobile View: PASS
✓ Access Control: PASS

ISSUES FOUND:
- [List any bugs here]

NOTES:
- [Any observations]

OVERALL: PASS ✓
```

---

**Testing Status**: Ready for comprehensive testing
**Suggested Timeline**: 1-2 hours for full QA
**Go/No-Go Decision**: Ready to deploy after testing passes
