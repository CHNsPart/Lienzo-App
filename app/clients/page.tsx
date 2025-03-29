'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
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
import { Roles } from "@/lib/roles"
import dayjs from 'dayjs';
import { cn } from '@/lib/utils'

interface UserCount {
  licenseRequests: number;
  licenses: number;
  permissions: number;
}

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
  permissions: any[]
  _count: UserCount
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
      console.log('User data:', data)
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

  const getBadgeVariant = (role: string) => {
    switch (role) {
      case Roles.ADMIN:
        return "border-violet-200 bg-gradient-to-r from-violet-50 via-violet-100 to-violet-50 text-violet-700 hover:bg-violet-100 hover:border-violet-300 hover:text-violet-800";
      case Roles.MANAGER:
        return "border-sky-200 bg-gradient-to-r from-sky-50 via-sky-100 to-sky-50 text-sky-700 hover:bg-sky-100 hover:border-sky-300 hover:text-sky-800";
      case Roles.SUPPORT:
        return "border-emerald-200 bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-800";
      case Roles.USER:
        return "border-gray-200 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-800";
      default:
        return "border-gray-200 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-800";
    }
  };

  const UserCard = ({ user }: { user: User }) => (
    <Card className="transition-all duration-300 hover:shadow-lg bg-white/50 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Header - Avatar and Main Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="size-14 border-2 border-gray-100 ring-2 ring-primary/5">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}%20${user.lastName}`}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-md font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6 p-3 bg-gray-50 rounded-lg">
          <div className="text-center border-r border-gray-200">
            <p className="text-2xl font-bold text-primary">{user._count.licenses}</p>
            <p className="text-xs text-gray-500 mt-1">Licenses</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{user._count.licenseRequests}</p>
            <p className="text-xs text-gray-500 mt-1">Requests</p>
          </div>
          {/* <div className="text-center">
            <p className="text-2xl font-bold text-primary">{user._count.permissions}</p>
            <p className="text-xs text-gray-500 mt-1">Permissions</p>
          </div> */}
        </div>

        <div className="mt-6 w-full text-center">
          <Badge 
            className={cn(
              "mx-auto w-full flex items-center justify-center border",
              "transition-colors duration-200",
              getBadgeVariant(user.role)
            )}
          >
            {user.role}
          </Badge>
        </div>
  
        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-sm font-medium">{user.phoneNumber || 'Not provided'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Quote Status</p>
            <Badge variant="outline" className={user.newUser ? "bg-green-50 text-green-700" : ""}>
              {user.newUser ? 'No Quote' : 'Got Quote'}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Joined</p>
            <p className="text-sm font-medium">{dayjs(user.createdAt).format('MMM D, YYYY')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-sm font-medium">{dayjs(user.updatedAt).format('MMM D, YYYY')}</p>
          </div>
        </div>
  
        {/* Action Button */}
        <div className="mt-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full bg-white hover:bg-gray-50">
                Manage Role <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {Object.values(Roles).map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => handleRoleChange(user.id, role)}
                  disabled={user.role === role}
                  className={user.role === role ? "bg-gray-50" : ""}
                >
                  Set as {role}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="container p-6 space-y-8">
      <h1 className="text-4xl font-bold mb-6">Client Management</h1>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-fit grid-cols-5 mb-8">
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
              {"Are you sure you want to change this user's role to"}{" "}{confirmationDialog.newRole}?
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