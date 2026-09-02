"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/UI/Card"
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
import  Textarea  from "../components/UI/TextArea"
import  Checkbox  from "../components/UI/Checkbox"
import {
  Plus,
  Search,
  Trash2,
  Download,
  Filter,
  MoreHorizontal,
  CreditCard,
  DollarSign,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Printer,
  Send,
  BarChart4,
  PieChart,
  TrendingUp,
  Wallet,
  CheckCircle,
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
import Progress from "../components/UI/Progress"
import { useTranslation } from "react-i18next";
import { translateValue } from '../utilis/translate';

export default function Billing() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)
  const [showProcessPayment, setShowProcessPayment] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showPaymentPlan, setShowPaymentPlan] = useState(false)
  const [selectedPatientForInvoice, setSelectedPatientForInvoice] = useState(null)

  // Sample data for patients
  const patients = [
    {
      id: "P-10045",
      name: "Ahmed Mohamed",
      email: "ahmed.mohamed@example.com",
      phone: "+20 123-456-7890",
      insuranceProvider: "MediCare Health Insurance",
      insuranceId: "INS-001",
      policyNumber: "POL-12345",
    },
    {
      id: "P-10046",
      name: "Fatima Ali",
      email: "fatima.ali@example.com",
      phone: "+20 123-456-7891",
      insuranceProvider: "National Health Insurance",
      insuranceId: "INS-002",
      policyNumber: "POL-23456",
    },
    {
      id: "P-10047",
      name: "Omar Khaled",
      email: "omar.khaled@example.com",
      phone: "+20 123-456-7892",
      insuranceProvider: "Cairo Medical Insurance",
      insuranceId: "INS-003",
      policyNumber: "POL-34567",
    },
    {
      id: "P-10048",
      name: "Layla Ibrahim",
      email: "layla.ibrahim@example.com",
      phone: "+20 123-456-7893",
      insuranceProvider: "MediCare Health Insurance",
      insuranceId: "INS-001",
      policyNumber: "POL-45678",
    },
    {
      id: "P-10049",
      name: "Youssef Mahmoud",
      email: "youssef.mahmoud@example.com",
      phone: "+20 123-456-7894",
      insuranceProvider: "Alexandria Insurance Group",
      insuranceId: "INS-005",
      policyNumber: "POL-56789",
    },
  ]

  // Sample data for invoices
  const [invoices, setInvoices] = useState([
    {
      id: "INV-001",
      patientId: "P-10045",
      patientName: "Ahmed Mohamed",
      date: "2025-01-05",
      dueDate: "2025-02-05",
      amount: 1250.0,
      paid: 0,
      balance: 1250.0,
      status: "pending",
      items: [
        { description: "Cardiology Consultation", quantity: 1, unitPrice: 350.0, total: 350.0 },
        { description: "ECG Test", quantity: 1, unitPrice: 150.0, total: 150.0 },
        { description: "Blood Work", quantity: 1, unitPrice: 250.0, total: 250.0 },
        { description: "Medication", quantity: 1, unitPrice: 500.0, total: 500.0 },
      ],
      insuranceClaim: {
        id: "CLM-002",
        status: "pending",
        coverageAmount: 875.0,
      },
      notes: "Patient has insurance coverage for 70% of total amount",
    },
    {
      id: "INV-002",
      patientId: "P-10046",
      patientName: "Fatima Ali",
      date: "2025-01-04",
      dueDate: "2025-02-04",
      amount: 5800.0,
      paid: 5800.0,
      balance: 0,
      status: "paid",
      items: [
        { description: "Appendectomy Surgery", quantity: 1, unitPrice: 4500.0, total: 4500.0 },
        { description: "Hospital Stay (2 days)", quantity: 2, unitPrice: 500.0, total: 1000.0 },
        { description: "Post-op Medication", quantity: 1, unitPrice: 300.0, total: 300.0 },
      ],
      insuranceClaim: {
        id: "CLM-001",
        status: "approved",
        coverageAmount: 4640.0,
      },
      notes: "Insurance covered 80% of total amount. Patient paid remaining balance.",
    },
    {
      id: "INV-003",
      patientId: "P-10047",
      patientName: "Omar Khaled",
      date: "2025-01-03",
      dueDate: "2025-02-03",
      amount: 850.0,
      paid: 425.0,
      balance: 425.0,
      status: "partial",
      items: [
        { description: "Orthopedic Consultation", quantity: 1, unitPrice: 300.0, total: 300.0 },
        { description: "X-Ray", quantity: 2, unitPrice: 150.0, total: 300.0 },
        { description: "Physical Therapy Session", quantity: 1, unitPrice: 250.0, total: 250.0 },
      ],
      insuranceClaim: {
        id: "CLM-003",
        status: "rejected",
        coverageAmount: 0,
      },
      notes: "Insurance claim rejected. Patient on installment plan.",
    },
    {
      id: "INV-004",
      patientId: "P-10048",
      patientName: "Layla Ibrahim",
      date: "2025-01-02",
      dueDate: "2025-02-02",
      amount: 3200.0,
      paid: 3200.0,
      balance: 0,
      status: "paid",
      items: [
        { description: "Cataract Surgery", quantity: 1, unitPrice: 2500.0, total: 2500.0 },
        { description: "Pre-op Assessment", quantity: 1, unitPrice: 200.0, total: 200.0 },
        { description: "Post-op Medication", quantity: 1, unitPrice: 300.0, total: 300.0 },
        { description: "Follow-up Visit", quantity: 1, unitPrice: 200.0, total: 200.0 },
      ],
      insuranceClaim: {
        id: "CLM-004",
        status: "approved",
        coverageAmount: 2560.0,
      },
      notes: "Insurance covered 80% of total amount. Patient paid remaining balance.",
    },
    {
      id: "INV-005",
      patientId: "P-10049",
      patientName: "Youssef Mahmoud",
      date: "2025-01-01",
      dueDate: "2025-02-01",
      amount: 750.0,
      paid: 0,
      balance: 750.0,
      status: "overdue",
      items: [
        { description: "Pediatric Consultation", quantity: 1, unitPrice: 250.0, total: 250.0 },
        { description: "Throat Culture", quantity: 1, unitPrice: 150.0, total: 150.0 },
        { description: "Antibiotics", quantity: 1, unitPrice: 200.0, total: 200.0 },
        { description: "Follow-up Visit", quantity: 1, unitPrice: 150.0, total: 150.0 },
      ],
      insuranceClaim: {
        id: "CLM-005",
        status: "pending",
        coverageAmount: 600.0,
      },
      notes: "Payment reminder sent on Jan 15, 2025",
    },
  ])

  // Sample data for payments
  const [payments, setPayments] = useState([
    {
      id: "PAY-001",
      invoiceId: "INV-002",
      patientName: "Fatima Ali",
      date: "2025-01-04",
      amount: 1160.0,
      method: "Credit Card",
      reference: "TXREF-12345",
      notes: "Patient portion after insurance",
    },
    {
      id: "PAY-002",
      invoiceId: "INV-002",
      patientName: "Fatima Ali",
      date: "2025-01-04",
      amount: 4640.0,
      method: "Insurance",
      reference: "INS-REF-23456",
      notes: "Insurance payment",
    },
    {
      id: "PAY-003",
      invoiceId: "INV-003",
      patientName: "Omar Khaled",
      date: "2025-01-10",
      amount: 425.0,
      method: "Cash",
      reference: "CASH-34567",
      notes: "First installment payment",
    },
    {
      id: "PAY-004",
      invoiceId: "INV-004",
      patientName: "Layla Ibrahim",
      date: "2025-01-02",
      amount: 640.0,
      method: "Debit Card",
      reference: "TXREF-45678",
      notes: "Patient portion after insurance",
    },
    {
      id: "PAY-005",
      invoiceId: "INV-004",
      patientName: "Layla Ibrahim",
      date: "2025-01-05",
      amount: 2560.0,
      method: "Insurance",
      reference: "INS-REF-56789",
      notes: "Insurance payment",
    },
  ])

  // Sample data for payment plans
  const [paymentPlans, setPaymentPlans] = useState([
    {
      id: "PLAN-001",
      invoiceId: "INV-003",
      patientId: "P-10047",
      patientName: "Omar Khaled",
      totalAmount: 850.0,
      remainingBalance: 425.0,
      installments: [
        { number: 1, dueDate: "2025-01-10", amount: 425.0, status: "paid", paymentId: "PAY-003" },
        { number: 2, dueDate: "2025-02-10", amount: 425.0, status: "pending", paymentId: null },
      ],
      startDate: "2025-01-03",
      endDate: "2025-02-10",
      status: "active",
    },
  ])

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter payments based on search query
  const filteredPayments = payments.filter(
    (payment) =>
      payment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate total revenue
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)

  // Calculate pending amount
  const pendingAmount = invoices.reduce((sum, invoice) => sum + invoice.balance, 0)

  // Calculate collection rate
  const totalBilled = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const collectionRate = totalBilled > 0 ? (totalRevenue / totalBilled) * 100 : 0

  // Calculate revenue by payment method
  const revenueByMethod = payments.reduce((acc, payment) => {
    acc[payment.method] = (acc[payment.method] || 0) + payment.amount
    return acc
  }, {})

  // Add new invoice
  const handleAddInvoice = (newInvoice) => {
    const id = `INV-${(invoices.length + 1).toString().padStart(3, "0")}`
    const today = new Date().toISOString().split("T")[0]

    // Calculate due date (30 days from today)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)
    const dueDateStr = dueDate.toISOString().split("T")[0]

    // Calculate total amount
    const totalAmount = newInvoice.items.reduce((sum, item) => sum + item.total, 0)

    setInvoices([
      ...invoices,
      {
        ...newInvoice,
        id,
        date: today,
        dueDate: dueDateStr,
        amount: totalAmount,
        paid: 0,
        balance: totalAmount,
        status: "pending",
      },
    ])
    setShowCreateInvoice(false)
  }

  // Process payment
  const handleProcessPayment = (newPayment) => {
    const id = `PAY-${(payments.length + 1).toString().padStart(3, "0")}`
    const today = new Date().toISOString().split("T")[0]

    // Update invoice with payment
    const updatedInvoices = invoices.map((invoice) => {
      if (invoice.id === newPayment.invoiceId) {
        const newPaid = invoice.paid + newPayment.amount
        const newBalance = invoice.amount - newPaid
        let newStatus = "pending"

        if (newBalance <= 0) {
          newStatus = "paid"
        } else if (newPaid > 0) {
          newStatus = "partial"
        }

        return {
          ...invoice,
          paid: newPaid,
          balance: newBalance,
          status: newStatus,
        }
      }
      return invoice
    })

    setInvoices(updatedInvoices)

    // Add payment record
    setPayments([
      ...payments,
      {
        ...newPayment,
        id,
        date: today,
      },
    ])

    setShowProcessPayment(false)
  }

  // Create payment plan
  const handleCreatePaymentPlan = (newPlan) => {
    const id = `PLAN-${(paymentPlans.length + 1).toString().padStart(3, "0")}`

    setPaymentPlans([
      ...paymentPlans,
      {
        ...newPlan,
        id,
        status: "active",
      },
    ])

    setShowPaymentPlan(false)
  }

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "partial":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      case "overdue":
        return "bg-rose-100 text-rose-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  return (
    <>
     <div className="ml-24 md:ml-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("billing.title")}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowProcessPayment(true)}>
            <CreditCard className="h-4 w-4 mr-2" />
            {t("billing.processPayment", "Process Payment")}
          </Button>
          <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => setShowCreateInvoice(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("billing.createInvoice", "Create Invoice")}
          </Button>
        </div>
      </div>

      {/* Add a new insurance verification feature */}
      <div className="mb-6">
        <Card className="border-teal-500">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{t("billing.realtimeVerification", "Real-time Insurance Verification")}</CardTitle>
                <CardDescription>{t("billing.verifyInstantly", "Verify patient insurance coverage instantly")}</CardDescription>
              </div>
              <Badge className="bg-teal-100 text-teal-800">{t("common.new", "New")}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <Label htmlFor="insurance-patient">{t("billing.patientInfo", "Patient Information")}</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="insurance-patient"
                      placeholder={t("billing.searchPlaceholder", "Search patient by name or ID...")}
                      className="pl-8 w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="insurance-provider">{t("insurance.provider", "Insurance Provider")}</Label>
                    <Select>
                      <SelectTrigger id="insurance-provider" className="mt-1">
                        <SelectValue placeholder={t("insurance.selectProvider", "Select provider")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicare">{t('translation:medicareHealthInsurance')}</SelectItem>
                        <SelectItem value="national">{t('translation:nationalHealthInsurance')}</SelectItem>
                        <SelectItem value="cairo">{t('translation:cairoMedicalInsurance')}</SelectItem>
                        <SelectItem value="alexandria">{t('translation:alexandriaInsuranceGroup')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="policy-number">{t("insurance.policyNumber", "Policy Number")}</Label>
                    <Input id="policy-number" className="mt-1" placeholder={t("insurance.enterPolicyNumber", "Enter policy number")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="service-date">{t("billing.serviceDate", "Service Date")}</Label>
                    <Input id="service-date" type="date" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="service-type">{t('translation:serviceType')}</Label>
                    <Select>
                      <SelectTrigger id="service-type" className="mt-1">
                        <SelectValue placeholder={t('translation:selectService')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">{t('translation:consultation')}</SelectItem>
                        <SelectItem value="procedure">{t('translation:procedure')}</SelectItem>
                        <SelectItem value="surgery">{t('translation:surgery')}</SelectItem>
                        <SelectItem value="diagnostic">{t('translation:diagnosticTest')}</SelectItem>
                        <SelectItem value="therapy">{t('translation:therapy')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-full bg-teal-500 hover:bg-teal-600">{t('translation:verifyCoverage')}</Button>
              </div>

              <div>
                <div className="border rounded-md p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h4 className="font-medium">{t('translation:coverageVerified')}</h4>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">{t('translation:patient')}</p>
                        <p className="font-medium">{t('translation:ahmedMohamed')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('translation:policyStatus')}</p>
                        <p className="font-medium">{t('translation:active')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('translation:coverage')}</p>
                        <p className="font-medium">80%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('translation:deductible')}</p>
                        <p className="font-medium">{t('translation:500350Met')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('translation:copay')}</p>
                        <p className="font-medium">$25</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t('translation:outofpocketMax')}</p>
                        <p className="font-medium">$2,000</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">{t('translation:serviceCoverage')}</p>
                      <p className="text-sm">
                        Cardiology Consultation -{" "}
                        <span className="font-medium text-green-600">{t('translation:covered')}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{t('translation:authorizationNotRequired')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button className="flex-1 bg-teal-500 hover:bg-teal-600">
                    <FileText className="h-4 w-4 mr-2" />{t('translation:generateEstimate')}</Button>
                  <Button variant="outline" className="flex-1">
                    <Printer className="h-4 w-4 mr-2" />{t('translation:printVerification')}</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-teal-100p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-teal-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('translation:totalRevenue')}</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('translation:pendingAmount')}</p>
              <p className="text-2xl font-bold">{formatCurrency(pendingAmount)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('translation:collectionRate')}</p>
              <p className="text-2xl font-bold">{collectionRate.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-purple-100p-3 rounded-full">
              <FileText className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('translation:totalInvoices')}</p>
              <p className="text-2xl font-bold">{invoices.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("billing.invoicesSearchPlaceholder", "Search invoices or payments...")}
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="ml-2">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="ml-2">
          <Download className="h-4 w-4 mr-2" />{t('translation:export')}</Button>
      </div>
    
      <Tabs defaultValue="invoices" className="mb-6">
        <TabsList className="bg-teal-100">
          <TabsTrigger value="invoices" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">{t('translation:invoices')}</TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">{t('translation:payments')}</TabsTrigger>
          <TabsTrigger value="plans" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">{t('translation:paymentPlans')}</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">{t('translation:analytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('translation:recentInvoices')}</CardTitle>
              <CardDescription>{t('translation:managePatientInvoicesAndBillin')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('translation:invoice')}</TableHead>
                    <TableHead>{t('translation:patient')}</TableHead>
                    <TableHead>{t('translation:date')}</TableHead>
                    <TableHead>{t('translation:amount')}</TableHead>
                    <TableHead>{t('translation:balance')}</TableHead>
                    <TableHead>{t('translation:status')}</TableHead>
                    <TableHead className="text-right">{t('translation:actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.patientName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(invoice.date)}</span>
                          <span className="text-xs text-muted-foreground">Due: {formatDate(invoice.dueDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>{formatCurrency(invoice.balance)}</TableCell>
                      <TableCell>
                        <Badge className={cn(getStatusBadgeClass(invoice.status))}>{translateValue('status', invoice.status, t)}</Badge>
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
                            <DropdownMenuItem onClick={() => setSelectedInvoice(invoice)}>
                              <FileText className="h-4 w-4 mr-2" />{t('translation:viewDetails')}</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedInvoice(invoice)
                                setShowProcessPayment(true)
                              }}
                            >
                              <CreditCard className="h-4 w-4 mr-2" />{t('translation:processPayment')}</DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="h-4 w-4 mr-2" />{t('translation:printInvoice')}</DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />{t('translation:emailInvoice')}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {invoice.balance > 0 && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedInvoice(invoice)
                                  setShowPaymentPlan(true)
                                }}
                              >
                                <Calendar className="h-4 w-4 mr-2" />{t('translation:createPaymentPlan')}</DropdownMenuItem>
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

        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('translation:paymentHistory')}</CardTitle>
              <CardDescription>{t('translation:trackAllPaymentTransactions')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('translation:payment')}</TableHead>
                    <TableHead>{t('translation:invoice')}</TableHead>
                    <TableHead>{t('translation:patient')}</TableHead>
                    <TableHead>{t('translation:date')}</TableHead>
                    <TableHead>{t('translation:amount')}</TableHead>
                    <TableHead>{t('translation:method')}</TableHead>
                    <TableHead className="text-right">{t('translation:actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.invoiceId}</TableCell>
                      <TableCell>{payment.patientName}</TableCell>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            payment.method === "Insurance"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800",
                          )}
                        >
                          {payment.method}
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
                            <DropdownMenuItem onClick={() => setSelectedPayment(payment)}>
                              <FileText className="h-4 w-4 mr-2" />{t('translation:viewDetails')}</DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="h-4 w-4 mr-2" />{t('translation:printReceipt')}</DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />{t('translation:emailReceipt')}</DropdownMenuItem>
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

        <TabsContent value="plans" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('translation:paymentPlans')}</CardTitle>
              <CardDescription>{t('translation:manageInstallmentPaymentPlans')}</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentPlans.length > 0 ? (
                <div className="space-y-6">
                  {paymentPlans.map((plan) => (
                    <Card key={plan.id} className="border-l-4 border-blue-500">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">
                              {plan.patientName} - {plan.id}
                            </CardTitle>
                            <CardDescription>Invoice: {plan.invoiceId}</CardDescription>
                          </div>
                          <Badge
                            className={cn(
                              plan.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800",
                            )}
                          >
                            {translateValue('status', plan.status, t)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between mb-2">
                          <div className="text-sm text-muted-foreground">{t('translation:totalAmount')}</div>
                          <div className="font-medium">{formatCurrency(plan.totalAmount)}</div>
                        </div>
                        <div className="flex justify-between mb-2">
                          <div className="text-sm text-muted-foreground">{t('translation:remainingBalance')}</div>
                          <div className="font-medium">{formatCurrency(plan.remainingBalance)}</div>
                        </div>
                        <div className="mb-2">
                          <div className="text-sm text-muted-foreground mb-1">{t('translation:paymentProgress')}</div>
                          <Progress value={(1 - plan.remainingBalance / plan.totalAmount) * 100} className="h-2" />
                        </div>
                        <div className="mt-4">
                          <div className="text-sm font-medium mb-2">{t('translation:installments')}</div>
                          <div className="space-y-2">
                            {plan.installments.map((installment) => (
                              <div
                                key={installment.number}
                                className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
                              >
                                <div>
                                  <div className="text-sm">Installment #{installment.number}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Due: {formatDate(installment.dueDate)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="font-medium">{formatCurrency(installment.amount)}</div>
                                  <Badge
                                    className={cn(
                                      installment.status === "paid"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-amber-100 text-amber-800",
                                    )}
                                  >
                                    {translateValue('status', installment.status, t)}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />{t('translation:viewDetails')}</Button>
                        {plan.remainingBalance > 0 && (
                          <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                            <CreditCard className="h-4 w-4 mr-2" />{t('translation:processPayment')}</Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="flex justify-center mb-4">
                    <Calendar className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{t('translation:noPaymentPlans')}</h3>
                  <p className="text-muted-foreground mb-4">{t('translation:thereAreNoActivePaymentPlansAt')}</p>
                  <Button onClick={() => setShowPaymentPlan(true)} className="bg-teal-500 hover:bg-teal-600">
                    <Plus className="h-4 w-4 mr-2" />{t('translation:createPaymentPlan')}</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('translation:revenueOverview')}</CardTitle>
                <CardDescription>{t('translation:monthlyRevenueBreakdown')}</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <BarChart4 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{t('translation:revenueChartVisualizationWould')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('translation:paymentMethods')}</CardTitle>
                <CardDescription>{t('translation:distributionByPaymentType')}</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{t('translation:paymentMethodsChartWouldAppear')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('translation:outstandingBalances')}</CardTitle>
                <CardDescription>{t('translation:agingAccountsReceivable')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm">{t('translation:current030Days')}</div>
                      <div className="text-sm font-medium">{formatCurrency(1675.0)}</div>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm">{t('translation:3160Days')}</div>
                      <div className="text-sm font-medium">{formatCurrency(425.0)}</div>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm">{t('translation:6190Days')}</div>
                      <div className="text-sm font-medium">{formatCurrency(0.0)}</div>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm">{t('translation:over90Days')}</div>
                      <div className="text-sm font-medium">{formatCurrency(750.0)}</div>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('translation:insuranceClaimsStatus')}</CardTitle>
                <CardDescription>{t('translation:overviewOfClaimProcessing')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-muted-foreground">{t('translation:approved')}</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <Clock className="h-8 w-8 text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-sm text-muted-foreground">{t('translation:pending')}</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <AlertCircle className="h-8 w-8 text-rose-500" />
                    </div>
                    <div className="text-2xl font-bold">1</div>
                    <div className="text-sm text-muted-foreground">{t('translation:rejected')}</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <Wallet className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold">{formatCurrency(8675.0)}</div>
                    <div className="text-sm text-muted-foreground">{t('translation:totalClaimed')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
      {/* Create Invoice Dialog */}
      <Dialog open={showCreateInvoice} onOpenChange={setShowCreateInvoice}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{t('translation:createInvoice')}</DialogTitle>
            <DialogDescription>{t('translation:generateANewInvoiceForAPatient')}</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)

              // Get patient details
              const patientId = formData.get("patientId")
              const patient = patients.find((p) => p.id === patientId)

              // Get items from form
              const itemsCount = Number.parseInt(formData.get("itemsCount") || "0")
              const items = []

              for (let i = 0; i < itemsCount; i++) {
                const description = formData.get(`item-description-${i}`)
                const quantity = Number.parseInt(formData.get(`item-quantity-${i}`) || "0")
                const unitPrice = Number.parseFloat(formData.get(`item-price-${i}`) || "0")
                const total = quantity * unitPrice

                items.push({
                  description,
                  quantity,
                  unitPrice,
                  total,
                })
              }

              // Create new invoice
              const newInvoice = {
                patientId,
                patientName: patient ? patient.name : "",
                items,
                insuranceClaim: {
                  id: null,
                  status: "pending",
                  coverageAmount: 0,
                },
                notes: formData.get("notes") || "",
              }

              handleAddInvoice(newInvoice)
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="patientId" className="text-right">{t('translation:patient')}</Label>
                <Select name="patientId" required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t('translation:selectPatient')} />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} ({patient.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium">{t('translation:invoiceItems')}</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const itemsContainer = document.getElementById("invoice-items")
                      const itemsCount = itemsContainer.children.length

                      const newItem = document.createElement("div")
                      newItem.className = "grid grid-cols-12 gap-2 mb-2"
                      newItem.innerHTML = `
                        <div class="col-span-6">
                          <Input name="item-description-${itemsCount}" placeholder={t('translation:description')} required />
                        </div>
                        <div class="col-span-2">
                          <Input name="item-quantity-${itemsCount}" type="number" min="1" placeholder={t('translation:qty')} required />
                        </div>
                        <div class="col-span-3">
                          <Input name="item-price-${itemsCount}" type="number" min="0" step="0.01" placeholder={t('translation:price')} required />
                        </div>
                        <div class="col-span-1">
                          <Button type="button" variant="ghost" size="icon" class="remove-item">
                            <Trash2 class="h-4 w-4" />
                          </Button>
                        </div>
                      `

                      itemsContainer.appendChild(newItem)

                      // Update items count
                      document.getElementById("itemsCount").value = itemsCount + 1

                      // Add event listener to remove button
                      const removeButton = newItem.querySelector(".remove-item")
                      removeButton.addEventListener("click", () => {
                        newItem.remove()
                        // Update items count
                        document.getElementById("itemsCount").value =
                          document.getElementById("invoice-items").children.length
                      })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />{t('translation:addItem')}</Button>
                </div>

                <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium">
                  <div className="col-span-6">{t('translation:description')}</div>
                  <div className="col-span-2">{t('translation:quantity')}</div>
                  <div className="col-span-3">{t('translation:unitPrice')}</div>
                  <div className="col-span-1"></div>
                </div>

                <div id="invoice-items" className="space-y-2">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-6">
                      <Input name="item-description-0" placeholder={t('translation:description')} required />
                    </div>
                    <div className="col-span-2">
                      <Input name="item-quantity-0" type="number" min="1" defaultValue="1" placeholder={t('translation:qty')} required />
                    </div>
                    <div className="col-span-3">
                      <Input name="item-price-0" type="number" min="0" step="0.01" placeholder={t('translation:price')} required />
                    </div>
                    <div className="col-span-1">
                      <Button type="button" variant="ghost" size="icon" className="remove-item" disabled>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <input type="hidden" id="itemsCount" name="itemsCount" value="1" />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right pt-2">{t('translation:notes')}</Label>
                <Textarea id="notes" name="notes" className="col-span-3" rows={3} />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="useInsurance" className="text-right">{t('translation:insurance')}</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox id="useInsurance" name="useInsurance" />
                  <Label htmlFor="useInsurance">{t('translation:submitToPatientsInsurance')}</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateInvoice(false)}>{t('translation:cancel')}</Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">{t('translation:createInvoice')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Process Payment Dialog */}
      <Dialog open={showProcessPayment} onOpenChange={setShowProcessPayment}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('translation:processPayment')}</DialogTitle>
            <DialogDescription>{t('translation:recordAPaymentForAnInvoice')}</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)

              // Get invoice details
              const invoiceId = formData.get("invoiceId")
              const invoice = invoices.find((inv) => inv.id === invoiceId)

              // Create new payment
              const newPayment = {
                invoiceId,
                patientName: invoice ? invoice.patientName : "",
                amount: Number.parseFloat(formData.get("amount") || "0"),
                method: formData.get("method"),
                reference: formData.get("reference"),
                notes: formData.get("notes") || "",
              }

              handleProcessPayment(newPayment)
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invoiceId" className="text-right">{t('translation:invoice')}</Label>
                <Select name="invoiceId" required defaultValue={selectedInvoice ? selectedInvoice.id : undefined}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t('translation:selectInvoice')} />
                  </SelectTrigger>
                  <SelectContent>
                    {invoices
                      .filter((inv) => inv.balance > 0)
                      .map((invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.id} - {invoice.patientName} ({formatCurrency(invoice.balance)})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">{t('translation:amount')}</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="col-span-3"
                  required
                  defaultValue={selectedInvoice ? selectedInvoice.balance.toFixed(2) : ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">{t('translation:paymentMethod')}</Label>
                <Select name="method" required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t('translation:selectMethod')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">{t('translation:cash')}</SelectItem>
                    <SelectItem value="Credit Card">{t('translation:creditCard')}</SelectItem>
                    <SelectItem value="Debit Card">{t('translation:debitCard')}</SelectItem>
                    <SelectItem value="Bank Transfer">{t('translation:bankTransfer')}</SelectItem>
                    <SelectItem value="Insurance">{t('translation:insurance')}</SelectItem>
                    <SelectItem value="Other">{t('translation:other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reference" className="text-right">{t('translation:reference')}</Label>
                <Input id="reference" name="reference" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right pt-2">{t('translation:notes')}</Label>
                <Textarea id="notes" name="notes" className="col-span-3" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowProcessPayment(false)
                  setSelectedInvoice(null)
                }}
              >{t('translation:cancel')}</Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">{t('translation:processPayment')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Payment Plan Dialog */}
      <Dialog open={showPaymentPlan} onOpenChange={setShowPaymentPlan}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('translation:createPaymentPlan')}</DialogTitle>
            <DialogDescription>{t('translation:setUpAnInstallmentPaymentPlanF')}</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)

              // Get invoice details
              const invoiceId = formData.get("invoiceId")
              const invoice = invoices.find((inv) => inv.id === invoiceId)

              // Get installment details
              const installmentsCount = Number.parseInt(formData.get("installmentsCount") || "1")
              const installmentAmount = invoice.balance / installmentsCount

              // Create installments array
              const installments = []
              const startDate = new Date()

              for (let i = 0; i < installmentsCount; i++) {
                const dueDate = new Date(startDate)
                dueDate.setMonth(dueDate.getMonth() + i)

                installments.push({
                  number: i + 1,
                  dueDate: dueDate.toISOString().split("T")[0],
                  amount: installmentAmount,
                  status: "pending",
                  paymentId: null,
                })
              }

              // Create end date
              const endDate = new Date(startDate)
              endDate.setMonth(endDate.getMonth() + installmentsCount - 1)

              // Create new payment plan
              const newPlan = {
                invoiceId,
                patientId: invoice.patientId,
                patientName: invoice.patientName,
                totalAmount: invoice.balance,
                remainingBalance: invoice.balance,
                installments,
                startDate: startDate.toISOString().split("T")[0],
                endDate: endDate.toISOString().split("T")[0],
              }

              handleCreatePaymentPlan(newPlan)
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invoiceId" className="text-right">{t('translation:invoice')}</Label>
                <Select name="invoiceId" required defaultValue={selectedInvoice ? selectedInvoice.id : undefined}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t('translation:selectInvoice')} />
                  </SelectTrigger>
                  <SelectContent>
                    {invoices
                      .filter((inv) => inv.balance > 0)
                      .map((invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.id} - {invoice.patientName} ({formatCurrency(invoice.balance)})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="installmentsCount" className="text-right">{t('translation:OfInstallments')}</Label>
                <Select name="installmentsCount" defaultValue="3">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t('translation:selectNumberOfInstallments')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">{t('translation:2Installments')}</SelectItem>
                    <SelectItem value="3">{t('translation:3Installments')}</SelectItem>
                    <SelectItem value="4">{t('translation:4Installments')}</SelectItem>
                    <SelectItem value="6">{t('translation:6Installments')}</SelectItem>
                    <SelectItem value="12">{t('translation:12Installments')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right pt-2">{t('translation:notes')}</Label>
                <Textarea id="notes" name="notes" className="col-span-3" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPaymentPlan(false)
                  setSelectedInvoice(null)
                }}
              >{t('translation:cancel')}</Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">{t('translation:createPlan')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Invoice Details Dialog */}
      <Dialog
        open={!!selectedInvoice && !showProcessPayment && !showPaymentPlan}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{t('translation:invoiceDetails')}</DialogTitle>
            <DialogDescription>Invoice #{selectedInvoice?.id}</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-medium">{t('translation:patientInformation')}</h3>
                  <p>{selectedInvoice.patientName}</p>
                  <p className="text-sm text-muted-foreground">ID: {selectedInvoice.patientId}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-medium">{t('translation:invoiceDetails')}</h3>
                  <p>Date: {formatDate(selectedInvoice.date)}</p>
                  <p className="text-sm text-muted-foreground">Due: {formatDate(selectedInvoice.dueDate)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">{t('translation:items')}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('translation:description')}</TableHead>
                      <TableHead className="text-right">{t('translation:quantity')}</TableHead>
                      <TableHead className="text-right">{t('translation:unitPrice')}</TableHead>
                      <TableHead className="text-right">{t('translation:total')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between border-t pt-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">{t('translation:insuranceInformation')}</h3>
                  <p>Claim ID: {selectedInvoice.insuranceClaim.id || "Not submitted"}</p>
                  <p>{t('translation:status')}<Badge
                      className={cn(
                        selectedInvoice.insuranceClaim.status === "approved"
                          ? "bg-green-100 text-green-800ml-2"
                          : selectedInvoice.insuranceClaim.status === "rejected"
                            ? "bg-rose-100 text-rose-800 ml-2"
                            : "bg-amber-100 text-amber-800 ml-2",
                      )}
                    >
                      {translateValue('status', selectedInvoice.insuranceClaim.status, t)}
                    </Badge>
                  </p>
                  <p>Coverage Amount: {formatCurrency(selectedInvoice.insuranceClaim.coverageAmount)}</p>
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{t('translation:subtotal')}</span>
                      <span>{formatCurrency(selectedInvoice.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t('translation:paid')}</span>
                      <span>{formatCurrency(selectedInvoice.paid)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t('translation:balance')}</span>
                      <span>{formatCurrency(selectedInvoice.balance)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">{t('translation:notes')}</h3>
                <p className="text-sm">{selectedInvoice.notes}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <div>
              <Button variant="outline" size="sm" className="mr-2">
                <Printer className="h-4 w-4 mr-2" />{t('translation:print')}</Button>
              <Button variant="outline" size="sm">
                <Send className="h-4 w-4 mr-2" />{t('translation:email')}</Button>
            </div>
            <Button onClick={() => setSelectedInvoice(null)}>{t('translation:close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Payment Details Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('translation:paymentDetails')}</DialogTitle>
            <DialogDescription>Payment #{selectedPayment?.id}</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('translation:invoice')}</h3>
                  <p className="font-medium">{selectedPayment.invoiceId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('translation:date')}</h3>
                  <p className="font-medium">{formatDate(selectedPayment.date)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('translation:patient')}</h3>
                  <p className="font-medium">{selectedPayment.patientName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('translation:amount')}</h3>
                  <p className="font-medium">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('translation:method')}</h3>
                  <Badge
                    className={cn(
                      selectedPayment.method === "Insurance"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800",
                    )}
                  >
                    {selectedPayment.method}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('translation:reference')}</h3>
                  <p className="font-medium">{selectedPayment.reference}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{t('translation:notes')}</h3>
                <p className="text-sm">{selectedPayment.notes}</p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Receipt className="h-5 w-5 mr-2 text-teal-500" />
                  <span className="font-medium">{t('translation:receipt')}</span>
                </div>
                <p className="text-sm mt-2">Receipt #{selectedPayment.id} was generated for this payment.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" className="mr-2">
              <Printer className="h-4 w-4 mr-2" />{t('translation:printReceipt')}</Button>
            <Button onClick={() => setSelectedPayment(null)}>{t('translation:close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

