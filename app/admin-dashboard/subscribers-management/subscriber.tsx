'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'


type Newsletter = {
    _id: string
    email: string
}

export default function Subscription() {
    const { data: session } = useSession()
    const token = (session?.user as { accessToken?: string })?.accessToken

    const page = 1
    const limit = 10

    const { data, isLoading, isError } = useQuery({
        queryKey: ['newsletter', page],
        enabled: !!token,
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/newsletters?page=${page}&limit=${limit}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!res.ok) {
                throw new Error('Failed to fetch newsletters')
            }

            const result = await res.json()
            return {
                ...result,
                data: result.data.map((item: any) => ({
                    _id: item.id,
                    email: item.email,
                })),
            }
        },
    })

    const newsletters: Newsletter[] = data?.data ?? []
    const totalItems = data?.meta?.total ?? 0

    if (isLoading) {
        return (
            <div className="rounded-xl border p-6 text-center text-muted-foreground">
                Loading subscribers...
            </div>
        )
    }

    if (isError) {
        return (
            <div className="rounded-xl border p-6 text-center text-destructive">
                Failed to load data
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl border border-gray-700">
                <table className="w-full">
                    <thead className="bg-gray-800 border-b border-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                                #
                            </th>
                            <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                                Subscriber ID
                            </th>
                            <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                                Email
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {newsletters.length ? (
                            newsletters.map((item, index) => (
                                <tr
                                    key={item._id}
                                    className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                                    <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                                        {item._id}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{item.email}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-6 py-6 text-center text-gray-400"
                                >
                                    No newsletters found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* FOOTER INFO */}
            <p className="text-sm text-gray-400">
                Total subscribers: <span className="font-medium">{totalItems}</span>
            </p>
        </div>
    )
}
