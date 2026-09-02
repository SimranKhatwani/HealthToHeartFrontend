import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Label from "../../components/UI/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/UI/Tabs";
import Badge from "../../components/UI/Badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/UI/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/UI/Table";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/UI/Avatar";
import {
    Filter, Download, Search, FileText, Calendar,
    Pill, Activity, Bell, File, Send
} from 'lucide-react';
import { useGetPatientDetailsQuery } from '../../redux/slices/patientSlice';
import { useGetDoctorsQuery } from '../../redux/slices/doctorSlice';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import NotificationCenter from '../../components/NotificationCenter';
import MessageBox from './MessageBox';
import { useTranslation } from "react-i18next";
import { translateValue } from '../../utilis/translate';

export default function PatientPortal() {
    const { t } = useTranslation();
    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [showPrescriptionDetails, setShowPrescriptionDetails] = useState(false);
    const [showBookAppointmentDialog, setShowBookAppointmentDialog] = useState(false);
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [showMessageDialog, setShowMessageDialog] = useState(false)
    const [exportOptions, setExportOptions] = useState({
        startDate: '',
        endDate: '',
        includeAppointments: true,
        includePrescriptions: true,
        includeMedicalRecords: true,
    });
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showRecordDetails, setShowRecordDetails] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    // Appointment booking state
    const [doctors, setDoctors] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedSchedule, setSelectedSchedule] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [selectedTest, setSelectedTest] = useState(null);
    const [showTestReport, setShowTestReport] = useState(false);
    const [PendingAppointments, setPendingAppointments] = useState();
    const [formData, setFormData] = useState({
        reason: "",
    });

    // Get user details from location state
    const location = useLocation();
    const { userDetails } = location.state || {};

    // API queries
    const { data: patientResponse, isLoading: patientLoading } = useGetPatientDetailsQuery(userDetails);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const roleName = "Doctor";
                const orgId = patientResponse.data.org_id._id;
                const response = await axios.get(`${apiUrl}/medicalstaff/${roleName}`, {
                    params: { orgId }
                });
                setDoctors(response.data.data);
            } catch (error) {
            }
        };

        if (patientResponse?.data?.org_id) {
            fetchDoctors();
        }
    }, [patientResponse]);


    // Set doctors data when it's loaded
    // useEffect(() => {
    //     if (doctorsData?.data) {
    //         console.log("doctorsData", doctorsData);
    //         setDoctors(doctorsData.data);
    //         // Pre-fill patient data if available
    //         if (patientResponse?.data) {
    //             setFormData({
    //                 patientName: patientResponse.data.name || "",
    //                 patientEmail: patientResponse.data.email || "",
    //                 patientPhone: patientResponse.data.phone || "",
    //             });
    //         }
    //     }
    // }, [doctorsData, patientResponse]);

    // Fetch schedules when doctor is selected
    useEffect(() => {
        if (selectedDoctor) {
            try {
                axios.get(`${apiUrl}/schedules/${selectedDoctor}`)
                    .then(res => setSchedules(res.data.data));
            } catch (error) {
                // console.error("Error fetching schedules:", error);
            }
        }
    }, [selectedDoctor]);

    // Update time slots when schedule is selected
    useEffect(() => {
        const selected = schedules.find(sch => sch._id === selectedSchedule);
        // console.log("selected", selected);
        if (selected) {
            setTimeSlots(selected.slots || []);
        } else {
            setTimeSlots([]);
        }
    }, [selectedSchedule, schedules]);

    // Fetch pending appointments
    useEffect(() => {
        const fetchPendingAppointments = async () => {
            try {
                const response = await axios.get(`${apiUrl}/pending-appointments/patient/${patientResponse.data._id}`);
                const newAppointments = response.data.data || [];
                const updatedAppointments = [...patientResponse?.data?.appointments, ...newAppointments];
                setPendingAppointments(updatedAppointments);

                // console.log("PendingAppointments", response.data.data);

            } catch (error) {
                // console.error("Error fetching pending appointments:", error);
            }
        }

        fetchPendingAppointments();
    }, [patientResponse]);

    // Extract all needed data from the patient response
    const patientData = patientResponse?.data;
    const prescriptions = patientData?.prescriptions?.map(p => p.prescriptionId) || [];
    const appointments = PendingAppointments || [];
    // console.log("appointments", appointments);
    const medicalRecords = patientData?.medicalHistory || [];
    const labTests = patientData?.labTests || [];

    const messageData = patientResponse?.data?.messages
    // console.log("messageData", messageData)
    // Filter prescriptions based on search query
    const filteredPrescriptions = prescriptions.filter(
        (prescription) =>
            prescription?.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prescription?.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prescription?.prescription?.some(med =>
                med?.medicineName?.toLowerCase().includes(searchQuery.toLowerCase())
            )
    );

    // Filter appointments based on search query
    const filteredAppointments = appointments.filter(
        (appointment) =>
            appointment?.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment?.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            new Date(appointment?.slotTime).toLocaleDateString().includes(searchQuery)
    );

    // Event handlers
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleBookAppointment = async () => {
        try {
            const payload = {
                doctorId: selectedDoctor,
                scheduleId: selectedSchedule,
                appointmentDate: selectedDate,
                slotTime: selectedTimeSlot,
                patientId: patientData._id,
                org_id: patientData.org_id._id,
                reason: formData.reason


            };

            const res = await axios.post(`${apiUrl}/pending-appointments`, payload);
            toast.success(res.data.message || "Appointment request sent!");
            setShowBookAppointmentDialog(false);
        } catch (err) {
            // console.error(err);
            toast.error(t('translation:failedToSubmitAppointmentReque'));
        }
    };

    // Download handler function that was missing
    const handleDownload = (type, id, data) => {
        // console.log("data", data);
        // console.log("type", type);
        // console.log("id", id);
        // console.log("data", data);


        // Function to create a PDF with basic formatting and trigger download
        const downloadPDF = (content, filename) => {
            // Create a script element to load jsPDF if not already loaded
            if (typeof jsPDF === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                script.onload = () => {
                    // Load the autotable plugin
                    const autoTableScript = document.createElement('script');
                    autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js';
                    autoTableScript.onload = () => {
                        generateAndDownloadPDF(content, filename);
                    };
                    document.head.appendChild(autoTableScript);
                };
                document.head.appendChild(script);
            } else {
                generateAndDownloadPDF(content, filename);
            }
        };
    
        // Function that actually generates the PDF once libraries are loaded
        const generateAndDownloadPDF = (content, filename) => {
            try {
                // Show loading toast if available
                const loadingToast = toast?.loading ? toast.loading(`Preparing ${type} for download...`) : null;
                
                // Create PDF document
                const doc = new jspdf.jsPDF();
                const pageWidth = doc.internal.pageSize.getWidth();
    
                // Add organization name
                doc.setFontSize(16);
                doc.setTextColor(23, 107, 107); // Teal color
                doc.text(`${patientData?.org_id?.org_name || 'Healthcare Portal'}`, pageWidth / 2, 15, { align: 'center' });
    
                // Add document title
                doc.setFontSize(14);
                doc.setTextColor(41, 128, 185);
                doc.text(`${content.title}`, pageWidth / 2, 25, { align: 'center' });
    
                // Add generation date
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    
                // Add patient information section
                doc.setFontSize(12);
                doc.setTextColor(52, 73, 94);
                doc.text('Patient Information', 20, 40);
    
                // Patient info table
                doc.autoTable({
                    startY: 45,
                    head: [['Field', 'Details']],
                    body: [
                        ['Name', patientData?.name || 'N/A'],
                        ['Patient ID', patientData?.id || 'N/A'],
                        ['Blood Group', patientData?.bloodGroup || 'Not specified'],
                        ['Primary Doctor', patientData?.doctorAssigned?.name || 'Not assigned']
                    ],
                    theme: 'grid',
                    styles: { fontSize: 10 },
                    headStyles: { fillColor: [23, 107, 107], textColor: 255 }
                });
    
                // Add type-specific content using your existing functions
                let startY = doc.lastAutoTable.finalY + 10;
    
                // Call the appropriate function based on document type
                switch (type) {
                    case 'Prescription':
                        generatePrescriptionPDF(doc, id, startY);
                        break;
                        
                    case 'MedicalRecord':
                        generateMedicalRecordPDF(doc, id, startY);
                        break;
                        
                    case 'Report':
                        generateReportPDF(doc, id, startY);
                        break;
                        
                    case 'MedicalRecords':
                        generateMedicalRecordsExportPDF(doc, data, startY);
                        break;
                    
                    default:
                        throw new Error('Invalid document type');
                }
    
                // Add footer with disclaimer
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text('This document contains confidential medical information.', 105, 280, { align: 'center' });
                doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });
    
                // Save and download the PDF
                doc.save(filename);
                
                // Dismiss loading toast and show success message if toast is available
                if (loadingToast && toast?.dismiss) {
                    toast.dismiss(loadingToast);
                    toast.success(`${type} downloaded successfully!`);
                }
            } catch (error) {
                // console.error('Error generating PDF:', error);
                
                // Show error toast if available, otherwise use alert
                if (toast?.error) {
                    toast.error(`Error downloading ${type}: ${error.message}`);
                } else {
                    alert(`Could not generate PDF: ${error.message}. Falling back to text download...`);
                }
    
                // Fallback to text download if PDF generation fails
                fallbackToTextDownload(content, filename.replace('.pdf', '.txt'));
            }
        };
    
        // Fallback function to download as text if PDF fails
        const fallbackToTextDownload = (content, filename) => {
            let textContent = `${content.title}\n`;
            textContent += "=======================================\n";
            textContent += `Patient: ${patientData?.name || 'N/A'}\n`;
            textContent += `Patient ID: ${patientData?.id || 'N/A'}\n`;
            textContent += `Generated on: ${new Date().toLocaleString()}\n`;
            textContent += "=======================================\n\n";
    
            // Add more content based on type...
            if (content.data) {
                textContent += JSON.stringify(content.data, null, 2);
            }
    
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
    
        try {
            // Get filename using your existing function
            const filename = getFilename(type, id);
            
            // Prepare content based on document type
            switch (type) {
                case 'Prescription': {
                    const prescription = prescriptions.find(p => p.id === id);
                    if (!prescription) {
                        throw new Error('Prescription data not found.');
                    }
    
                    const content = {
                        title: 'PRESCRIPTION',
                        data: prescription
                    };
    
                    downloadPDF(content, filename);
                    break;
                }
    
                case 'MedicalRecord': {
                    const record = medicalRecords.find(r => r._id === id);
                    if (!record) {
                        throw new Error('Medical record data not found.');
                    }
    
                    const content = {
                        title: 'MEDICAL RECORD',
                        data: record
                    };
    
                    downloadPDF(content, filename);
                    break;
                }
                
                case 'Report': {
                
                    let report = labTests?.report?.find(r => r._id?.toString() === id?.toString());
                
                    // Fetch the report on demand if not found
                    if (!report) {
                        // console.log('Fetching report manually...');
                        
                    }
                
                    const content = {
                        title: 'MEDICAL REPORT',
                        data: report
                    };
                
                    downloadPDF(content, filename);
                    break;
                }
                
                
    
                case 'MedicalRecords': {
                    const content = {
                        title: 'MEDICAL RECORDS EXPORT',
                        data: data
                    };
    
                    downloadPDF(content, filename);
                    break;
                }
    

                default:
                    throw new Error('Unknown document type requested.');
            }
        } catch (error) {
            // console.error('Download error:', error);
            if (toast?.error) {
                toast.error(error.message);
            } else {
                alert(error.message);
            }
        }
    };
     // Helper functions for different document types
     const generatePrescriptionPDF = (doc, id, startY) => {
        // Find the prescription by ID
        const prescription = prescriptions.find(p => p.id === id);
        if (!prescription) throw new Error('Prescription not found');
        
        // Add prescription details
        doc.setFontSize(12);
        doc.text(`Prescription ID: ${prescription.id}`, 15, startY);
        doc.text(`Date: ${formatDate(prescription.consultationDate)}`, 15, startY + 7);
        doc.text(`Doctor: ${prescription.doctor?.name || 'Unknown'}`, 15, startY + 14);
        doc.text(`Diagnosis: ${prescription.diagnosis}`, 15, startY + 21);
        
        // Add medications table
        startY += 30;
        doc.setFontSize(12);
        doc.text('Medications:', 15, startY);
        
        const tableColumns = ['Medicine', 'Dosage', 'Duration', 'Status'];
        const tableRows = prescription.prescription.map(medicine => {
            const daysRemaining = calculateDaysRemaining(prescription.consultationDate, medicine.duration);
            return [
                medicine.medicineName,
                medicine.dosage,
                medicine.duration,
                daysRemaining === t('translation:completed') ? t('translation:completed') : `${daysRemaining} days left`
            ];
        });
        
        doc.autoTable({
            startY: startY + 5,
            head: [tableColumns],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [23, 107, 107] },
        });
        
        // Add notes if available
        if (prescription.notes) {
            const finalY = doc.previousAutoTable.finalY + 10;
            doc.text('Additional Notes:', 15, finalY);
            doc.setFontSize(11);
            doc.text(prescription.notes, 15, finalY + 7);
        }
    };
    
    const generateMedicalRecordPDF = (doc, id, startY) => {
        // Find the medical record by ID
        const record = medicalRecords.find(r => r._id === id);
        if (!record) throw new Error('Medical record not found');
        
        // Add record details
        doc.setFontSize(12);
        doc.text(`Date: ${formatDate(record.date)}`, 15, startY);
        doc.text(`Diagnosis: ${record.diagnosis}`, 15, startY + 7);
        doc.text(`Doctor: ${record.doctor?.name || 'Unknown'}`, 15, startY + 14);
        doc.text(`Treatment: ${record.treatment}`, 15, startY + 21);
        
        startY += 30;
        
        // Add vitals if available
        if (record.vitals) {
            doc.setFontSize(12);
            doc.text('Vitals:', 15, startY);
            
            const vitalsData = [
                ['Blood Pressure', record.vitals.bloodPressure || 'N/A'],
                ['Heart Rate', (record.vitals.heartRate || 'N/A') + ' bpm'],
                ['Temperature', (record.vitals.temperature || 'N/A') + ' °F'],
                ['Respiratory Rate', (record.vitals.respiratoryRate || 'N/A') + ' bpm']
            ];
            
            doc.autoTable({
                startY: startY + 5,
                head: [['Measurement', 'Value']],
                body: vitalsData,
                theme: 'grid',
                headStyles: { fillColor: [23, 107, 107] },
            });
            
            startY = doc.previousAutoTable.finalY + 10;
        }
        
        // Add lab results if available
        if (record.labResults && record.labResults.length > 0) {
            doc.setFontSize(12);
            doc.text('Lab Results:', 15, startY);
            
            const labRows = record.labResults.map(result => [
                result.test,
                result.result,
                result.referenceRange
            ]);
            
            doc.autoTable({
                startY: startY + 5,
                head: [['Test', 'Result', 'Reference Range']],
                body: labRows,
                theme: 'grid',
                headStyles: { fillColor: [23, 107, 107] },
            });
        }
        
        // Add notes if available
        if (record.notes) {
            const finalY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : startY;
            doc.text('Notes:', 15, finalY);
            doc.setFontSize(11);
            doc.text(record.notes, 15, finalY + 7);
        }
    };
    
    const generateReportPDF = (doc, id, startY) => {
        // Find the test report
        const report = (Array.isArray(selectedTest) ? selectedTest.find(r => r._id === id) : null) || 
                       labTests.flatMap(t => t.report || []).find(r => r._id === id);
        
        if (!report) throw new Error('Report not found');
        
        // Add report details
        doc.setFontSize(12);
        doc.text(`Report ID: ${report.id}`, 15, startY);
        doc.text(`Test Name: ${report.testName}`, 15, startY + 7);
        doc.text(`Status: ${translateValue('status', report.status, t)}`, 15, startY + 14);
        doc.text(`Result Date: ${formatDate(report.resultDate)}`, 15, startY + 21);
        doc.text(`Performed By: ${report.performedBy?.name || 'Unknown'}`, 15, startY + 28);
        doc.text(`Reviewed By: ${report.reviewedBy?.name || 'Unknown'}`, 15, startY + 35);
        
        startY += 45;
        
        // Add test results table if available
        if (report.results && report.results.length > 0) {
            doc.setFontSize(12);
            doc.text('Test Results:', 15, startY);
            
            const resultRows = report.results.map(result => [
                result.parameter,
                result.value,
                result.unit,
                result.referenceRange
            ]);
            
            doc.autoTable({
                startY: startY + 5,
                head: [['Parameter', 'Value', 'Unit', 'Reference Range']],
                body: resultRows,
                theme: 'grid',
                headStyles: { fillColor: [23, 107, 107] },
            });
        }
        
        // Add comments if available
        if (report.comments) {
            const finalY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : startY;
            doc.text('Comments:', 15, finalY);
            doc.setFontSize(11);
            doc.text(report.comments, 15, finalY + 7);
        }
    };
    
    const generateMedicalRecordsExportPDF = (doc, options, startY) => {
        // Add export details
        doc.setFontSize(12);
        doc.text('Export Information:', 15, startY);
        doc.setFontSize(10);
        
        if (options.startDate && options.endDate) {
            doc.text(`Date Range: ${formatDate(new Date(options.startDate))} to ${formatDate(new Date(options.endDate))}`, 15, startY + 7);
        } else {
            doc.text('Date Range: All records', 15, startY + 7);
        }
        
        let currentY = startY + 14;
        
        // Add prescriptions if included
        if (options.includePrescriptions && prescriptions.length > 0) {
            doc.addPage();
            doc.setFontSize(14);
            doc.text('Prescriptions', pageWidth / 2, 15, { align: 'center' });
            
            // Filter prescriptions by date range if specified
            const filteredPrescriptions = options.startDate && options.endDate 
                ? prescriptions.filter(p => {
                    const date = new Date(p.consultationDate);
                    return date >= new Date(options.startDate) && date <= new Date(options.endDate);
                  })
                : prescriptions;
                
            // Add prescriptions table
            const prescriptionRows = filteredPrescriptions.map(p => [
                p.id,
                formatDate(p.consultationDate),
                p.diagnosis,
                p.doctor?.name || 'Unknown',
                p.filled ? 'Filled' : t('translation:active')
            ]);
            
            doc.autoTable({
                startY: 25,
                head: [['ID', 'Date', 'Diagnosis', 'Doctor', 'Status']],
                body: prescriptionRows,
                theme: 'grid',
                headStyles: { fillColor: [23, 107, 107] },
            });
        }
        
        // Add appointments if included
        if (options.includeAppointments && appointments.length > 0) {
            doc.addPage();
            doc.setFontSize(14);
            doc.text('Appointments', pageWidth / 2, 15, { align: 'center' });
            
            // Filter appointments by date range if specified
            const filteredAppointments = options.startDate && options.endDate 
                ? appointments.filter(a => {
                    const date = new Date(a.slotTime);
                    return date >= new Date(options.startDate) && date <= new Date(options.endDate);
                  })
                : appointments;
                
            // Add appointments table
            const appointmentRows = filteredAppointments.map(a => [
                formatDate(a.slotTime),
                new Date(a.slotTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
                a.doctorId?.name || 'Unknown',
                a.reason || 'Regular checkup',
                a.status
            ]);
            
            doc.autoTable({
                startY: 25,
                head: [['Date', 'Time', 'Doctor', 'Reason', 'Status']],
                body: appointmentRows,
                theme: 'grid',
                headStyles: { fillColor: [23, 107, 107] },
            });
        }
        
        // Add medical records if included
        if (options.includeMedicalRecords && medicalRecords.length > 0) {
            doc.addPage();
            doc.setFontSize(14);
            doc.text('Medical Records', pageWidth / 2, 15, { align: 'center' });
            
            // Filter records by date range if specified
            const filteredRecords = options.startDate && options.endDate 
                ? medicalRecords.filter(r => {
                    const date = new Date(r.date);
                    return date >= new Date(options.startDate) && date <= new Date(options.endDate);
                  })
                : medicalRecords;
                
            // Add medical records table
            const recordRows = filteredRecords.map(r => [
                formatDate(r.date),
                r.diagnosis,
                r.treatment,
                r.doctor?.name || 'Unknown'
            ]);
            
            doc.autoTable({
                startY: 25,
                head: [['Date', 'Diagnosis', 'Treatment', 'Doctor']],
                body: recordRows,
                theme: 'grid',
                headStyles: { fillColor: [23, 107, 107] },
            });
        }
    };
    
    // Helper function to get appropriate filename
    const getFilename = (type, id) => {
        const timestamp = new Date().toISOString().slice(0, 10);
        switch (type) {
            case 'Prescription':
                return `Prescription_${id}_${timestamp}.pdf`;
            case 'MedicalRecord':
                return `MedicalRecord_${id}_${timestamp}.pdf`;
            case 'Report':
                return `LabReport_${id}_${timestamp}.pdf`;
            case 'MedicalRecords':
                return `MedicalRecords_Export_${timestamp}.pdf`;
            default:
                return `Document_${timestamp}.pdf`;
        }
    };


    // Calculate days remaining for medication
    const calculateDaysRemaining = (startDate, duration) => {
        const start = new Date(startDate);
        const durationMatch = duration.match(/(\d+)\s*(day|days|week|weeks|month|months)/i);

        if (!durationMatch) return "Unknown";

        const value = parseInt(durationMatch[1]);
        const unit = durationMatch[2].toLowerCase();

        let daysToAdd = 0;
        if (unit.includes('day')) daysToAdd = value;
        else if (unit.includes('week')) daysToAdd = value * 7;
        else if (unit.includes('month')) daysToAdd = value * 30;

        const endDate = new Date(start);
        endDate.setDate(start.getDate() + daysToAdd);

        const today = new Date();
        const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

        return remainingDays > 0 ? remainingDays : t('translation:completed');
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Loading state
    if (patientLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
                    <p className="mt-4 text-gray-600">{t('translation:loadingYourMedicalInformation')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='p-6'>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">{t("patients.myHealthPortal", "My Health Portal")} -{" "} <span className="text-teal-500">"{patientData?.org_id?.org_name}"</span></h1>
                <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
                    <Button
                        className="bg-teal-500 hover:bg-teal-600 w-full sm:w-auto"
                        onClick={() => setShowBookAppointmentDialog(true)}
                    >
                        <Calendar className="h-4 w-4 mr-2" />
                        {t("patients.bookAppointment", "Book Appointment")}
                    </Button>
                    <NotificationCenter/>
                </div>
            </div>

            {/* Patient Profile Summary */}
            <Card className="border border-gray-200 mb-6 bg-gradient-to-r from-teal-50 to-blue-50">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <Avatar className="h-20 w-20 border-2 border-teal-500">
                            <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
                                {patientData?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold">{patientData?.name}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <div>
                                    <p className="text-sm text-gray-500">{t("patients.patientId", "Patient ID")}</p>
                                    <p className="font-medium">{patientData?.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{t("patients.bloodGroup", "Blood Group")}</p>
                                    <p className="font-medium">{patientData?.bloodGroup || t("common.notSpecified", "Not specified")}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{t("common.doctor", "Doctor")}</p>
                                    <p className="font-medium">{patientData?.doctorAssigned?.name || t("common.notAssigned", "Not assigned")}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                                {t("patients.activePatient", "Active Patient")}
                            </Badge>
                            <p className="text-sm text-gray-500">{t("patients.lastVisit", "Last Visit:")} {patientData?.lastVisit ? formatDate(patientData.lastVisit) : t("patients.noRecentVisits", "No recent visits")}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 ">
                        <div className="flex justify-between pt-3 items-start ">
                            <div>
                                <h3 className="font-medium">{t('translation:upcomingAppointments')}</h3>
                                <p className="text-3xl font-bold mt-2">
                                    {appointments?.filter(a => a.status === 'scheduled').length || 0}
                                </p>
                            </div>
                            <div className="bg-green-100 p-2 rounded-full">
                                <Calendar className="h-5 w-5 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex justify-between pt-3 items-start">
                            <div>
                                <h3 className="font-medium">{t('translation:activePrescriptions')}</h3>
                                <p className="text-3xl font-bold mt-2">
                                    {prescriptions?.filter(p => !p.filled).length || 0}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-full">
                                <Pill className="h-5 w-5 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                        <div className="flex justify-between pt-3 items-start">
                            <div>
                                <h3 className="font-medium">{t('translation:recentMedicalRecords')}</h3>
                                <p className="text-3xl font-bold mt-2">
                                    {medicalRecords?.length || 0}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-2 rounded-full">
                                <FileText className="h-5 w-5 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="flex items-center mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t('translation:searchPrescriptionsAppointment')}
                        className="pl-8 w-full border border-gray-200 p-2 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-300 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {/* <Button variant="outline" size="icon" className="ml-2">
                    <Filter className="h-4 w-4" />
                </Button> */}
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => {
                        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
                        // Set default date to 30 days ago
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        const startDateStr = thirtyDaysAgo.toISOString().split('T')[0];
                        
                        setExportOptions({
                          ...exportOptions,
                          startDate: startDateStr,
                          endDate: today
                        });
                        setShowExportDialog(true);
                      }}
                >
                    <Download className="h-4 w-4 mr-2" />{t('translation:export')}</Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="prescriptions" className="mb-6">
                <TabsList className="bg-teal-100 gap-3">
                    <TabsTrigger value="prescriptions" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">{t('translation:prescriptions')}</TabsTrigger>
                    <TabsTrigger value="appointments" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">{t('translation:appointments')}</TabsTrigger>
                    <TabsTrigger value="medicalHistory" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">{t('translation:medicalHistory')}</TabsTrigger>
                    <TabsTrigger value="payments" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">{t('translation:payments')}</TabsTrigger>
                    <TabsTrigger value="labTests" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white ">{t('translation:tests')}</TabsTrigger>
                    <TabsTrigger value="messages" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white ">{t('translation:messages')}</TabsTrigger>
                </TabsList>

                {/* Prescriptions Tab */}
                <TabsContent value="prescriptions" className="mt-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>{t('translation:myPrescriptions')}</CardTitle>
                            <CardDescription>{t('translation:viewAllYourMedicationPrescript')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredPrescriptions?.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('translation:id')}</TableHead>
                                            <TableHead>{t('translation:date')}</TableHead>
                                            <TableHead>{t('translation:diagnosis')}</TableHead>
                                            <TableHead>{t('translation:doctor')}</TableHead>
                                            <TableHead>{t('translation:status')}</TableHead>
                                            <TableHead className="text-right">{t('translation:action')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPrescriptions.map((prescription) => (
                                            <TableRow key={prescription._id}>
                                                <TableCell className="font-medium">{prescription.id}</TableCell>
                                                <TableCell>{formatDate(prescription.consultationDate)}</TableCell>
                                                <TableCell>{prescription.diagnosis}</TableCell>
                                                <TableCell>{prescription.doctor?.name || 'Unknown'}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={prescription.filled ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}
                                                    >
                                                        {prescription.filled ? "Filled" : t('translation:active')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedPrescription(prescription);
                                                            setShowPrescriptionDetails(true);
                                                        }}>{t('translation:viewDetails')}</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-6">
                                    <Pill className="h-10 w-10 mx-auto text-gray-300" />
                                    <p className="mt-2 text-gray-500">{t('translation:noPrescriptionsFound')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Appointments Tab */}
                <TabsContent value="appointments" className="mt-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>{t('translation:myAppointments')}</CardTitle>
                            <CardDescription>{t('translation:viewAndManageYourScheduledAppo')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredAppointments?.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('translation:dateTime')}</TableHead>
                                            <TableHead>{t('translation:doctor')}</TableHead>
                                            <TableHead>{t('translation:reason')}</TableHead>
                                            <TableHead>{t('translation:status')}</TableHead>
                                            <TableHead className="text-right">{t('translation:action')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAppointments.map((appointment) => (
                                            <TableRow key={appointment._id}>
                                                <TableCell>
                                                    {new Date(appointment.slotTime).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(appointment.slotTime).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </TableCell>
                                                <TableCell>{appointment.doctorId?.name || 'Unknown'}</TableCell>
                                                <TableCell>{appointment.reason || "Regular checkup"}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            appointment.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                                                                appointment.status === "completed" ? "bg-green-100 text-green-800" :
                                                                    appointment.status === "cancelled" ? "bg-red-100 text-red-800" :
                                                                        "bg-amber-100 text-amber-800"
                                                        }
                                                    >
                                                        {translateValue('status', appointment.status, t)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={appointment.status !== "scheduled"}>
                                                        {appointment.status === "scheduled" ? "Reschedule" : "View"}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-6">
                                    <Calendar className="h-10 w-10 mx-auto text-gray-300" />
                                    <p className="mt-2 text-gray-500">{t('translation:noAppointmentsFound')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Medical History Tab */}
                <TabsContent value="medicalHistory" className="mt-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>{t('translation:medicalHistory')}</CardTitle>
                            <CardDescription>{t('translation:viewYourPastMedicalRecordsAndD')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {medicalRecords?.length > 0 ? (
                                <div className="space-y-6">
                                    {medicalRecords.map((record, index) => (
                                        <Card key={index} className="border border-gray-200">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <CardTitle className="text-base">{record.diagnosis}</CardTitle>
                                                        <CardDescription>
                                                            {formatDate(record.date)}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <dt className="text-gray-500">{t('translation:treatment')}</dt>
                                                        <dd className="font-medium mt-1">{record.treatment}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-gray-500">{t('translation:doctor')}</dt>
                                                        <dd className="font-medium mt-1">{record.doctor?.name || "Unknown"}</dd>
                                                    </div>
                                                </dl>
                                                <Button
                                                    className="mt-4"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedRecord(record);
                                                        setShowRecordDetails(true);
                                                    }}
                                                >
                                                    <File className="h-4 w-4 mr-2" />{t('translation:viewFullReport')}</Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <FileText className="h-10 w-10 mx-auto text-gray-300" />
                                    <p className="mt-2 text-gray-500">{t('translation:noMedicalRecordsFound')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payments Tab - Empty state */}
                <TabsContent value="payments" className="mt-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>{t('translation:paymentHistory')}</CardTitle>
                            <CardDescription>{t('translation:viewYourPaymentHistoryAndInvoi')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-6">
                                <Activity className="h-10 w-10 mx-auto text-gray-300" />
                                <p className="mt-2 text-gray-500">{t('translation:noPaymentRecordsFound')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Lab Tests Tab */}
                <TabsContent value="labTests" className="mt-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>{t('translation:labTests')}</CardTitle>
                            <CardDescription>{t('translation:viewLabTestResultsAndReports')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {labTests?.length > 0 ? (
                                <div className="space-y-6">
                                    {labTests.map((test, index) => (
                                        <Card key={index} className="border border-gray-200">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-base">{test.testName}</CardTitle>
                                                        <CardDescription>
                                                            {formatDate(test.requestDate)}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge className={`${test.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"}`}
                                                    >
                                                        {translateValue('status', test.status, t)}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <dt className="text-gray-500">{t('translation:priority')}</dt>
                                                        <dd className="font-medium mt-1">{test.Priority}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-gray-500">{t('translation:requestedBy')}</dt>
                                                        <dd className="font-medium mt-1">{test.DoctorId?.name || "N/A"}</dd>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <dt className="text-gray-500">{t('translation:notes')}</dt>
                                                        <dd className="font-medium mt-1">{test.notes || "None"}</dd>
                                                    </div>
                                                </dl>

                                                {test.report?.length > 0 && (
                                                    <Button
                                                        className="mt-4"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedTest(test.report);
                                                            setShowTestReport(true);
                                                        }}
                                                    >
                                                        <File className="h-4 w-4 mr-2" />{t('translation:viewTestReport')}</Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">{t('translation:noLabTestsAvailable')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Message Tab */}
                <TabsContent value="messages" className="mt-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>{t('translation:message')}</CardTitle>
                            <CardDescription>{t('translation:messagesReceived')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {messageData?.map((msg) => (
                                <>
                                <div key={msg._id} className='w-full p-2 border-2 border-gray-200 my-2 rounded-xl shadow-lg shadow-gray-300 flex justify-between'>
                                    <div>
                                        <p> Subject: {msg.subject}</p>
                                        <p> Message:{msg.message}</p>
                                    </div>
                                    {/* <button 
                                    className="flex items-center p-2 text-teal-600 hover:text-teal-800"
                                    onClick={()=>setShowMessageDialog(true)}
                                    >
                                    <Send className="h-4 w-4 mr-2" />
                                        Reply
                                    </button> */}
                                </div>
                                <MessageBox 
                                showMessageDialog={showMessageDialog} 
                                setShowMessageDialog={setShowMessageDialog}
                                msg={msg}
                                />
                                </>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>

            {/* Prescription Detail Dialog */}
            <Dialog open={showPrescriptionDetails} onOpenChange={setShowPrescriptionDetails}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{t('translation:prescriptionDetails')}</DialogTitle>
                        <DialogDescription>
                            Prescription ID: {selectedPrescription?.id} • {selectedPrescription && formatDate(selectedPrescription.consultationDate)}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPrescription && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">{t('translation:doctor')}</p>
                                    <p className="font-medium">{selectedPrescription.doctor?.name || 'Unknown'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{t('translation:diagnosis')}</p>
                                    <p className="font-medium">{selectedPrescription.diagnosis}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">{t('translation:medications')}</h4>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t('translation:medicine')}</TableHead>
                                            <TableHead>{t('translation:dosage')}</TableHead>
                                            <TableHead>{t('translation:duration')}</TableHead>
                                            <TableHead>{t('translation:status')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedPrescription.prescription.map((medicine, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{medicine.medicineName}</TableCell>
                                                <TableCell>{medicine.dosage}</TableCell>
                                                <TableCell>{medicine.duration}</TableCell>
                                                <TableCell>
                                                    {calculateDaysRemaining(selectedPrescription.consultationDate, medicine.duration) === t('translation:completed') ? (
                                                        <Badge className="bg-gray-100 text-gray-800">{t('translation:completed')}</Badge>
                                                    ) : (
                                                        <Badge className="bg-green-100 text-green-800">
                                                            {calculateDaysRemaining(selectedPrescription.consultationDate, medicine.duration)} days left
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {selectedPrescription.notes && (
                                <div>
                                    <h4 className="font-medium mb-1">{t('translation:additionalNotes')}</h4>
                                    <p className="text-gray-700">{selectedPrescription.notes}</p>
                                </div>
                            )}

                            <DialogFooter>
                                <Button
                                    className="bg-teal-500 hover:bg-teal-600"
                                    onClick={() => {
                                        handleDownload('Prescription', selectedPrescription.id);
                                        setShowPrescriptionDetails(false);
                                    }}
                                >
                                    <Download className="h-4 w-4 mr-2" />{t('translation:downloadPdf')}</Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Export Dialog */}
            <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{t('translation:exportMedicalRecords')}</DialogTitle>
                        <DialogDescription>{t('translation:selectDateRangeAndInformationT')}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">{t('translation:startDate')}</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={exportOptions.startDate}
                                    onChange={(e) => setExportOptions({ ...exportOptions, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">{t('translation:endDate')}</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={exportOptions.endDate}
                                    onChange={(e) => setExportOptions({ ...exportOptions, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('translation:includeInformation')}</Label>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="includePrescriptions"
                                        checked={exportOptions.includePrescriptions}
                                        onChange={(e) => setExportOptions({ ...exportOptions, includePrescriptions: e.target.checked })}
                                    />
                                    <label htmlFor="includePrescriptions">{t('translation:prescriptions')}</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="includeAppointments"
                                        checked={exportOptions.includeAppointments}
                                        onChange={(e) => setExportOptions({ ...exportOptions, includeAppointments: e.target.checked })}
                                    />
                                    <label htmlFor="includeAppointments">{t('translation:appointments')}</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="includeMedicalRecords"
                                        checked={exportOptions.includeMedicalRecords}
                                        onChange={(e) => setExportOptions({ ...exportOptions, includeMedicalRecords: e.target.checked })}
                                    />
                                    <label htmlFor="includeMedicalRecords">{t('translation:medicalRecords')}</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowExportDialog(false)}>{t('translation:cancel')}</Button>
                        <Button
                            className="bg-teal-500 hover:bg-teal-600"
                            onClick={() => {
                                handleDownload('MedicalRecords', null, exportOptions);
                                setShowExportDialog(false);
                            }}
                        >
                            <Download className="h-4 w-4 mr-2" />{t('translation:exportRecords')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Book Appointment Dialog */}
            <Dialog open={showBookAppointmentDialog} onOpenChange={setShowBookAppointmentDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{t('translation:bookAnAppointment')}</DialogTitle>
                        <DialogDescription>{t('translation:fillInTheDetailsToScheduleAnAp')}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="patientName">{t('translation:fullName')}</Label>
                            <Input
                                id="patientName"
                                name="patientName"
                                value={patientData?.name}
                                disabled

                            />
                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="patientEmail">{t('translation:email')}</Label>
                                <Input
                                    id="patientEmail"
                                    name="patientEmail"
                                    type="email"
                                    value={patientData?.email}
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="patientPhone">{t('translation:phoneNumber')}</Label>
                                <Input
                                    id="patientPhone"
                                    name="patientPhone"
                                    type="tel"
                                    value={patientData?.phone}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason">{t('translation:concern')}</Label>
                            <Input
                                id="reason"
                                name="reason"
                                value={formData?.reason}
                                required
                                onChange={handleChange}

                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="doctor">{t('translation:selectDoctor')}</Label>
                            <select
                                id="doctor"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                value={selectedDoctor}
                                onChange={(e) => setSelectedDoctor(e.target.value)}
                            >
                                <option value="">{t('translation:selectADoctor')}</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor._id} value={doctor._id}>
                                        {doctor.name} - {doctor.specialization}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="schedule">{t('translation:selectSchedule')}</Label>
                            <select
                                id="schedule"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                value={selectedSchedule}
                                onChange={(e) => {
                                    const newSchedule = e.target.value;
                                    setSelectedSchedule(newSchedule);
                                    setSelectedDate(newSchedule.date);
                                }}
                                disabled={!selectedDoctor}
                            >
                                <option value="">{selectedDoctor ? "Select a schedule" : "Select a doctor first"}</option>
                                {schedules.map((schedule) => (
                                    <option key={schedule._id} value={schedule._id}>
                                        {schedule.date?.split("T")[0]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* <div className="space-y-2">
                            <Label htmlFor="date">Select Date</Label>
                            <select
                                id="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                disabled={!selectedDoctor}
                            >
                                <option value="">{selectedDoctor ? "Select a schedule" : "Select a doctor first"}</option>
                                {schedules.map((schedule) => (
                                    <option key={schedule._id} value={schedule._id}>
                                        {schedule.date?.split("T")[0]} 
                                    </option>
                                ))}
                            </select>
                        </div> */}


                        {/* <div className="space-y-2">
                            <Label>Select Date</Label>
                            <div className="border border-gray-200 rounded-md p-2">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    minDate={new Date()}
                                    className="w-full outline-none"
                                    dateFormat="MMMM d, yyyy"
                                />
                            </div>
                        </div> */}

                        <div className="space-y-2">
                            <Label htmlFor="timeSlot">{t('translation:selectTimeSlot')}</Label>
                            <select
                                id="timeSlot"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                value={selectedTimeSlot}
                                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                                disabled={!selectedSchedule}
                            >
                                <option disabled value="">
                                    {selectedSchedule ? "Select a time slot" : "Select a schedule first"}
                                </option>
                                {timeSlots.map((slot) => (
                                    slot.status === "available" && (
                                        <option key={slot._id} value={slot.time}>
                                            {new Date(slot.time).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </option>
                                    )
                                ))}

                            </select>
                        </div>

                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowBookAppointmentDialog(false)}>{t('translation:cancel')}</Button>
                        <Button
                            className="bg-teal-500 hover:bg-teal-600"
                            onClick={handleBookAppointment}
                            disabled={!selectedDoctor || !selectedSchedule || !selectedTimeSlot}
                        >{t('translation:bookAppointment')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Medical Record Details Dialog */}
            <Dialog open={showRecordDetails} onOpenChange={setShowRecordDetails}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{t('translation:medicalRecordDetails')}</DialogTitle>
                        <DialogDescription>
                            {selectedRecord && formatDate(selectedRecord.date)}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRecord && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">{t('translation:diagnosis')}</p>
                                    <p className="font-medium">{selectedRecord.diagnosis}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{t('translation:doctor')}</p>
                                    <p className="font-medium">{selectedRecord.doctor?.name || 'Unknown'}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">{t('translation:treatment')}</p>
                                <p className="font-medium">{selectedRecord.treatment}</p>
                            </div>

                            {selectedRecord.notes && (
                                <div>
                                    <p className="text-sm text-gray-500">{t('translation:notes')}</p>
                                    <p className="font-medium">{selectedRecord.notes}</p>
                                </div>
                            )}

                            {selectedRecord.vitals && (
                                <div>
                                    <h4 className="font-medium mb-2">{t('translation:vitals')}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">{t('translation:bloodPressure')}</p>
                                            <p>{selectedRecord.vitals.bloodPressure || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">{t('translation:heartRate')}</p>
                                            <p>{selectedRecord.vitals.heartRate || 'N/A'} bpm</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">{t('translation:temperature')}</p>
                                            <p>{selectedRecord.vitals.temperature || 'N/A'} °F</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">{t('translation:respiratoryRate')}</p>
                                            <p>{selectedRecord.vitals.respiratoryRate || 'N/A'} bpm</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedRecord.labResults && selectedRecord.labResults.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">{t('translation:labResults')}</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>{t('translation:test')}</TableHead>
                                                <TableHead>{t('translation:result')}</TableHead>
                                                <TableHead>{t('translation:referenceRange')}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedRecord.labResults.map((result, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{result.test}</TableCell>
                                                    <TableCell>{result.result}</TableCell>
                                                    <TableCell>{result.referenceRange}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            <DialogFooter>
                                <Button
                                    className="bg-teal-500 hover:bg-teal-600"
                                    onClick={() => {
                                        handleDownload('MedicalRecord', selectedRecord._id);
                                        setShowRecordDetails(false);
                                    }}
                                >
                                    <Download className="h-4 w-4 mr-2" />{t('translation:downloadReport')}</Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            {/* Report Details Dialog */}
            <Dialog open={showTestReport} onOpenChange={setShowTestReport}>
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
            <DialogTitle>{t('translation:reportDetails')}</DialogTitle>
            <DialogDescription>
                {Array.isArray(selectedTest) && selectedTest.length > 0 && (
                    <>Showing {selectedTest.length} report(s)</>
                )}
            </DialogDescription>
        </DialogHeader>

        {Array.isArray(selectedTest) && selectedTest.map((report, i) => (
            <div key={report._id || i} className="space-y-4 border-t pt-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">{t('translation:testName')}</p>
                        <p className="font-medium">{report.testName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{t('translation:reportId')}</p>
                        <p className="font-medium">{report.id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">{t('translation:status')}</p>
                        <p className="font-medium capitalize">{translateValue('status', report.status, t)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{t('translation:resultDate')}</p>
                        <p className="font-medium">{formatDate(report.resultDate)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">{t('translation:performedBy')}</p>
                        <p className="font-medium">{report.performedBy?.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{t('translation:reviewedBy')}</p>
                        <p className="font-medium">{report.reviewedBy?.name}</p>
                    </div>
                </div>

                {report.comments && (
                    <div>
                        <p className="text-sm text-gray-500">{t('translation:comments')}</p>
                        <p className="font-medium">{report.comments}</p>
                    </div>
                )}

                {report.results && report.results.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-2">{t('translation:results')}</h4>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('translation:parameter')}</TableHead>
                                    <TableHead>{t('translation:value')}</TableHead>
                                    <TableHead>{t('translation:unit')}</TableHead>
                                    <TableHead>{t('translation:reference')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {report.results.map((res, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{res.parameter}</TableCell>
                                        <TableCell>{res.value}</TableCell>
                                        <TableCell>{res.unit}</TableCell>
                                        <TableCell>{res.referenceRange}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        className="bg-teal-500 hover:bg-teal-600"
                        onClick={() => {
                            handleDownload('Report', report._id);
                            setShowTestReport(false);
                        }}
                    >
                        <Download className="h-4 w-4 mr-2" />{t('translation:downloadReport')}</Button>
                </DialogFooter>
            </div>
        ))}
    </DialogContent>
</Dialog>



        </div>
    );
}
