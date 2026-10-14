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
  ShieldCheck,
  AlertCircle,
  Loader2,
  UserCheck,
  Info,
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
import { useSearchAbhaAccountMutation, useInitiateAbhaAuthMutation } from "../redux/slices/abhaSlice"
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
  const [searchAbhaAccount] = useSearchAbhaAccountMutation();
  const [initiateAbhaAuth] = useInitiateAbhaAuthMutation();

  // ABHA Claim Workflow State
  const [claimCategory, setClaimCategory] = useState("PATIENT_ID"); // "PATIENT_ID" | "ABHA"
  const [abhaInput, setAbhaInput] = useState("");
  const [patientConsent, setPatientConsent] = useState(false);
  const [abhaValidationError, setAbhaValidationError] = useState("");
  const [abhaVerificationStatus, setAbhaVerificationStatus] = useState("IDLE"); // "IDLE" | "VERIFYING" | "VERIFIED" | "FAILED" | "UNCONFIGURED"
  const [abhaVerificationResult, setAbhaVerificationResult] = useState(null);
  const [abhaAssociatedPatientId, setAbhaAssociatedPatientId] = useState("");
  const [abhaProviderId, setAbhaProviderId] = useState("");
  const [abhaService, setAbhaService] = useState("");
  const [abhaAmount, setAbhaAmount] = useState("");
  const [abhaNotes, setAbhaNotes] = useState("");
  const [abhaGovtId, setAbhaGovtId] = useState("");
  const [isVerifyingAbha, setIsVerifyingAbha] = useState(false);
  const [isSubmittingAbhaClaim, setIsSubmittingAbhaClaim] = useState(false);

  const resetAddClaimState = () => {
    setClaimCategory("PATIENT_ID");
    setAbhaInput("");
    setPatientConsent(false);
    setAbhaValidationError("");
    setAbhaVerificationStatus("IDLE");
    setAbhaVerificationResult(null);
    setAbhaAssociatedPatientId("");
    setAbhaProviderId("");
    setAbhaService("");
    setAbhaAmount("");
    setAbhaNotes("");
    setAbhaGovtId("");
    setIsVerifyingAbha(false);
    setIsSubmittingAbhaClaim(false);
  };

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

  // Add new claim (Through Patient ID)
  const handleAddClaim = async (newClaim) => {
    try {
      const response = await createInsuranceClaim(newClaim).unwrap();
      toast.success(t("insurance.claimAddSuccess", "Claim added successfully!"));
      setShowAddClaim(false);
      resetAddClaimState();
    } catch (error) {
      const errMsg = error?.data?.error || error?.data?.message || t("insurance.claimAddError", "Failed to add claim.");
      toast.error(errMsg);
    }
  };

  const handleAbhaInputChange = (e) => {
    const val = e.target.value;
    setAbhaInput(val);
    if (abhaVerificationStatus !== "IDLE") {
      setAbhaVerificationStatus("IDLE");
      setAbhaVerificationResult(null);
    }
    if (abhaValidationError) {
      setAbhaValidationError("");
    }
  };

  const handleVerifyAbha = async () => {
    setAbhaValidationError("");
    const clean = abhaInput.trim();
    if (!clean) {
      setAbhaValidationError(t("insurance.enterAbhaReq", "Please enter an ABHA Number or ABHA Address."));
      return;
    }

    const digitsOnly = clean.replace(/[-\s]/g, "");
    const is14Digit = /^\d{14}$/.test(digitsOnly);
    const isAbhaAddress = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(clean);

    if (!is14Digit && !isAbhaAddress) {
      setAbhaValidationError(
        t("insurance.abhaFormatError", "Invalid format. Expected a 14-digit ABHA Number (e.g. 12-3456-7890-1234) or ABHA Address (e.g. patient@abdm).")
      );
      return;
    }

    if (!patientConsent) {
      setAbhaValidationError(
        t("insurance.consentRequired", "Patient consent is mandatory before querying and accessing ABHA account records.")
      );
      return;
    }

    setIsVerifyingAbha(true);
    setAbhaVerificationStatus("VERIFYING");
    setAbhaVerificationResult(null);

    try {
      const res = await searchAbhaAccount({ healthId: clean }).unwrap();
      if (res && res.success) {
        setAbhaVerificationStatus("VERIFIED");
        setAbhaVerificationResult({
          type: "SUCCESS",
          data: res.data,
          profile: res.data?.profile || res.data,
          matchingPatients: res.matchingPatients || []
        });

        if (res.matchingPatients && res.matchingPatients.length === 1) {
          setAbhaAssociatedPatientId(res.matchingPatients[0].patientId);
        }
        toast.success(t("insurance.abhaVerifiedSuccess", "ABHA account verified successfully!"));
      } else {
        setAbhaVerificationStatus("FAILED");
        setAbhaVerificationResult({
          type: "FAILED",
          message: res?.message || t("insurance.abhaNotFound", "ABHA account could not be found.")
        });
      }
    } catch (err) {
      const errPayload = err?.data || err;
      const errorCode = errPayload?.error?.code;
      const errorMsg = errPayload?.error?.message || errPayload?.message || "Failed to connect to ABHA verification service.";

      if (errorCode === "ABDM_NOT_CONFIGURED" || err?.status === 502) {
        setAbhaVerificationStatus("UNCONFIGURED");
        setAbhaVerificationResult({
          type: "UNCONFIGURED",
          code: errorCode || "ABDM_NOT_CONFIGURED",
          message: errorMsg,
        });
      } else {
        setAbhaVerificationStatus("FAILED");
        setAbhaVerificationResult({
          type: "FAILED",
          code: errorCode || "GATEWAY_ERROR",
          message: errorMsg,
        });
      }
    } finally {
      setIsVerifyingAbha(false);
    }
  };

  const handleAbhaClaimSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!abhaAssociatedPatientId) {
      toast.error(t("insurance.selectPatientReq", "Please select or link an admitted/consulting hospital patient for this claim."));
      return;
    }

    if (!abhaProviderId) {
      toast.error(t("insurance.selectProviderReq", "Please select an insurance provider."));
      return;
    }

    if (!abhaService.trim()) {
      toast.error(t("insurance.enterServiceReq", "Please specify the service or treatment."));
      return;
    }

    const numAmount = parseFloat(abhaAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error(t("insurance.enterAmountReq", "Please enter a valid claim amount."));
      return;
    }

    const cleanAbha = abhaInput.trim();
    const provider = providers?.find((p) => p._id === abhaProviderId || p.id === abhaProviderId);
    const patientObj = paitentslist?.find((p) => p._id === abhaAssociatedPatientId);

    setIsSubmittingAbhaClaim(true);
    try {
      const newClaim = {
        patientId: abhaAssociatedPatientId,
        patientName: patientObj?.name || "",
        providerId: abhaProviderId,
        providerName: provider ? provider.name : "",
        service: abhaService.trim(),
        amount: numAmount,
        notes: abhaNotes.trim() || `Submitted via ABHA: ${cleanAbha}`,
        governmentId: abhaGovtId.trim() || cleanAbha,
        claimCategory: "ABHA",
        abhaNumber: cleanAbha,
      };

      await createInsuranceClaim(newClaim).unwrap();
      toast.success(t("insurance.claimAddSuccess", "Insurance claim created successfully!"));
      setShowAddClaim(false);
      resetAddClaimState();
    } catch (error) {
      const errMsg = error?.data?.error || error?.data?.message || t("insurance.claimAddError", "Failed to add claim.");
      toast.error(errMsg);
    } finally {
      setIsSubmittingAbhaClaim(false);
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
                      <TableHead>{t("insurance.claimCategory", "Category")}</TableHead>
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
                        <TableCell>
                          {claim.claimCategory === "ABHA" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                              ABHA
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                              <FileText className="w-3.5 h-3.5 text-gray-500" />
                              Patient ID
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{claim?.patientId?.name || "—"}</span>
                            {claim.claimCategory === "ABHA" && claim.abhaNumber && (
                              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-mono block">
                                ABHA: {claim.abhaNumber}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{claim?.providerId?.name || "—"}</TableCell>
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
      <Dialog
        open={showAddClaim}
        onOpenChange={(open) => {
          setShowAddClaim(open);
          if (!open) resetAddClaimState();
        }}
      >
        <DialogContent className="sm:max-w-[620px] max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("insurance.addInsuranceClaim", "Add Insurance Claim")}</DialogTitle>
            <DialogDescription>
              {t("insurance.enterClaimDetails", "Create an insurance claim through Patient ID or verified ABHA number.")}
            </DialogDescription>
          </DialogHeader>

          {/* Category Selector Segmented Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mt-1 mb-4">
            <button
              type="button"
              onClick={() => setClaimCategory("PATIENT_ID")}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold text-center transition-all border-b-2",
                claimCategory === "PATIENT_ID"
                  ? "border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/30"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{t("insurance.categoryPatientId", "Through Patient ID")}</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setClaimCategory("ABHA")}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold text-center transition-all border-b-2",
                claimCategory === "ABHA"
                  ? "border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/30"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{t("insurance.categoryAbha", "Through ABHA")}</span>
              </div>
            </button>
          </div>

          {/* Category 1: Through Patient ID (Preserved Existing Workflow) */}
          {claimCategory === "PATIENT_ID" && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const providerId = formData.get("providerId")
                const provider = providers?.find((p) => p.id === providerId || p._id === providerId)

                const newClaim = {
                  patientName: formData.get("patientName"),
                  patientId: formData.get("patientId"),
                  providerId: providerId,
                  providerName: provider ? provider.name : "",
                  service: formData.get("service"),
                  amount: Number.parseFloat(formData.get("amount")),
                  notes: formData.get("notes") || "Pending review",
                  governmentId: formData.get("governmentId"),
                  claimCategory: "PATIENT_ID",
                }
                handleAddClaim(newClaim)
              }}
            >
              <div className="grid gap-4 py-2">
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
              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddClaim(false);
                    resetAddClaimState();
                  }}
                >
                  {t("common.cancel", "Cancel")}
                </Button>
                <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                  {t("insurance.addClaim", "Add Claim")}
                </Button>
              </DialogFooter>
            </form>
          )}

          {/* Category 2: Through ABHA (New Workflow) */}
          {claimCategory === "ABHA" && (
            <div className="space-y-4 py-1">
              {/* Step 1: Enter ABHA Number */}
              <div className="border border-teal-200 dark:border-teal-900 rounded-lg p-4 bg-teal-50/30 dark:bg-teal-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold">
                      1
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {t("insurance.step1Abha", "Enter ABHA Number & Patient Consent")}
                    </h3>
                  </div>
                  {abhaVerificationStatus === "VERIFIED" && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {t("insurance.verified", "Verified")}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="abhaNumberInput" className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t("insurance.abhaNumberLabel", "ABHA Number or ABHA Address")} <span className="text-rose-500">*</span>
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="abhaNumberInput"
                        type="text"
                        value={abhaInput}
                        onChange={handleAbhaInputChange}
                        placeholder="e.g. 12-3456-7890-1234 or patient@abdm"
                        className={cn(
                          "w-full text-sm font-mono border rounded px-3 py-2",
                          abhaValidationError ? "border-rose-500 focus:ring-rose-500" : "border-gray-300 dark:border-gray-600"
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleVerifyAbha}
                      disabled={isVerifyingAbha}
                      className="bg-teal-500 hover:bg-teal-600 shrink-0 text-white"
                    >
                      {isVerifyingAbha ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                          {t("insurance.verifying", "Verifying...")}
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 mr-1.5" />
                          {t("insurance.verifyAbha", "Verify ABHA")}
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {t("insurance.abhaHint", "Hint: Enter a 14-digit ABHA Number (e.g., 12-3456-7890-1234) or registered ABHA Address (e.g., user@abdm).")}
                  </p>
                </div>

                {/* Patient Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600 dark:text-gray-300 select-none">
                    <input
                      type="checkbox"
                      id="patientConsentCheckbox"
                      checked={patientConsent}
                      onChange={(e) => {
                        setPatientConsent(e.target.checked);
                        if (e.target.checked && abhaValidationError.includes("consent")) {
                          setAbhaValidationError("");
                        }
                      }}
                      className="mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 w-4 h-4 shrink-0"
                    />
                    <span>
                      {t(
                        "insurance.patientConsentText",
                        "Patient provides explicit consent to verify identity and retrieve ABHA health account details for insurance claim processing under ABDM guidelines."
                      )}
                    </span>
                  </label>
                </div>

                {/* Inline Validation Error */}
                {abhaValidationError && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded border border-rose-200 dark:border-rose-900">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{abhaValidationError}</span>
                  </div>
                )}
              </div>

              {/* Step 2: Verification State & Patient Association */}
              {abhaVerificationStatus === "VERIFYING" && (
                <div className="border border-teal-200 dark:border-teal-800 rounded-lg p-4 bg-teal-50/50 dark:bg-teal-950/30 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-teal-600 animate-spin shrink-0" />
                  <div className="text-xs text-teal-800 dark:text-teal-200">
                    <p className="font-semibold">{t("insurance.connectingGateway", "Connecting to ABDM Gateway...")}</p>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400">
                      {t("insurance.verifyingAbhaAccount", "Authenticating ABHA account and retrieving demographic details.")}
                    </p>
                  </div>
                </div>
              )}

              {abhaVerificationStatus === "VERIFIED" && (
                <div className="border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">
                      2
                    </span>
                    <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {t("insurance.verifiedPatientDetails", "Verified ABHA Patient Details")}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-white dark:bg-gray-800 p-3 rounded border border-emerald-100 dark:border-emerald-900 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">{t("common.name", "Name")}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {abhaVerificationResult?.profile?.name || "Verified Citizen"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">{t("insurance.abhaNumber", "ABHA Number")}</span>
                      <span className="font-mono text-gray-800 dark:text-gray-100">
                        {abhaVerificationResult?.profile?.healthIdNumber || abhaInput}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">{t("common.gender", "Gender")}</span>
                      <span className="text-gray-800 dark:text-gray-100">
                        {abhaVerificationResult?.profile?.gender || "Not Specified"}
                      </span>
                    </div>
                  </div>

                  {/* Patient Linking / Association */}
                  <div className="space-y-1.5 pt-1">
                    <Label htmlFor="abhaLinkedPatient" className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {t("insurance.linkHospitalRecord", "Associate with Hospital Patient Record")} <span className="text-rose-500">*</span>
                    </Label>
                    <select
                      id="abhaLinkedPatient"
                      value={abhaAssociatedPatientId}
                      onChange={(e) => setAbhaAssociatedPatientId(e.target.value)}
                      className="w-full border p-2 rounded text-xs bg-white dark:bg-gray-800"
                      required
                    >
                      <option value="">-- {t("insurance.selectPatient", "Select patient to associate with this claim")} --</option>
                      {paitentslist
                        ?.filter((p) => p.status === "Admitted" || p.status === "Discharged" || p.status === "Deceased" || p.status === "InConsultation")
                        ?.map((patient) => (
                          <option key={patient._id} value={patient._id}>
                            {patient.id} - {patient.name} ({patient.phone || "No phone"})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              )}

              {abhaVerificationStatus === "UNCONFIGURED" && (
                <div className="border border-amber-300 dark:border-amber-700 rounded-lg p-4 bg-amber-50/70 dark:bg-amber-950/40 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <h4 className="font-semibold text-amber-900 dark:text-amber-200">
                        {t("insurance.sandboxPendingTitle", "ABDM Gateway Sandbox Integration Pending")}
                      </h4>
                      <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                        {t(
                          "insurance.sandboxPendingDesc",
                          "Official ABDM API credentials (ABDM_CLIENT_ID / ABDM_CLIENT_SECRET) are currently pending sandbox registration approval. Live government identity verification requires authorized credentials and cannot be simulated."
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-200 dark:border-amber-800 space-y-1.5">
                    <Label htmlFor="abhaFallbackPatient" className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {t("insurance.associatePatientRecord", "Associate Hospital Patient Record for ABHA Claim")} <span className="text-rose-500">*</span>
                    </Label>
                    <select
                      id="abhaFallbackPatient"
                      value={abhaAssociatedPatientId}
                      onChange={(e) => setAbhaAssociatedPatientId(e.target.value)}
                      className="w-full border p-2 rounded text-xs bg-white dark:bg-gray-800 border-gray-300"
                      required
                    >
                      <option value="">-- {t("insurance.selectPatientToLink", "Select hospital patient to associate with this ABHA claim")} --</option>
                      {paitentslist
                        ?.filter((p) => p.status === "Admitted" || p.status === "Discharged" || p.status === "Deceased" || p.status === "InConsultation")
                        ?.map((patient) => (
                          <option key={patient._id} value={patient._id}>
                            {patient.id} - {patient.name} ({patient.phone || "No phone"})
                          </option>
                        ))}
                    </select>
                    <p className="text-[11px] text-muted-foreground">
                      {t("insurance.associatePatientHint", "The claim will be created under the ABHA category with ABHA number recorded and linked to this patient.")}
                    </p>
                  </div>
                </div>
              )}

              {abhaVerificationStatus === "FAILED" && (
                <div className="border border-rose-200 dark:border-rose-900 rounded-lg p-3.5 bg-rose-50 dark:bg-rose-950/40 flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <h4 className="font-semibold text-rose-900 dark:text-rose-200">
                      {t("insurance.verificationFailedTitle", "ABHA Verification Failed")}
                    </h4>
                    <p className="text-rose-700 dark:text-rose-300 text-[11px]">
                      {abhaVerificationResult?.message || t("insurance.verificationFailedDesc", "The ABHA number could not be verified by the gateway. Please verify the number and try again.")}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Enter Insurance Claim Details */}
              {(abhaVerificationStatus === "VERIFIED" || (abhaVerificationStatus === "UNCONFIGURED" && abhaAssociatedPatientId)) && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50/50 dark:bg-gray-800/30 space-y-3 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold">
                      {abhaVerificationStatus === "VERIFIED" ? "3" : "2"}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {t("insurance.step3ClaimDetails", "Insurance Claim Details")}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1 sm:col-span-2">
                      <Label htmlFor="abhaProviderSelect" className="font-medium">
                        {t("insurance.provider", "Insurance Provider")} <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        id="abhaProviderSelect"
                        value={abhaProviderId}
                        onChange={(e) => setAbhaProviderId(e.target.value)}
                        className="w-full border p-2 rounded text-xs bg-white dark:bg-gray-800"
                        required
                      >
                        <option value="">{t("insurance.selectProvider", "Select provider")}</option>
                        {providers
                          ?.filter((p) => p.status === "active")
                          ?.map((provider) => (
                            <option key={provider._id} value={provider._id}>
                              {provider.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="abhaServiceInput" className="font-medium">
                        {t("insurance.service", "Service / Treatment")} <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="abhaServiceInput"
                        value={abhaService}
                        onChange={(e) => setAbhaService(e.target.value)}
                        placeholder="e.g. Inpatient Surgery / Treatment"
                        className="w-full text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="abhaAmountInput" className="font-medium">
                        {t("insurance.amount", "Claim Amount")} ($) <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        id="abhaAmountInput"
                        type="number"
                        min="0"
                        step="0.01"
                        value={abhaAmount}
                        onChange={(e) => setAbhaAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="abhaNotesInput" className="font-medium">
                        {t("insurance.notes", "Notes")}
                      </Label>
                      <Input
                        id="abhaNotesInput"
                        value={abhaNotes}
                        onChange={(e) => setAbhaNotes(e.target.value)}
                        placeholder="Optional notes or pre-auth remarks"
                        className="w-full text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="abhaGovtIdInput" className="font-medium">
                        {t("insurance.governmentId", "Government ID / ABHA Ref")}
                      </Label>
                      <Input
                        id="abhaGovtIdInput"
                        value={abhaGovtId || abhaInput}
                        onChange={(e) => setAbhaGovtId(e.target.value)}
                        placeholder="Defaults to ABHA Number"
                        className="w-full text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <DialogFooter className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddClaim(false);
                    resetAddClaimState();
                  }}
                >
                  {t("common.cancel", "Cancel")}
                </Button>
                <Button
                  type="button"
                  onClick={handleAbhaClaimSubmit}
                  disabled={
                    isSubmittingAbhaClaim ||
                    !abhaAssociatedPatientId ||
                    !abhaProviderId ||
                    !abhaService.trim() ||
                    !abhaAmount ||
                    Number(abhaAmount) <= 0 ||
                    (abhaVerificationStatus !== "VERIFIED" && abhaVerificationStatus !== "UNCONFIGURED")
                  }
                  className="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50"
                >
                  {isSubmittingAbhaClaim ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      {t("insurance.submitting", "Submitting Claim...")}
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-1.5" />
                      {t("insurance.submitAbhaClaim", "Submit Insurance Claim")}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
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

