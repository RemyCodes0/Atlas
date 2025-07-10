"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DashboardLayout from "../layout/DashboardLayout"
import { Loader2 } from "lucide-react";
import { CEONavbar } from "../components/sidebars/CEONavbar"
import axios from "axios"
import {toast} from "sonner"







function Fire() {
  const [sorting, setSorting] = React.useState([])
  const [data, setData] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState(
    []
  )
  const apiUrl = import.meta.env.VITE_API_URL;
const simpleUrl = import.meta.env.SIMPLE_API_URL;
  const [columnVisibility, setColumnVisibility] =
    React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})


  const columns =(setData)=> [
 
  {
    accessorKey: "image",
    header: "Profile Picture",
    cell: ({ row }) => (
      <img  className="h-10 w-10 rounded-full object-cover" src={`${simpleUrl}${row.original.imageUrl}`} alt="No images" />
    ),
  },
  {
    accessorKey: "name",
      header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
{
  accessorKey: "Fire",
  header: () => <div className="text-left">Fire</div>,
  cell: ({ row }) => {
    const userId = row.original._id
    const token = localStorage.getItem("authToken")

    

    const handleFire = async()=>{
      if(!window.confirm("Are you sure you want to fire this user?")) return;
      try{
        await axios.delete(`${apiUrl}/auth/users/${userId}`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        setData(prev=> prev.filter(user=> user._id!== userId))
        toast.success("User fired successfully🔥 ")
      }catch(err){
        console.error("Error firing user", err),
        toast.error("something went wrong"+ err)
      }
      
    }
   
    return (
      <button onClick={handleFire} className="p-2 border rounded bg-red-800 w-full text-white">Fire !!!</button>
    );
  },
  
}


  
]
React.useEffect(()=>{
  const fetchUsers = async()=>{
    try{
const res = await fetch(`${apiUrl}/auth/listUsers`)
    const result = await res.json()
    setData(result.users|| [])
    }catch(err){
      console.error("Failed to fetch users", err)
      alert("Failed to fetch users")
    }
  } 
  fetchUsers()
}, [])
  const table = useReactTable({
    data,
    columns: columns(setData),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <DashboardLayout sidebar={<CEONavbar />}>
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex flex-row justify-between space-x-5">
          <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Input
          placeholder="Filter Usernames..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
       
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column._id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column._id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup._id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header._id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row._id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell._id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}
export default Fire

