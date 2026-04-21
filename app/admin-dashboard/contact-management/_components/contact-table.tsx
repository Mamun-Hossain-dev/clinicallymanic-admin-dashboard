// ============================================
// File: app/contact-management/_components/ContactTable.tsx
// ============================================

import { Eye, Trash2, Mail, MailOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Contact } from '@/types/contact'

interface ContactTableProps {
  contacts: Contact[]
  onView: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}

export const ContactTable = ({
  contacts,
  onView,
  onDelete,
}: ContactTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-800 border-b border-gray-700">
          <tr>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Status
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Name
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Email
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Phone
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Occupation
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Subject
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Date
            </th>
            <th className="text-left px-6 py-4 text-lg font-semibold text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr
              key={contact._id}
              className={`border-b border-gray-700 hover:bg-gray-800/50 transition-colors ${
                !contact.isRead ? 'bg-blue-900/10' : ''
              }`}
            >
              <td className="px-6 py-4">
                {contact.isRead ? (
                  <MailOpen className="h-5 w-5 text-gray-400" />
                ) : (
                  <Mail className="h-5 w-5 text-blue-400" />
                )}
              </td>
              <td className="px-6 py-4 text-base text-gray-300 font-medium">
                {contact.name}
              </td>
              <td className="px-6 py-4 text-base text-gray-400">
                {contact.email}
              </td>
              <td className="px-6 py-4 text-base text-gray-400">
                {contact.phoneNumber}
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 text-sm bg-purple-600/20 text-purple-400 rounded-full">
                  {contact.occupation}
                </span>
              </td>
              <td className="px-6 py-4 text-base text-gray-300 max-w-xs truncate">
                {contact.subject}
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                {formatDate(contact.createdAt)}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(contact)}
                    title="View"
                  >
                    <Eye className="h-5 w-5 text-blue-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(contact)}
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5 text-red-400" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
