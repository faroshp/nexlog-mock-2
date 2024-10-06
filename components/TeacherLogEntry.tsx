"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CalendarIcon, SendIcon, ChevronLeftIcon, ChevronRightIcon, LinkIcon, MessageCircleIcon, BellIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

// Mock data for logs
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
        link: Math.random() > 0.7 ? 'https://example.com' : null,
        comments: []
      });
    }
  }
  return logs;
};

const mockLogs = generateMockLogs();

export default function TeacherLogEntry() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logs, setLogs] = useState(mockLogs);
  const [newLogContent, setNewLogContent] = useState('');
  const [newLogLink, setNewLogLink] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [unreadComments, setUnreadComments] = useState(0);

  const logsPerPage = 5;

  useEffect(() => {
    // Calculate unread comments
    const unreadCount = logs.reduce((count, log) => {
      return count + log.comments.filter(c => !c.isRead && c.author !== 'Teacher').length;
    }, 0);
    setUnreadComments(unreadCount);
  }, [logs]);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLog = {
      id: logs.length + 1,
      date: selectedDate,
      content: newLogContent,
      link: newLogLink,
      comments: []
    };
    setLogs([...logs, newLog]);
    setNewLogContent('');
    setNewLogLink('');
  };

  const openLogModal = (log) => {
    setSelectedLog(log);
  };

  const addComment = () => {
    if (newComment.trim() !== '') {
      const updatedLogs = logs.map(log => {
        if (log.id === selectedLog.id) {
          return {
            ...log,
            comments: [
              ...log.comments,
              { id: log.comments.length + 1, author: 'Teacher', content: newComment, isRead: true }
            ]
          };
        }
        return log;
      });
      setLogs(updatedLogs);
      setSelectedLog({
        ...selectedLog,
        comments: [
          ...selectedLog.comments,
          { id: selectedLog.comments.length + 1, author: 'Teacher', content: newComment, isRead: true }
        ]
      });
      setNewComment('');
    }
  };

  const paginatedLogs = logs
    .filter(log => log.date.toDateString() === selectedDate.toDateString())
    .slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

  const totalPages = Math.ceil(logs.filter(log => log.date.toDateString() === selectedDate.toDateString()).length / logsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">Log Entry</h1>
      
      <Card className="mb-8 bg-white shadow-md">
        <CardHeader className="bg-blue-50 pb-4">
          <CardTitle className="text-center text-lg md:text-xl text-blue-600">{formatDate(selectedDate)}</CardTitle>
          <CardDescription className="text-center">Your daily logs</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {paginatedLogs.length > 0 ? (
            <ul className="space-y-2">
              {paginatedLogs.map((log) => (
                <li key={log.id} className="p-2 bg-gray-50 rounded flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => openLogModal(log)}>
                  <span className="flex-grow text-gray-700">{log.content}</span>
                  <div className="flex items-center space-x-2">
                    {log.link && <LinkIcon className="h-4 w-4 text-blue-500" />}
                    {log.comments.length > 0 && (
                      <div className="flex items-center">
                        <MessageCircleIcon className="h-4 w-4 text-green-500" />
                        <Badge variant="secondary" className="ml-1">
                          {log.comments.filter(c => !c.isRead && c.author !== 'Teacher').length}
                        </Badge>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No logs for this date.</p>
          )}
          <div className="flex justify-between mt-4">
            <Button onClick={prevPage} disabled={currentPage === 1} variant="outline">
              <ChevronLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={nextPage} disabled={currentPage === totalPages} variant="outline">
              Next
              <ChevronRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-white shadow-md">
        <CardHeader className="bg-blue-50 pb-4">
          <CardTitle className="text-lg md:text-xl text-blue-600">New Log Entry</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="logContent">Log Content</Label>
              <Textarea
                id="logContent"
                value={newLogContent}
                onChange={(e) => setNewLogContent(e.target.value)}
                placeholder="Enter your log content here..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="logLink">Associated Link (optional)</Label>
              <Input
                id="logLink"
                type="url"
                value={newLogLink}
                onChange={(e) => setNewLogLink(e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <SendIcon className="h-4 w-4 mr-2" />
              Submit Log
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={selectedLog !== null} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-blue-600">Log Details</DialogTitle>
            <DialogDescription>
              {selectedLog && formatDate(selectedLog.date)}
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <p className="text-gray-700">{selectedLog.content}</p>
              {selectedLog.link && (
                <a href={selectedLog.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Associated Link
                </a>
              )}
              <h3 className="font-semibold text-gray-700">Comments:</h3>
              <ul className="space-y-2">
                {selectedLog.comments.map(comment => (
                  <li key={comment.id} className={`p-2 rounded ${comment.author === 'Admin' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <p className="font-semibold text-gray-700">{comment.author}</p>
                    <p className="text-gray-600">{comment.content}</p>
                    {!comment.isRead && comment.author !== 'Teacher' && (
                      <Badge variant="outline" className="mt-1">New</Badge>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow"
                />
                <Button onClick={addComment} className="bg-blue-600 hover:bg-blue-700 text-white">Post</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {unreadComments > 0 && (
        <div className="fixed bottom-4 right-4">
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            <BellIcon className="h-4 w-4 mr-2" />
            {unreadComments} Unread Comments
          </Button>
        </div>
      )}
    </div>
  )
}