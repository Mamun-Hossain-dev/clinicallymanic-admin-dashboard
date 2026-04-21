// ============================================
// File: app/contact-management/page.tsx
// ============================================

'use client'

import { useState } from 'react'
import { Search, Filter, Mail, MailOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import type { Contact } from '@/types/contact'
import { useContacts, useDeleteContact } from '@/hooks/useContact'
import { TableSkeleton } from '@/components/common/tableSkeleton'
import { NoDataFound } from '@/components/common/no-data-found'
import { ContactTable } from './contact-table'
import { Pagination } from '@/components/common/table-pagination'
import { ContactViewModal } from './contact-view'
import { DeleteModal } from '@/components/common/delete-modal'

export default function ContactManagementPage() {
  const { data: session } = useSession()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'read' | 'unread'>(
    'all',
  )

  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [viewingContact, setViewingContact] = useState<Contact | null>(null)
  const [deletingContact, setDeletingContact] = useState<{
    id: string
    title: string
  } | null>(null)

  // React Query hooks
  const { data, isLoading, error } = useContacts(page, limit)
  const deleteContact = useDeleteContact()

  const handleDelete = async () => {
    if (!deletingContact) return
    try {
      await deleteContact.mutateAsync(deletingContact.id)
      setShowDeleteModal(false)
      setDeletingContact(null)
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const handleView = (contact: Contact) => {
    setViewingContact(contact)
    setShowViewModal(true)
  }

  const handleDeleteClick = (contact: Contact) => {
    setDeletingContact({ id: contact._id, title: contact.name })
    setShowDeleteModal(true)
  }

  const contacts = data?.data || []
  const meta = data?.meta || { total: 0, page: 1, limit: 10 }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'read' && contact.isRead) ||
      (filterStatus === 'unread' && !contact.isRead)

    return matchesSearch && matchesFilter
  })

  const unreadCount = contacts.filter(c => !c.isRead).length

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Error Loading Contacts
          </h2>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Contact Management</h1>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-full font-medium">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-base text-gray-400">
                Manage and respond to contact inquiries
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or subject..."
                className="w-full pl-10 pr-4 py-2 text-base bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                className="text-base"
              >
                <Filter className="mr-2 h-4 w-4" />
                All
              </Button>
              <Button
                variant={filterStatus === 'unread' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('unread')}
                className="text-base"
              >
                <Mail className="mr-2 h-4 w-4" />
                Unread
              </Button>
              <Button
                variant={filterStatus === 'read' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('read')}
                className="text-base"
              >
                <MailOpen className="mr-2 h-4 w-4" />
                Read
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Contacts</p>
                <p className="text-2xl font-bold text-white">{meta.total}</p>
              </div>
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <Mail className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Unread</p>
                <p className="text-2xl font-bold text-white">{unreadCount}</p>
              </div>
              <div className="p-3 bg-yellow-600/20 rounded-lg">
                <Mail className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Read</p>
                <p className="text-2xl font-bold text-white">
                  {contacts.length - unreadCount}
                </p>
              </div>
              <div className="p-3 bg-green-600/20 rounded-lg">
                <MailOpen className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
          {isLoading ? (
            <TableSkeleton />
          ) : filteredContacts.length === 0 ? (
            <NoDataFound message="No contacts found" />
          ) : (
            <>
              <ContactTable
                contacts={filteredContacts}
                onView={handleView}
                onDelete={handleDeleteClick}
              />
              <Pagination
                meta={meta}
                onPageChange={newPage => setPage(newPage)}
                onPageSizeChange={newLimit => {
                  setLimit(newLimit)
                  setPage(1)
                }}
              />
            </>
          )}
        </div>

        {/* Modals */}
        <ContactViewModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false)
            setViewingContact(null)
          }}
          contact={viewingContact}
        />

        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setDeletingContact(null)
          }}
          onConfirm={handleDelete}
          title={deletingContact?.title || ''}
          // isLoading={deleteContact.isPending}
        />
      </div>
    </div>
  )
}
