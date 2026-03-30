
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const KPIExportButton = ({ kpiData, departmentData, filename = "KPI_Report" }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!departmentData || departmentData.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    setIsExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text(`${filename}`, 14, 20);
      
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      if (kpiData && kpiData.today) {
        doc.setFontSize(14);
        doc.text('Overall KPIs (Today)', 14, 45);
        doc.setFontSize(10);
        doc.text(`Total Tasks: ${kpiData.today.tasks}`, 14, 55);
        doc.text(`Total Hours: ${kpiData.today.hours}`, 14, 62);
        doc.text(`Completion Rate: ${kpiData.today.completionRate}%`, 14, 69);
        doc.text(`Avg Hours/Employee: ${kpiData.today.avgHoursPerEmployee}`, 14, 76);
      }

      const startY = kpiData ? 90 : 45;
      
      doc.setFontSize(14);
      doc.text('Department Breakdown', 14, startY - 5);

      const tableColumn = ["Department", "Employees", "Tasks", "Hours", "Avg Hours", "Completion %"];
      const tableRows = departmentData.map(dept => [
        dept.name,
        dept.employeeCount,
        dept.tasks,
        dept.hours,
        dept.avgHours,
        `${dept.completionRate}%`
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: startY,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [220, 20, 60] } // Future Designz Red
      });
      
      doc.save(`${filename.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (!departmentData || departmentData.length === 0) {
      toast.error('No data to export');
      return;
    }

    setIsExporting(true);
    try {
      const XLSX = await import('xlsx');
      
      const excelData = departmentData.map(dept => ({
        "Department": dept.name,
        "Team Size": dept.employeeCount,
        "Total Tasks": dept.tasks,
        "Total Hours": dept.hours,
        "Avg Hours/Employee": dept.avgHours,
        "Completion Rate (%)": dept.completionRate
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Departments");
      
      if (kpiData && kpiData.today) {
        const summaryData = [{
          "Metric": "Total Tasks", "Value": kpiData.today.tasks
        }, {
          "Metric": "Total Hours", "Value": kpiData.today.hours
        }, {
          "Metric": "Completion Rate (%)", "Value": kpiData.today.completionRate
        }, {
          "Metric": "Avg Hours/Employee", "Value": kpiData.today.avgHoursPerEmployee
        }];
        const summarySheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary KPIs");
      }
      
      XLSX.writeFile(workbook, `${filename.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Excel exported successfully');
    } catch (error) {
      console.error('Excel Export Error:', error);
      toast.error('Failed to export Excel');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting} className="bg-card border-border/50">
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Export KPIs
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2 text-primary" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2 text-success" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KPIExportButton;
