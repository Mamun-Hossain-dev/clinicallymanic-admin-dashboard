'use client'

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import Image from "next/image"

type AddEventModalProps = {
    open: boolean
    onClose: () => void
}

export default function AddEventModal({ open, onClose }: AddEventModalProps) {
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [location, setLocation] = React.useState("")
    const [date, setDate] = React.useState("")
    const [status, setStatus] = React.useState<"upcoming" | "ongoing" | "completed">("upcoming")
    const [thumbnail, setThumbnail] = React.useState<File | null>(null)
    const [preview, setPreview] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(false)
    const { data: session } = useSession()
    const token = (session?.user as { accessToken?: string })?.accessToken

    // Reset form whenever modal opens
    React.useEffect(() => {
        if (open) {
            setTitle("")
            setDescription("")
            setLocation("")
            setDate("")
            setStatus("upcoming")
            setThumbnail(null)
            setPreview(null)
        }
    }, [open])

    // Update image preview whenever a thumbnail is selected
    React.useEffect(() => {
        if (!thumbnail) {
            setPreview(null)
            return
        }
        const objectUrl = URL.createObjectURL(thumbnail)
        setPreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl) // clean up
    }, [thumbnail])

    const handleAdd = async () => {
        if (!title || !description || !location || !date || !status) {
            toast.error("Please fill all fields")
            return
        }

        if (!thumbnail) {
            toast.error("Please select a thumbnail image")
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()

            // Thumbnail as file
            formData.append("thumbnail", thumbnail)

            // All other data as JSON string under "data" key
            const eventData = {
                title,
                description,
                location,
                status,
                date: new Date(date).toISOString(), // convert to ISO string
            }

            formData.append("data", JSON.stringify(eventData))

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // NO Content-Type header – let browser set it automatically with boundary
                },
                body: formData,
            })

            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(errorText || "Failed to add event")
            }

            const result = await res.json()
            toast.success("Event added successfully!")
            onClose()
        } catch (err: any) {
            toast.error(err.message || "Failed to add event. Please try again.")
        } finally {
            setLoading(false)
        }
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-gray-900 rounded-lg p-6 border border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-white text-xl">Add New Event</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label className="text-gray-200">Title</Label>
                        <Input
                            className="bg-gray-800 text-white border border-gray-700"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Event title"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-gray-200">Description</Label>
                        <Textarea
                            className="bg-gray-800 text-white border border-gray-700 resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Event description"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-gray-200">Location</Label>
                        <Input
                            className="bg-gray-800 text-white border border-gray-700"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Event location"
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
                        <Label className="text-gray-200">Thumbnail</Label>
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
                    <Button onClick={handleAdd} disabled={loading}>
                        {loading ? "Adding..." : "Add Event"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
