import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/UI/Card"
import Button from "../components/UI/Button"
import Input from "../components/UI/Input"
import Label from "../components/UI/Label"
import { useSelector } from "react-redux"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/UI/Tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/UI/Select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/UI/Dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/UI/Table"
import Badge from "../components/UI/Badge"
import Checkbox from "../components/UI/CheckBox"
import {
  Download,
  FileText,
  BarChart2,
  PieChart,
  TrendingUp,
  Calendar,
  Search,
  Edit,
  Trash2,
  Settings,
  Mail,
  Printer,
  Share2,
  RefreshCw,
  AlertCircle,
  DollarSign,
  Activity,
  Users,
  Clipboard,
  BarChart,
  Pill,
} from "lucide-react"
import { useGetReportsQuery, useCreateReportsMutation, useDeleteReportsMutation, useEditReportsMutation } from "../redux/slices/reportsSlice"
import useFormattedDate from "../components/hooks/useFormattedDate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { downloadPdf } from '../components/utilis/DownloadPdfs';


import { useTranslation } from "react-i18next";
import { translateValue } from '../utilis/translate';

export default function Reports() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("")
  const [showGenerateReport, setShowGenerateReport] = useState(false)
  const [showScheduleReport, setShowScheduleReport] = useState(false)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [reportData, setReportData] = useState(null);
  const [dataType, setDataType] = useState("financial")
  const { data, isLoading } = useGetReportsQuery(dataType);
  const [deleteReports] = useDeleteReportsMutation()
  const [editReports] = useEditReportsMutation()
  const formatDate = useFormattedDate()
  const [formData, setFormData] = useState({
    reportName: '',
    type: '',
    reportFormat: '',
    duration: '',
    period: '',
    generatedDate: '',
    recipients: '',
    schedule: '',
    nextRun: '',
    status: '',
  });

  const [createReports] = useCreateReportsMutation();

  useEffect(() => {
    if (reportData) {
      setFormData({
        reportName: reportData.reportName,
        type: reportData.type,
        reportFormat: reportData.reportFormat,
        duration: reportData.duration,
        period: reportData.period,
        generatedDate: reportData.generatedDate,
        recipients: reportData.recipients,
        schedule: reportData.schedule,
        nextRun: reportData.nextRun,
        status: reportData.status,
      });
    }
  }, [reportData]);


  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (reportData) {
        // Editing an existing report
        response = await editReports({
          id: reportData._id,
          ...formData,
        }).unwrap();
        setShowGenerateReport(false);
      } else {
        // Creating a new report
        response = await createReports(formData).unwrap();
        toast.success(t('translation:reportGeneratedSuccessfully'));
        setShowGenerateReport(false);
      }
    } catch (err) {
      console.error("Error submitting report data:", err);
      setError(err?.data?.message || "Failed to submit report data");
    }
  };


  const handleDelete = async (id) => {
    try {
      await deleteReports(id).unwrap();
      toast.warn(t('translation:reportDeleted'));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === "dark";

  // Status badge color mapping
  const getStatusColor = (status) => {
    const statusColors = {
      Completed: isDark
        ? "bg-green-900 text-green-300"
        : "bg-green-100 text-green-800",
      Processing: isDark
        ? "bg-blue-900 text-blue-300"
        : "bg-blue-100 text-blue-800",
      Scheduled: isDark
        ? "bg-purple-900 text-purple-300"
        : "bg-purple-100 text-purple-800",
      Active: isDark
        ? "bg-green-900 text-green-300"
        : "bg-green-100 text-green-800",
      Paused: isDark
        ? "bg-yellow-900 text-yellow-300"
        : "bg-yellow-100 text-yellow-800",
      Failed: isDark
        ? "bg-red-900 text-red-300"
        : "bg-red-100 text-red-800",
    };

    return statusColors[status] || (isDark
      ? "bg-gray-800 text-gray-300"
      : "bg-gray-100 text-gray-800");
  };


  // Format badge color mapping
  const getFormatColor = (format) => {
    const formatColors = {
      PDF: "bg-red-100 text-red-800",
      Excel: "bg-green-100 text-green-800",
      CSV: "bg-yellow-100 text-yellow-800",
    }
    return formatColors[format] || "bg-gray-100 text-gray-800"
  }

  // Filters
  const filteredFinacialReports = data?.data?.filter(
    (report) =>
      report.type === "financial" &&
      report.reportName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOperationalReports = data?.data?.filter(
    (report) =>
      report.type === "operational" &&
      report.reportName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClinicalReports = data?.data?.filter(
    (report) =>
      report.type === "clinical" &&
      report.reportName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredScheduledReports = data?.data?.filter(
    (report) =>
      report.type === "scheduled" &&
      report.reportName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("reports.title", "Reports")}</h1>
        <div className="flex space-x-2">
          <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => setShowGenerateReport(true)}>
            <FileText className="h-4 w-4 mr-2" />
            {t("reports.generateReport", "Generate Report")}
          </Button>
        </div>
      </div>
      <div className="mb-6">
        <Tabs defaultValue="financial" value={dataType} onValueChange={setDataType}>
          <TabsList className="w-auto grid-cols-5 bg-teal-100 inline-flex h-10 items-center justify-start rounded-md text-gray-500 gap-2">
            <TabsTrigger value="financial">{t("reports.financial", "Financial")}</TabsTrigger>
            <TabsTrigger value="operational">{t("reports.operational", "Operational")}</TabsTrigger>
            <TabsTrigger value="clinical">{t("reports.clinical", "Clinical")}</TabsTrigger>
            <TabsTrigger value="scheduled">{t("reports.scheduled", "Scheduled")}</TabsTrigger>
          </TabsList>

          {/* Financial Reports Tab */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t("reports.financialReportsTitle", "Financial Reports")}</CardTitle>
                    <CardDescription>{t("reports.financialReportsSub", "Revenue, expenses, and financial analytics")}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder={t("reports.searchPlaceholder", "Search reports...")}
                        className="pl-8 w-full border-2 border-gray-400 h-10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const headers = ["Report Name", "Period", "Generated Date", "Status"];
                          const exportData = filteredFinacialReports.map((report) => [
                            report.reportName,
                            report.period,
                            formatDate(report.generatedDate),
                            report.status,
                          ]);

                          downloadPdf({
                            title: "Financial Report",
                            headers,
                            data: exportData,
                            fileName: "financial_report.pdf",
                          });
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("reports.reportName", "Report Name")}</TableHead>
                      <TableHead>{t("reports.period", "Period")}</TableHead>
                      <TableHead>{t("reports.generatedDate", "Generated Date")}</TableHead>
                      <TableHead>{t("common.status", "Status")}</TableHead>
                      <TableHead>{t("reports.format", "Format")}</TableHead>
                      <TableHead className="text-right">{t("common.actions", "Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFinacialReports?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          {t("reports.noReportsFound", "No reports found.")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFinacialReports?.map((report) => (
                        <TableRow key={report._id}>
                          <TableCell className="font-medium">{report.reportName}</TableCell>
                          <TableCell>{report.period}</TableCell>
                          <TableCell>{formatDate(report.generatedDate)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(report.status)}>{translateValue('status', report.status, t)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getFormatColor(report.reportFormat)}>{report.reportFormat}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="icon"
                                onClick={() => {
                                  setReportData(report);
                                  setShowGenerateReport(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleDelete(report._id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operational Reports Tab */}
          <TabsContent value="operational">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t("reports.operationalReportsTitle", "Operational Reports")}</CardTitle>
                    <CardDescription>{t("reports.operationalReportsSub", "Hospital operations and efficiency metrics")}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input type="search"
                        placeholder={t("reports.searchPlaceholder", "Search reports...")}
                        className="pl-8 w-full border-2 border-gray-400 h-10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const headers = ["Report Name", "Period", "Generated Date", "Status"];
                          const exportData = filteredOperationalReports.map((report) => [
                            report.reportName,
                            report.period,
                            formatDate(report.generatedDate),
                            report.status,
                          ]);

                          downloadPdf({
                            title: "Operational Report",
                            headers,
                            data: exportData,
                            fileName: "operational_report.pdf",
                          });
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("reports.reportName", "Report Name")}</TableHead>
                      <TableHead>{t("reports.period", "Period")}</TableHead>
                      <TableHead>{t("reports.generatedDate", "Generated Date")}</TableHead>
                      <TableHead>{t("common.status", "Status")}</TableHead>
                      <TableHead>{t("reports.format", "Format")}</TableHead>
                      <TableHead className="text-right">{t("common.actions", "Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOperationalReports?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          {t("reports.noReportsFound", "No reports found.")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOperationalReports?.map((report) => (
                        <TableRow key={report._id}>
                          <TableCell className="font-medium">{report.reportName}</TableCell>
                          <TableCell>{report.period}</TableCell>
                          <TableCell>{formatDate(report.generatedDate)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(report.status)}>{translateValue('status', report.status, t)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getFormatColor(report.reportFormat)}>{report.reportFormat}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="icon"
                                onClick={() => {
                                  setReportData(report);
                                  setShowGenerateReport(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleDelete(report._id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}

                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clinical Reports Tab */}
          <TabsContent value="clinical">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t("reports.clinicalReportsTitle", "Clinical Reports")}</CardTitle>
                    <CardDescription>{t("reports.clinicalReportsSub", "Patient outcomes and clinical metrics")}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder={t("reports.searchPlaceholder", "Search reports...")}
                        className="pl-8 w-full border-2 border-gray-400 h-10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const headers = ["Report Name", "Period", "Generated Date", "Status"];
                          const exportData = filteredClinicalReports.map((report) => [
                            report.reportName,
                            report.period,
                            formatDate(report.generatedDate),
                            report.status,
                          ]);

                          downloadPdf({
                            title: "Clinical Report",
                            headers,
                            data: exportData,
                            fileName: "clinical_report.pdf",
                          });
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("reports.reportName", "Report Name")}</TableHead>
                      <TableHead>{t("reports.period", "Period")}</TableHead>
                      <TableHead>{t("reports.generatedDate", "Generated Date")}</TableHead>
                      <TableHead>{t("common.status", "Status")}</TableHead>
                      <TableHead>{t("reports.format", "Format")}</TableHead>
                      <TableHead className="text-right">{t("common.actions", "Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>

                    {filteredClinicalReports?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          {t("reports.noReportsFound", "No reports found.")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClinicalReports?.map((report) => (
                        <TableRow key={report._id}>
                          <TableCell className="font-medium">{report.reportName}</TableCell>
                          <TableCell>{report.period}</TableCell>
                          <TableCell>{formatDate(report.generatedDate)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(report.status)}>{translateValue('status', report.status, t)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getFormatColor(report.reportFormat)}>{report.reportFormat}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="icon"
                                onClick={() => {
                                  setReportData(report);
                                  setShowGenerateReport(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleDelete(report._id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduled Reports Tab */}
          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t("reports.scheduledReportsTitle", "Scheduled Reports")}</CardTitle>
                    <CardDescription>{t("reports.scheduledReportsSub", "Automated report generation schedules")}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder={t("reports.searchPlaceholder", "Search scheduled reports...")}
                        className="pl-8 w-full border-2 border-gray-400 h-10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const headers = ["Report Name", "Period", "Generated Date", "Status"];
                          const exportData = filteredScheduledReports.map((report) => [
                            report.reportName,
                            report.period,
                            formatDate(report.generatedDate),
                            report.status,
                          ]);

                          downloadPdf({
                            title: "Scheduled Report",
                            headers,
                            data: exportData,
                            fileName: "scheduled_report.pdf",
                          });
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("reports.reportName", "Report Name")}</TableHead>
                      <TableHead>{t("reports.schedule", "Schedule")}</TableHead>
                      <TableHead>{t("reports.nextRun", "Next Run")}</TableHead>
                      <TableHead>{t("reports.recipients", "Recipients")}</TableHead>
                      <TableHead>{t("reports.format", "Format")}</TableHead>
                      <TableHead>{t("common.status", "Status")}</TableHead>
                      <TableHead className="text-right">{t("common.actions", "Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScheduledReports?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          {t("reports.noReportsFound", "No reports found.")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredScheduledReports?.map((report) => (
                        <TableRow key={report._id}>
                          <TableCell className="font-medium">{report.reportName}</TableCell>
                          <TableCell>{report.schedule}</TableCell>
                          <TableCell>{formatDate(report.nextRun)}</TableCell>
                          <TableCell>{report.recipients}</TableCell>
                          <TableCell>
                            <Badge className={getFormatColor(report.reportFormat)}>{report.reportFormat}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(report.status)}>{translateValue('status', report.status, t)}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="icon"
                                onClick={() => {
                                  setReportData(report);
                                  setShowGenerateReport(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleDelete(report._id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('translation:totalRevenue')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,248,590</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />{t('translation:125FromLastMonth')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('translation:patientAdmissions')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,842</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />{t('translation:52FromLastMonth')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{t('translation:averageLengthOfStay')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{t('translation:43Days')}</div>
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />{t('translation:05DaysFromLastMonth')}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('translation:revenueBreakdown')}</CardTitle>
                  <CardDescription>{t('translation:revenueByDepartment')}</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">{t('translation:revenueBreakdownChartWillBeDis')}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t('translation:patientTrends')}</CardTitle>
                  <CardDescription>{t('translation:admissionTrendsOverTime')}</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart2 className="h-16 w-16 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">{t('translation:patientTrendsChartWillBeDispla')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t('translation:keyPerformanceIndicators')}</CardTitle>
                    <CardDescription>{t('translation:hospitalwidePerformanceMetrics')}</CardDescription>
                  </div>
                  <Select defaultValue="month">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('translation:selectPeriod')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">{t('translation:thisWeek')}</SelectItem>
                      <SelectItem value="month">{t('translation:thisMonth')}</SelectItem>
                      <SelectItem value="quarter">{t('translation:thisQuarter')}</SelectItem>
                      <SelectItem value="year">{t('translation:thisYear')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center p-4 border rounded-lg">
                    <DollarSign className="h-10 w-10 text-green-500 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('translation:revenuePerPatient')}</p>
                      <p className="text-xl font-bold">$4,250</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 border rounded-lg">
                    <Activity className="h-10 w-10 text-blue-500 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('translation:bedOccupancyRate')}</p>
                      <p className="text-xl font-bold">78.5%</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 border rounded-lg">
                    <Users className="h-10 w-10 text-purple-500 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('translation:staffToPatientRatio')}</p>
                      <p className="text-xl font-bold">1:4.2</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 border rounded-lg">
                    <Clipboard className="h-10 w-10 text-orange-500 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('translation:readmissionRate')}</p>
                      <p className="text-xl font-bold">5.8%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* Generate Report Dialog */}
      <Dialog open={showGenerateReport} onOpenChange={setShowGenerateReport}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">{t("reports.generateReportTitle", "Generate New Report")}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {t("reports.generateReportSub", "Fill in the details below to generate your custom report.")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reportName" className="text-right">{t("reports.reportName", "Report Name")}</Label>
                <Input
                  id="reportName"
                  value={formData.reportName}
                  onChange={(e) => handleChange('reportName', e.target.value)}
                  className="col-span-3 border border-gray-400 rounded-lg p-1"
                  placeholder={t("reports.reportNamePlaceholder", "E.g. Q1 Performance Overview")}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">{t("reports.reportType", "Report Type")}</Label>
                <Select onValueChange={(val) => handleChange('type', val)}>
                  <SelectTrigger id="type" className="col-span-3 border border-gray-400 rounded-lg p-1">
                    <SelectValue placeholder={t("reports.chooseType", "Choose type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">{t("reports.financial", "Financial")}</SelectItem>
                    <SelectItem value="operational">{t("reports.operational", "Operational")}</SelectItem>
                    <SelectItem value="clinical">{t("reports.clinical", "Clinical")}</SelectItem>
                    <SelectItem value="scheduled">{t("reports.scheduled", "Scheduled")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reportFormat" className="text-right">{t("reports.format", "Format")}</Label>
                <Select onValueChange={(val) => handleChange('reportFormat', val)}>
                  <SelectTrigger id="reportFormat" className="col-span-3 border border-gray-400 rounded-lg p-1">
                    <SelectValue placeholder={t("reports.selectFormat", "Select format")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">{t('translation:pdf')}</SelectItem>
                    <SelectItem value="excel">{t('translation:excel')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("reports.duration", "Duration")}</Label>
                <Select onValueChange={(val) => handleChange('duration', val)}>
                  <SelectTrigger className="col-span-3 border border-gray-400 rounded-lg p-1">
                    <SelectValue placeholder={t("reports.selectDuration", "Select duration")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">{t("reports.durations.monthly", "Monthly")}</SelectItem>
                    <SelectItem value="quarterly">{t("reports.durations.quarterly", "Quarterly")}</SelectItem>
                    <SelectItem value="yearly">{t("reports.durations.yearly", "Yearly")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("reports.period", "Period")}</Label>
                <Input
                  type="date"
                  value={formData.period}
                  onChange={(e) => handleChange('period', e.target.value)}
                  className="col-span-3 border border-gray-400 rounded-lg p-1"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("reports.generatedDate", "Generated Date")}</Label>
                <Input
                  type="date"
                  value={formData.generatedDate}
                  onChange={(e) => handleChange('generatedDate', e.target.value)}
                  className="col-span-3 border border-gray-400 rounded-lg p-1"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("reports.recipients", "Recipients")}</Label>
                <Input
                  type="number"
                  value={formData.recipients}
                  onChange={(e) => handleChange('recipients', e.target.value)}
                  className="col-span-3 border border-gray-400 rounded-lg p-1"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("reports.schedule", "Schedule")}</Label>
                <Input
                  value={formData.schedule}
                  onChange={(e) => handleChange('schedule', e.target.value)}
                  className="col-span-3 border border-gray-400 rounded-lg p-1"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("reports.nextRun", "Next Run")}</Label>
                <Input
                  type="date"
                  value={formData.nextRun}
                  onChange={(e) => handleChange('nextRun', e.target.value)}
                  className="col-span-3 border border-gray-400 rounded-lg p-1"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t("common.status", "Status")}</Label>
                <Select onValueChange={(val) => handleChange('status', val)}>
                  <SelectTrigger className="col-span-3 border border-gray-400 rounded-lg p-1">
                    <SelectValue placeholder={t("inventory.selectStatus", "Select status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Processing">{t("reports.statuses.processing", "Processing")}</SelectItem>
                    <SelectItem value="Completed">{t("status.completed", "Completed")}</SelectItem>
                    <SelectItem value="Scheduled">{t("status.scheduled", "Scheduled")}</SelectItem>
                    <SelectItem value="Active">{t("insurance.status.active", "Active")}</SelectItem>
                    <SelectItem value="Paused">{t("reports.statuses.paused", "Paused")}</SelectItem>
                    <SelectItem value="Failed">{t("reports.statuses.failed", "Failed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowGenerateReport(false)}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                {t("reports.saveReport", "Save Report")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>



      {/* Schedule Report Dialog */}
      <Dialog open={showScheduleReport} onOpenChange={setShowScheduleReport}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{t('translation:scheduleAutomatedReport')}</DialogTitle>
            <DialogDescription>{t('translation:setUpRecurringReportGeneration')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportName" className="text-right">{t('translation:reportName')}</Label>
              <Input id="reportName" placeholder={t('translation:enterReportName')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportType" className="text-right">{t('translation:reportType')}</Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('translation:selectReportType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">{t('translation:financialReport')}</SelectItem>
                  <SelectItem value="operational">{t('translation:operationalReport')}</SelectItem>
                  <SelectItem value="clinical">{t('translation:clinicalReport')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">{t('translation:frequency')}</Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('translation:selectFrequency')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t('translation:daily')}</SelectItem>
                  <SelectItem value="weekly">{t('translation:weekly')}</SelectItem>
                  <SelectItem value="monthly">{t('translation:monthly')}</SelectItem>
                  <SelectItem value="quarterly">{t('translation:quarterly')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">{t('translation:time')}</Label>
              <Input id="time" type="time" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipients" className="text-right">{t('translation:recipients')}</Label>
              <Input id="recipients" placeholder={t('translation:enterEmailAddresses')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">{t('translation:format')}</Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('translation:selectFormat')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">{t('translation:pdf')}</SelectItem>
                  <SelectItem value="excel">{t('translation:excel')}</SelectItem>
                  <SelectItem value="dashboard">{t('translation:dashboard')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t('translation:options')}</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="activeSchedule" defaultChecked />
                  <label htmlFor="activeSchedule" className="text-sm">{t('translation:active')}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="notifyFailure" />
                  <label htmlFor="notifyFailure" className="text-sm">{t('translation:notifyOnFailure')}</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleReport(false)}>{t('translation:cancel')}</Button>
            <Button type="submit" className="bg-teal-500 hover:bg-teal-600">{t('translation:scheduleReport')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Export Options Dialog */}
      <Dialog open={showExportOptions} onOpenChange={setShowExportOptions}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('translation:exportReports')}</DialogTitle>
            <DialogDescription>{t('translation:selectReportsToExportAndChoose')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>{t('translation:selectReports')}</Label>
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="export1" />
                  <label htmlFor="export1" className="text-sm">{t('translation:monthlyRevenueReport')}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="export2" />
                  <label htmlFor="export2" className="text-sm">{t('translation:patientAdmissionTrends')}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="export3" />
                  <label htmlFor="export3" className="text-sm">{t('translation:diseasePrevalenceAnalysis')}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="export4" />
                  <label htmlFor="export4" className="text-sm">{t('translation:staffEfficiencyMetrics')}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="export5" />
                  <label htmlFor="export5" className="text-sm">{t('translation:quarterlyExpenseAnalysis')}</label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('translation:exportFormat')}</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue placeholder={t('translation:selectFormat')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">{t('translation:pdf')}</SelectItem>
                  <SelectItem value="excel">{t('translation:excel')}</SelectItem>
                  <SelectItem value="csv">{t('translation:csv')}</SelectItem>
                  <SelectItem value="zip">{t('translation:compressedZip')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('translation:options')}</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="includeMetadata" />
                  <label htmlFor="includeMetadata" className="text-sm">{t('translation:includeMetadata')}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="password" />
                  <label htmlFor="password" className="text-sm">{t('translation:passwordProtect')}</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportOptions(false)}>{t('translation:cancel')}</Button>
            <Button className="bg-teal-500 hover:bg-teal-600">
              <Download className="h-4 w-4 mr-2" />{t('translation:exportSelected')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Data Visualization Card */}
      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle>Advanced Analytics</CardTitle>
          <CardDescription>Interactive data visualization tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Custom Report Builder</h3>
              <p className="text-sm text-gray-500">
                Create custom reports by selecting metrics, dimensions, and visualization types. Drag and drop interface
                allows for intuitive report creation without technical knowledge.
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Chart Builder
                </Button>
                <Button variant="outline" className="flex-1">
                  <PieChart className="h-4 w-4 mr-2" />
                  Data Explorer
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Report Distribution</h3>
              <p className="text-sm text-gray-500">
                Share reports with stakeholders through multiple channels. Set up automated distribution to ensure
                timely delivery of critical information.
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Reports
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Dashboard
                </Button>
                <Button variant="outline" className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Center
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
      {/* AI-Powered Insights Card */}
      {/* <Card>
        <CardHeader>
          <CardTitle>AI-Powered Insights</CardTitle>
          <CardDescription>Automated analysis and predictive analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Leverage artificial intelligence to automatically identify trends, anomalies, and opportunities in your
              hospital data. Predictive analytics help forecast patient volumes, resource needs, and financial outcomes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Trend Detection</h4>
                <p className="text-xs text-gray-500">
                  Automatically identify patterns and trends in hospital operations and patient care.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Anomaly Detection</h4>
                <p className="text-xs text-gray-500">
                  Highlight unusual patterns that may indicate issues requiring attention.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Predictive Forecasting</h4>
                <p className="text-xs text-gray-500">
                  Forecast future metrics based on historical data and current trends.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button className="bg-teal-500 hover:bg-teal-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                Generate AI Insights
              </Button>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* <div className="mb-6">
        <Card className="border-teal-500 dark:border-teal-700">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>AI-powered forecasting and trend analysis</CardDescription>
              </div>
              <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">New</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{t('translation:patientAdmissions')}</h3>
                      <p className="text-3xl font-bold mt-2">+12%</p>
                      <p className="text-xs text-muted-foreground mt-1">Predicted increase next month</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                      <TrendingUp className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Resource Utilization</h3>
                      <p className="text-3xl font-bold mt-2">87%</p>
                      <p className="text-xs text-muted-foreground mt-1">Projected efficiency rate</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <BarChart className="h-5 w-5 text-green-500 dark:text-green-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Revenue Forecast</h3>
                      <p className="text-3xl font-bold mt-2">$1.2M</p>
                      <p className="text-xs text-muted-foreground mt-1">Projected for next quarter</p>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-purple-500 dark:text-purple-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <Users className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Staffing Recommendations</p>
                  <p className="text-sm text-muted-foreground">
                    AI predicts increased patient volume in Emergency Department next week. Consider scheduling 2
                    additional nurses.
                  </p>
                </div>
                <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                  View Details
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-md">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <Pill className="h-5 w-5 text-green-500 dark:text-green-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Inventory Forecast</p>
                  <p className="text-sm text-muted-foreground">
                    Predicted shortage of surgical supplies in 2 weeks based on current usage patterns and scheduled
                    procedures.
                  </p>
                </div>
                <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                  View Details
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-md">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                  <Activity className="h-5 w-5 text-purple-500 dark:text-purple-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Disease Trend Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    AI detected a 15% increase in respiratory conditions in the local area. Prepare for potential
                    increase in related cases.
                  </p>
                </div>
                <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </>
  )
}

