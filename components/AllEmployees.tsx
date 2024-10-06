"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRightIcon, SearchIcon, FilterIcon } from "lucide-react"

// Mock data for employees
const employeesData = [
  { id: 1, name: "John Doe", department: "Marketing", yearsOfExperience: 5, lastLogDate: "2024-09-15" },
  { id: 2, name: "Jane Smith", department: "Human Resources", yearsOfExperience: 8, lastLogDate: "2024-09-14" },
  { id: 3, name: "Bob Johnson", department: "Engineering", yearsOfExperience: 3, lastLogDate: "2024-09-13" },
  { id: 4, name: "Alice Brown", department: "Sales", yearsOfExperience: 6, lastLogDate: "2024-09-12" },
  { id: 5, name: "Charlie Davis", department: "Customer Support", yearsOfExperience: 4, lastLogDate: "2024-09-11" },
  { id: 6, name: "Eva Wilson", department: "Design", yearsOfExperience: 7, lastLogDate: "2024-09-10" },
  { id: 7, name: "Frank Miller", department: "Finance", yearsOfExperience: 2, lastLogDate: "2024-09-09" },
  { id: 8, name: "Grace Lee", department: "IT", yearsOfExperience: 5, lastLogDate: "2024-09-08" },
  { id: 9, name: "Henry Taylor", department: "Operations", yearsOfExperience: 9, lastLogDate: "2024-09-07" },
  { id: 10, name: "Ivy Chen", department: "Legal", yearsOfExperience: 6, lastLogDate: "2024-09-06" },
]

export default function AllEmployees() {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')

  const filteredEmployees = employeesData.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (departmentFilter === 'all' || employee.department === departmentFilter) &&
    (experienceFilter === 'all' ||
      (experienceFilter === '0-5' && employee.yearsOfExperience <= 5) ||
      (experienceFilter === '6-10' && employee.yearsOfExperience > 5 && employee.yearsOfExperience <= 10) ||
      (experienceFilter === '10+' && employee.yearsOfExperience > 10)
    )
  )

  const uniqueDepartments = [...new Set(employeesData.map(employee => employee.department))]

  const handleEmployeeClick = (employeeId) => {
    // In a real application, this would navigate to the employee's detail page
    console.log(`Navigating to employee detail page for ID: ${employeeId}`)
    alert(`Navigating to employee detail page for ID: ${employeeId}`)
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">All Employees</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {uniqueDepartments.map(department => (
                  <SelectItem key={department} value={department}>{department}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience</SelectItem>
                <SelectItem value="0-5">0-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Years of Experience</TableHead>
                <TableHead>Last Log Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="cursor-pointer hover:bg-gray-100" onClick={() => handleEmployeeClick(employee.id)}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.yearsOfExperience}</TableCell>
                  <TableCell>{employee.lastLogDate}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredEmployees.length === 0 && (
            <p className="text-center py-4 text-gray-500">No employees found matching the current filters.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}