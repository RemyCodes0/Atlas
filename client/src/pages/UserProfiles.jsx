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


function UserProfiles() {
  const [sorting, setSorting] = React.useState([])
  const [data, setData] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const apiUrl = import.meta.env.VITE_API_URL;
  const simpleUrl = import.meta.env.VITE_SIMPLE_API_URL;



  const columns = [
 
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
  accessorKey: "role",
  header: () => <div className="text-left">Role</div>,
  cell: ({ row }) => {
    const role = row.getValue("role")
    const handleRoleChange = (e) => {
      const newRole = e.target.value;
   

      // Define and immediately call an async function
      (async () => {
        try {
          const res = await fetch(`${apiUrl}/auth/updateUser/${row.original._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newRole }),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Failed to update role");
          }
         setData((prev) =>
                prev.map((user) =>
                  user._id === row.original._id
                    ? { ...user, role: newRole }
                    : user
                )
              )

              
        } catch (error) {
          console.error("Error updating role:", error.message);
          console.log(row.original._id)
          alert(`Role not updated ${error}`)
        }
      })();
    };
   const roleStyles = {
      "CEO": "bg-black text-white",
      "Member-I": "bg-blue-100 text-blue-800",
      "Member-II": "bg-blue-100 text-blue-800",
      "Member-III": "bg-blue-100 text-blue-800",
      "President-I": "bg-green-100 text-green-800",
      "President-II": "bg-green-100 text-green-800",
      "President-III": "bg-green-100 text-green-800",
      "Vice President-I": "bg-purple-100 text-purple-800",
      "Vice President-II": "bg-purple-100 text-purple-800",
      "Vice President-III": "bg-purple-100 text-purple-800",
      "Peasant": "bg-gray-100 text-black",
    };
    return (
      <select
        value={role}
        onChange={handleRoleChange}
       className={`rounded px-2 py-1 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${roleStyles[role] || "bg-gray-100 text-gray-800"}`}
      >
        <option value="CEO">CEO</option>
        <option value="Member-I">Member-I</option>
        <option value="Member-II">Member-II</option>
        <option value="Member-III">Member-III</option>
        <option value="President-I">President-I</option>
        <option value="President-II">President-II</option>
        <option value="President-III">President-III</option>
        <option value="Vice President-I">Vice President-I</option>
        <option value="Vice President-II">Vice President-II</option>
        <option value="Vice President-III">Vice President-III</option>
        <option value="Peasant">Peasant</option>
      </select>
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
    columns,
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
export default UserProfiles

