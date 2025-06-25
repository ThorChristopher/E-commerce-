"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Package, Settings, LogOut, ShoppingBag, Activity, Clock } from "lucide-react"
import { useStore } from "@/lib/store"
import Link from "next/link"

export default function AccountPage() {
  const router = useRouter()
  const { currentUser, userActivities, logoutUser, addActivity } = useStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      router.push("/login")
      return
    }

    // Log page visit
    addActivity({
      userId: currentUser.id,
      action: "page_visit",
      details: "Visited account page",
    })

    setIsLoading(false)
  }, [currentUser, router, addActivity])

  const handleLogout = () => {
    if (currentUser) {
      addActivity({
        userId: currentUser.id,
        action: "logout",
        details: "User logged out",
      })
    }
    logoutUser()
    router.push("/")
  }

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your account...</p>
        </div>
      </div>
    )
  }

  // Get user's activities
  const myActivities = userActivities
    .filter((activity) => activity.userId === currentUser.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-muted-foreground">Welcome back, {currentUser.firstName}!</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="shopping">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Shopping
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <p className="text-lg">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-lg">{currentUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Member Since</label>
                  <p className="text-lg">{new Date(currentUser.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Last Login</label>
                  <p className="text-lg">{new Date(currentUser.lastLogin).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className="ml-2">Active Member</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't placed any orders yet. Start shopping to see your order history here.
                  </p>
                  <Button asChild>
                    <Link href="/products">Start Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <p className="text-sm text-muted-foreground">Your recent actions on the platform</p>
              </CardHeader>
              <CardContent>
                {myActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No activity recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div>
                            <p className="font-medium capitalize">{activity.action.replace("_", " ")}</p>
                            {activity.details && <p className="text-sm text-muted-foreground">{activity.details}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Update Email Address
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Notification Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Privacy Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shopping">
            <Card>
              <CardHeader>
                <CardTitle>Quick Shopping</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild className="h-20">
                    <Link href="/products" className="flex flex-col">
                      <ShoppingBag className="h-6 w-6 mb-2" />
                      Browse All Products
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20">
                    <Link href="/deals" className="flex flex-col">
                      <Package className="h-6 w-6 mb-2" />
                      View Hot Deals
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
