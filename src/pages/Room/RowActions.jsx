import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useOutsideClick } from '../../components/hooks/useOutsideClick';
import { useDeleteRoomMutation } from '../../redux/slices/roomSlice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const RowActions = ({ room, onEdit }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClick(() => setIsOpen(false));

  const [deleteRoom, { isLoading }] = useDeleteRoomMutation();

  const handleDelete = async () => {
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

  return (
    <td className="px-4 py-3 text-right relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-gray-500 hover:text-gray-700"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div
          ref={ref}
          className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50"
        >
          <button
            onClick={() => {
              onEdit(room); // Send current room to edit handler
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >{t('translation:edit')}</button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </td>
  );
};

export default RowActions;
