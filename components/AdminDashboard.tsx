import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { MessageCircleIcon, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data for teachers and logs
const teachers = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
];

const generateMockLogs = () => {
  const logs = [];
  const startDate = new Date(2024, 0, 1);
  const endDate = new Date(2024, 11, 31);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const logsForDay = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < logsForDay; i++) {
      logs.push({
        id: logs.length + 1,
        date: new Date(d),
        teacherName: teachers[Math.floor(Math.random() * teachers.length)].name,
        content: `Log entry ${logs.length + 1} for ${d.toISOString().split('T')[0]}`,
        comments: []
      });
    }
  }
  return logs;
};

const mockLogs = generateMockLogs();

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredTeachers, setFilteredTeachers] = useState(teachers);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [jumpToDate, setJumpToDate] = useState(null);
  const [groupedByDate, setGroupedByDate] = useState({});
  const [sortedDates, setSortedDates] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const observerTarget = useRef(null);

  useEffect(() => {
    const grouped = mockLogs.reduce((acc, log) => {
      const date = log.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    }, {});

    setGroupedByDate(grouped);
    setSortedDates(Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)));
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowAutocomplete(query.length > 0);
    setFilteredTeachers(
      teachers.filter(teacher => 
        teacher.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setSearchQuery(teacher.name);
    setShowAutocomplete(false);
  };

  const handleDateSelect = (date) => {
    setJumpToDate(date);
    // Implement logic to scroll to the selected date
  };

  const openLogModal = (log) => {
    setSelectedLog(log);
  };

  const addComment = () => {
    if (newComment.trim() !== '') {
      setSelectedLog(prevLog => ({
        ...prevLog,
        comments: [
          ...prevLog.comments,
          { id: prevLog.comments.length + 1, author: 'Admin', content: newComment }
        ]
      }));
      setNewComment('');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Implement infinite scrolling logic here

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative w-full md:w-64">
          <Input
            type="text"
            placeholder="Search for a teacher..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
          {showAutocomplete && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
              {filteredTeachers.map(teacher => (
                <li 
                  key={teacher.id} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleTeacherSelect(teacher)}
                >
                  {teacher.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        
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
              <CardDescription>Daily logs and activities</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {groupedByDate[date].map((log) => (
                  <div 
                    key={log.id} 
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => openLogModal(log)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm text-blue-600">{log.teacherName}</p>
                        <p className="mt-1 text-gray-700">{log.content}</p>
                      </div>
                      {log.comments.length > 0 && (
                        <MessageCircleIcon className="h-4 w-4 text-blue-500 ml-2 flex-shrink-0" />
                      )}
                    </div>
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

      <Dialog open={selectedLog !== null} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-blue-600">Log Details</DialogTitle>
            <DialogDescription>View and add comments</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-700">{selectedLog.teacherName} - {formatDate(selectedLog.date)}</p>
                <p className="text-gray-600">{selectedLog.content}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Comments:</h3>
                <ul className="space-y-2">
                  {selectedLog.comments.map(comment => (
                    <li key={comment.id} className={`p-2 rounded ${comment.author === 'Admin' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                      <p className="font-semibold text-gray-700">{comment.author}</p>
                      <p className="text-gray-600">{comment.content}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow"
                />
                <Button onClick={addComment} className="bg-blue-600 hover:bg-blue-700 text-white">Post Comment</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}