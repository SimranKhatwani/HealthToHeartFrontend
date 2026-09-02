import React, { useEffect, useState } from "react";
import Table from "../../components/utilis/Table";
import axios from "axios";
import { toast } from "react-toastify";
import AddRoleModal from "./AddRoleModal";
import { useGetRolesQuery } from "../../redux/slices/roleSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const AllRoles = () => {
    const { t } = useTranslation();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [initialRoleData, setInitialRoleData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [entries, setEntries] = useState(10);
    const { role } = useSelector((state) => state.role);
    const isSuperAdmin = role && role.toLowerCase() === "superadmin";
    const { data: roles, error: roleError, isSuccess: roleIsSuccess } = useGetRolesQuery();

    const handleRoleEntriesChange = (value) => {
        setEntries(value);
        setCurrentPage(1);
    };

    const columns = [
        ...(isSuperAdmin ? [{ header: t("roles.orgId", "Organization ID"), accessor: "org_id" }] : []),
        { header: t("common.id", "ID"), accessor: "role_id" },
        { header: t("roles.roleName", "Role Name"), accessor: "role_name" },
        { header: t("roles.createdAt", "Created At"), accessor: "createdAt" },
    ];

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };
    const handleRolePageChange = (page) => {
        setCurrentPage(page);
      };
    const HandleSearch = (value) => {
        setFilteredRoles(
            roles.filter((role) =>
                role.role_name.toLowerCase().includes(value.toLowerCase()) ||
                role.role_id.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    useEffect(() => {
        if (roleIsSuccess && roles) {
            const cleanedRoles = roles.map(role => ({
                ...role,
                org_id: typeof role.org_id === "object" ? role.org_id?.org_name ?? "Unknown Org" : role.org_id
            }));
            setFilteredRoles(cleanedRoles);
        }
    }, [roleIsSuccess, roles]);
    
    const startIndex = (currentPage - 1) * entries;
    const RolespaginateData = filteredRoles.slice(startIndex, startIndex + entries);

    return (
        <div className="p-4">
            <Table
                title={t("roles.rolesTable", "Roles Table")}
                columns={columns}
                data={RolespaginateData}
                // actions={actions}
                onSearch={(value) => HandleSearch(value)}
                onRowClick={(row) => {
                    setIsAddModalOpen(true);
                    setInitialRoleData(row);
                }}
                currentPage={currentPage}
                totalPages={Math.ceil(filteredRoles.length / entries)}
                onPageChange={handleRolePageChange}
                totalEntries={filteredRoles.length}
                entriesPerPage={entries}
                onEntriesChange={handleRoleEntriesChange}
                entriesOptions={[5, 10, 25, 50, 100]}
                exportButton={false}
                loading={loading}

            />
            {isAddModalOpen && <AddRoleModal closeAddModal={closeAddModal} setIsAddModalOpen={setIsAddModalOpen} initialRoleData={initialRoleData} />}
        </div>
    );
};

export default AllRoles;