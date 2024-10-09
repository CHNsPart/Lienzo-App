'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Roles, Role, roleHierarchy } from "@/lib/roles"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  phoneNumber: string | null
  newUser: boolean
  createdAt: string
  updatedAt: string
}

export default function ClientsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [confirmationDialog, setConfirmationDialog] = useState<{ isOpen: boolean; userId: string; newRole: string }>({ isOpen: false, userId: '', newRole: Roles.USER })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      try {
        const response = await fetch('/api/user-claims')
        const data = await response.json()
        if (data.role !== Roles.ADMIN) {
          router.push('/dashboard')
        } else {
          fetchUsers()
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        toast({
          title: "Error",
          description: "Failed to verify admin status. Please try again.",
          variant: "destructive",
        })
        router.push('/dashboard')
      }
    }

    checkAdminAndFetchUsers()
  }, [router, toast])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    setConfirmationDialog({ isOpen: true, userId, newRole })
  }

  const confirmRoleChange = async () => {
    try {
      const response = await fetch(`/api/users/${confirmationDialog.userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: confirmationDialog.newRole }),
      })

      if (!response.ok) throw new Error('Failed to update user role')

      setUsers(users.map(user => 
        user.id === confirmationDialog.userId ? { ...user, role: confirmationDialog.newRole } : user
      ))

      toast({
        title: "Role Updated",
        description: `User role has been updated to ${confirmationDialog.newRole}.`,
      })
    } catch (error) {
      console.error('Error updating user role:', error)
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setConfirmationDialog({ isOpen: false, userId: '', newRole: '' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const usersByRole = Object.values(Roles).reduce((acc, role) => {
    acc[role] = users.filter(user => user.role === role)
    return acc
  }, {} as Record<string, User[]>)

  const UserCard = ({ user }: { user: User }) => (
    <Card key={user.id} className="flex flex-col h-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}%20${user.lastName}`} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{user.firstName} {user.lastName}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-2">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Role:</span>
            <Badge variant={user.role === Roles.ADMIN ? "default" : "secondary"}>{user.role}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Phone:</span>
            <span>{user.phoneNumber || 'Not provided'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">New User:</span>
            <span>{user.newUser ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Joined:</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Last Updated:</span>
            <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                Change Role <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {Object.values(Roles).map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => handleRoleChange(user.id, role)}
                  disabled={user.role === role}
                >
                  Set as {role}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold mb-6">Client Management</h1>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="all">All Users</TabsTrigger>
          {Object.values(Roles).map((role) => (
            <TabsTrigger key={role} value={role}>{role}s</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        {Object.values(Roles).map((role) => (
          <TabsContent key={role} value={role}>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usersByRole[role].map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
      <Dialog open={confirmationDialog.isOpen} onOpenChange={(isOpen) => setConfirmationDialog(prev => ({ ...prev, isOpen }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Role Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change this user's role to {confirmationDialog.newRole}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmationDialog({ isOpen: false, userId: '', newRole: '' })}>Cancel</Button>
            <Button onClick={confirmRoleChange}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}