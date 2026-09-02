import React, { useState, useEffect } from 'react';
import { Search, Calendar, Plus, Filter, Download, MoreVertical, MoreHorizontal, X, Edit, Trash2 } from 'lucide-react';
import { useGetRoomsQuery, useDeleteRoomMutation, useGetAssignRoomsQuery, useDeleteAssignRoomMutation } from '../../redux/slices/roomSlice';
import AddRoomForm from './AddRoomForm';
import AssignRoomForm from './AssignRoomForm';
import Button from "../../components/UI/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/UI/Tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/UI/DropMenu"
import { toast } from 'react-toastify';
import useFormattedDate from '../../components/hooks/useFormattedDate';
import { downloadPdf } from '../../components/utilis/DownloadPdfs';


import { useTranslation } from "react-i18next";

const RoomsManagement = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState("rooms");
  const [activeTab, setActiveTab] = useState('directory');
  const { data } = useGetRoomsQuery();
  const { data: assignRooms } = useGetAssignRoomsQuery();
  const [deleteRoom, { isLoading }] = useDeleteRoomMutation();
  const [deleteAssignRoom] = useDeleteAssignRoomMutation();
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [showAssignRoomForm, setShowAssignRoomForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [editingRoom, setEditingRoom] = useState(null);
  const formatDate = useFormattedDate();
  

  const handleDelete = async (room) => {
      try {
        await deleteRoom(room._id).unwrap();
        toast.success(`Room ${room.room_name} deleted successfully`);
      } catch (error) {
        // console.error('Delete error:', error);
        toast.error(t('translation:failedToDeleteRoom'));
      } finally {
        setIsOpen(false);
      }
    };

  const handleAssignRoomDelete = async (assignRoom) => {
      try {
        await deleteAssignRoom(assignRoom._id).unwrap();
        toast.success(`Assign Room deleted successfully`);
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(t('translation:failedToDeleteRoom'));
      }
    };

    const editRoom = (room) => {
      // setEditingRoom(room);
      // setShowAddRoomForm(true);
    };

    const filteredRooms = data?.data?.filter((room) =>
      room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.room_name.toLowerCase().includes(searchTerm.toLowerCase())

    );

    const filteredAssignRooms = assignRooms?.filter((room) =>
      room.roomId?.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomId?.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.patientId?.id.toLowerCase().includes(searchTerm.toLowerCase())
    );


  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      
      {showAddRoomForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50">
            <AddRoomForm 
            setShowAddRoomForm={setShowAddRoomForm} 
            />
        </div>
      )}
      
      {showAssignRoomForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50">
            <AssignRoomForm 
            setShowAssignRoomForm={setShowAssignRoomForm}
            />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("rooms.title")}</h1>
        <div className="flex gap-2 md:flex-row flex-col">
          <button className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-md"
          onClick={() => setShowAssignRoomForm(true)}
          >
            <Calendar size={18} />
            <span>{t("rooms.addReservation", "Add Reservation")}</span>
          </button>
          <button
            className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-md"
            onClick={() => setShowAddRoomForm(true)}
          >
            <Plus size={18} />
            <span>{t("rooms.addRoom", "Add Room")}</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t("rooms.searchPlaceholder", "Search rooms by number, type, or department...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full border-2 border-gray-400 h-10 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
          />
        </div>
        {/* <button className="p-2 border border-gray-300 bg-white rounded-md">
          <Filter size={20} className="text-gray-600" />
        </button> */}
        <button 
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-md text-gray-700"
        onClick={() => {
          if (tabValue === "rooms") {
          const headers = ["Room Id", "Room Number", "Room Type", "Department", "Total Beds", "Beds Occupied"];
          const exportData = data?.data?.map((room) => [
            room.room_id,
            room.room_number,
            room.roomType,
            room.room_name,
            room.bedsCount,
            room.occupiedBedsCount,
          ]);

          downloadPdf({
            title: "Rooms Data",
            headers,
            data: exportData,
            fileName: "room_data.pdf",
          });
        } else if (tabValue === "assignments") {
        const headers = ["Patient Id", "Room Number", "Room Type", "Bed Number", "Discharge Date", "Notes", "Status"];
        const exportData = assignRooms?.map((assignment) => [
        assignment?.patientId?.id,
        assignment?.roomId?.room_number,
        assignment?.roomId?.roomType,
        assignment.bedNumber,
        formatDate(assignment.expectedDischarge),
        assignment.notes,
        assignment.status,
      ]);

      downloadPdf({
        title: "Room Assignments",
        headers,
        data: exportData,
        fileName: "room_assignments.pdf",
      });
    }
        }}
      >
        <Download size={18} />
        <span>{t("common.export", "Export")}</span>
      </button>

      </div>

      {/* Tabs */}
      <Tabs defaultValue="rooms" value={tabValue} onValueChange={setTabValue} className="mb-6">
      <div className="flex gap-1 mb-6">
      <TabsList className="bg-teal-100">
      <TabsTrigger
        value="rooms"
        className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
      >
        {t("rooms.directory", "Rooms Directory")}
      </TabsTrigger>
      <TabsTrigger
        value="assignments"
        className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
      >
        {t("rooms.assignments", "Room Assignments")}
      </TabsTrigger>
    </TabsList>
  </div>

  {/* Rooms Directory Content */}
  <TabsContent value="rooms" className="mt-4">
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{t("rooms.directory", "Rooms Directory")}</h2>
        <p className="text-gray-500 text-sm">{t("rooms.directorySub", "Complete list of hospital rooms")}</p>
      </div>

      <div className="overflow-x-auto">
      <table className="w-full table-auto">
       <thead>
        <tr className="bg-gray-50 text-left">
          <th className="px-4 py-3">{t("rooms.roomId", "Room ID")}</th>
          <th className="px-4 py-3">{t("rooms.roomNumber", "Room Number")}</th>
          <th className="px-4 py-3">{t("rooms.type", "Type")}</th>
          <th className="px-4 py-3">{t("rooms.department", "Department")}</th>
          <th className="px-4 py-3">{t("rooms.totalBeds", "Total Beds")}</th>
          <th className="px-4 py-3">{t("rooms.bedsOccupied", "Beds Occupied")}</th>
          <th className="px-4 py-3">{t("common.status", "Status")}</th>
          <th className="px-4 py-3 text-right">{t("common.actions", "Actions")}</th>
        </tr>
        </thead>
        <tbody>
        {filteredRooms?.length === 0 ? (
          <tr>
          <td colSpan={8} className="text-center py-4">
          {t("rooms.noRoomsFound", "No rooms found.")}
        </td>
        </tr>
        ) : (
        filteredRooms?.map((room) => (
        <tr key={room.room_id} className="border-b">
          <td className="px-4 py-3">{room.room_id}</td>
          <td className="px-4 py-3">{room.room_number}</td>
          <td className="px-4 py-3">{t(`rooms.${room.roomType.toLowerCase().replace(/\s+/g, "").replace("-", "")}`, room.roomType)}</td>
          <td className="px-4 py-3">{room.room_name}</td>
          <td className="px-4 py-3">{room.bedsCount}</td>
          <td className="px-4 py-3">{room.occupiedBedsCount}</td>
          <td className="px-4 py-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                room.roomStatus === 'Available'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {t(`status.${room.roomStatus.toLowerCase()}`, room.roomStatus)}
            </span>
          </td>
          <td className="px-4 py-3 text-right">
            {/* Room Actions */}
            <DropdownMenu className="bg-white">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel>{t("common.actions", "Actions")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => editRoom(room)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {t("common.edit", "Edit")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(room)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("common.delete", "Delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        </tr>
          ))
        )}
      </tbody>
      </table>

      </div>
    </div>
  </TabsContent>

  {/* Room Assignments Content */}
  <TabsContent value="assignments" className="mt-4">
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{t("rooms.assignments", "Room Assignments")}</h2>
        <p className="text-gray-500 text-sm">{t("rooms.assignmentsSub", "Assign rooms to patients")}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3">{t("patients.patientId", "Patient ID")}</th>
              <th className="px-4 py-3">{t("rooms.roomNumber", "Room Number")}</th>
              <th className="px-4 py-3">{t("rooms.type", "Room Type")}</th>
              <th className="px-4 py-3">{t("rooms.bedNumber", "Bed Number")}</th>
              <th className="px-4 py-3">{t("rooms.admissionDate", "Admission Date")}</th>
              <th className="px-4 py-3">{t("rooms.dischargeDate", "Discharge Date")}</th>
              <th className="px-4 py-3">{t("common.notes", "Notes")}</th>
              <th className="px-4 py-3">{t("common.status", "Status")}</th>
              <th className="px-4 py-3 text-right">{t("common.actions", "Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignRooms?.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-4">
                {t("rooms.noAssignRoomsFound", "No Assign rooms found.")}
              </td>
            </tr>
            ) : (
          filteredAssignRooms?.map((assignRoom) => (
          <tr key={assignRoom._id} className="border-b">
          <td className="px-4 py-3">{assignRoom?.patientId?.id}</td>
          <td className="px-4 py-3">{assignRoom?.roomId?.room_number}</td>
          <td className="px-4 py-3">{t(`rooms.${assignRoom?.roomId?.roomType?.toLowerCase().replace(/\s+/g, "").replace("-", "")}`, assignRoom?.roomId?.roomType)}</td>
          <td className="px-4 py-3">{assignRoom?.bedNumber}</td>
          <td className="px-4 py-3">{formatDate(assignRoom?.admissionDate)}</td>
          <td className="px-4 py-3">{formatDate(assignRoom?.expectedDischarge)}</td>
          <td className="px-4 py-3">{assignRoom?.notes}</td>
          <td className="px-4 py-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              assignRoom?.roomStatus === 'Available'
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {t(`status.${assignRoom?.status?.toLowerCase()}`, assignRoom?.status)}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <DropdownMenu className="bg-white">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>{t("common.actions", "Actions")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => editRoom(assignRoom)}>
                <Edit className="h-4 w-4 mr-2" />
                {t("common.edit", "Edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAssignRoomDelete(assignRoom)}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("common.delete", "Delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
    ))
            )}
        </tbody>

        </table>
      </div>
    </div>
  </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoomsManagement;
