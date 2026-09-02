import React, { useEffect, useState } from "react";
import Table from "../../components/utilis/Table";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import AddPermissionModal from "./AddPermission";
import { useGetAllPermissionsQuery } from "../../redux/slices/permissionSlice"
import { useTranslation } from "react-i18next";

const AllPermission = () => {
    const { t } = useTranslation();
    const [permissions, setPermissions] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [initialPermissionData, setInitialPermissionData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredPermissions, setFilteredPermissions] = useState([]);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const { role } = useSelector((state) => state.role);
    const isSuperAdmin = role === "superadmin";
    const isAdmin = role === "admin";
    const { data: allPermissions } = useGetAllPermissionsQuery();

    useEffect(() => {
        setPermissions(allPermissions);
        setFilteredPermissions(allPermissions);
    }, [allPermissions]);

    const handlePermissionEntriesChange = (value) => {
        setEntriesPerPage(value);
        setCurrentPage(1);
    };

    const columns = [
        ...((isSuperAdmin || isAdmin) ? ([{ header: t("roles.orgId", "Organization ID"), accessor: "org_id" }]) : []),
        { header: t("roles.permissionName", "Permission Name"), accessor: "permission_name" },
        { header: t("roles.createdAt", "Created At"), accessor: "createdAt" },
    ];

    const actions = [
        ...((isSuperAdmin || isAdmin)
            ? ([
                {
                    label: "📝 " + t("roles.addNewPermission", "Add New Permission"),
                    onClick: () => {
                        setIsAddModalOpen(true);
                        setInitialPermissionData(null);
                    },
                },
            ])
            : []),
    ];

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };
    const handleSearch = (value) => {
        setFilteredPermissions(
            permissions.filter((permission) =>
                permission.permission_name.toLowerCase().includes(value.toLowerCase()) ||
                permission.org_id.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }; 
    const startIndex = (currentPage - 1) * entriesPerPage;
    const PermissionpaginatedData = filteredPermissions?.slice(startIndex, startIndex + entriesPerPage); 

    return (
        <div className="p-4">
            <Table
                title={t("roles.permissionsTable", "Permissions Table")}
                columns={columns}
                data={PermissionpaginatedData}
                actions={actions}
                onSearch={(value) => handleSearch(value)}
                onRowClick={
                    (row) => {
                        (isSuperAdmin || isAdmin) && setIsAddModalOpen(true);
                        (isSuperAdmin || isAdmin) && setInitialPermissionData(row);
                    }

                }
                currentPage={currentPage}
                totalPages={Math.ceil(filteredPermissions?.length / entriesPerPage)}
                onPageChange={handlePageChange}
                totalEntries={filteredPermissions?.length}
                entriesPerPage={entriesPerPage}
                onEntriesChange={handlePermissionEntriesChange}
                entriesOptions={[5, 10, 25, 50, 100, permissions?.length]}
                exportButton={false}
                loading={loading}
            />
            {isAddModalOpen && <AddPermissionModal closeAddModal={closeAddModal} setIsAddModalOpen={setIsAddModalOpen} initialPermissionData={initialPermissionData} />}

        </div>
    );
};

export default AllPermission;
