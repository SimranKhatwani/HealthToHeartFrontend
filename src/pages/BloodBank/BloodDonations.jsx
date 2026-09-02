import { useState } from 'react';
import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { Download, Droplet } from "lucide-react";
import Badge from "../../components/UI/Badge";
import { useFetchBloodDonationsQuery } from '../../redux/slices/bloodBankSlice';
import { downloadPdf } from '../../components/utilis/DownloadPdfs';
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const BloodDonations = () => {
  const { t, i18n } = useTranslation();
  const { data: bloodDonations, error, isLoading } = useFetchBloodDonationsQuery();
  const { mode } = useSelector((state) => state.theme)
  const [isHovered, setIsHovered] = useState(false);

  const darkTeal = "#014d4d";

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const donations = bloodDonations?.data || [];
  const totalPages = Math.ceil(donations.length / itemsPerPage);

  const paginatedDonations = donations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className='rounded-lg border bg-white border-gray-200'
    style={{
      backgroundColor: mode === "dark" && "#020817",
      color: mode === "dark" && "white",
      }}>
      <div className="flex flex-row items-center justify-between p-8">
        <div>
          <div className='text-2xl font-semibold leading-none'>{t("bloodBank.recentDonations", "Recent Donations")}</div>
          <div className='text-sm text-gray-500'>{t("bloodBank.latestDonations", "Latest blood donations received")}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 hover:bg-teal-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundColor: isHovered
              ? darkTeal
              : mode === "dark"
              ? "#020817"
              : "white",
            color: mode === "dark" ? "white" : "black",
            transition: "background-color 0.3s ease",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() => {
            const headers = ["Donor Name", "Blood Type", "Donation Date", "Units Donated"];
            const exportData = donations.map((donation) => [
              donation.donorName,
              donation.bloodType,
              new Date(donation.donationDate).toLocaleDateString(i18n.language === "fr" ? "fr-FR" : "en-US"),
              donation.unitsDonated + " unit",
            ]);

            downloadPdf({
              title: "Blood Donations Report",
              headers,
              data: exportData,
              fileName: "blood_donations.pdf",
            });
          }}
        >
        <Download className="h-4 w-4 mr-2" />
        {t("common.export", "Export")}
        </Button>
      </div>

      <div className='pt-0 p-8'>
        <div className="space-y-4">
          {paginatedDonations.map((donation) => (
            <div
              key={donation._id}
              className="flex items-center justify-between border-b border-gray-200 pb-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-500">
                  <Droplet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{donation.donorName}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs rounded-sm ${mode === "dark" ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800 "}`}>
                      {donation.bloodType}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(donation.donationDate).toLocaleDateString(i18n.language === "fr" ? "fr-FR" : "en-US", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{donation.unitsDonated} {t("bloodBank.units", "units")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {donations.length >= 4 && (
        <div className="border-t border-gray-200 py-4 flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-500 hover:text-teal-600"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            {t("common.previous", "Previous")}
          </Button>
          <p className="text-sm text-gray-500">
            {t("common.page", "Page")} {currentPage} {t("common.of", "of")} {totalPages}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-500 hover:text-teal-600"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            {t("common.next", "Next")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BloodDonations;
