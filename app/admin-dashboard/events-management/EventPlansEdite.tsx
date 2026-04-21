
'use client'

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import Image from "next/image"

type Event = {
  _id: string
  title: string
  description: string
  location: string
  date: string
  status: "upcoming" | "ongoing" | "completed"
  thumbnail?: string // optional existing thumbnail URL
}

type EditEventModalProps = {
  open: boolean
  onClose: () => void
  event: Event
  token: string
  onUpdated: () => void
}

export default function EditEventModal({ open, onClose, event, token, onUpdated }: EditEventModalProps) {
  const [title, setTitle] = useState(event.title || "")
  const [description, setDescription] = useState(event.description || "")
  const [location, setLocation] = useState(event.location || "")
  const [date, setDate] = useState(event.date ? new Date(event.date).toISOString().slice(0, 16) : "")
  const [status, setStatus] = useState<"upcoming" | "ongoing" | "completed">(event.status || "upcoming")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(event.thumbnail || null) // existing thumbnail preview
  const [loading, setLoading] = useState(false)

  // Reset form when modal opens or event changes
  useEffect(() => {
    if (open && event) {
      setTitle(event.title || "")
      setDescription(event.description || "")
      setLocation(event.location || "")
      setDate(event.date ? new Date(event.date).toISOString().slice(0, 16) : "")
      setStatus(event.status || "upcoming")
      setThumbnail(null) // new file
      setPreview(event.thumbnail || null) // show existing if available
    }
  }, [open, event])

  // Preview for newly selected thumbnail
  useEffect(() => {
    if (!thumbnail) {
      // If no new file selected, keep existing preview or null
      return
    }
    const objectUrl = URL.createObjectURL(thumbnail)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [thumbnail])

  const handleUpdate = async () => {
    if (!title || !description || !location || !date || !status) {
      toast.error("Please fill all fields")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()

      // Only append thumbnail if a new file is selected
      if (thumbnail) {
        formData.append("thumbnail", thumbnail)
      }

      // Always send data as JSON string
      const eventData = {
        title,
        description,
        location,
        status,
        date: new Date(date).toISOString(),
      }

      formData.append("data", JSON.stringify(eventData))

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/${event._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type – let browser set multipart boundary
        },
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || "Failed to update event")
      }

      const result = await res.json()
      toast.success("Event updated successfully!")
      onUpdated() // refresh list
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Failed to update event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gray-900 rounded-lg p-6 border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Edit Event</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="text-gray-200">Title</Label>
            <Input
              className="bg-gray-800 text-white border border-gray-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-200">Description</Label>
            <Textarea
              className="bg-gray-800 text-white border border-gray-700 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-200">Location</Label>
            <Input
              className="bg-gray-800 text-white border border-gray-700"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-200">Date & Time</Label>
            <Input
              type="datetime-local"
              className="bg-gray-800 text-white border border-gray-700"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-200">Status</Label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as "upcoming" | "ongoing" | "completed")}
              disabled={loading}
            >
              <SelectTrigger className="bg-gray-800 text-white border border-gray-700">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-200">Thumbnail (leave empty to keep current)</Label>
            <Input
              type="file"
              accept="image/*"
              className="bg-gray-800 text-white border border-gray-700"
              onChange={(e) => {
                if (e.target.files?.[0]) setThumbnail(e.target.files[0])
              }}
              disabled={loading}
            />
            {thumbnail && <p className="text-sm text-gray-400">{thumbnail.name}</p>}
            {preview && (
              <Image
                width={200}
                height={200}
                src={preview}
                alt="Thumbnail Preview"
                className="mt-2 w-40 h-40 object-cover rounded border border-gray-700"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-800">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}