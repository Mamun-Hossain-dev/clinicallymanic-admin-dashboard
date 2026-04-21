// ============================================
// File: app/contact-management/_components/ContactViewModal.tsx
// ============================================

import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  MessageSquare,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Contact } from '@/types/contact'

interface ContactViewModalProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact | null
}

export const ContactViewModal = ({
  isOpen,
  onClose,
  contact,
}: ContactViewModalProps) => {
  if (!isOpen || !contact) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-3xl w-full my-8 border border-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-white">
              Contact Details
            </h3>
            {!contact.isRead && (
              <span className="px-3 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full">
                Unread
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Name</h4>
                <p className="text-base text-white font-medium">
                  {contact.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Mail className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Email</h4>
                <p className="text-base text-white">{contact.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Phone className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Phone</h4>
                <p className="text-base text-white">{contact.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-600/20 rounded-lg">
                <Briefcase className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Occupation</h4>
                <p className="text-base text-white">{contact.occupation}</p>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="border-t border-gray-800 pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <MessageSquare className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm text-gray-400 mb-1">Subject</h4>
                <p className="text-base text-white font-medium">
                  {contact.subject}
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="border-t border-gray-800 pt-4">
            <h4 className="text-base text-gray-400 mb-2 font-medium">
              Message
            </h4>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-base text-gray-300 whitespace-pre-wrap leading-relaxed">
                {contact.message}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t border-gray-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-700/50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Received At</h4>
                <p className="text-sm text-gray-300">
                  {formatDate(contact.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-700/50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Last Updated</h4>
                <p className="text-sm text-gray-300">
                  {formatDate(contact.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-800 mt-6">
          <Button variant="outline" onClick={onClose} className="text-base">
            Close
          </Button>
          <Button
            onClick={() => (window.location.href = `mailto:${contact.email}`)}
            className="text-base"
          >
            <Mail className="mr-2 h-4 w-4" />
            Reply via Email
          </Button>
        </div>
      </div>
    </div>
  )
}
