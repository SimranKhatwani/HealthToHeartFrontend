import { useState, useEffect } from "react"
import { Search, X, User, Calendar, FileText, Pill, Stethoscope, Bed } from "lucide-react"
import Button from "../UI/Button"
import Input from "../UI/Input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../UI/Tabs"
import { Dialog, DialogContent, DialogHeader } from "../UI/Dialog"
import { ScrollArea } from "../UI/ScrollArea"
import { translateValue } from '../../utilis/translate';
import { useTranslation } from 'react-i18next';


export function GlobalSearch() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState({
    patients: [],
    appointments: [],
    medications: [],
    doctors: [],
    rooms: [],
  })

  // Mock data for search results
  const mockData = {
    patients: [
      { id: "P-10045", name: "Ahmed Mohamed", age: 45, gender: "Male", type: "patient" },
      { id: "P-10046", name: "Fatima Ali", age: 32, gender: "Female", type: "patient" },
      { id: "P-10047", name: "Omar Khaled", age: 58, gender: "Male", type: "patient" },
      { id: "P-10048", name: "Layla Ibrahim", age: 65, gender: "Female", type: "patient" },
      { id: "P-10049", name: "Youssef Mahmoud", age: 12, gender: "Male", type: "patient" },
    ],
    appointments: [
      {
        id: "APP-001",
        patientName: "Ahmed Mohamed",
        date: "2025-01-05",
        time: "9:00 AM",
        doctor: "Dr. Sara Hassan",
        type: "appointment",
      },
      {
        id: "APP-002",
        patientName: "Fatima Ali",
        date: "2025-01-05",
        time: "10:30 AM",
        doctor: "Dr. Ahmed Ali",
        type: "appointment",
      },
      {
        id: "APP-003",
        patientName: "Omar Khaled",
        date: "2025-01-06",
        time: "11:00 AM",
        doctor: "Dr. Mostafa Aita",
        type: "appointment",
      },
    ],
    medications: [
      { id: "MED-001", name: "Amoxicillin", dosage: "500mg", form: "Capsule", type: "medication" },
      { id: "MED-002", name: "Paracetamol", dosage: "500mg", form: "Tablet", type: "medication" },
      { id: "MED-003", name: "Ibuprofen", dosage: "400mg", form: "Tablet", type: "medication" },
    ],
    doctors: [
      { id: "DOC-001", name: "Dr. Sara Hassan", specialty: "Cardiology", type: "doctor" },
      { id: "DOC-002", name: "Dr. Ahmed Ali", specialty: "General Medicine", type: "doctor" },
      { id: "DOC-003", name: "Dr. Mostafa Aita", specialty: "Emergency Medicine", type: "doctor" },
    ],
    rooms: [
      { id: "RM-101", type: "General Ward", floor: "1st Floor", status: "available", type: "room" },
      { id: "RM-201", type: "Private Room", floor: "2nd Floor", status: "available", type: "room" },
      { id: "RM-301", type: "ICU", floor: "3rd Floor", status: "occupied", type: "room" },
    ],
  }

  // Handle keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Search function
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({
        patients: [],
        appointments: [],
        medications: [],
        doctors: [],
        rooms: [],
      })
      return
    }

    const query = searchQuery.toLowerCase()

    // Filter patients
    const filteredPatients = mockData.patients.filter(
      (patient) => patient.name.toLowerCase().includes(query) || patient.id.toLowerCase().includes(query),
    )

    // Filter appointments
    const filteredAppointments = mockData.appointments.filter(
      (appointment) =>
        appointment.patientName.toLowerCase().includes(query) ||
        appointment.id.toLowerCase().includes(query) ||
        appointment.doctor.toLowerCase().includes(query),
    )

    // Filter medications
    const filteredMedications = mockData.medications.filter(
      (medication) => medication.name.toLowerCase().includes(query) || medication.id.toLowerCase().includes(query),
    )

    // Filter doctors
    const filteredDoctors = mockData.doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(query) ||
        doctor.id.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query),
    )

    // Filter rooms
    const filteredRooms = mockData.rooms.filter(
      (room) => room.id.toLowerCase().includes(query) || room.type.toLowerCase().includes(query),
    )

    setSearchResults({
      patients: filteredPatients,
      appointments: filteredAppointments,
      medications: filteredMedications,
      doctors: filteredDoctors,
      rooms: filteredRooms,
    })
  }, [searchQuery])

  // Get total results count
  const totalResults =
    searchResults.patients.length +
    searchResults.appointments.length +
    searchResults.medications.length +
    searchResults.doctors.length +
    searchResults.rooms.length

  // Get icon for result type
  const getResultIcon = (type) => {
    switch (type) {
      case "patient":
        return <User className="h-4 w-4 text-blue-500" />
      case "appointment":
        return <Calendar className="h-4 w-4 text-purple-500" />
      case "medication":
        return <Pill className="h-4 w-4 text-green-500" />
      case "doctor":
        return <Stethoscope className="h-4 w-4 text-teal-500" />
      case "room":
        return <Bed className="h-4 w-4 text-amber-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-between text-muted-foreground max-w-sm"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center">
          <Search className="h-4 w-4 mr-2" />
          <span>{t('translation:search')}</span>
        </div>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="px-4 pt-4 pb-0">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t('translation:searchForPatientsAppointmentsM')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
              {searchQuery && (
                <Button variant="ghost" size="icon" onClick={() => setSearchQuery("")}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <Tabs defaultValue="all" className="mt-2">
            <div className="px-4">
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
                <TabsTrigger value="patients">Patients ({searchResults.patients.length})</TabsTrigger>
                <TabsTrigger value="appointments">Appointments ({searchResults.appointments.length})</TabsTrigger>
                <TabsTrigger value="medications">Medications ({searchResults.medications.length})</TabsTrigger>
                <TabsTrigger value="doctors">Doctors ({searchResults.doctors.length})</TabsTrigger>
                <TabsTrigger value="rooms">Rooms ({searchResults.rooms.length})</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="max-h-[400px] mt-2">
              <TabsContent value="all" className="m-0">
                {totalResults > 0 ? (
                  <div className="divide-y">
                    {/* Patients */}
                    {searchResults.patients.length > 0 && (
                      <div className="py-2 px-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('translation:patients')}</h3>
                        <div className="space-y-1">
                          {searchResults.patients.map((patient) => (
                            <div
                              key={patient.id}
                              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                            >
                              <User className="h-5 w-5 text-blue-500" />
                              <div>
                                <div className="font-medium">{patient.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {patient.id} • {patient.age} years • {translateValue('gender', patient.gender, t)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Appointments */}
                    {searchResults.appointments.length > 0 && (
                      <div className="py-2 px-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('translation:appointments')}</h3>
                        <div className="space-y-1">
                          {searchResults.appointments.map((appointment) => (
                            <div
                              key={appointment.id}
                              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                            >
                              <Calendar className="h-5 w-5 text-purple-500" />
                              <div>
                                <div className="font-medium">{appointment.patientName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {appointment.date.split("-").reverse().join("/")} • {appointment.time} •{" "}
                                  {appointment.doctor}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Medications */}
                    {searchResults.medications.length > 0 && (
                      <div className="py-2 px-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('translation:medications')}</h3>
                        <div className="space-y-1">
                          {searchResults.medications.map((medication) => (
                            <div
                              key={medication.id}
                              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                            >
                              <Pill className="h-5 w-5 text-green-500" />
                              <div>
                                <div className="font-medium">{medication.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {medication.dosage} • {medication.form}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Doctors */}
                    {searchResults.doctors.length > 0 && (
                      <div className="py-2 px-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('translation:doctors')}</h3>
                        <div className="space-y-1">
                          {searchResults.doctors.map((doctor) => (
                            <div
                              key={doctor.id}
                              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                            >
                              <Stethoscope className="h-5 w-5 text-teal-500" />
                              <div>
                                <div className="font-medium">{doctor.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {doctor.id} • {doctor.specialty}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rooms */}
                    {searchResults.rooms.length > 0 && (
                      <div className="py-2 px-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('translation:rooms')}</h3>
                        <div className="space-y-1">
                          {searchResults.rooms.map((room) => (
                            <div
                              key={room.id}
                              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                            >
                              <Bed className="h-5 w-5 text-amber-500" />
                              <div>
                                <div className="font-medium">{room.id}</div>
                                <div className="text-xs text-muted-foreground">
                                  {translateValue('type', room.type, t)} • {room.floor} • {translateValue('status', room.status, t)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="h-10 w-10 text-muted-foreground mb-3" />
                    {searchQuery ? (
                      <>
                        <h3 className="font-medium">{t('translation:noResultsFound')}</h3>
                        <p className="text-sm text-muted-foreground">{t('translation:trySearchingForSomethingElse')}</p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-medium">{t('translation:searchForAnything')}</h3>
                        <p className="text-sm text-muted-foreground">{t('translation:startTypingToSeeResults')}</p>
                      </>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* Individual tabs for each category */}
              <TabsContent value="patients" className="m-0">
                {searchResults.patients.length > 0 ? (
                  <div className="divide-y">
                    {searchResults.patients.map((patient) => (
                      <div key={patient.id} className="flex items-center gap-2 p-4 hover:bg-muted/50 cursor-pointer">
                        <User className="h-5 w-5 text-blue-500" />
                        <div className="flex-1">
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {patient.id} • {patient.age} years • {translateValue('gender', patient.gender, t)}
                          </div>
                        </div>
                        <Button size="sm">{t('translation:viewProfile')}</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <User className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="font-medium">{t('translation:noPatientsFound')}</h3>
                    <p className="text-sm text-muted-foreground">{t('translation:trySearchingForSomethingElse')}</p>
                  </div>
                )}
              </TabsContent>

              {/* Similar structure for other tabs */}
              <TabsContent value="appointments" className="m-0">
                {searchResults.appointments.length > 0 ? (
                  <div className="divide-y">
                    {searchResults.appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center gap-2 p-4 hover:bg-muted/50 cursor-pointer"
                      >
                        <Calendar className="h-5 w-5 text-purple-500" />
                        <div className="flex-1">
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.date.split("-").reverse().join("/")} • {appointment.time} •{" "}
                            {appointment.doctor}
                          </div>
                        </div>
                        <Button size="sm">{t('translation:viewDetails')}</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="font-medium">{t('translation:noAppointmentsFound')}</h3>
                    <p className="text-sm text-muted-foreground">{t('translation:trySearchingForSomethingElse')}</p>
                  </div>
                )}
              </TabsContent>

              {/* Medications tab */}
              <TabsContent value="medications" className="m-0">
                {searchResults.medications.length > 0 ? (
                  <div className="divide-y">
                    {searchResults.medications.map((medication) => (
                      <div key={medication.id} className="flex items-center gap-2 p-4 hover:bg-muted/50 cursor-pointer">
                        <Pill className="h-5 w-5 text-green-500" />
                        <div className="flex-1">
                          <div className="font-medium">{medication.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {medication.dosage} • {medication.form}
                          </div>
                        </div>
                        <Button size="sm">{t('translation:viewDetails')}</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Pill className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="font-medium">{t('translation:noMedicationsFound')}</h3>
                    <p className="text-sm text-muted-foreground">{t('translation:trySearchingForSomethingElse')}</p>
                  </div>
                )}
              </TabsContent>

              {/* Doctors tab */}
              <TabsContent value="doctors" className="m-0">
                {searchResults.doctors.length > 0 ? (
                  <div className="divide-y">
                    {searchResults.doctors.map((doctor) => (
                      <div key={doctor.id} className="flex items-center gap-2 p-4 hover:bg-muted/50 cursor-pointer">
                        <Stethoscope className="h-5 w-5 text-teal-500" />
                        <div className="flex-1">
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {doctor.id} • {doctor.specialty}
                          </div>
                        </div>
                        <Button size="sm">{t('translation:viewProfile')}</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Stethoscope className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="font-medium">{t('translation:noDoctorsFound')}</h3>
                    <p className="text-sm text-muted-foreground">{t('translation:trySearchingForSomethingElse')}</p>
                  </div>
                )}
              </TabsContent>

              {/* Rooms tab */}
              <TabsContent value="rooms" className="m-0">
                {searchResults.rooms.length > 0 ? (
                  <div className="divide-y">
                    {searchResults.rooms.map((room) => (
                      <div key={room.id} className="flex items-center gap-2 p-4 hover:bg-muted/50 cursor-pointer">
                        <Bed className="h-5 w-5 text-amber-500" />
                        <div className="flex-1">
                          <div className="font-medium">{room.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {translateValue('type', room.type, t)} • {room.floor} • {translateValue('status', room.status, t)}
                          </div>
                        </div>
                        <Button size="sm">{t('translation:viewDetails')}</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bed className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="font-medium">{t('translation:noRoomsFound')}</h3>
                    <p className="text-sm text-muted-foreground">{t('translation:trySearchingForSomethingElse')}</p>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>

            <div className="p-2 border-t">
              <div className="text-xs text-muted-foreground flex items-center justify-between px-2">
                <div>{t('translation:press')}<kbd className="rounded border bg-muted px-1 text-xs">↑</kbd>{" "}
                  <kbd className="rounded border bg-muted px-1 text-xs">↓</kbd>{t('translation:toNavigate')}</div>
                <div>{t('translation:press')}<kbd className="rounded border bg-muted px-1 text-xs">{t('translation:enter')}</kbd>{t('translation:toSelect')}</div>
              </div>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}

