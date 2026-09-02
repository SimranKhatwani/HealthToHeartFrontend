import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/UI/Card"
import Button from "../components/UI/Button"
import Input from "../components/UI/Input"
import Label from "../components/UI/Label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/UI/Tabs"
import Badge from "../components/UI/Badge"
import { toast } from "react-toastify";
import { useSelector } from "react-redux"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../components/UI/Dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/UI/Table"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  Download,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
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
import { useCreateInsuranceClaimMutation, useCreateInsuranceProviderMutation, useDeleteInsuranceClaimMutation, useDeleteInsuranceProviderMutation, useGetInsuranceClaimsQuery, useGetInsuranceProvidersQuery, useUpdateInsuranceClaimMutation, useUpdateInsuranceProviderMutation } from "../redux/slices/insuranceSlice"
import { useGetPatientsQuery } from "../redux/slices/patientSlice"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { downloadPdf } from '../components/utilis/DownloadPdfs';
import { useTranslation } from "react-i18next";
import { translateValue } from '../utilis/translate';

export default function Insurance() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddProvider, setShowAddProvider] = useState(false)
  const [showAddClaim, setShowAddClaim] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [providers, setProviders] = useState()
  const [claims, setClaims] = useState();
  const { data, error, isLoading, isFetching, isSuccess, isError } = useGetInsuranceProvidersQuery();
  const { data: claimData, error: claimError, isLoading: claimIsLoading } = useGetInsuranceClaimsQuery();
  const [createInsuranceProvider] = useCreateInsuranceProviderMutation();
  const [deleteInsuranceProvider] = useDeleteInsuranceProviderMutation();
  const [deleteInsuranceClaim] = useDeleteInsuranceClaimMutation();
  const [updateInsuranceProvider] = useUpdateInsuranceProviderMutation();
  const [createInsuranceClaim] = useCreateInsuranceClaimMutation();
  const [updateInsuranceClaim] = useUpdateInsuranceClaimMutation();
  const { data: patientData, error: patientError, isLoading: patientIsLoading, } = useGetPatientsQuery();
  const [paitentslist, setPaitentslist] = useState(patientData?.data)
  const filterRef = useRef(null);
  const [selectedSurgeon, setSelectedSurgeon] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("providers");
  const { mode } = useSelector((state) => state.theme);

  const [providerData, setProviderData] = useState({
    name: "",
    type: "",
    contactPerson: "",
    phone: "",
    email: "",
    governmentId: "",
    patientsCount: 0,  // Default to 0
    status: "active",
  });


  // console.log("claimData", claimData)

  const handleChange = (e) => {
    setProviderData({ ...providerData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setProviderData({ ...providerData, type: value });
  };

  useEffect(() => {
    if (data) setProviders(data.
      providers);
    if (patientData) {
      // console.log(patientData?.data)
      setPaitentslist(patientData?.data)
    }
  }, [data, patientData]);

  useEffect(() => {
    if (claimData) setClaims(claimData?.claims);

  }, [claimData]);

  if (claimIsLoading || isLoading) {
    return <div className="flex items-center justify-center h-screen">{t('translation:loader')}</div>
  }


  // Filter providers based on search query
  const filteredProviders = providers?.filter(
    (provider) =>
      provider?.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      provider?.id?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      provider?.type?.toLowerCase().includes(searchQuery?.toLowerCase()),
  )

  // Filter claims based on search query
  const filteredClaims = claims?.filter(
    (claim) =>
      claim?.patientName?.email?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      claim?.patientId?.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      claim?.patientId?.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      claim?.id?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      claim?.service?.toLowerCase().includes(searchQuery?.toLowerCase()),
  )

  // Add new provider

  const handleAddProvider = async (e) => {
    e.preventDefault();

    try {
      // console.log("Submitting:", providerData); // Debug log
      const response = await createInsuranceProvider(providerData).unwrap();
      // console.log("Server Response:", response); // Log API response

      if (response.success) {
        toast.success(t("insurance.providerAddSuccess", "Provider added successfully!"));
        setShowAddProvider(false);
      } else {
        toast.error(response.message || t("insurance.providerAddError", "Failed to add provider"));
      }
    } catch (error) {
      toast.error(t("insurance.providerAddError", "Failed to add provider"));
    }
  };

  // Update provider
  const handleUpdateProvider = async (updatedProvider) => {
    try {
      const response = await updateInsuranceProvider(updatedProvider).unwrap();

      if (response.success) {
        toast.success(t("insurance.providerUpdateSuccess", "Provider updated successfully!"));
        setSelectedProvider(null);
      } else {
        toast.error(response.message || t("insurance.providerUpdateError", "Failed to update provider"));
      }
    } catch (error) {
      toast.error(t("insurance.providerUpdateError", "Failed to update provider"));
    }
  };

  // Delete provider
  const handleDeleteProvider = async (id) => {
    if (!window.confirm(t("insurance.deleteProviderConfirm", "Are you sure you want to delete this provider?"))) return;

    try {
      const response = await deleteInsuranceProvider(id).unwrap();

      if (response.success) {
        toast.success(t("insurance.providerDeleteSuccess", "Provider deleted successfully!"));
      } else {
        toast.error(response.message || t("insurance.providerDeleteError", "Failed to delete provider"));
      }
    } catch (error) {
      toast.error(t("insurance.providerDeleteError", "Failed to delete provider"));
    }
  };

  // Add new claim
  const handleAddClaim = async (newClaim) => {
    try {
      const response = await createInsuranceClaim(newClaim).unwrap();
      toast.success(t("insurance.claimAddSuccess", "Claim added successfully!"));
      setShowAddClaim(false);
    } catch (error) {
      toast.error(t("insurance.claimAddError", "Failed to add claim."));
    }
  };

  const handleUpdateClaim = async (updatedClaim) => {
    try {
      const response = await updateInsuranceClaim(updatedClaim).unwrap();
      toast.success(t("insurance.claimUpdateSuccess", "Claim updated successfully!"));
      setSelectedClaim(null)
    } catch (error) {
      toast.error(t("insurance.claimUpdateError", "Failed to update claim."));
    }
  };

  // Delete claim
  const handleDeleteClaim = async (id) => {
    if (!window.confirm(t("insurance.deleteClaimConfirm", "Are you sure you want to delete this claim?"))) return;

    try {
      const response = await deleteInsuranceClaim(id).unwrap();

      if (response.success) {
        toast.success(t("insurance.claimDeleteSuccess", "Claim deleted successfully!"));
        setClaims(claims?.filter((claim) => claim.id !== id))
      } else {
        toast.error(response.message || t("insurance.claimDeleteError", "Failed to delete claim"));
      }
    } catch (error) {
      toast.error(t("insurance.claimDeleteError", "Failed to delete claim"));
    }
  };


  // console.log("paitentslist:", paitentslist);

  return (
    <>
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">{t("insurance.title")}</h1>
          <div className="flex flex-col md:flex-row gap-2">
            <Button onClick={() => setShowAddClaim(true)} className="w-64 md:w-full">
              <FileText className="h-4 w-4 mr-2" />
              {t("insurance.newClaim", "New Claim")}
            </Button>
            <Button onClick={() => setShowAddProvider(true)} className="w-64 md:w-full">
              <Plus className="h-4 w-4 mr-2" />
              {t("insurance.addProvider", "Add Provider")}
            </Button>
          </div>
        </div>


        <div className="flex items-center mb-6 w-64 md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("insurance.searchPlaceholder", "Search insurance providers or claims...")}
              className="pl-8 w-full border-2 border-gray-400 h-10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 hover:bg-teal-50 m-2"
            onClick={() => {
              if (activeTab === "providers") {
                const headers = [
                  "ID",
                  "Provider Name",
                  "Type",
                  "Contact Person",
                  "Status",
                  "Patients",
                ];
                const exportData = data?.providers?.map((provider) => [
                  provider.id,
                  provider.name,
                  provider.type,
                  provider.contactPerson,
                  provider.status,
                  provider.patientsCount,
                ]);

                downloadPdf({
                  title: "Insurance Provider Report",
                  headers,
                  data: exportData,
                  fileName: "insurance_provider.pdf",
                });
              } else if (activeTab === "claims") {
                const headers = [
                  "ID",
                  "Patient Name",
                  "Provider Name",
                  "Service",
                  "Amount",
                  "Status",
                ];
                const exportData = claimData?.claims?.map((claim) => [
                  claim.id,
                  claim?.patientId?.name,
                  claim?.providerId?.name,
                  claim.service,
                  `$${claim.amount.toLocaleString()}`,
                  claim.status,
                ]);

                downloadPdf({
                  title: "Insurance Claim Report",
                  headers,
                  data: exportData,
                  fileName: "insurance_claims.pdf",
                });
              }
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            {t("common.export", "Export")}
          </Button>

        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='mb-6 overflow-auto'>
          <TabsList className="bg-teal-100 inline-flex h-10 items-center justify-center rounded-md text-gray-500">
            <TabsTrigger value="providers" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              {t("insurance.providers", "Insurance Providers")}
            </TabsTrigger>
            <TabsTrigger value="claims" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
              {t("insurance.claims", "Insurance Claims")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("insurance.providers", "Insurance Providers")}</CardTitle>
                <CardDescription>{t("insurance.providersSub", "Manage insurance providers and policies")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("common.id", "ID")}</TableHead>
                      <TableHead>{t("insurance.providerName", "Provider Name")}</TableHead>
                      <TableHead>{t("insurance.type", "Type")}</TableHead>
                      <TableHead>{t("insurance.contactPerson", "Contact Person")}</TableHead>
                      <TableHead>{t("common.status", "Status")}</TableHead>
                      <TableHead>{t("insurance.patients", "Patients")}</TableHead>
                      <TableHead className="text-right">{t("common.actions", "Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProviders?.map((provider) => (
                      <TableRow key={provider._id}>
                        <TableCell className="font-medium">{provider.id}</TableCell>
                        <TableCell>{provider.name}</TableCell>
                        <TableCell>{t(`insurance.${provider.type?.toLowerCase()}`, provider.type)}</TableCell>
                        <TableCell>{provider.contactPerson}</TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              provider.status === "active"
                                ? mode === "dark"
                                  ? "bg-green-900 text-green-200"
                                  : "bg-green-100 text-green-800"
                                : mode === "dark"
                                  ? "bg-gray-800 text-gray-200"
                                  : "bg-gray-100 text-gray-800"
                            )}
                          >
                            {t(`insurance.status.${translateValue('status', provider.status, t)}`, provider.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{provider.patientsCount}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t("common.actions", "Actions")}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setSelectedProvider(provider)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t("common.edit", "Edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteProvider(provider._id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t("common.delete", "Delete")}
                              </DropdownMenuItem>
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

          <TabsContent value="claims" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("insurance.claimsTitle", "Insurance Claims")}</CardTitle>
                <CardDescription>{t("insurance.claimsSub", "Track and process insurance claims")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("common.id", "ID")}</TableHead>
                      <TableHead>{t("appointments.patient", "Patient")}</TableHead>
                      <TableHead>{t("insurance.provider", "Provider")}</TableHead>
                      <TableHead>{t("insurance.service", "Service")}</TableHead>
                      <TableHead>{t("insurance.amount", "Amount")}</TableHead>
                      <TableHead>{t("common.status", "Status")}</TableHead>
                      <TableHead className="text-right">{t("common.actions", "Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClaims?.map((claim) => (
                      <TableRow key={claim._id}>
                        <TableCell className="font-medium">{claim.id}</TableCell>
                        <TableCell>{claim?.patientId?.name}</TableCell>
                        <TableCell>{claim?.providerId?.name}</TableCell>
                        <TableCell>{claim.service}</TableCell>
                        <TableCell>${claim.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              claim.status === "approved"
                                ? mode === "dark"
                                  ? "bg-green-900 text-green-200"
                                  : "bg-green-100 text-green-800"
                                : claim.status === "rejected"
                                  ? mode === "dark"
                                    ? "bg-rose-900 text-rose-200"
                                    : "bg-rose-100 text-rose-800"
                                  : mode === "dark"
                                    ? "bg-amber-900 text-amber-200"
                                    : "bg-amber-100 text-amber-800"
                            )}
                          >
                            {t(`insurance.status.${translateValue('status', claim.status, t)}`, claim.status)}
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
                              <DropdownMenuLabel>{t("common.actions", "Actions")}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setSelectedClaim(claim)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t("common.edit", "Edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClaim(claim._id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t("common.delete", "Delete")}
                              </DropdownMenuItem>
                              {claim.status === "pending" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      const updatedClaim = {
                                        ...claim,
                                        status: "approved",
                                        notes: `Approved on ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
                                      }
                                      handleUpdateClaim(updatedClaim)
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {t("insurance.approve", "Approve")}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      const updatedClaim = {
                                        ...claim,
                                        status: "rejected",
                                        notes: "Rejected by administrator",
                                      }
                                      handleUpdateClaim(updatedClaim)
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    {t("insurance.reject", "Reject")}
                                  </DropdownMenuItem>
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
        </Tabs>

      </div>


      {/* Add Provider Dialog */}
      <Dialog open={showAddProvider} onOpenChange={setShowAddProvider}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("insurance.addProviderTitle", "Add Insurance Provider")}</DialogTitle>
            <DialogDescription>{t("insurance.addProviderSub", "Enter the details of the new insurance provider.")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProvider}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">{t("common.name", "Name")}</Label>
                <Input id="name" name="name" className="col-span-3" required value={providerData.name} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">{t("insurance.type", "Type")}</Label>
                <select
                  id="type"
                  name="type"
                  className="col-span-3 border p-2 rounded"
                  required
                  value={translateValue('type', providerData.type, t)}
                  onChange={handleChange}
                >
                  <option value="">{t("insurance.selectType", "Select type")}</option>
                  <option value="Government">{t("insurance.government", "Government")}</option>
                  <option value="Private">{t("insurance.private", "Private")}</option>
                  <option value="Cooperative">{t("insurance.cooperative", "Cooperative")}</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contactPerson" className="text-right">{t("insurance.contactPerson", "Contact Person")}</Label>
                <Input id="contactPerson" name="contactPerson" className="col-span-3 border border-black rounded px-3 py-2 " required value={providerData.contactPerson} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">{t("common.phone", "Phone")}</Label>
                <Input id="phone" name="phone" className="col-span-3 border border-black rounded px-3 py-2 " required value={providerData.phone} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">{t("common.email", "Email")}</Label>
                <Input id="email" name="email" type="email" className="col-span-3 border border-black rounded px-3 py-2 " required value={providerData.email} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="governmentId" className="text-right">{t("insurance.governmentId", "Government ID")}</Label>
                <Input id="governmentId" name="governmentId" className="col-span-3 border border-black rounded px-3 py-2 " required value={providerData.governmentId} onChange={handleChange} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddProvider(false)}>{t("common.cancel", "Cancel")}</Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">{t("insurance.addProvider", "Add Provider")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Provider Dialog */}
      <Dialog open={!!selectedProvider} onOpenChange={(open) => !open && setSelectedProvider(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("insurance.editProviderTitle", "Edit Insurance Provider")}</DialogTitle>
            <DialogDescription>{t("insurance.editProviderSub", "Update the details of the insurance provider.")}</DialogDescription>
          </DialogHeader>
          {selectedProvider && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const updatedProvider = {
                  ...selectedProvider,
                  name: formData.get("name"),
                  type: formData.get("type"),
                  contactPerson: formData.get("contactPerson"),
                  phone: formData.get("phone"),
                  email: formData.get("email"),
                  status: formData.get("status"),
                }
                handleUpdateProvider(updatedProvider)
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    {t("common.name", "Name")}
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={selectedProvider.name}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-type" className="text-right">{t("insurance.type", "Type")}</Label>
                  <select
                    id="edit-type"
                    name="type"
                    className="col-span-3 border p-2 rounded"
                    required
                    defaultValue={translateValue('type', selectedProvider.type, t)}
                  >
                    <option value="Government">{t("insurance.government", "Government")}</option>
                    <option value="Private">{t("insurance.private", "Private")}</option>
                    <option value="Cooperative">{t("insurance.cooperative", "Cooperative")}</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-contactPerson" className="text-right">
                    {t("insurance.contactPerson", "Contact Person")}
                  </Label>
                  <Input
                    id="edit-contactPerson"
                    name="contactPerson"
                    defaultValue={selectedProvider.contactPerson}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phone" className="text-right">
                    {t("common.phone", "Phone")}
                  </Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    defaultValue={selectedProvider.phone}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    {t("common.email", "Email")}
                  </Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={selectedProvider.email}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">{t("common.status", "Status")}</Label>
                  <select
                    id="edit-status"
                    name="status"
                    className="col-span-3 border p-2 rounded"
                    required
                    defaultValue={translateValue('status', selectedProvider.status, t)}
                  >
                    <option value="active">{t("insurance.status.active", "Active")}</option>
                    <option value="inactive">{t("insurance.status.inactive", "Inactive")}</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedProvider(null)}>
                  {t("common.cancel", "Cancel")}
                </Button>
                <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                  {t("insurance.updateProvider", "Update Provider")}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Claim Dialog */}
      <Dialog open={showAddClaim} onOpenChange={setShowAddClaim}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("insurance.addInsuranceClaim", "Add Insurance Claim")}</DialogTitle>
            <DialogDescription>{t("insurance.enterClaimDetails", "Enter the details of the new insurance claim.")}</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const providerId = formData.get("providerId")
              const provider = providers.find((p) => p.id === providerId)

              const newClaim = {
                patientName: formData.get("patientName"),
                patientId: formData.get("patientId"),
                providerId: providerId,
                providerName: provider ? provider.name : "",
                service: formData.get("service"),
                amount: Number.parseFloat(formData.get("amount")),
                notes: formData.get("notes") || "Pending review",
                governmentId: formData.get("governmentId"),
              }
              handleAddClaim(newClaim)
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="patientId" className="text-right">
                  {t("insurance.patientId", "Patient ID")}
                </Label>
                <select
                  id="patientId"
                  name="patientId"
                  className="col-span-3 border p-2 rounded"
                  required
                >
                  <option value="" disabled selected>
                    {t("insurance.selectPatient", "Select patient")}
                  </option>
                  {paitentslist
                    ?.filter((p) => p.status === "Admitted" || p.status === "Discharged" || p.status === "Deceased" || p.status === "InConsultation")
                    ?.map((patient) => (
                      <option key={patient._id} value={patient._id}>
                        {patient.id}{" - "}
                        {patient.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="providerId" className="text-right">
                  {t("insurance.provider", "Provider")}
                </Label>
                <select
                  id="providerId"
                  name="providerId"
                  className="col-span-3 border p-2 rounded"
                  required
                >
                  <option value="" disabled selected>
                    {t("insurance.selectProvider", "Select provider")}
                  </option>
                  {providers
                    ?.filter((p) => p.status === "active")
                    ?.map((provider) => (
                      <option key={provider._id} value={provider._id}>
                        {provider.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                  {t("insurance.service", "Service")}
                </Label>
                <Input id="service" name="service" className="col-span-3 border border-black rounded px-3 py-2" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  {t("insurance.amount", "Amount")} ($)
                </Label>
                <Input id="amount" name="amount" type="number" min="0" step="0.01" className="col-span-3 border border-black rounded px-3 py-2" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  {t("insurance.notes", "Notes")}
                </Label>
                <Input id="notes" name="notes" className="col-span-3 border border-black rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="governmentId" className="text-right">
                  {t("insurance.governmentId", "Government ID")}
                </Label>
                <Input id="governmentId" name="governmentId" className="col-span-3 border border-black rounded px-3 py-2" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddClaim(false)}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                {t("insurance.addClaim", "Add Claim")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Claim Dialog */}
      <Dialog open={selectedClaim} onOpenChange={(open) => !open && setSelectedClaim(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("insurance.editClaimTitle", "Edit Insurance Claim")}</DialogTitle>
            <DialogDescription>{t("insurance.editClaimSub", "Modify the details of the insurance claim.")}</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const providerId = formData.get("providerId");
              const provider = providers.find((p) => p._id === providerId);

              const updatedClaim = {
                id: selectedClaim._id,
                patientName: formData.get("patientName"),
                patientId: formData.get("patientId"),
                providerId: providerId,
                providerName: provider ? provider.name : "",
                service: formData.get("service"),
                amount: Number.parseFloat(formData.get("amount")),
                notes: formData.get("notes") || "Pending review",
                governmentId: formData.get("governmentId"),
              };

              handleUpdateClaim(updatedClaim);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="patientName" className="text-right">{t("common.name", "Patient Name")}</Label>
                <Input id="patientName" name="patientName" disabled className="col-span-3" required defaultValue={selectedClaim?.patientId?.name} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="patientId" className="text-right">{t("insurance.patientId", "Patient ID")}</Label>
                <Input id="patientId" name="patientId" className="col-span-3" required defaultValue={selectedClaim?.patientId} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="providerId" className="text-right">{t("insurance.provider", "Provider")}</Label>
                <select
                  id="providerId"
                  name="providerId"
                  className="col-span-3 border p-2 rounded"
                  required
                  defaultValue={selectedClaim?.providerId || ""}
                >
                  <option value="" disabled>{t("insurance.selectProvider", "Select provider")}</option>
                  {providers
                    ?.filter((p) => p.status === "active")
                    ?.map((provider) => (
                      <option key={provider._id} value={provider._id}>
                        {provider.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">{t("insurance.service", "Service")}</Label>
                <Input id="service" name="service" className="col-span-3 border p-2 rounded" required defaultValue={selectedClaim?.service} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">{t("insurance.amount", "Amount")} ($)</Label>
                <Input id="amount" name="amount" type="number" min="0" step="0.01" className="col-span-3 border p-2 rounded" required defaultValue={selectedClaim?.amount} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">{t("insurance.notes", "Notes")}</Label>
                <Input id="notes" name="notes" className="col-span-3 border p-2 rounded" defaultValue={selectedClaim?.notes} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="governmentId" className="text-right">{t("insurance.governmentId", "Government ID")}</Label>
                <Input id="governmentId" name="governmentId" className="col-span-3 border p-2 rounded" defaultValue={selectedClaim?.governmentId} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSelectedClaim(null)}>{t("common.cancel", "Cancel")}</Button>
              <Button type="submit" className="bg-teal-500 hover:bg-teal-600">{t("common.save", "Save Changes")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </>
  )
}

