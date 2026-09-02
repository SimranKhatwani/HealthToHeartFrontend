import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/UI/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/UI/Tabs"
import Button from "../../components/UI/Button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/UI/Avatar"
import Badge from "../../components/UI/Badge"
import Progress from "../../components/UI/Progress"
import { Calendar, Clock, MoreHorizontal, Search, Filter, Plus, CheckCircle2, Clock3 } from "lucide-react"
import Input from "../../components/UI/Input"
import { cn } from "../../components/Lib/Utilis"
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useGetAllOperationsQuery  } from "../../redux/slices/operationSlice";
import OperationUploadForm from "./OperationUploadForm"
import OperationDetails from "./OperationDetails"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Operations() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(3);
  const [operationsData, setOperationsData] = useState([]); 
  const [selectedSurgeon, setSelectedSurgeon] = useState(""); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [operationDetails, setOperationDetails] = useState({
    room: "",
    patient: "",
    operationName: "",
    surgeon: "",
    startTime: "",
    endTime: "",
  });


  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 5); // Load 5 more operations on button click
  };

  // console.log("isDialogOpen", isFormOpen)
  const { mode, color } = useSelector((state) => state.theme);

  useEffect(() => {
    document.documentElement.className = mode;
    document.documentElement.style.setProperty('--theme-color', color);
  }, [mode, color]);
  
  const { data  , error, isLoading } = useGetAllOperationsQuery();

  useEffect(() => {
    if (data) {
      // console.log("data", data)
      setOperationsData(data);
    }
  },[data]);

  if (isLoading) return <p>{t('translation:loading')}</p>;
  if (error) return <p>Error: {error?.data?.message || error?.data?.error || error?.message || "Failed to fetch operations"}</p>;


  // console.log("operationsData", operationsData)
  

  // Filter operations based on search query
    const filteredOperations = Array.isArray(operationsData?.data)
  ? operationsData.data.filter((op) => {
      // Check if search query matches patient name or operation ID
      const matchesSearch =
        !searchQuery ||
        op?.patient_details?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op?._id?.toLowerCase().includes(searchQuery.toLowerCase());

      // Check if selected surgeon matches
      const matchesSurgeon =
        !selectedSurgeon || (op?.doctor_details[0]?.name === selectedSurgeon);

      // Check if selected date matches operation date
      const matchesDate =
        !selectedDate || (new Date(op?.operationDate).toDateString() === new Date(selectedDate).toDateString());

      return matchesSearch && matchesSurgeon && matchesDate;
    })
  : [];


    {Array.isArray(filteredOperations) ? (
      <>
        {filteredOperations.slice(0, visibleCount).map((operation) => (
          <OperationCard key={operation._id} operation={operation} />
        ))}
      </>
    ) : (
      <p className="text-red-500">{t('translation:failedToLoadOperations')}</p>
    )}
    
    // console.log("filteredOperations", filteredOperations)
  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "scheduled":
        return {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
          icon: <Clock className="h-3 w-3 mr-1" />,
        }
      case "in-progress":
        return {
          color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
          icon: <Clock3 className="h-3 w-3 mr-1" />,
        }
      case "completed":
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
          icon: null,
        }
    }
  }

  const isDark = mode === "dark";
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4">
        <h1 className="text-2xl font-bold">{t("operations.title")}</h1>
        <Button className={`w-full sm:w-auto ${mode === "dark" ? "bg-teal-900 hover:bg-teal-800 text-black" : "text-white"}`} onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("operations.scheduleOperation", "Schedule Operation")}
        </Button>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">  
            <div className={`${mode === "dark" ? "bg-black" : "bg-white"}  p-6 rounded-lg shadow-lg w-full max-w-lg`}>
              <OperationUploadForm
                onClose={() => setIsFormOpen(false)}  // Close form on cancel
              />
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="all" className="mb-6 p-4">
        <div className="flex flex-col gap-4 mb-4">
        <TabsList
      className={`w-full grid grid-cols-4 font-bold ${
        isDark ? "bg-[#006c68] text-gray-800" : "bg-[#e0f7f5] text-gray-400"
      }`}
    >
      {["all", t('translation:scheduled'), t('translation:inProgress'), t('translation:completed')].map((tab) => (
        <TabsTrigger
          key={tab}
          value={tab}
          className={`w-full ${
            isDark
              ? "data-[state=active]:bg-[#0fb3af] data-[state=active]:text-white"
              : "data-[state=active]:bg-[#00c4be] data-[state=active]:text-white"
          }`}
        >
          {tab === "all" ? t("common.all", "All") : t(`status.${tab.toLowerCase().replace(" ", "")}`, tab)}
        </TabsTrigger>
      ))}
    </TabsList>

          <div className="flex w-full gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder={t("operations.searchPlaceholder", "Search by patient name or operation Id...")}
                  className="pl-8 w-full border-2 border-gray-400 h-10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />  
              </div>

            {/* Filter Button */}
            <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              <Filter className="h-4 w-4" />
            </Button>

            {/* Small Filter Modal */}
            {isFilterOpen && (
              <div ref={filterRef} className={`absolute top-64 right-6 shadow-lg border rounded-lg p-4 w-56 z-50 ${mode === "dark" ? "bg-black" : "bg-white"}`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold">{t("common.filters", "Filters")}</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                    {t("common.close", "Close")}
                  </Button>
                </div>

                {/* Surgeon Filter */}
                <label className="block text-xs font-medium">{t("operations.filterSurgeon", "Filter by Surgeon:")}</label>
                <select
                  className="w-full border rounded-md p-2 text-sm mb-3"
                  value={selectedSurgeon}
                  onChange={(e) => setSelectedSurgeon(e.target.value)}
                >
                  <option value="">{t("common.all", "All")}</option>
                  {Array.from(new Set(data?.data?.map(op => op.doctor_details[0]?.name)))
                    .map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                </select>

                {/* Date Filter */}
                <label className="block text-xs font-medium">{t("operations.filterDate", "Filter by Date:")}</label>
                <DatePicker 
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  className="w-full border rounded-md p-2 text-sm"
                  placeholderText={t("operations.selectDate", "Select a date")}
                />

                {/* Reset & Apply Buttons */}
                <div className="flex justify-between mt-3">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedSurgeon(""); setSelectedDate(null); }}>
                    {t("common.reset", "Reset")}
                  </Button>
                  <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                    {t("common.apply", "Apply")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          <div className="grid gap-4">
            {filteredOperations.map((operation) => (
              <OperationCard key={operation._id} operation={operation} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="Scheduled" className="m-0">
          <div className="grid gap-4">
            {filteredOperations
              .filter((op) => op.status === t('translation:scheduled'))
              .map((operation) => (
                <OperationCard key={operation._id} operation={operation} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="In Progress" className="m-0">
          <div className="grid gap-4">
            {filteredOperations
              .filter((op) => op.status === t('translation:inProgress'))
              .map((operation) => (
                <OperationCard key={operation._id} operation={operation} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="Completed" className="m-0">
          <div className="grid gap-4">
            {filteredOperations
              .filter((op) => op.status === t('translation:completed'))
              .map((operation) => (
                <OperationCard key={operation._id} operation={operation} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

function OperationCard({ operation }) {
  const { t, i18n } = useTranslation();
  const statusBadge = getStatusBadge(operation.status)
  const priorityBadge = getPriorityBadge(operation.priority)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const { mode } = useSelector((state) => state.theme);

  return (
    <div>
      <div className="p-4 border-2 border-gray-300 rounded-xl">
        <div className="flex flex-col">
          <div className="p-4 flex-1">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{operation.patient_details.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{operation?.patient_details?.name}</h3>
                  <p className="text-xs text-muted-foreground">{operation?.patient_details?.id}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">{t("operations.details", "Operation Details")}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("operations.type", "Type:")}</span>
                    <span className="font-medium">{t(`operations.${operation.operationType.toLowerCase()}`, operation.operationType)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("operations.surgeon", "Surgeon:")}</span>
                    <span>{operation.doctor_details[0].name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("operations.room", "Room:")}</span>
                    <span>{operation.operationRoom}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">{t("operations.schedule", "Schedule")}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("operations.date", "Date:")}</span>
                    <div className="flex items-center">
                      <span>
                        {new Date(operation.operationDate).toLocaleDateString(i18n.language === "fr" ? "fr-FR" : "en-US", {
                          weekday: "long", 
                          year: "numeric",
                          month: "long", 
                          day: "numeric", 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("operations.duration", "Duration:")}</span>
                    <span>{operation.duration} {t("common.minutes", "Minutes")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("operations.anesthesiaType", "Anesthesia Type:")}</span>
                    <span>{t(`operations.${operation.anesthesiaType.toLowerCase()}`, operation.anesthesiaType)}</span>
                  </div>
                </div>
              </div>
            </div>

            {operation.notes && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-1">{t("operations.notes", "Notes")}</p>
                <p className="text-sm text-muted-foreground">{operation.notes}</p>
              </div>
            )}
          </div>

          <div className="bg-muted/30 p-4 flex flex-row items-center justify-between gap-4 border-t border-gray-500">
            <div className="flex items-start text-center">
              <Badge className={cn("mb-2 flex items-center", statusBadge.color)}>
                <span className="capitalize">{t(`status.${operation.status.toLowerCase().replace(/\s+/g, "").replace("-", "")}`, operation.status)}</span>
              </Badge>
            </div>

            <Button
              className={cn(
                "w-auto",
                operation.status === "completed"
                  ? "bg-gray-500 hover:bg-gray-600"
                  : mode === "dark"
                  ? "bg-teal-900 hover:bg-teal-800 text-black"
                  : "bg-[#0fb3af] hover:bg-teal-600 text-white"
              )}
              disabled={operation.status === "completed"}
              onClick={openModal}
            >
              {t("operations.viewDetails", "View Details")}
            </Button>
          </div>
        </div>
      </div>
      <OperationDetails isModalOpen={isModalOpen} closeModal={closeModal} operation={operation} />
    </div>
  )
}

function getStatusBadge(status) {
  switch (status) {
    case "Scheduled":
      return {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        icon: <Clock className="h-3 w-3 mr-1" />,
      }
    case "In Progress":
      return {
        color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
        icon: <Clock3 className="h-3 w-3 mr-1" />,
      }
    case "Completed":
      return {
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
      }
    default:
      return {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        icon: null,
      }
  }
}

function getPriorityBadge(priority) {
  switch (priority) {
    case "high":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    case "emergency":
      return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300"
    case "normal":
    default:
      return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
  }
}


