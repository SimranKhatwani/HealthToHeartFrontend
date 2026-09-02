import React, { useState } from 'react';
import {
  Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter
} from '../../components/UI/Card';
import { Plus, Droplet, AlertCircle } from "lucide-react";
import Badge from "../../components/UI/Badge";
import Button from '../../components/UI/Button';
import { useFetchBloodRequestsQuery } from '../../redux/slices/bloodBankSlice';
import NewRequestForm from './NewRequestForm';
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { translateValue } from '../../utilis/translate';

const BloodRequests = () => {
  const { t, i18n } = useTranslation();
  const [isNewRequestFormOpen, setIsNewRequestFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { data: bloodRequests, error, isLoading } = useFetchBloodRequestsQuery();
  const { mode } = useSelector((state) => state.theme)

  const totalItems = bloodRequests?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedRequests = bloodRequests?.data?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className='rounded-lg border bg-white border-gray-200'
    style={{
      backgroundColor: mode === "dark" && "#020817",
      color: mode === "dark" && "white",
      }}>
      <div className='flex justify-between p-8'>
        <div>
          <div className='text-2xl font-semibold leading-none'>{t("bloodBank.bloodRequests", "Blood Requests")}</div>
          <div className='text-sm text-gray-500'>{t("bloodBank.recentRequests", "Recent blood requests from hospital departments")}</div>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600" size="sm" onClick={() => setIsNewRequestFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("bloodBank.newRequest", "New Request")}
        </Button>
      </div>

      <div className='pt-0 p-8'>
        <div className="space-y-4">
          {paginatedRequests?.map((request) => (
            <div key={request._id} className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-3">
                <div className={`
                  flex items-center justify-center h-10 w-10 rounded-full
                  ${request.urgency === "critical"
                      ? "bg-rose-100 text-rose-500"
                      : request.urgency === "urgent"
                        ? "bg-amber-100 text-amber-500"
                        : "bg-blue-100 text-blue-500"}
                `}>
                  {(request.urgency === "critical" || request.urgency === "urgent") && <AlertCircle className="h-5 w-5" />}
                  {request.urgency === "normal" && <Droplet className="h-5 w-5" />}
                </div>

                <div>
                  <p className="text-sm font-medium">{request.patientName}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs rounded-sm border border-gray-200">
                      {request.bloodType}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(request.requestDate).toLocaleDateString(i18n.language === "fr" ? "fr-FR" : "en-US", {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-normal">
              <Badge
                className={`capitalize ${
                  request.status === "pending"
                    ? mode === "light"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-amber-900 text-amber-300"
                    : request.status === "rejected"
                      ? mode === "light"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-blue-900 text-blue-300"
                      : mode === "light"
                        ? "bg-green-100 text-green-800"
                        : "bg-green-900 text-green-300"
                }`}
              >
                {t(`status.${translateValue('status', request.status, t)}`, request.status)}
              </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="border-t border-gray-200 py-3 flex items-center justify-between px-4">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="text-teal-500 hover:text-teal-600 hover:bg-teal-50"
        >
          {t("common.previous", "Previous")}
        </Button>
        <span className="text-sm text-muted-foreground">
          {t("common.page", "Page")} {currentPage} {t("common.of", "of")} {totalPages}
        </span>
        <Button
          variant="ghost"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="text-teal-500 hover:text-teal-600 hover:bg-teal-50"
        >
          {t("common.next", "Next")}
        </Button>
      </div>

      {/* Modal */}
      {isNewRequestFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${mode === "dark" ? "bg-black" : "bg-white"} p-6 rounded-lg shadow-lg w-full max-w-lg`}>
            <NewRequestForm onClose={() => setIsNewRequestFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodRequests;
