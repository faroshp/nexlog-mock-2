"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserPlus, Trash2, Settings, Database, Users, CreditCard, DollarSign, FileText } from "lucide-react"

// Mock data for users
const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Manager" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
]

// Mock data for billing history
const billingHistory = [
  { id: 1, date: "2024-09-01", amount: 199.99, status: "Paid" },
  { id: 2, date: "2024-08-01", amount: 199.99, status: "Paid" },
  { id: 3, date: "2024-07-01", amount: 199.99, status: "Paid" },
]

// Mock data for subscription plans
const subscriptionPlans = [
  { id: 1, name: "Basic", price: 99.99, features: ["Up to 10 users", "Basic reporting", "Email support"] },
  { id: 2, name: "Pro", price: 199.99, features: ["Up to 50 users", "Advanced reporting", "Priority support"] },
  { id: 3, name: "Enterprise", price: 499.99, features: ["Unlimited users", "Custom features", "24/7 support"] },
]

export default function AdminSettings() {
  const [users, setUsers] = useState(initialUsers)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'User' })
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState('30')
  const [backupFrequency, setBackupFrequency] = useState('daily')
  const [currentPlan, setCurrentPlan] = useState('Pro')
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')

  const addUser = () => {
    if (newUser.name && newUser.email) {
      setUsers([...users, { ...newUser, id: Date.now() }])
      setNewUser({ name: '', email: '', role: 'User' })
    }
  }

  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id))
  }

  const handleDataRetentionChange = (value) => {
    setDataRetentionPeriod(value)
  }

  const handleBackupFrequencyChange = (value) => {
    setBackupFrequency(value)
  }

  const handlePlanChange = (value) => {
    setCurrentPlan(value)
  }

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value)
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Settings</h1>
      <Tabs defaultValue="user-management" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="user-management">User Management</TabsTrigger>
          <TabsTrigger value="system-settings">System Settings</TabsTrigger>
          <TabsTrigger value="data-management">Data Management</TabsTrigger>
          <TabsTrigger value="billing">Billing & Subscription</TabsTrigger>
        </TabsList>
        <TabsContent value="user-management">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <Input
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                  <Input
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({...newUser, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addUser}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="system-settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                  <Label htmlFor="email-notifications">Enable Email Notifications</Label>
                </div>
                <div>
                  <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                  <Select value={dataRetentionPeriod} onValueChange={handleDataRetentionChange}>
                    <SelectTrigger id="data-retention">
                      <SelectValue placeholder="Select data retention period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="data-management">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select value={backupFrequency} onValueChange={handleBackupFrequencyChange}>
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Select backup frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Database className="mr-2 h-4 w-4" />
                      Purge All Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete all data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="destructive">Yes, delete all data</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
                  <Select value={currentPlan} onValueChange={handlePlanChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {subscriptionPlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.name}>{plan.name} - ${plan.price}/month</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    <h4 className="font-semibold">Features:</h4>
                    <ul className="list-disc list-inside">
                      {subscriptionPlans.find(plan => plan.name === currentPlan)?.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                  <Select value={paymentMethod} onValueChange={handlePaymentMethodChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="mt-2">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Update Payment Details
                  </Button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Billing History</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Invoice</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingHistory.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell>{bill.date}</TableCell>
                          <TableCell>${bill.amount}</TableCell>
                          <TableCell>{bill.status}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}