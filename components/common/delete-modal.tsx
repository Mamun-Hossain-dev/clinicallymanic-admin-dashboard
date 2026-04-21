// ============================================
// File: app/shop-management/_components/DeleteModal.tsx
// ============================================

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

export const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}: DeleteModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-2">
          Confirm Delete
        </h3>
        <p className="text-base text-gray-300 mb-6">
          Are you sure you want to delete &quot;{title}&quot;? This action
          cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-base bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-base bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
