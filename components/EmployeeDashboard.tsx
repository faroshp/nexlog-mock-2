import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { MessageCircleIcon, CalendarIcon, PlusCircleIcon, MessageSquareIcon, ClipboardListIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

// Mock data generation
const generateMockLogs = () => {
  const logs = [];
  const startDate = new Date(2024, 0, 1);
  const endDate = new Date(2024, 11, 31);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const logsForDay = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < logsForDay; i++) {
      logs.push({
        id: logs.length + 1,
        date: new Date(d),
        content: `Log entry ${logs.length + 1} for ${d.toISOString().split('T')[0]}`,
        comments: []
      });
    }
  }
  return logs;
};

const mockLogs = generateMockLogs();

export default function EmployeeDashboard() {
  const router = useRouter()
  const [logs, setLogs] = useState(mockLogs)
  const [groupedByDate, setGroupedByDate] = useState({})
  const [sortedDates, setSortedDates] = useState([])
  const [jumpToDate, setJumpToDate] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [metrics, setMetrics] = useState({
    totalLogs: 0,
    totalComments: 0,
    averageCommentsPerLog: 0,
    logsThisWeek: 0
  })

  const observerTarget = useRef(null)

  useEffect(() => {
    const grouped = logs.reduce((acc, log) => {
      const date = log.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    }, {});

    setGroupedByDate(grouped);
    setSortedDates(Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)));

    // Calculate metrics
    const totalLogs = logs.length;
    const totalComments = logs.reduce((sum, log) => sum + log.comments.length, 0);
    const averageCommentsPerLog = totalLogs > 0 ? (totalComments / totalLogs).toFixed(2) : 0;
    const today = new Date();
    const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const logsThisWeek = logs.filter(log => log.date >= oneWeekAgo).length;

    setMetrics({
      totalLogs,
      totalComments,
      averageCommentsPerLog,
      logsThisWeek
    });
  }, [logs]);

  const handleDateSelect = (date) => {
    setJumpToDate(date);
    // Implement logic to scroll to the selected date
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Implement infinite scrolling logic here

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Dashboard</h1>
        <Button 
          onClick={() => router.push('/log-entry')} 
          className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Add New Log
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white shadow-md">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-gray-500">Total Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline">
              <div className="text-2xl font-semibold text-blue-600">{metrics.totalLogs}</div>
              <ClipboardListIcon className="ml-2 h-4 w-4 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-gray-500">Total Comments</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline">
              <div className="text-2xl font-semibold text-blue-600">{metrics.totalComments}</div>
              <MessageSquareIcon className="ml-2 h-4 w-4 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Comments per Log</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-semibold text-blue-600">{metrics.averageCommentsPerLog}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-gray-500">Logs This Week</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-semibold text-blue-600">{metrics.logsThisWeek}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Jump to Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={jumpToDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-8">
        {sortedDates.map(date => (
          <Card key={date} id={`date-${date}`} className="bg-white shadow-md">
            <CardHeader className="bg-blue-50 pb-6">
              <CardTitle className="text-lg md:text-xl text-blue-600">{formatDate(date)}</CardTitle>
              <CardDescription>Your daily logs and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupedByDate[date].map((log) => (
                  <div 
                    key={log.id} 
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="mt-1 text-gray-700">{log.content}</p>
                      </div>
                      {log.comments.length > 0 && (
                        <div className="flex items-center text-blue-600">
                          <MessageCircleIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">{log.comments.length}</span>
                        </div>
                      )}
                    </div>
                    {log.comments.length > 0 && (
                      <div className="mt-3 pl-3 border-l-2 border-gray-300">
                        {log.comments.map(comment => (
                          <div key={comment.id} className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">{comment.author}:</span> {comment.content}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div ref={observerTarget} className="h-10 flex items-center justify-center">
          {isLoading && <div className="text-gray-500">Loading more logs...</div>}
        </div>
      </div>
    </div>
  )
}