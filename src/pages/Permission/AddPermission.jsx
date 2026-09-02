import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {useOutsideClick} from "../../components/hooks/useOutsideClick";
import { useCreatePermissionMutation } from "../../redux/slices/permissionSlice";
import { useUpdatePermissionMutation } from "../../redux/slices/permissionSlice";
import { useGetAllOrganizationQuery } from "../../redux/slices/organizationSlice";
import { useTranslation } from "react-i18next";

const AddPermissionModal = ({ closeAddModal, setIsAddModalOpen, initialPermissionData }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        permission_name: "",
        org_id: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { role } = useSelector((state) => state.role);
    const isSuperAdmin = role === "superadmin";
    const [ createPermission ] = useCreatePermissionMutation();
    const [ updatePermission ] = useUpdatePermissionMutation();
    const { data: organizations} = useGetAllOrganizationQuery();

    useEffect(() => {
        if (initialPermissionData) {
            setFormData({
                permission_name: initialPermissionData.permission_name || "",
                org_id: initialPermissionData.org_id || "",
            });
        }
    }, [initialPermissionData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        setLoading(true);
        setError("");
    
        let response;
        try {
            if (initialPermissionData) {
                response = await updatePermission({
                    id: initialPermissionData._id,
                    ...formData,
                }).unwrap();
            } else {
                response = await createPermission(formData).unwrap();
            }
    
            toast(response.message);
            closeAddModal(false);
        } catch (err) {
            console.error("Error submitting permission data:", err);
            setError(err?.data?.message || "Failed to submit permission data");
        } finally {
            setLoading(false);
        }
    };
    
    const ref = useOutsideClick(() => {
        closeAddModal(false);
    });

    return (
        <div className="fixed inset-0 bg-black/10 bg-opacity-40 flex items-center justify-center p-4 sm:p-8 min-h-screen">
            <div ref={ref}  className="bg-white rounded-lg shadow-lg p-8 sm:p-10 max-h-[33rem] overflow-y-auto scrollbar-thin w-screen max-w-lg transition-transform transform scale-100">
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-semibold mb-4">
                        {initialPermissionData ? t("roles.editPermission", "Edit Permission") : t("roles.addPermission", "Add Permission")}
                    </h2>
                    <button className="text-gray-500 hover:text-gray-800 text-2xl" onClick={closeAddModal}>
                        &times;
                    </button>
                </div>
                <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="permission_name" className="block text-sm font-medium text-gray-700">
                            {t("roles.permissionName", "Permission Name")}*
                        </label>
                        <input
                            type="text"
                            id="permission_name"
                            name="permission_name"
                            value={formData.permission_name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                            placeholder={t("roles.enterPermissionName", "Enter permission name")}
                            required
                        />
                    </div>
                    {isSuperAdmin  && (
                        <div>
                            <label htmlFor="org_id" className="block text-sm font-medium text-gray-700">
                                {t("roles.organization", "Organization")}
                            </label>
                            <select
                                id="org_id"
                                name="org_id"
                                value={formData.org_id}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                            >
                                <option value="" disabled>
                                    {t("roles.selectOrganization", "Select Organization")}
                                </option>
                                {organizations?.map((org) => (
                                    <option key={org._id} value={org.org_id}>
                                        {org.org_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            className="bg-gray-500 text-white py-2 px-4 text-sm rounded-lg hover:bg-gray-600 transition"
                            onClick={closeAddModal}
                        >
                            {t("common.cancel", "Cancel")}
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 text-sm rounded-lg hover:bg-blue-600 transition"
                            disabled={loading}
                        >
                            {initialPermissionData ? (loading ? t("common.editing", "Editing...") : t("roles.editPermission", "Edit Permission")) : (loading ? t("common.creating", "Creating...") : t("roles.createPermission", "Create Permission"))}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPermissionModal;
