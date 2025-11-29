"use client"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditIcon, TrashIcon } from "lucide-react"

interface Column {
    key: string
    label: string
    width?: number
    render?: (value: any, row?: any) => React.ReactNode
}

interface DataTableProps {
    data: any[]
    columns: Column[]
    onEdit?: (row: any) => void
    onDelete?: (row: any) => void
    rowClassName?: (row: any) => string
}

export function DataTable({ data, columns, onEdit, onDelete, rowClassName }: DataTableProps) {
    const formatValue = (value: any, column: Column, row?: any) => {
        if (column.render) return column.render(value, row)  // pass row too
        if (value === null || value === undefined) return "-"
        if (column.key.includes("price") || column.key.includes("discount")) return `KES ${Number(value).toFixed(2)}`
        if (column.key.includes("date") || column.key.includes("created")) return new Date(value).toLocaleDateString()
        return String(value)
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column.key} style={{ width: column.width }}>
                                {column.label}
                            </TableHead>
                        ))}
                        {(onEdit || onDelete) && <TableHead className="w-28">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, idx) => (
                        <TableRow key={idx} className={rowClassName?.(row)}>
                            {columns.map((column) => (
                                <TableCell key={column.key}>{formatValue(row[column.key], column, row)}</TableCell>
                            ))}
                            {(onEdit || onDelete) && (
                                <TableCell>
                                    <div className="flex gap-1">
                                        {onEdit && (
                                            <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
                                                <EditIcon className="h-4 w-4 text-secondary" />
                                            </Button>
                                        )}
                                        {onDelete && (
                                            <Button variant="ghost" size="sm" onClick={() => onDelete(row)}>
                                                <TrashIcon className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {data.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No data found</div>}
        </div>
    )
}
