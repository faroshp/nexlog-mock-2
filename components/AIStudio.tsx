"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ChevronRightIcon, SendIcon, MessageSquareIcon, ClockIcon, FileIcon } from "lucide-react"

// Mock data for previously generated reports and autorun reports
const previousReports = [
  { id: 1, name: 'Monthly Organization Report', date: '2024-09-01', type: 'organization' },
  { id: 2, name: 'John Doe Performance Report', date: '2024-08-15', type: 'staff' },
  { id: 3, name: 'Yearly Summary Report', date: '2024-01-01', type: 'organization' },
]

const autorunReports = [
  { id: 1, name: 'Daily Activity Summary', frequency: 'day', nextRun: '2024-09-16' },
  { id: 2, name: 'Monthly Staff Performance', frequency: 'month', nextRun: '2024-10-01' },
]

export default function AIStudio() {
  const [reportType, setReportType] = useState('organization')
  const [timePeriod, setTimePeriod] = useState('day')
  const [customPrompt, setCustomPrompt] = useState('')
  const [selectedStaff, setSelectedStaff] = useState([])
  const [emailReport, setEmailReport] = useState(false)
  const [emailAddresses, setEmailAddresses] = useState('')
  const [autorun, setAutorun] = useState(false)
  const [autorunFrequency, setAutorunFrequency] = useState('day')

  const handleGenerateReport = () => {
    // In a real application, this would trigger the report generation
    console.log('Generating report:', { reportType, timePeriod, customPrompt, selectedStaff, emailReport, emailAddresses, autorun, autorunFrequency })
    alert('Report generation started. You will be notified when it\'s ready.')
  }

  const handleChatAccess = () => {
    // In a real application, this would navigate to the chat interface
    alert('Navigating to AI Chat Interface')
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Studio</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate AI Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={reportType} onValueChange={setReportType} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="organization" id="organization" />
              <Label htmlFor="organization">Organization-wide Report</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="staff" id="staff" />
              <Label htmlFor="staff">Staff-specific Report</Label>
            </div>
          </RadioGroup>
          <div>
            <Label htmlFor="timePeriod" className="mb-2 block">Time Period</Label>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger id="timePeriod">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {reportType === 'staff' && (
            <div>
              <Label htmlFor="staffSelect" className="mb-2 block">Select Staff Members</Label>
              <Select
                value={selectedStaff}
                onValueChange={(value) => setSelectedStaff(Array.isArray(value) ? value : [value])}
              >
                <SelectTrigger id="staffSelect">
                  <SelectValue placeholder="Select staff members" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff1">John Doe</SelectItem>
                  <SelectItem value="staff2">Jane Smith</SelectItem>
                  <SelectItem value="staff3">Bob Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label htmlFor="customPrompt" className="mb-2 block">Custom Prompt (Optional)</Label>
            <Textarea
              id="customPrompt"
              placeholder="Enter a custom prompt for the AI..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="emailReport"
              checked={emailReport}
              onCheckedChange={setEmailReport}
            />
            <Label htmlFor="emailReport">Email Report</Label>
          </div>
          {emailReport && (
            <div>
              <Label htmlFor="emailAddresses" className="mb-2 block">Email Addresses</Label>
              <Input
                id="emailAddresses"
                placeholder="Enter email addresses (comma-separated)"
                value={emailAddresses}
                onChange={(e) => setEmailAddresses(e.target.value)}
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Switch
              id="autorun"
              checked={autorun}
              onCheckedChange={setAutorun}
            />
            <Label htmlFor="autorun">Enable Autorun</Label>
          </div>
          {autorun && (
            <div>
              <Label htmlFor="autorunFrequency" className="mb-2 block">Autorun Frequency</Label>
              <Select value={autorunFrequency} onValueChange={setAutorunFrequency}>
                <SelectTrigger id="autorunFrequency">
                  <SelectValue placeholder="Select autorun frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <Button onClick={handleGenerateReport} className="w-full">
            <SendIcon className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Previously Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {previousReports.map((report) => (
              <li key={report.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                <div>
                  <p className="font-semibold">{report.name}</p>
                  <p className="text-sm text-gray-500">{report.date}</p>
                </div>
                <Button variant="outline" size="sm">
                  <FileIcon className="mr-2 h-4 w-4" />
                  View
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Autorun Enabled Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {autorunReports.map((report) => (
              <li key={report.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                <div>
                  <p className="font-semibold">{report.name}</p>
                  <p className="text-sm text-gray-500">Frequency: {report.frequency}, Next run: {report.nextRun}</p>
                </div>
                <Button variant="outline" size="sm">
                  <ClockIcon className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI Chat Interface</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Access the AI chat interface to interact with all data of the organization.</p>
          <Button onClick={handleChatAccess} className="w-full">
            <MessageSquareIcon className="mr-2 h-4 w-4" />
            Access AI Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}