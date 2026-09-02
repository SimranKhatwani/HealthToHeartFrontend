import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/UI/Card"
import Button from "../components/UI/Button"
import Input from "../components/UI/Input"
import Label from "../components/UI/Label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/UI/Tabs"
import Badge  from "../components/UI/Badge"
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
import { Plus, Search, Edit, Trash2, FileText, DollarSign, Calendar, Clock, AlertCircle } from "lucide-react"
import Checkbox from "../components/UI/CheckBox"
import {
  useGetMealPlansQuery,
  useGetPatientMealQuery,
  useCreateMealPlanMutation,
  useDeleteMealPlanMutation,
  useEditMealPlanMutation,
  useEditAssignMealPlanMutation,
  useCreatePatientMealMutation,
  useDeleteAssignMealPlanMutation
} from '../redux/slices/mealPlanSlice';
import { useGetPatientsQuery } from '../redux/slices/patientSlice'
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import {socket} from "../components/hooks/useInitSocket";
import { useCreateNotificationsMutation } from "../redux/slices/notificationSlice";
import { useFetchLoggedInUserQuery } from "../redux/slices/authSlice";
import { useTranslation } from "react-i18next";
import { translateValue } from '../utilis/translate';

export default function MealPlans() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("")
  const [searchBillTerm, setSearchBillTerm] = useState("")
  const [showAddMealPlan, setShowAddMealPlan] = useState(false)
  const [showAddAssignment, setShowAddAssignment] = useState(false)
  const [showBillingForm, setShowBillingForm] = useState(false)
  const { data: mealPlans, isLoading, error } = useGetMealPlansQuery();
  const { data: patientData } = useGetPatientsQuery();
  const { data: patientMeal } = useGetPatientMealQuery();
  const [createMealPlan] = useCreateMealPlanMutation();
  const [createPatientMeal] = useCreatePatientMealMutation();
  const [deleteMealPlan] = useDeleteMealPlanMutation();
  const [deleteAssignMealPlan] = useDeleteAssignMealPlanMutation();
  const [editMealPlan] = useEditMealPlanMutation();
  const [editAssignMealPlan] = useEditAssignMealPlanMutation();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all status');
  const [createNotification] = useCreateNotificationsMutation();
  const { data: logInUser } = useFetchLoggedInUserQuery();
  const [newMeal, setNewMeal] = useState({
    name: "",
    type: "Basic",
    calories: "",
    costPerDay: "",
    status: t('translation:active'),
  });
  const [editMealData, setEditMealData] = useState(null)

  useEffect(()=>{
    if(editMealData){
      setNewMeal({
        name: editMealData.name,
        type: editMealData.type,
        calories: editMealData.calories,
        costPerDay: editMealData.costPerDay,
        status: editMealData.status,
      })
    }
  }, [editMealData])

  const [assignPatientMeal, setAssignPatientMeal] = useState({
    patientId: "",
    MealPlanId: "",
    startDate: "",
    endDate: "",
    status: "",
    billingStatus: "",
    invoiceDate: ""
  });
  
  const [editAssignMeal, setEditAssignMeal] = useState(null);
  
  useEffect(() => {
    if (editAssignMeal) {
      setAssignPatientMeal({
        patientId: editAssignMeal.patientDetails?._id,
        MealPlanId: editAssignMeal.MealPlan?.mealPlanId,
        startDate: editAssignMeal.startDate,
        endDate: editAssignMeal.endDate,
        status: editAssignMeal.status,
        billingStatus: editAssignMeal.billingStatus,
        invoiceDate: editAssignMeal.invoiceDate
      });
    }
  }, [editAssignMeal]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  // console.log("newMeal", newMeal)
  // console.log("mealPlans", mealPlans)
  // console.log("patientMeal", patientMeal)
  // console.log("patientData", patientData)
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setNewMeal((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? (checked ? t('translation:active') : "Inactive") : value,
    }));
  };

  const handleAssignMealChange = (field, value) => {
    setAssignPatientMeal((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleCreate = async (e) => {
    e.preventDefault(); // Prevent default form submit
    let response
    try {
      if(editMealData){
        response = await editMealPlan({
          id: editMealData._id,
          ...newMeal,
        }).unwrap();
        setShowAddMealPlan(false);
      }else{
        response = await createMealPlan(newMeal).unwrap(); // Or replace with your actual API call
        toast.success(t('translation:mealPlanCreated'));
        setNewMeal({
          name: "",
          type: "Basic",
          calories: "",
          costPerDay: "",
          status: t('translation:active'),
        });
        setShowAddMealPlan(false);
      }
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  const handleAssignMealSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...assignPatientMeal,
      invoiceDate: new Date().toISOString()
    };
  
    try {
      let response;
  
      if (editAssignMeal) {
        response = await editAssignMealPlan({
          id: editAssignMeal._id,
          ...assignPatientMeal
        }).unwrap();
        toast.success(t('translation:mealPlanUpdated'));
        setShowAddAssignment(false);
      } else {
        response = await createPatientMeal(payload).unwrap();
        toast.success(t('translation:mealPlanAssigned'));
  
        setShowAddAssignment(false);
        setAssignPatientMeal({
          patientId: "",
          MealPlanId: "",
          startDate: "",
          endDate: "",
          status: "Assigned",
          billingStatus: "manual",
          invoiceDate: ""
        });
      }
  
      if (response?.success) {
        socket.emit("operation-scheduled", {
          to: response.data.patientDetails,
          message: "Meal assigned to you",
          date: new Date(),
          notDesc: `Pay amount ${response.data.payAmount}`
        });
  
        await createNotification({
          sender: logInUser._id,
          receiver: response.data.patientDetails,
          message: "Meal assigned to you.",
          notDesc: `Pay amount ${response.data.payAmount}`
        });
      }
  
    } catch (err) {
      toast.error(t('translation:failedToAssignMealPlan'));
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMealPlan(id).unwrap();
      toast.warn(t('translation:mealPlanDeleted'));
    } catch (err) {
      // console.error('Delete error:', err);
    }
  };

  const handleAssignMealDelete = async (id) => {
    try {
      await deleteAssignMealPlan(id).unwrap();
      toast.warn(t('translation:assignedMealPlanDeleted'));
    } catch (err) {
      // console.error('Delete error:', err);
    }
  };

  if (isLoading) return <p>{t('translation:loading')}</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredMealPlans = mealPlans?.data?.filter((plan) => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || plan.type === selectedType;
    return matchesSearch && matchesType;
  });

  const filteredMealPlanBills = patientMeal?.data?.filter((plan) => {
    const matchesSearch = plan.MealPlan.name.toLowerCase().includes(searchBillTerm.toLowerCase());
    const matchesType = selectedStatus === 'all status' || plan.billingStatus === selectedStatus;
    return matchesSearch && matchesType;
  });
  
  const paginatedRecords = filteredMealPlanBills?.slice(indexOfFirstRecord, indexOfLastRecord) || [];
  const totalPages = Math.ceil((filteredMealPlanBills?.length || 0) / recordsPerPage);

  // Status badge color mapping
  const getStatusColor = (status) => {
    const statusColors = {
      Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      Completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Scheduled: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Billed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Not Billed": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      Overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <>
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("mealPlans.title", "Meal Plans")}</h1>
        <div className="flex space-x-2">
          {/* <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => setShowBillingForm(true)}>
            <DollarSign className="h-4 w-4 mr-2" />
            Billing Management
          </Button> */}
          <Button className="bg-teal-500 hover:bg-teal-600" onClick={() => setShowAddMealPlan(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("mealPlans.createPlan", "Create Meal Plan")}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="meal-plans">
        <TabsList className="bg-teal-100 inline-flex h-10 items-center justify-center rounded-md text-gray-500">
          <TabsTrigger
            value="meal-plans"
            className="px-4 py-2 rounded-md data-[state=active]:bg-teal-400 data-[state=active]:text-white cursor-pointer"
          >
            {t("navigation.mealPlans", "Meal Plans")}
          </TabsTrigger>
          <TabsTrigger
            value="assignments"
            className="px-4 py-2 rounded-md data-[state=active]:bg-teal-400 data-[state=active]:text-white cursor-pointer"
          >
            {t("mealPlans.patientAssignments", "Patient Assignments")}
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="px-4 py-2 rounded-md data-[state=active]:bg-teal-400 data-[state=active]:text-white cursor-pointer"
          >
            {t("mealPlans.billingRecords", "Billing Records")}
          </TabsTrigger>
        </TabsList>


          {/* Meal Plans Tab */}
          <TabsContent value="meal-plans">
            <Card className="border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t("mealPlans.availablePlans", "Available Meal Plans")}</CardTitle>
                    <CardDescription>{t("mealPlans.availablePlansSub", "Manage dietary plans for patients")}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder={t("mealPlans.searchPlaceholder", "Search meal plans or diets...")}
                        className="pl-8 w-auto border border-gray-400 h-10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={selectedType} onValueChange={(value) => setSelectedType(value)}>
                      <SelectTrigger className="w-[180px] border border-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-xl p-1.5">
                        <SelectValue placeholder={t("mealPlans.filterType", "Filter by type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("common.allTypes", "All Types")}</SelectItem>
                        <SelectItem value="Regular">{t("mealPlans.types.regular", "Regular")}</SelectItem>
                        <SelectItem value="Special">{t("mealPlans.types.special", "Special")}</SelectItem>
                        <SelectItem value="Super Special">{t("mealPlans.types.superSpecial", "Super Special")}</SelectItem>
                        <SelectItem value="Basic">{t("mealPlans.types.basic", "Basic")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("common.name", "Name")}</TableHead>
                      <TableHead>{t("common.type", "Type")}</TableHead>
                      <TableHead>{t("mealPlans.calories", "Calories")}</TableHead>
                      <TableHead>{t("mealPlans.costPerDay", "Cost per Day ($)")}</TableHead>
                      <TableHead>{t("common.status", "Status")}</TableHead>
                      <TableHead className="text-right">{t("common.actions", "Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMealPlans?.length > 0 ? (
                      filteredMealPlans.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">{plan.name}</TableCell>
                          <TableCell>{plan.type === "Basic" ? t("mealPlans.types.basic", "Basic") : plan.type === "Regular" ? t("mealPlans.types.regular", "Regular") : plan.type === "Special" ? t("mealPlans.types.special", "Special") : plan.type === "Super Special" ? t("mealPlans.types.superSpecial", "Super Special") : plan.type}</TableCell>
                          <TableCell>{plan.calories}</TableCell>
                          <TableCell>${plan.costPerDay.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(plan.status)}>
                                {plan.status === t('translation:active') ? t("insurance.status.active", t('translation:active')) : plan.status === "Inactive" ? t("insurance.status.inactive", "Inactive") : plan.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="icon" 
                              onClick={() => {
                                setShowAddMealPlan(true)
                                setEditMealData(plan)
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleDelete(plan._id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                          {t("mealPlans.noPlansFound", "No meal plans found.")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patient Assignments Tab */}
          <TabsContent value="assignments">
            <Card className="border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t("mealPlans.patientMealAssignments", "Patient Meal Assignments")}</CardTitle>
                    <CardDescription>{t("mealPlans.patientMealAssignmentsSub", "Manage patient meal plan assignments")}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setShowAddAssignment(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t("mealPlans.assignMealPlan", "Assign Meal Plan")}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("insurance.patientId", "Patient ID")}</TableHead>
                      <TableHead>{t("patients.patientName", "Patient Name")}</TableHead>
                      <TableHead>{t("navigation.mealPlans", "Meal Plan")}</TableHead>
                      <TableHead>{t("mealPlans.startDate", "Start Date")}</TableHead>
                      <TableHead>{t("mealPlans.endDate", "End Date")}</TableHead>
                      <TableHead>{t("common.status", "Status")}</TableHead>
                      <TableHead>{t("mealPlans.billingStatus", "Billing Status")}</TableHead>
                      <TableHead className="text-right">{t("common.actions", "Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientMeal?.data?.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment?.patientDetails?.id}</TableCell>
                        <TableCell className="font-medium">{assignment?.patientDetails?.name}</TableCell>
                        <TableCell>{mealPlans?.data?.find((p) => p.id === assignment.mealPlanId)?.name}</TableCell>
                        <TableCell>{new Date(assignment.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(assignment.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(assignment.status)}>{translateValue('status', assignment.status, t)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(assignment.billingStatus)}>{assignment.billingStatus}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="icon"
                            onClick={() => {
                              setShowAddAssignment(true)
                              setEditAssignMeal(assignment)
                            }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleAssignMealDelete(assignment._id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Records Tab */}
          <TabsContent value="billing">
            <Card className="border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t("mealPlans.billingRecordsTitle", "Meal Plan Billing Records")}</CardTitle>
                    <CardDescription>{t("mealPlans.billingRecordsSub", "Track and manage meal plan billing")}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder={t("mealPlans.searchPlaceholder", "Search meal plans...")}
                        className="pl-8 w-auto border border-gray-400 h-10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                        value={searchBillTerm}
                        onChange={(e) => setSearchBillTerm(e.target.value)}
                      />
                    </div>
                    <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
                      <SelectTrigger className="w-[180px] border border-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-xl p-1.5">
                        <SelectValue placeholder={t("mealPlans.filterType", "Filter by type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all status">{t("mealPlans.allStatus", "All Status")}</SelectItem>
                        <SelectItem value="Billed">{t("mealPlans.status.billed", "Billed")}</SelectItem>
                        <SelectItem value="Pending">{t("status.pending", "Pending")}</SelectItem>
                        <SelectItem value="Not Billed">{t("mealPlans.status.notBilled", "Not Billed")}</SelectItem>
                        <SelectItem value="Paid">{t("mealPlans.status.paid", "Paid")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("insurance.patientId", "Patient ID")}</TableHead>
                      <TableHead>{t("patients.patientName", "Patient Name")}</TableHead>
                      <TableHead>{t("navigation.mealPlans", "Meal Plan")}</TableHead>
                      <TableHead>{t("mealPlans.period", "Period")}</TableHead>
                      <TableHead>{t("common.amount", "Amount ($)")}</TableHead>
                      <TableHead>{t("common.status", "Status")}</TableHead>
                      <TableHead>{t("mealPlans.billingStatus", "Billing Status")}</TableHead>
                      <TableHead>{t("mealPlans.invoiceDate", "Invoice Date")}</TableHead>
                      {/* <TableHead className="text-right">Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {filteredMealPlanBills?.length > 0 ? (
                    paginatedRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.patientDetails.id}</TableCell>
                        <TableCell className="font-medium">{record.patientDetails.name}</TableCell>
                        <TableCell>{record.MealPlan.name}</TableCell>
                        <TableCell>
                          {new Date(record.startDate).toLocaleDateString()} - {new Date(record.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${record.payAmount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>{translateValue('status', record.status, t)}</Badge>
                        </TableCell>
                        <TableCell>
                          {record.billingStatus}
                        </TableCell>
                        <TableCell>{new Date(record.invoiceDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        {t("mealPlans.noBillsFound", "No meal plan bills found.")}
                      </TableCell>
                    </TableRow>
                  )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  {t("common.showing", "Showing")} {paginatedRecords.length} {t("common.of", "of")} {filteredMealPlanBills?.length || 0} {t("common.records", "records")}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    {t("common.previous", "Previous")}
                  </Button>
                  <span className="text-sm text-gray-600">
                    {t("common.page", "Page")} {currentPage} {t("common.of", "of")} {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    {t("common.next", "Next")}
                  </Button>
                </div>
              </CardFooter>

            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
      {/* Add Meal Plan Dialog */}
      <Dialog open={showAddMealPlan} onOpenChange={setShowAddMealPlan}>
      <DialogContent className="sm:max-w-[600px]">
    <form onSubmit={handleCreate} className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-900">{t("mealPlans.createMealPlanTitle", "Create a New Meal Plan")}</DialogTitle>
        <DialogDescription className="text-sm text-gray-500">
          {t("mealPlans.createMealPlanSub", "Fill out the form below to add a new meal plan.")}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right font-medium text-gray-700">
            {t("common.name", "Name")}
          </Label>
          <Input
            id="name"
            value={newMeal.name}
            onChange={handleInputChange}
            placeholder={t("mealPlans.mealPlanNamePlaceholder", "Meal plan name")}
            className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right font-medium text-gray-700">
            {t("common.type", "Type")}
          </Label>
          <select
                id="type"
                value={translateValue('type', newMeal.type, t)}
                onChange={handleInputChange}
                className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">{t("insurance.selectType", "Select type")}</option>
                <option value="Regular">{t("mealPlans.types.regular", "Regular")}</option>
                <option value="Special">{t("mealPlans.types.special", "Special")}</option>
                <option value="Super Special">{t("mealPlans.types.superSpecial", "Super Special")}</option>
                <option value="Basic">{t("mealPlans.types.basic", "Basic")}</option>
              </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
          <Label htmlFor="calories" className="text-right font-medium text-gray-700">
            {t("mealPlans.calories", "Calories")}
          </Label>
          <Input
            id="calories"
            type="number"
            value={newMeal.calories}
            onChange={handleInputChange}
            placeholder={t('translation:eg2000')}
            className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
          <Label htmlFor="costPerDay" className="text-right font-medium text-gray-700">
            {t("mealPlans.costPerDayLabel", "Cost / Day")}
          </Label>
          <Input
            id="costPerDay"
            type="number"
            step="0.01"
            value={newMeal.costPerDay}
            onChange={handleInputChange}
            placeholder="$"
            className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right font-medium text-gray-700">
            {t("common.status", "Status")}
          </Label>
          <div className="flex items-center col-span-3 space-x-3">
          <select
                id="status"
                value={translateValue('status', newMeal.status, t)}
                onChange={handleInputChange}
                className="col-span-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">{t("inventory.selectStatus", "Select status")}</option>
                <option value="Active">{t("insurance.status.active", "Active")}</option>
                <option value="Inactive">{t("insurance.status.inactive", "Inactive")}</option>
              </select>
          </div>
        </div>
      </div>

      <DialogFooter className="pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAddMealPlan(false)}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          {t("common.cancel", "Cancel")}
        </Button>
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
          {t("mealPlans.saveMealPlan", "Save Meal Plan")}
        </Button>
        </DialogFooter>
      </form>
      </DialogContent>
    </Dialog>


      {/* Assign Meal Plan Dialog */}
      <Dialog open={showAddAssignment} onOpenChange={setShowAddAssignment}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{t("mealPlans.assignMealPlanTitle", "Assign Meal Plan to Patient")}</DialogTitle>
            <DialogDescription>{t("mealPlans.assignMealPlanSub", "Assign a meal plan to a patient and set the duration.")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignMealSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient" className="text-right">
                {t("common.patient", "Patient")}
              </Label>
              <Select onValueChange={(value) => handleAssignMealChange("patientId", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("insurance.selectPatient", "Select patient")} />
                </SelectTrigger>
                <SelectContent>
                  {patientData?.data?.map((patient)=>{
                    return(
                      <SelectItem 
                        key={patient._id}
                        value={patient._id}>
                          {patient.id}: {patient.name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mealplan" className="text-right">
                {t("navigation.mealPlans", "Meal Plan")}
              </Label>
              <Select onValueChange={(value) => handleAssignMealChange("MealPlanId", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("mealPlans.selectMealPlan", "Select meal plan")} />
                </SelectTrigger>
                <SelectContent>
                  {mealPlans?.data?.map((meal)=>{
                    return(
                      <SelectItem 
                      key={meal._id}
                      value={meal._id}>{meal.mealPlanId}: {meal.name}</SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                {t("mealPlans.startDate", "Start Date")}
              </Label>
              <Input id="startDate" type="date" className="col-span-3" onChange={(e) => handleAssignMealChange("startDate", e.target.value)}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                {t("mealPlans.endDate", "End Date")}
              </Label>
              <Input id="endDate" type="date" className="col-span-3" onChange={(e) => handleAssignMealChange("endDate", e.target.value)}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mealplan" className="text-right">
                {t("common.status", "Status")}
              </Label>
              <Select onValueChange={(value) => handleAssignMealChange("status", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("inventory.selectStatus", "Select status")} />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem 
                      value="Active">{t("insurance.status.active", "Active")}</SelectItem>
                      <SelectItem 
                      value="Inactive">{t("insurance.status.inactive", "Inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mealplan" className="text-right">
                {t("mealPlans.billingStatus", "Billing Status")}
              </Label>
              <Select onValueChange={(value) => handleAssignMealChange("billingStatus", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("mealPlans.selectBillingStatus", "Select billing status")} />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem 
                      value="Billed">{t("mealPlans.status.billed", "Billed")}</SelectItem>
                      <SelectItem 
                      value="Pending">{t("status.pending", "Pending")}</SelectItem>
                      <SelectItem 
                      value="Paid">{t("mealPlans.status.paid", "Paid")}</SelectItem>
                      <SelectItem 
                      value="Not Billed">{t("mealPlans.status.notBilled", "Not Billed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAssignment(false)}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
              {t("mealPlans.assignMealPlan", "Assign Meal Plan")}
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Billing Management Dialog */}
      <Dialog open={showBillingForm} onOpenChange={setShowBillingForm}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{t('translation:mealPlanBillingManagement')}</DialogTitle>
            <DialogDescription>{t('translation:generateAndManageBillingForPat')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="billingType" className="text-right">{t('translation:billingType')}</Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('translation:selectBillingType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">{t('translation:individualPatient')}</SelectItem>
                  <SelectItem value="batch">{t('translation:batchProcessing')}</SelectItem>
                  <SelectItem value="insurance">{t('translation:insuranceClaim')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient" className="text-right">{t('translation:patient')}</Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('translation:selectPatient')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="p1001">{t('translation:p1001JohnSmith')}</SelectItem>
                  <SelectItem value="p1002">{t('translation:p1002SarahJohnson')}</SelectItem>
                  <SelectItem value="p1003">{t('translation:p1003RobertDavis')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="billingPeriod" className="text-right">{t('translation:billingPeriod')}</Label>
              <div className="col-span-3 flex space-x-2">
                <Input type="date" placeholder={t('translation:startDate')} />
                <Input type="date" placeholder={t('translation:endDate')} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountType" className="text-right">{t('translation:discount')}</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('translation:discountType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('translation:none')}</SelectItem>
                  <SelectItem value="percentage">{t('translation:percentage')}</SelectItem>
                  <SelectItem value="fixed">{t('translation:fixedAmount')}</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder={t('translation:amount')} className="w-[120px]" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">{t('translation:billingNotes')}</Label>
              <Input id="notes" placeholder={t('translation:additionalBillingInformation')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">{t('translation:options')}</Label>
              <div className="flex flex-col space-y-2 col-span-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="sendEmail" />
                  <label htmlFor="sendEmail" className="text-sm font-medium leading-none">{t('translation:sendEmailNotification')}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="printInvoice" />
                  <label htmlFor="printInvoice" className="text-sm font-medium leading-none">{t('translation:printInvoiceAutomatically')}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="includeDetails" />
                  <label htmlFor="includeDetails" className="text-sm font-medium leading-none">{t('translation:includeDetailedMealBreakdown')}</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBillingForm(false)}>{t('translation:cancel')}</Button>
            <Button type="submit" className="bg-teal-500 hover:bg-teal-600">{t('translation:generateBill')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nutritional Information Card */}
      {/* <Card className="mb-6 border-2 border-gray-200">
        <CardHeader>
          <CardTitle>Nutritional Management</CardTitle>
          <CardDescription>Track and manage nutritional requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dietary Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="vegetarian" />
                  <label htmlFor="vegetarian">Vegetarian</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="vegan" />
                  <label htmlFor="vegan">Vegan</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="glutenFree" />
                  <label htmlFor="glutenFree">Gluten-Free</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="dairyFree" />
                  <label htmlFor="dairyFree">Dairy-Free</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lowCarb" />
                  <label htmlFor="lowCarb">Low-Carb</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="kosher" />
                  <label htmlFor="kosher">Kosher</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="halal" />
                  <label htmlFor="halal">Halal</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="nutFree" />
                  <label htmlFor="nutFree">Nut-Free</label>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Menu Planning</h3>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Weekly Menu
                </Button>
                <Button variant="outline" className="flex-1">
                  <Clock className="h-4 w-4 mr-2" />
                  Meal Schedule
                </Button>
                <Button variant="outline" className="flex-1">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Allergies
                </Button>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                <p>
                  Connect with inventory system to check ingredient availability for meal planning and automatically
                  adjust menus based on stock levels.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </>
  )
}

