import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/UI/Card"
import Button from "../components/UI/Button"
import Input from "../components/UI/Input"
import Label from "../components/UI/Label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/UI/Tabs"
import Badge from "../components/UI/Badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/UI/Dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/UI/Table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/UI/Select"
import Textarea from "../components/UI/TextArea"
import ReactMarkdown from 'react-markdown';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Filter,
  MoreHorizontal,
  FileText,
  FlaskConical,
  FileDown,
  ClipboardCheck,
  Clock,
  Brain,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  X,
  ChevronUp,
  ChevronDown,
  DownloadCloud,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/UI/DropMenu"
import { cn } from "../components/Lib/Utilis"
import { useGetPatientsQuery } from "../redux/slices/patientSlice"
import { useGetDoctorsQuery } from "../redux/slices/doctorSlice"
import { useCreateLabTestMutation, useDeleteLabTestMutation, useGetLabTestsQuery, useUpdateLabTestMutation } from "../redux/slices/labTestSlice"
import { useCreateLabReportMutation, useDeleteLabReportMutation, useGetLabReportsQuery, useUpdateLabReportMutation } from "../redux/slices/labReportSlice"
import { useCreateAIDiagnosticMutation, useGetAIDiagnosticsQuery } from "../redux/slices/aiDiagnosticSlice"
import { useTranslation } from "react-i18next";
import { translateValue } from '../utilis/translate';

export default function Laboratory() {
  const { t } = useTranslation();
  const { data: patientsData } = useGetPatientsQuery();
  const { data: doctorsData } = useGetDoctorsQuery();
  const { data: testsData } = useGetLabTestsQuery();
  const { data: reportsData } = useGetLabReportsQuery();
  const { data: diagnosticsData } = useGetAIDiagnosticsQuery();

  const [createLabTest] = useCreateLabTestMutation();
  const [updateLabTest] = useUpdateLabTestMutation();
  const [createLabReport] = useCreateLabReportMutation();
  const [updateLabReport] = useUpdateLabReportMutation();
  const [deleteLabTest] = useDeleteLabTestMutation();
  const [deleteLabReport] = useDeleteLabReportMutation();
  const [createAIDiagnostic] = useCreateAIDiagnosticMutation();

  const [searchQuery, setSearchQuery] = useState("")
  const [showAddTest, setShowAddTest] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)
  const [showAddResult, setShowAddResult] = useState(false)
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null)
  const [searchTerm, setSearchTerm] = useState("");
  const [patientsList, setPatientsList] = useState(patientsData?.data || []);
  const [doctorsList, setDoctorsList] = useState(doctorsData?.data || []);
  const [testRequests, setTestRequests] = useState(testsData?.data || []);
  const [testResults, setTestResults] = useState(reportsData?.data || []);
  const [medicalstaffList, setMedicalStaffList] = useState(doctorsData?.data || []);
  const [diagnostics, setDiagnostics] = useState(diagnosticsData || []);
  const [selectest, setTestID] = useState(null);
  const [expandedReports, setExpandedReports] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedTestResultId, setSelectedTestResultId] = useState("");
  const [parameters, setParameters] = useState([
    { parameter: "", value: "", unit: "", referenceRange: "" },
  ]);
  const [editParameters, setEditParameters] = useState([]);

  useEffect(() => {
    if (selectedResult) {
      // console.log("Selected Result", selectedResult);
      setEditParameters(selectedResult.results || []);
    }
  }, [selectedResult]);
  useEffect(() => {
    if (testsData) {
      // console.log(testsData.data);
      setTestRequests(testsData.data);
    }
  }, [testsData]);

  useEffect(() => {
    if (doctorsData) {
      setDoctorsList(doctorsData.data?.filter((doctor) => doctor?.role_id?.role_name === "Doctor"));
      setMedicalStaffList(doctorsData.data);
    }
  }, [doctorsData]);

  useEffect(() => {
    if (patientsData) {
      setPatientsList(patientsData.data);
    }
  }, [patientsData]);
  useEffect(() => {
    if (reportsData) {
      // console.log("Test Results", reportsData);
      setTestResults(reportsData);
    }
  }, [reportsData]);
  useEffect(() => {
    if (diagnosticsData) {
      // console.log("Diagnostics", diagnosticsData);
      setDiagnostics(diagnosticsData);
    }
  }, [diagnosticsData]);

  // Sample data for test categories
  const testCategories = [
    { id: "CAT-001", name: "Hematology", description: "Blood cell tests and clotting analysis" },
    { id: "CAT-002", name: "Chemistry", description: "Blood chemical analysis (glucose, electrolytes)" },
    { id: "CAT-003", name: "Microbiology", description: "Detection of bacteria, fungi, and parasites" },
    { id: "CAT-004", name: "Immunology", description: "Immune response and antibody detection" },
    { id: "CAT-005", name: "Urinalysis", description: "Urine-based tests for infection, proteins, etc." },
    { id: "CAT-006", name: "Imaging", description: "Radiology tests like X-ray, MRI, ultrasound" },
    { id: "CAT-007", name: "Serology", description: "Detection of antibodies and antigens" },
    { id: "CAT-008", name: "Pathology", description: "Study of tissues and biopsy samples" },
    { id: "CAT-009", name: "Toxicology", description: "Analysis of drugs, poisons, and chemicals" },
    { id: "CAT-010", name: "Genetics", description: "DNA testing, chromosomal studies" },
    { id: "CAT-011", name: "Endocrinology", description: "Hormone levels and thyroid function" },
    { id: "CAT-012", name: "Virology", description: "Virus detection (HIV, Hepatitis, COVID-19)" },
    { id: "CAT-013", name: "Cardiology", description: "Heart-related tests (ECG, troponin, enzymes)" },
    { id: "CAT-014", name: "Pulmonology", description: "Respiratory function and lung tests" },
    { id: "CAT-015", name: "Gastroenterology", description: "Liver function, digestive enzyme tests" },
    { id: "CAT-016", name: "Oncology", description: "Cancer markers and tumor detection" },
    { id: "CAT-017", name: "Rheumatology", description: "Autoimmune disorder testing (RA, ANA)" },
    { id: "CAT-018", name: "Allergy Testing", description: "Detection of allergens and sensitivity" },
    { id: "CAT-019", name: "Infectious Disease", description: "Tests for TB, malaria, dengue, etc." },
    { id: "CAT-020", name: "Metabolic Panel", description: "Comprehensive analysis of metabolic function" },
  ];
  const filteredCategories = testCategories?.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const filteredTests = testRequests?.filter(
    (test) =>
      test.patientId?.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      test._id?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      test.testName?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      test.status?.toLowerCase().includes(searchQuery?.toLowerCase()),
  )

  // Filter results based on search query
  const filteredResults = testResults?.filter(
    (result) =>
      result.patientId.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      result.id?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      result.testName?.toLowerCase().includes(searchQuery?.toLowerCase()),
  )

  // Handle adding a new test request
  const handleAddTest = async (newTest) => {

    try {
      const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

      await createLabTest(newTest).unwrap();
      setTestRequests([
        ...testRequests,
        {
          ...newTest,
          requestDate: today,
          status: "pending",
          sampleCollected: false,
        },
      ])
      setShowAddTest(false)
    } catch (error) {
      if (error.status === 400) {
        alert(error.data.message);
      } else {
        alert(t('translation:anErrorOccurredWhileAddingTheT'));
      }
    }
  }


  // Handle updating a test request
  const handleUpdateTest = async (updatedTest) => {
    try {
      const { _id, ...testData } = updatedTest;

      await updateLabTest({ id: _id, ...testData }).unwrap();

      setTestRequests((prev) =>
        prev?.map((test) => (test.id === _id || test._id === _id ? updatedTest : test))
      );

      setSelectedTest(null);
    } catch (error) {
      if (error?.status === 400 && error?.data?.message) {
        alert(error.data.message);
      } else {
        // console.error("Error updating test:", error);
        alert(t('translation:anErrorOccurredWhileUpdatingTh'));
      }
    }
  };


  // Handle deleting a test request
  const handleDeleteTest = async (id) => {
    try {
      // console.log("id", id);
      // Call the delete API
      await deleteLabTest(id).unwrap();

      // Update local state to reflect deletion
      setTestRequests((prev) => prev?.filter((test) => test.id !== id));
      setTestResults((prev) => prev?.filter((result) => result.testId !== id));
    } catch (error) {
      // console.error("Failed to delete lab test:", error);
      // Optionally show an error message to the user
    }
  };

  // Handle adding test results
  const handleAddResult = async (newResult) => {
    try {
      // console.log("---------------------------------------------------->", newResult);
      await createLabReport(newResult).unwrap();
      const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

      // Find the associated test and update its status

      // if (test) {
      //   handleUpdateTest({
      //     ...test,
      //     status: "completed",
      //   })
      // }

      setTestResults([
        ...testResults,
        {
          ...newResult,
          resultDate: today,
        },
      ])
      setShowAddResult(false)
    }
    catch (error) {
      // console.log(error);
      alert(t('translation:anErrorOccurredWhileAddingTheT'));
    }
  }

  // Handle updating test results
  const handleUpdateResult = async (updatedData) => {
    const { _id } = updatedData;

    try {
      const res = await updateLabReport({ id: _id, ...updatedData }).unwrap();
      // console.log("res", res);

      setTestResults((prevResults) =>
        prevResults?.map((result) => (result._id === _id ? updatedData : result))
      );
      setSelectedResult(null);
    } catch (error) {
      // console.error("Error updating result:", error);
    }
  };


  // Handle deleting test results
  const handleDeleteResult = async (id) => {
    try {
      await deleteLabReport(id).unwrap();
      setTestResults((prev) => prev?.filter((result) => result.id !== id));
    } catch (error) {
      // console.error("Failed to delete test report:", error);
      // Optionally show a toast or alert here
    }
  };

  const handleAddParameter = () => {
    setParameters((prev) => [
      ...prev,
      { parameter: "", value: "", unit: "", referenceRange: "" },
    ]);
  };

  const handleRemoveParameter = (index) => {
    setParameters((prev) => prev?.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...parameters];
    updated[index][field] = value;
    setParameters(updated);
  };

  const handleEditParamChange = (index, key, value) => {
    setEditParameters((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };


  // Derived stats
  const analyzedToday = diagnostics?.filter((d) => {
    const date = new Date(d.createdAt);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  })?.length ?? 0;

  const averageAccuracy =
    diagnostics?.length > 0
      ? (
        diagnostics.reduce((acc, curr) => acc + (curr.accuracy || 0), 0) /
        diagnostics.length
      ).toFixed(1)
      : 0;

  const avgTimeReduction =
    diagnostics?.length > 0
      ? (
        diagnostics.reduce((acc, curr) => acc + (curr.processingTimeReduction || 0), 0) /
        diagnostics.length
      ).toFixed(0)
      : 0;

  const totalAnomalies = diagnostics?.reduce(
    (acc, curr) => acc + (curr.anomalies?.length || 0),
    0
  ) ?? 0;

  const patternMatches = diagnostics?.reduce(
    (acc, curr) => acc + (curr.patterns?.length || 0),
    0
  ) ?? 0;

  const autoReports = diagnostics?.length ?? 0;

  const toggleExpanded = (reportId) => {
    setExpandedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }))
  }

  const handleCreate = async () => {

    if (!selectedTestResultId) return toast.error(t('translation:selectALabTestFirst'));
    // console.log("selectedTestResultId", selectedTestResultId);
    try {
      setLoading(true);
      const response = await createAIDiagnostic({ testId: selectedTestResultId }).unwrap();
      // console.log("response", response);
      toast.success(t('translation:aiDiagnosticCreatedSuccessfull'));
      setSelectedTestResultId("");
    } catch (err) {
      // console.error("Failed to create diagnostic:", err);
      toast.error(t('translation:failedToCreateDiagnostic'));
    }
    finally {
      setLoading(false);
    }
  };

  const generatePDF = (report, index) => {
    const doc = new jsPDF();
    const patient = report.testId?.patientId;
    const labTest = report.testId?.labTest;
    
    // Define colors
    const primaryColor = [0, 102, 204]; // blue
    const secondaryColor = [66, 66, 66]; // dark gray
    const accentColor = [220, 53, 69]; // red
    const warningColor = [255, 165, 0]; // orange
    const successColor = [40, 167, 69]; // green
    const lightGray = [240, 240, 240]; // light gray for backgrounds
    
    let y = 20;
    
    // Helper function for section titles with improved styling
    const sectionTitle = (text) => {
      // Section title background
      doc.setFillColor(...primaryColor);
      doc.rect(10, y-5, 190, 8, 'F');
      
      // Section title text
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255); // white text
      doc.text(text, 14, y);
      y += 10;
      
      // Reset to normal text
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
    };
    
    // Helper function for field labels and values
    const addField = (label, value) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...secondaryColor);
      doc.text(`${label}:`, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${value || '-'}`, 50, y);
      y += 6;
    };
    
    // Helper function for two-column fields
    const addFieldPair = (label1, value1, label2, value2) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...secondaryColor);
      doc.text(`${label1}:`, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${value1 || '-'}`, 50, y);
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${label2}:`, 110, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`${value2 || '-'}`, 140, y);
      y += 6;
    };
    
    // Helper function for multiline text
    const addMultilineText = (label, text, maxWidth = 180) => {
      // Create a container with light background
      const beforeY = y;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...secondaryColor);
      doc.text(`${label}:`, 14, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      
      // Handle text content
      const lines = doc.splitTextToSize(text || '-', maxWidth - 10);
      
      // Draw background rectangle
      doc.setFillColor(...lightGray);
      doc.setDrawColor(200, 200, 200);
      doc.roundedRect(12, y-3, maxWidth, lines.length * 5 + 4, 2, 2, 'FD');
      
      // Add text
      doc.text(lines, 16, y);
      y += lines.length * 5 + 6;
    };
    
    // Helper function for lists with icons
    const addList = (label, items, color = secondaryColor) => {
      if (!items || items.length === 0) {
        return;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...secondaryColor);
      doc.text(`${label}:`, 14, y);
      y += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...color);
      
      // Draw background for list
      const listHeight = items.length * 6;
      doc.setFillColor(...lightGray);
      doc.setDrawColor(200, 200, 200);
      doc.roundedRect(12, y-3, 186, listHeight + 2, 2, 2, 'FD');
      
      items?.forEach((item, idx) => {
        // Create a bullet point with filled circle
        doc.circle(16, y-1, 1, 'F');
        doc.text(item, 20, y);
        y += 6;
      });
      
      doc.setTextColor(...secondaryColor); // reset color
      y += 2;
    };
    
    // Check if new page is needed
    const checkPageBreak = (neededSpace = 20) => {
      if (y > 270 - neededSpace) {
        doc.addPage();
        y = 20;
        return true;
      }
      return false;
    };
    
    // ----------------------------
    // Header with logo placeholder
    // ----------------------------
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(10, 10, 190, 25, 3, 3, 'FD');
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text("AI Diagnostic Report", 15, 25);
    
    // Add report date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...secondaryColor);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 130, 25);
    
    y = 45;
    
    // ----------------------------
    // Patient & Test Info
    // ----------------------------
    sectionTitle("Patient & Test Details");
    
    // Add patient photo placeholder
    doc.setFillColor(...lightGray);
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(160, y-5, 30, 30, 2, 2, 'FD');
    doc.setFontSize(8);
    doc.text("Patient Photo", 165, y+10);
    
    // Patient info
    const patientAge = patient?.dateOfBirth ? 
      `${new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} yrs` : 
      'Unknown';
    
    addField("Patient", `${patient?.name || 'Unknown'} (${patient?.gender || 'Unknown'}, ${patientAge})`);
    addField("Patient ID", patient?.id || 'Unknown');
    addFieldPair("Test", labTest?.testName || 'Unknown', "Test ID", labTest?.id || 'Unknown');
    addFieldPair("Status", report.testId?.status || 'Unknown', "Priority", labTest?.Priority || 'Standard');
    addField("Date", new Date(report.createdAt).toLocaleString());
    
    y += 5;
    
    // ----------------------------
    // Test Results Table
    // ----------------------------
    checkPageBreak(60);
    sectionTitle("Test Results");
    
    // Table header with colored background
    doc.setFillColor(...primaryColor);
    doc.rect(10, y-5, 190, 8, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255); // white text for header
    doc.text("Parameter", 14, y);
    doc.text("Value", 74, y);
    doc.text("Unit", 114, y);
    doc.text("Reference", 154, y);
    y += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...secondaryColor);
    
    // Table rows with alternating colors
    if (report.testId?.results && report.testId.results.length > 0) {
      report.testId.results.forEach((res, idx) => {
        // Check for page break within table
        if (checkPageBreak(10)) {
          // Repeat table header on new page
          doc.setFillColor(...primaryColor);
          doc.rect(10, y-5, 190, 8, 'F');
          
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(255, 255, 255);
          doc.text("Parameter", 14, y);
          doc.text("Value", 74, y);
          doc.text("Unit", 114, y);
          doc.text("Reference", 154, y);
          y += 8;
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...secondaryColor);
        }
        
        // Alternating row colors
        if (idx % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(10, y-4, 190, 6, 'F');
        }
        
        // Check if value is out of reference range
        let isAbnormal = false;
        const refRange = res.referenceRange;
        const value = parseFloat(res.value);
        
        if (refRange && !isNaN(value)) {
          if (refRange.includes('-')) {
            const [min, max] = refRange.split('-').map(parseFloat);
            if (!isNaN(min) && !isNaN(max)) {
              isAbnormal = value < min || value > max;
            }
          } else if (refRange.includes('<')) {
            const max = parseFloat(refRange.replace('<', ''));
            isAbnormal = !isNaN(max) && value >= max;
          } else if (refRange.includes('>')) {
            const min = parseFloat(refRange.replace('>', ''));
            isAbnormal = !isNaN(min) && value <= min;
          }
        }
        
        // Parameter
        doc.text(res.parameter || '-', 14, y);
        
        // Value (highlighted if abnormal)
        if (isAbnormal) {
          doc.setTextColor(...accentColor);
          doc.setFont('helvetica', 'bold');
        }
        doc.text(res.value?.toString() || '-', 74, y);
        
        // Reset color
        doc.setTextColor(...secondaryColor);
        doc.setFont('helvetica', 'normal');
        
        // Unit and reference
        doc.text(res.unit || '-', 114, y);
        doc.text(res.referenceRange || '-', 154, y);
        
        y += 6;
      });
    } else {
      doc.text("No test results available", 14, y);
      y += 6;
    }
    
    y += 5;
    
    // ----------------------------
    // Summary and Insights
    // ----------------------------
    checkPageBreak(60);
    sectionTitle("AI Summary & Insights");
    
    // AI Summary box
    addMultilineText("AI Summary", report.summary);
    
    // Insights with color coding and icons
    addList("Key Insights", report.insights, [40, 167, 69]); // green color
    
    // ----------------------------
    // Anomalies and Patterns
    // ----------------------------
    checkPageBreak(60);
    sectionTitle("Anomalies & Patterns");
    
    // Anomalies with color coding
    addList("Anomalies", report.anomalies, accentColor);
    
    // Patterns with color coding
    addList("Patterns", report.patterns, warningColor);
    
    // ----------------------------
    // Final AI Report
    // ----------------------------
    checkPageBreak(80);
    sectionTitle("AI Generated Report");
    
    // Generated report in a nice box
    addMultilineText("Report", report.autoGeneratedReport);
    
    // ----------------------------
    // Stats and Metrics
    // ----------------------------
    checkPageBreak(40);
    sectionTitle("AI Analysis Metrics");
    
    // Metrics in a nice box
    doc.setFillColor(...lightGray);
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(12, y-3, 186, 24, 2, 2, 'FD');
    
    // Accuracy with visual indicator
    doc.setFont('helvetica', 'bold');
    doc.text("Accuracy:", 20, y);
    doc.setFont('helvetica', 'normal');
    
    // Draw accuracy bar
    const accuracy = parseInt(report.accuracy) || 0;
    doc.setFillColor(220, 220, 220);
    doc.rect(80, y-3, 100, 6, 'F');
    
    // Color based on accuracy level
    let accuracyColor = accentColor; // default red
    if (accuracy >= 90) {
      accuracyColor = successColor; // green
    } else if (accuracy >= 70) {
      accuracyColor = warningColor; // orange
    }
    
    doc.setFillColor(...accuracyColor);
    doc.rect(80, y-3, accuracy, 6, 'F');
    doc.text(`${accuracy}%`, 185, y);
    
    y += 10;
    
    // Time saved with visual indicator
    doc.setFont('helvetica', 'bold');
    doc.text("Time Saved:", 20, y);
    doc.setFont('helvetica', 'normal');
    
    // Draw time saved bar
    const timeSaved = parseInt(report.processingTimeReduction) || 0;
    doc.setFillColor(220, 220, 220);
    doc.rect(80, y-3, 100, 6, 'F');
    doc.setFillColor(...successColor);
    doc.rect(80, y-3, timeSaved, 6, 'F');
    doc.text(`${timeSaved}%`, 185, y);
    
    y += 15;
    
    // ----------------------------
    // Footer
    // ----------------------------
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    
    // Add footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20);
    
    // Add footer text
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("This report was generated by AI and should be reviewed by a healthcare professional.", 10, pageHeight - 15);
    doc.text(`Report ID: ${report.id || `AI-${index}`}`, 10, pageHeight - 10);
    
    // Add page number
    doc.text(`Page 1 of 1`, pageWidth - 40, pageHeight - 10);
    
    // Save PDF with improved filename
    const patientName = (patient?.name || 'Unknown').replace(/\s+/g, '_');
    const testName = (labTest?.testName || 'Unknown').replace(/\s+/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `AI_Diagnostic_${patientName}_${testName}_${dateStr}.pdf`;
    
    doc.save(filename);
  };
  const generateResultPDF = (result) => {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Define colors and styles
    const primaryColor = [41, 128, 185];
    const secondaryColor = [52, 73, 94];
    const accentColor = [231, 76, 60];
    const lightGray = [200, 200, 200];
    
    // Initialize vertical position
    let y = 20;
    
    // Add logo/header image placeholder
    doc.setDrawColor(...lightGray);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(10, 10, 190, 25, 3, 3, 'FD');
    
    // Document title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text("Lab Test Report", 15, 25);
    
    // Subtitle with date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...secondaryColor);
    doc.text(`Report generated on ${new Date().toLocaleDateString()}`, 120, 25);
    
    // Update y position after header
    y = 45;
    
    // Section formatting function with improved styling
    const section = (title) => {
      doc.setFillColor(...primaryColor);
      doc.rect(10, y - 5, 190, 8, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(title, 15, y);
      y += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
    };
    
    // Field formatting with better alignment and styling
    const field = (label, value) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...secondaryColor);
      doc.text(`${label}:`, 15, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const formattedValue = value || "-";
      doc.text(formattedValue, 60, y);
      y += 6;
    };
    
    // Two-column field formatting
    const fieldPair = (label1, value1, label2, value2) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...secondaryColor);
      doc.text(`${label1}:`, 15, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(value1 || "-", 60, y);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...secondaryColor);
      doc.text(`${label2}:`, 110, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(value2 || "-", 155, y);
      y += 6;
    };
    
    // Section 1: Patient Information
    section("Patient Information");
    field("Patient", `${result.patientId?.name} (${result.patientId?.id})`);
    fieldPair("Gender", result.patientId?.gender, "Blood Group", result.patientId?.bloodGroup);
    fieldPair("Date of Birth", result.patientId?.dateOfBirth?.split("T")[0], "Phone", result.patientId?.phone);
    field("Email", result.patientId?.email);
    field("Address", result.patientId?.address);
    
    y += 5; // Add some spacing
    
    // Section 2: Test Information
    section("Test Details");
    fieldPair("Test Name", result.testName || result.labTest?.testName, "Test ID", result.labTest?.id);
    fieldPair("Result ID", result.id, "Status", result.status);
    fieldPair("Result Date", new Date(result.resultDate).toLocaleDateString(), "Created At", new Date(result.createdAt).toLocaleDateString());
    fieldPair("Performed By", result.performedBy?.name, "Reviewed By", result.reviewedBy?.name);
    
    y += 5; // Add some spacing
    
    // Section 3: Test Results with table formatting
    section("Test Parameters");
    
    // Table header
    const startY = y;
    doc.setFillColor(240, 240, 240);
    doc.rect(15, y - 5, 180, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text("Parameter", 20, y);
    doc.text("Value", 80, y);
    doc.text("Unit", 120, y);
    doc.text("Reference Range", 150, y);
    y += 5;
    
    // Table content
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    if (result.results && result.results.length > 0) {
      result.results.forEach((r, i) => {
        // Alternating row colors
        if (i % 2 === 0) {
          doc.setFillColor(248, 248, 248);
          doc.rect(15, y - 4, 180, 6, 'F');
        }
        
        doc.text(r.parameter, 20, y);
        
        // Highlight abnormal values
        const isAbnormal = r.referenceRange && 
          !r.referenceRange.includes('-') ? 
          r.value !== r.referenceRange :
          (r.referenceRange && r.value && 
           ((parseFloat(r.value) < parseFloat(r.referenceRange.split('-')[0])) || 
            (parseFloat(r.value) > parseFloat(r.referenceRange.split('-')[1]))));
        
        if (isAbnormal) {
          doc.setTextColor(...accentColor);
          doc.setFont('helvetica', 'bold');
        }
        
        doc.text(r.value || "-", 80, y);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        
        doc.text(r.unit || "-", 120, y);
        doc.text(r.referenceRange || "-", 150, y);
        y += 6;
      });
    } else {
      doc.text("No test parameters available", 20, y);
      y += 6;
    }
    
    // Draw table border
    doc.setDrawColor(...lightGray);
    doc.rect(15, startY - 5, 180, y - startY + 1);
    
    y += 8; // Add spacing
    
    // Section 4: Comments with styled box
    if (result.comments) {
      section("Additional Comments");
      doc.setFillColor(252, 252, 252);
      doc.setDrawColor(...lightGray);
      const commentY = y;
      
      // Split comments to prevent overflow
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(result.comments, 170);
      
      // Draw comment box
      doc.roundedRect(15, y - 5, 180, lines.length * 5 + 10, 2, 2, 'FD');
      doc.text(lines, 20, y + 2);
      y += lines.length * 6 + 5;
    }
    
    // Footer
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Footer line
    doc.setDrawColor(...lightGray);
    doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20);
    
    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text("This is a computer-generated report and does not require a signature.", 10, pageHeight - 15);
    doc.text("For questions or concerns, please contact the laboratory.", 10, pageHeight - 10);
    
    // Page number
    doc.text(`Page 1 of 1`, pageWidth - 40, pageHeight - 10);
    
    // Save with a descriptive filename
    const patientName = result.patientId?.name?.replace(/\s+/g, '_') || 'Unknown';
    const testName = (result.testName || result.labTest?.testName || 'Test').replace(/\s+/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Lab_Report_${patientName}_${testName}_${dateStr}.pdf`;
    
    doc.save(filename);
  };

  const downloadAllReports = () => {
    diagnostics.forEach((report, idx) => generatePDF(report, idx));
  };

  return (
    <>
      <Tabs defaultValue="insights" className="mb-6">
      <TabsList className="bg-teal-100 inline-flex h-10 items-center justify-center rounded-md text-gray-500">
          <TabsTrigger value="insights" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
            {t("laboratory.insightsTab", "Insights")}
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
            {t("laboratory.createReportTab", "Create AI Report")}
          </TabsTrigger>
          </TabsList>

        {/* Insights Panel */}
        <TabsContent value="insights">
          <div className="mb-6">
            <Card className="border-teal-500 dark:border-teal-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{t("laboratory.aiDiagnosticsTitle", "AI-Powered Diagnostics")}</CardTitle>
                    <CardDescription>
                      {t("laboratory.aiDiagnosticsSub", "Machine learning assisted test analysis")}
                    </CardDescription>
                  </div>
                  <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">{t('translation:beta')}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <InsightCard
                    title={t("laboratory.aiAnalysis", "AI Analysis")}
                    value={analyzedToday}
                    subtitle={t("laboratory.testsAnalyzed", "Tests analyzed today")}
                    icon={<Brain className="h-5 w-5 text-blue-500 dark:text-blue-300" />}
                    bg="bg-blue-800 "
                  />
                  <InsightCard
                    title={t("laboratory.accuracyRate", "Accuracy Rate")}
                    value={`${averageAccuracy}%`}
                    subtitle={t("laboratory.comparedToManual", "Compared to manual review")}
                    icon={<CheckCircle className="h-5 w-5 text-green-500 dark:text-green-300" />}
                    bg="bg-green-900"
                  />
                  <InsightCard
                    title={t("laboratory.processingTime", "Processing Time")}
                    value={`${avgTimeReduction}%`}
                    subtitle={t("laboratory.reductionTime", "Reduction in analysis time")}
                    icon={<Clock className="h-5 w-5 text-purple-500 dark:text-purple-300" />}
                    bg="bg-purple-800  "
                  />
                </div>

                <div className="space-y-4">
                  <InsightRow
                    title={t("laboratory.anomalyDetection", "Anomaly Detection")}
                    desc={t("laboratory.anomalyDesc", { count: totalAnomalies, defaultValue: `AI detected ${totalAnomalies} potential anomalies that require review.` })}
                    icon={<AlertCircle className="h-5 w-5 text-blue-500 dark:text-blue-300" />}
                    bg="bg-blue-100"
                    buttonText={t("laboratory.review", "Review")}
                    onButtonClick={() => setShowReportsModal(true)}
                  />
                  <InsightRow
                    title={t("laboratory.patternRecognition", "Pattern Recognition")}
                    desc={t("laboratory.patternDesc", { count: patternMatches, defaultValue: `AI identified significant patterns in ${patternMatches} recent diagnostics.` })}
                    icon={<TrendingUp className="h-5 w-5 text-green-500 dark:text-green-300" />}
                    bg="bg-green-100 "
                    buttonText={t("laboratory.analyze", "Analyze")}
                    onButtonClick={() => setShowReportsModal(true)}
                  />
                  <InsightRow
                    title={t("laboratory.autoReporting", "Automated Reporting")}
                    desc={t("laboratory.autoDesc", { count: autoReports, defaultValue: `${autoReports} reports were automatically generated and are ready for review.` })}
                    icon={<FileText className="h-5 w-5 text-purple-500 dark:text-purple-300" />}
                    bg="bg-purple-100"
                    buttonText={t("laboratory.viewReports", "View Reports")}
                    onButtonClick={() => setShowReportsModal(true)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Create Report Panel */}
        <TabsContent value="create">
          <Card className="border-teal-500 dark:border-teal-700">
            <CardHeader>
              <CardTitle>{t("laboratory.createReportTitle", "Create AI Diagnostic Report")}</CardTitle>
              <CardDescription>
                {t("laboratory.createReportSub", "Generate a report by selecting a lab test Report below")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Label>{t("laboratory.selectLabTest", "Select Lab Test Report")}</Label>
                <select
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 hover:bg-gray-100 cursor-pointer transition"
                  value={selectedTestResultId}
                  onChange={(e) => setSelectedTestResultId(e.target.value)}
                >
                  <option value="">{t("laboratory.chooseLabTest", "Choose a lab test report")}</option>
                  {testResults?.map((test) => (
                    <option key={test._id} value={test._id}>
                      {test?.testName} - ({test?.labTest?.id}) - ({test?.patientId?.name})
                    </option>
                  ))}
                </select>
              </div>


              <Button
                disabled={!selectedTestResultId || loading}
                onClick={handleCreate}
                className="bg-teal-500 hover:bg-teal-600"
              >
                {loading ? t("laboratory.generating", "Generating...") : t("laboratory.generateReport", "Generate Report")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* <div className="mb-6">
        <Card className="border-teal-500 dark:border-teal-700">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>AI-Powered Diagnostics</CardTitle>
                <CardDescription>Machine learning assisted test analysis</CardDescription>
              </div>
              <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">{t('translation:beta')}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">AI Analysis</h3>
                      <p className="text-3xl font-bold mt-2">24</p>
                      <p className="text-xs text-muted-foreground mt-1">Tests analyzed today</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <Brain className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Accuracy Rate</h3>
                      <p className="text-3xl font-bold mt-2">98.7%</p>
                      <p className="text-xs text-muted-foreground mt-1">Compared to manual review</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Processing Time</h3>
                      <p className="text-3xl font-bold mt-2">-67%</p>
                      <p className="text-xs text-muted-foreground mt-1">Reduction in analysis time</p>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-purple-500 dark:text-purple-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Anomaly Detection</p>
                  <p className="text-sm text-muted-foreground">
                    AI detected 3 potential anomalies in recent blood work that require review.
                  </p>
                </div>
                <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                  Review
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-md">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-500 dark:text-green-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Pattern Recognition</p>
                  <p className="text-sm text-muted-foreground">
                    AI identified similar patterns in 5 patients with respiratory symptoms.
                  </p>
                </div>
                <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                  Analyze
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-md">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-purple-500 dark:text-purple-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Automated Reporting</p>
                  <p className="text-sm text-muted-foreground">
                    12 test reports were automatically generated and are ready for review.
                  </p>
                </div>
                <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                  View Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("laboratory.title")}</h1>
        <div className="flex gap-2">
          <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => setShowAddResult(true)}>
            <FileText className="h-4 w-4 mr-2" />
            {t("laboratory.enterResults", "Enter Results")}
          </Button>
          <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => setShowAddTest(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("laboratory.newRequest", "New Test Request")}
          </Button>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("laboratory.searchPlaceholder", "Search tests by patient, ID, or test name...")}
            className="pl-8 w-full border border-gray-400 h-10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* <Button variant="outline" size="icon" className="ml-2">
          <Filter className="h-4 w-4" />
        </Button> */}
        <Button variant="outline" size="sm" className="ml-2">
          <Download className="h-4 w-4 mr-2" />
          {t("common.export")}
        </Button>
      </div>

      <Tabs defaultValue="requests" className="mb-6">
      <TabsList className="bg-teal-100 inline-flex h-10 items-center justify-center rounded-md text-gray-500">
          <TabsTrigger value="requests" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
            {t("laboratory.testRequestsTab", "Test Requests")}
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
            {t("laboratory.testResultsTab", "Test Results")}
          </TabsTrigger>
          </TabsList>

        <TabsContent value="requests" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("laboratory.testRequestsTitle", "Test Requests")}</CardTitle>
              <CardDescription>{t("laboratory.testRequestsSub", "Manage laboratory test requests")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <Card className="bg-blue-50  dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4 mt-4 flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-blue-500 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-500 dark:text-blue-300">{t('translation:pending')}</p>
                      <p className="text-2xl font-bold">{testRequests?.filter((t) => t.status === "pending")?.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                  <CardContent className="p-4 flex mt-4 items-center gap-4">
                    <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
                      <FlaskConical className="h-6 w-6 text-amber-500 dark:text-amber-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-500 dark:text-amber-300">{t('translation:inProgress')}</p>
                      <p className="text-2xl font-bold">
                        {testRequests?.filter((t) => t.status === "in-progress")?.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <CardContent className="p-4 flex mt-4 items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                      <ClipboardCheck className="h-6 w-6 text-green-500 dark:text-green-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-500 dark:text-green-300">{t('translation:completed')}</p>
                      <p className="text-2xl font-bold">
                        {testRequests?.filter((t) => t.status === "completed")?.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800">
                  <CardContent className="p-4 flex mt-4 items-center gap-4">
                    <div className="bg-rose-100 dark:bg-rose-900 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-rose-500 dark:text-rose-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-rose-500 dark:text-rose-300">{t('translation:urgent')}</p>
                      <p className="text-2xl font-bold">
                        {testRequests?.filter((t) => t.Priority === "Urgent" || t.Priority === "High")?.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("common.id", "ID")}</TableHead>
                    <TableHead>{t("common.patient", "Patient")}</TableHead>
                    <TableHead>{t("laboratory.test", "Test")}</TableHead>
                    <TableHead>{t("laboratory.requestedBy", "Requested By")}</TableHead>
                    <TableHead>{t("laboratory.priority", "Priority")}</TableHead>
                    <TableHead>{t("common.status", "Status")}</TableHead>
                    <TableHead className="text-right">{t("common.actions", "Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests?.map((test) => (
                    <TableRow key={test._id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell>{test.patientId?.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span
                            title={
                              filteredCategories.find((cat) => cat.name?.toLowerCase() === test.testName?.toLowerCase())?.description || test.testName
                            }
                          >
                            {test.testName}
                          </span>
                          {/* <span className="text-xs text-muted-foreground">{test.category}</span> */}
                        </div>
                      </TableCell>
                      <TableCell>{test.DoctorId?.name}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            test.Priority === "Urgent"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300"
                              : test.Priority === "High"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                          )}
                        >
                          {test.Priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            test.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : test.status === "in-progress"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                          )}
                        >
                          {test.status.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('translation:actions')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedTest(test)}>
                              <Edit className="h-4 w-4 mr-2" />{t('translation:edit')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteTest(test._id)}>
                              <Trash2 className="h-4 w-4 mr-2" />{t('translation:delete')}</DropdownMenuItem>
                            {test.status !== "completed" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setShowAddResult(true)
                                    // Pre-select this test for results
                                    setTestID(test)
                                  }}
                                >
                                  <FileDown className="h-4 w-4 mr-2" />{t('translation:enterResults')}</DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("laboratory.testResultsTitle", "Test Results")}</CardTitle>
              <CardDescription>{t("laboratory.testResultsSub", "View and manage laboratory test results")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("common.id", "ID")}</TableHead>
                    <TableHead>{t("common.patient", "Patient")}</TableHead>
                    <TableHead>{t("laboratory.test", "Test")}</TableHead>
                    <TableHead>{t("common.date", "Date")}</TableHead>
                    <TableHead>{t("common.status", "Status")}</TableHead>
                    <TableHead>{t("laboratory.performedBy", "Performed By")}</TableHead>
                    <TableHead>{t("laboratory.reviewedBy", "Reviewed By")}</TableHead>
                    <TableHead className="text-right">{t("common.actions", "Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults?.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.id}</TableCell>
                      <TableCell>{result.patientId.name}</TableCell>
                      <TableCell>{result.testName}</TableCell>
                      <TableCell>{result?.resultDate.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            result.status === "normal"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
                          )}
                        >
                          {translateValue('status', result.status, t)}
                        </Badge>
                      </TableCell>
                      <TableCell>{result.performedBy?.name}</TableCell>
                      <TableCell>{result.reviewedBy?.name}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('translation:actions')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedResult(result)}>
                              <Edit className="h-4 w-4 mr-2" />{t('translation:edit')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteResult(result._id)}>
                              <Trash2 className="h-4 w-4 mr-2" />{t('translation:delete')}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => generateResultPDF(result)}>
                              <FileDown className="h-4 w-4 mr-2" />{t('translation:downloadPdf')}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Test Dialog */}
      <Dialog open={showAddTest} onOpenChange={setShowAddTest}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("laboratory.newTestRequestTitle", "New Test Request")}</DialogTitle>
            <DialogDescription>{t("laboratory.newTestRequestSub", "Create a new laboratory test request")}</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);

              const newTest = {
                patientId: formData.get("patientId"),
                testName: formData.get("testName"),
                notes: formData.get("notes"),
                DoctorId: formData.get("DoctorId"),
                Priority: formData.get("priority"),
                sampleCollected: false,
              };

              handleAddTest(newTest);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="patientId" className="text-right">
                  {t("common.patient", "Patient")}
                </Label>
                <select className="col-span-3 border rounded px-3 py-2" id="patientId" name="patientId">
                  <option value="">{t("insurance.selectPatient", "Select patient")}</option>
                  {patientsList?.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      ({patient.id}){" - "}{patient.name}
                    </option>
                  ))}
                </select>

              </div>


              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="testName" className="text-right pt-2">
                  {t("laboratory.testName", "Test Name")}
                </Label>
                <div className="col-span-3 space-y-2">
                  <select name="testName" required className="w-full px-3 py-2 border rounded">
                    <option value="">
                      {t("laboratory.selectTest", "Select Test")}
                    </option>
                    {filteredCategories?.map((category) => (
                      <option
                        key={category.id}
                        value={category.name}
                        title={category.description}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>


              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="DoctorId" className="text-right">
                  {t("laboratory.requestedBy", "Requested By")}
                </Label>
                <select className="col-span-3 px-3 py-2 border rounded" id="DoctorId" name="DoctorId">
                  <option value="">{t("doctors.selectDoctor", "Select doctor")}</option>
                  {doctorsList?.map((doctor) => (
                    <option key={doctor._id} value={doctor._id} title={doctor.specialization}>
                      ({doctor.id}){" - "}{doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  {t("laboratory.priority", "Priority")}
                </Label>
                <select className="col-span-3 w-full px-3 py-2 border rounded" id="priority" name="priority">
                  <option value="">{t("laboratory.selectPriority", "Select Priority")}</option>
                  <option value="Urgent">{t("laboratory.priorities.urgent", "Urgent")}</option>
                  <option value="High">{t("bloodBank.high", "High")}</option>
                  <option value="Normal">{t("bloodBank.normal", "Normal")}</option>
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  {t("common.notes", "Notes")}
                </Label>
                <Textarea id="notes" name="notes" className="col-span-3" rows={3} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddTest(false)}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                {t("laboratory.createRequest", "Create Request")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Test Dialog */}
      <Dialog open={!!selectedTest} onOpenChange={(open) => !open && setSelectedTest(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('translation:editTestRequest')}</DialogTitle>
            <DialogDescription>{t('translation:updateTheTestRequestDetails')}</DialogDescription>
          </DialogHeader>
          {selectedTest && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updatedTest = {
                  ...selectedTest,
                  patientId: formData.get("patientId"),
                  testName: formData.get("testName"),
                  DoctorId: formData.get("DoctorId"),
                  Priority: formData.get("priority"),
                  status: formData.get("status"),
                  sampleCollected: formData.get("sampleCollected") === "yes",
                  notes: formData.get("notes"),
                };
                handleUpdateTest(updatedTest);
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t('translation:testId')}</Label>
                  <Input defaultValue={selectedTest.id} className="col-span-3" disabled />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-patientId" className="text-right">{t('translation:patient')}</Label>
                  <select defaultValue={selectedTest?.patientId?._id} className="col-span-3 px-3 py-2 border rounded" id="edit-patientId" name="patientId" required>
                    <option  value="">{t('translation:selectPatient')}</option>
                    {patientsList?.map((patient) => (
                      <option key={patient._id} value={patient._id}>
                        ({patient.id}){" - "}{patient.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-testName" className="text-right pt-2">{t('translation:testName')}</Label>
                  <div className="col-span-3 space-y-2">
                    {/* <Input
                      type="text"
                      placeholder="Search test categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    /> */}
                    <select name="testName" required className="w-full px-3 py-2 border rounded" defaultValue={selectedTest.testName}>
                      <option  value="">{t('translation:selectTest')}</option>
                      {filteredCategories?.map((category) => (
                        <option key={category.id} value={category.name} title={category.description}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-DoctorId" className="text-right">{t('translation:requestedByDoctorId')}</Label>
                  <select className="col-span-3 px-3 py-2 border rounded" id="edit-DoctorId" name="DoctorId" defaultValue={selectedTest.DoctorId?._id}>
                    <option disabled value="">{t('translation:selectDoctor')}</option>
                    {doctorsList?.map((doctor) => (
                      <option key={doctor._id} value={doctor._id} title={doctor.specialization}>
                        ({doctor.id}){" - "}{doctor.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-priority" className="text-right">{t('translation:priority')}</Label>
                  <select className="col-span-3 w-full px-3 py-2 border rounded" id="edit-priority" name="priority" defaultValue={selectedTest.Priority}>
                    <option disabled value="">{t('translation:selectPriority')}</option>
                    <option value="Urgent" title={t('translation:urgentTestsRequireImmediateAtt')}>{t('translation:urgent')}</option>
                    <option value="High" title={t('translation:highPriorityTestsRequireQuickA')}>{t('translation:high')}</option>
                    <option value="Normal" title={t('translation:normalPriorityTests')}>{t('translation:normal')}</option>
                  </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">{t('translation:status')}</Label>
                  <select className="col-span-3 w-full px-3 py-2 border rounded" id="edit-status" name="status" defaultValue={translateValue('status', selectedTest.status, t)}>
                    <option value="pending">{t('translation:pending')}</option>
                    <option value="in-progress">{t('translation:inProgress')}</option>
                    <option value="completed">{t('translation:completed')}</option>
                  </select>
                </div>



                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-sampleCollected" className="text-right">{t('translation:sampleCollected')}</Label>
                  <select name="sampleCollected" className="col-span-3 w-full px-3 py-2 border rounded" defaultValue={selectedTest.sampleCollected ? "yes" : "no"}>
                    <option value="yes">{t('translation:yes')}</option>
                    <option value="no">{t('translation:no')}</option>
                  </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-notes" className="text-right">{t('translation:notes')}</Label>
                  <Textarea id="edit-notes" name="notes" defaultValue={selectedTest.notes} className="col-span-3" rows={3} />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedTest(null)}>{t('translation:cancel')}</Button>
                <Button type="submit" className="bg-teal-500 hover:bg-teal-600">{t('translation:updateRequest')}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>


      {/* Add Result Dialog */}
      <Dialog open={showAddResult} onOpenChange={(isOpen) => {
        setTestID(null);
        setShowAddResult(isOpen);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("laboratory.enterTestResultsTitle", "Enter Test Results")}</DialogTitle>
            <DialogDescription>{t('translation:recordResultsForALaboratoryTes')}</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)

              const parameterList = formData.getAll("parameter")
              const valueList = formData.getAll("value")
              const unitList = formData.getAll("unit")
              const referenceRangeList = formData.getAll("referenceRange")

              const results = parameterList?.map((param, index) => ({
                parameter: param,
                value: valueList[index],
                unit: unitList[index],
                referenceRange: referenceRangeList[index],
              }))

              const newResult = {
                labTest: formData.get("labTest"),
                patientId: selectest?.patientId?._id ?? "",
                testName: selectest?.testName ?? "",
                performedBy: formData.get("performedBy"),
                reviewedBy: formData.get("reviewedBy"),
                status: formData.get("status"),
                results,
                comments: formData.get("comments"),
              }

              handleAddResult(newResult)
            }}
          >
            <div className="grid gap-4 py-4">
              {/* Lab Test Select */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="labTest" className="text-right">{t('translation:testId')}</Label>
                <select
                  name="labTest"
                  required
                  defaultValue={(selectest) ? selectest?._id : ""}
                  onChange={(e) => {
                    const selected = testRequests.find((test) => test._id === e.target.value)
                    setTestID(selected)
                  }}
                  className="col-span-3 border rounded p-2"
                >
                  <option value="" >{t('translation:selectTest')}</option>
                  {testRequests
                    ?.filter((test) => test.status !== "completed")
                    ?.map((test) => (
                      <option key={test._id} value={test._id}>
                        {test.id} - {test.testName} ({test.patientId.name})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t('translation:patient')}</Label>
                <Input className="col-span-3 py-1 border " disabled value={selectest?.patientId.name ?? ""} readOnly />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t('translation:testName')}</Label>
                <Input className="col-span-3 py-1 border" disabled value={selectest?.testName ?? ""} readOnly />
              </div>

              <input type="hidden" name="patientId" value={selectest?.patientId.name ?? ""} />
              <input type="hidden" name="testName" value={selectest?.testName ?? ""} />

              {/* Performed By */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("laboratory.performedBy", "Performed By")}</Label>
                <select name="performedBy" required className="col-span-3 border rounded p-2">
                  <option value="" >{t('translation:selectLabTechnician')}</option>
                  {medicalstaffList?.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.id} - ({staff.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Reviewed By */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("laboratory.reviewedBy", "Reviewed By")}</Label>
                <select name="reviewedBy" required className="col-span-3 border rounded p-2">
                  <option value="" >{t('translation:selectReviewer')}</option>
                  {medicalstaffList?.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.id} - ({staff.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t('translation:status')}</Label>
                <select name="status" required className="col-span-3 border rounded p-2">
                  <option value="" >{t('translation:selectStatus')}</option>
                  <option value="normal">{t('translation:normal')}</option>
                  <option value="abnormal">{t('translation:abnormal')}</option>
                </select>
              </div>

              {/* Parameters */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">{t('translation:testParameters')}</h3>
                <div className="space-y-3">
                  {parameters?.map((param, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 relative">
                      <button
                        type="button"
                        onClick={() => handleRemoveParameter(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                        title={t('translation:remove')}
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div>
                        <Label className="text-xs block mb-1">{t('translation:parameter')}</Label>
                        <input
                          name="parameter"
                          value={param.parameter}
                          onChange={(e) =>
                            handleInputChange(index, "parameter", e.target.value)
                          }
                          className="h-8 w-full border border-gray-300 rounded px-2"
                        />
                      </div>
                      <div>
                        <Label className="text-xs block mb-1">{t('translation:value')}</Label>
                        <input
                          name="value"
                          value={param.value}
                          onChange={(e) =>
                            handleInputChange(index, "value", e.target.value)
                          }
                          className="h-8 w-full border border-gray-300 rounded px-2"
                        />
                      </div>
                      <div>
                        <Label className="text-xs block mb-1">{t('translation:unit')}</Label>
                        <input
                          name="unit"
                          value={param.unit}
                          onChange={(e) =>
                            handleInputChange(index, "unit", e.target.value)
                          }
                          className="h-8 w-full border border-gray-300 rounded px-2"
                        />
                      </div>
                      <div>
                        <Label className="text-xs block mb-1">{t('translation:refRange')}</Label>
                        <input
                          name="referenceRange"
                          value={param.referenceRange}
                          onChange={(e) =>
                            handleInputChange(index, "referenceRange", e.target.value)
                          }
                          className="h-8 w-full border border-gray-300 rounded px-2"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleAddParameter}
                  >
                    <Plus className="h-3 w-3 mr-1" />{t('translation:addParameter')}</Button>
                </div>
              </div>
              {/* Comments */}
              <div className="grid grid-cols-4 items-start gap-4 mt-2">
                <Label className="text-right pt-2">{t('translation:comments')}</Label>
                <Textarea name="comments" className="col-span-3" rows={3} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddResult(false)}>{t('translation:cancel')}</Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">{t('translation:saveResults')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


      {/* Edit Result Dialog */}
      {selectedResult && (
        <Dialog open={!!selectedResult} onOpenChange={(open) => !open && setSelectedResult(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t("laboratory.editTestResultsTitle", "Edit Test Results")}</DialogTitle>
              <DialogDescription>{t("laboratory.editTestResultsSub", "Update laboratory test results")}</DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);

                const parameterList = formData.getAll("parameter");
                const valueList = formData.getAll("value");
                const unitList = formData.getAll("unit");
                const referenceRangeList = formData.getAll("referenceRange");

                const results = parameterList.map((param, index) => ({
                  parameter: param,
                  value: valueList[index],
                  unit: unitList[index],
                  referenceRange: referenceRangeList[index],
                }));

                const updatedResult = {
                  ...selectedResult,
                  _id: selectedResult?._id,
                  labTest: selectedResult?.labTest?._id,
                  patientId: selectedResult?.patientId?._id ?? "",
                  // testName: formData.get("testName"),
                  performedBy: formData.get("performedBy"),
                  reviewedBy: formData.get("reviewedBy"),
                  status: formData.get("status"),
                  results,
                  comments: formData.get("comments"),
                };

                handleUpdateResult(updatedResult);
              }}
            >
              <div className="grid gap-4 py-4">
                {/* Static Fields */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t('translation:resultId')}</Label>
                  <Input value={selectedResult.id} disabled className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t('translation:testId')}</Label>
                  <Input name="testId" value={selectedResult.labTest.id} disabled className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t('translation:patient')}</Label>
                  <Input value={selectedResult.patientId?.name} disabled className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t('translation:testName')}</Label>
                  <Input name="testName" disabled defaultValue={selectedResult.testName} className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t("laboratory.performedBy", "Performed By")}</Label>
                  <select name="performedBy" required defaultValue={selectedResult.performedBy._id} className="col-span-3 border rounded p-2">
                    <option value="">{t('translation:selectLabTechnician')}</option>
                    {medicalstaffList?.map((staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.id} - ({staff.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t("laboratory.reviewedBy", "Reviewed By")}</Label>
                  <select name="reviewedBy" required defaultValue={selectedResult.reviewedBy._id} className="col-span-3 border rounded p-2">
                    <option value="">{t('translation:selectReviewer')}</option>
                    {medicalstaffList?.map((staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.id} - ({staff.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t('translation:status')}</Label>
                  <select name="status" required defaultValue={translateValue('status', selectedResult.status, t)} className="col-span-3 border rounded p-2">
                    <option value="">{t('translation:selectStatus')}</option>
                    <option value="normal">{t('translation:normal')}</option>
                    <option value="abnormal">{t('translation:abnormal')}</option>
                  </select>
                </div>

                {/* Editable Parameters */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">{t('translation:testParameters')}</h3>
                  <div className="space-y-3">
                    {editParameters.map((param, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...editParameters];
                            updated.splice(index, 1);
                            setEditParameters(updated);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                          title={t('translation:remove')}
                        >
                          <X className="w-3 h-3" />
                        </button>

                        <div>
                          <Label className="text-xs block mb-1">{t('translation:parameter')}</Label>
                          <input
                            name="parameter"
                            value={param.parameter}
                            onChange={(e) => handleEditParamChange(index, "parameter", e.target.value)}
                            className="h-8 w-full border border-gray-300 rounded px-2"
                          />
                        </div>
                        <div>
                          <Label className="text-xs block mb-1">{t('translation:value')}</Label>
                          <input
                            name="value"
                            value={param.value}
                            onChange={(e) => handleEditParamChange(index, "value", e.target.value)}
                            className="h-8 w-full border border-gray-300 rounded px-2"
                          />
                        </div>
                        <div>
                          <Label className="text-xs block mb-1">{t('translation:unit')}</Label>
                          <input
                            name="unit"
                            value={param.unit}
                            onChange={(e) => handleEditParamChange(index, "unit", e.target.value)}
                            className="h-8 w-full border border-gray-300 rounded px-2"
                          />
                        </div>
                        <div>
                          <Label className="text-xs block mb-1">{t('translation:refRange')}</Label>
                          <input
                            name="referenceRange"
                            value={param.referenceRange}
                            onChange={(e) => handleEditParamChange(index, "referenceRange", e.target.value)}
                            className="h-8 w-full border border-gray-300 rounded px-2"
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() =>
                        setEditParameters((prev) => [
                          ...prev,
                          { parameter: "", value: "", unit: "", referenceRange: "" },
                        ])
                      }
                    >
                      <Plus className="h-3 w-3 mr-1" />{t('translation:addParameter')}</Button>
                  </div>
                </div>

                {/* Comments */}
                <div className="grid grid-cols-4 items-start gap-4 mt-2">
                  <Label className="text-right pt-2">{t('translation:comments')}</Label>
                  <Textarea
                    name="comments"
                    defaultValue={selectedResult.comments}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedResult(null)}>{t('translation:cancel')}</Button>
                <Button type="submit" className="bg-teal-500 hover:bg-teal-600">{t('translation:updateResults')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showReportsModal} onOpenChange={setShowReportsModal} >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]  overflow-y-auto ">
        <DialogHeader>
  <DialogTitle>{t('translation:aiDiagnosticReports')}</DialogTitle>
  <DialogDescription>
    <span>{t('translation:detailedAigeneratedDiagnosticA')}</span>
  </DialogDescription>
  <div className="flex justify-end mb-2">
    <button
      onClick={downloadAllReports}
      className="text-sm bg-primary text-white flex items-center px-3 py-1 rounded hover:bg-primary/90"
    >
      <DownloadCloud size={16} className="mr-2" />{t('translation:downloadAllReports')}</button>
  </div>
</DialogHeader>
          {diagnostics.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('translation:noReportsAvailable')}</p>
          ) : (
            diagnostics.map((report) => {
              const labTest = report.testId?.labTest;
              const patient = report.testId?.patientId;
              const isExpanded = expandedReports[report._id] || false;

              return (
                <div key={report._id} className="p-4 border rounded-lg space-y-2 bg-white dark:bg-zinc-900">
                  {/* Collapsible Header */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpanded(report._id)}
                  >
                    <div>
                      <p className="font-semibold  text-teal-600">{patient?.name}</p>
                      <p className="text-sm">
                        {labTest?.id} - {labTest?.testName}
                      </p>
                    </div>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">{t('translation:patient')}</p>
                          <p className="text-base font-medium">
                            {patient?.name} ({translateValue('gender', patient?.gender, t)},{" "}
                            {new Date().getFullYear() -
                              new Date(patient?.dateOfBirth).getFullYear()}{" "}
                            yrs)
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">{t('translation:test')}</p>
                          <p className="text-base font-medium">{labTest?.testName}</p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">{t('translation:testId')}</p>
                          <p className="text-sm">{labTest?.id}</p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">{t('translation:status')}</p>
                          <p className="text-sm">{translateValue('status', report.testId?.status, t)}</p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">{t('translation:priority')}</p>
                          <p className="text-sm">{labTest?.Priority}</p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">{t('translation:date')}</p>
                          <p className="text-sm">
                            {new Date(report.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Results */}
                      <div>
                        <p className="font-semibold text-muted-foreground mt-2 mb-1">{t('translation:testResults')}</p>
                        <div className="border rounded p-3 bg-background">
                          {report.testId.results.map((result, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-4 gap-4 text-sm py-1"
                            >
                              <span className="font-medium">{result.parameter}</span>
                              <span>Value: {result.value}</span>
                              <span>Unit: {result.unit}</span>
                              <span>Ref: {result.referenceRange}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Summary and Insights */}
                      <div>
                        <p className="font-semibold text-muted-foreground mt-4">{t('translation:aiSummary')}</p>
                        <div className="text-sm text-gray-800 dark:text-gray-300">
                          <ReactMarkdown>{report.summary}</ReactMarkdown>
                        </div>
                      </div>

                      <div>
                        <p className="font-semibold text-muted-foreground mt-2">{t('translation:insights')}</p>
                        <ul className="list-disc pl-5 text-sm text-gray-800 dark:text-gray-300">
                          {report.insights.map((insight, i) => (
                            <li key={i}><ReactMarkdown>{insight}</ReactMarkdown></li>
                          ))}
                        </ul>
                      </div>

                      {/* Anomalies and Patterns */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="font-semibold text-muted-foreground">{t('translation:anomaliesDetected')}</p>
                          <ul className="list-disc pl-5 text-sm text-red-600">
                            {report.anomalies.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="font-semibold text-muted-foreground">{t('translation:detectedPatterns')}</p>
                          <ul className="list-disc pl-5 text-sm text-yellow-800 dark:text-yellow-300">
                            {report.patterns.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Report Footer */}
                      <div className="mt-4">
                        <p className="font-semibold text-muted-foreground">{t('translation:aiGeneratedReport')}</p>
                        <pre className="text-sm whitespace-pre-wrap bg-background p-3 border rounded">
                          {report.autoGeneratedReport}
                        </pre>
                      </div>

                      <div className="text-xs text-muted-foreground flex justify-between mt-2">
                        <span>Accuracy: {report.accuracy}%</span>
                        <span>Time Saved: {report.processingTimeReduction}%</span>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => generatePDF(report)}
                          className="text-sm bg-muted text-foreground px-3 flex items-center py-1 rounded hover:bg-muted/80"
                        >
                          <DownloadCloud size={16} className="mr-2" />{t('translation:downloadThisReport')}</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}


// Subcomponents
function InsightCard({ title, value, subtitle, icon, bg }) {
  return (
    <Card>
      <CardContent className="p-4 mt-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className={`${bg} p-2 rounded-full`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightRow({ title, desc, icon, bg, buttonText, onButtonClick }) {
  return (
    <div className={`flex items-center gap-3 p-3 ${bg} rounded-md`}>
      <div className="p-2 rounded-full bg-opacity-50">{icon}</div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Button
        size="sm"
        className="bg-teal-500 hover:bg-teal-600"
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </div>
  );
}
