"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

export function PaymentSettings() {
  const { paymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = useStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    name: "",
    type: "paypal" as "paypal" | "cashapp" | "venmo" | "zelle",
    email: "",
    handle: "",
    description: "",
  })

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.name) {
      toast.error("Please enter a display name")
      return
    }

    if (newPaymentMethod.type === "paypal" && !newPaymentMethod.email) {
      toast.error("Please enter PayPal email")
      return
    }

    if ((newPaymentMethod.type === "cashapp" || newPaymentMethod.type === "venmo") && !newPaymentMethod.handle) {
      toast.error("Please enter handle")
      return
    }

    addPaymentMethod({
      name: newPaymentMethod.name,
      type: newPaymentMethod.type,
      email: newPaymentMethod.email,
      handle: newPaymentMethod.handle,
      status: "active",
      description: newPaymentMethod.description,
    })

    toast.success("Payment method added successfully!")
    setNewPaymentMethod({ name: "", type: "paypal", email: "", handle: "", description: "" })
    setIsAddDialogOpen(false)
  }

  const togglePaymentMethodStatus = (id: string) => {
    const method = paymentMethods.find((m) => m.id === id)
    if (method) {
      updatePaymentMethod(id, {
        status: method.status === "active" ? "inactive" : "active",
      })
      toast.success(`Payment method ${method.status === "active" ? "disabled" : "enabled"}`)
    }
  }

  const handleDeletePaymentMethod = (id: string) => {
    const method = paymentMethods.find((m) => m.id === id)
    if (method) {
      deletePaymentMethod(id)
      toast.success(`${method.name} deleted successfully`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Settings</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={newPaymentMethod.name}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, name: e.target.value })}
                  placeholder="e.g., Primary PayPal"
                />
              </div>

              <div>
                <Label htmlFor="type">Payment Type</Label>
                <select
                  id="type"
                  value={newPaymentMethod.type}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, type: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="paypal">PayPal</option>
                  <option value="cashapp">Cash App</option>
                  <option value="venmo">Venmo</option>
                  <option value="zelle">Zelle</option>
                </select>
              </div>

              {newPaymentMethod.type === "paypal" && (
                <div>
                  <Label htmlFor="email">PayPal Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newPaymentMethod.email}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, email: e.target.value })}
                    placeholder="your-paypal@email.com"
                  />
                </div>
              )}

              {(newPaymentMethod.type === "cashapp" || newPaymentMethod.type === "venmo") && (
                <div>
                  <Label htmlFor="handle">{newPaymentMethod.type === "cashapp" ? "Cash App" : "Venmo"} Handle</Label>
                  <Input
                    id="handle"
                    value={newPaymentMethod.handle}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, handle: e.target.value })}
                    placeholder={newPaymentMethod.type === "cashapp" ? "$YourCashAppHandle" : "@YourVenmoHandle"}
                  />
                </div>
              )}

              {newPaymentMethod.type === "zelle" && (
                <div>
                  <Label htmlFor="email">Zelle Email/Phone</Label>
                  <Input
                    id="email"
                    value={newPaymentMethod.email}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, email: e.target.value })}
                    placeholder="your-zelle@email.com or phone number"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newPaymentMethod.description}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>

              <Button onClick={handleAddPaymentMethod} className="w-full">
                Add Payment Method
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No payment methods configured yet</p>
              <p className="text-sm text-muted-foreground">Add payment methods for customers to use during checkout</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentMethods.map((method) => (
                  <TableRow key={method.id}>
                    <TableCell className="font-medium">{method.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        <CreditCard className="h-3 w-3 mr-1" />
                        {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {method.type === "paypal" || method.type === "zelle" ? method.email : method.handle}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={method.status === "active"}
                          onCheckedChange={() => togglePaymentMethodStatus(method.id)}
                        />
                        <Badge variant={method.status === "active" ? "default" : "secondary"}>{method.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePaymentMethod(method.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Instructions Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This is how customers will see payment instructions during checkout:
          </p>
          <div className="space-y-4">
            {paymentMethods
              .filter((m) => m.status === "active")
              .map((method) => (
                <div key={method.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{method.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {method.type === "paypal" && `Send payment to: ${method.email}`}
                    {method.type === "cashapp" && `Send payment to: ${method.handle}`}
                    {method.type === "venmo" && `Send payment to: ${method.handle}`}
                    {method.type === "zelle" && `Send payment to: ${method.email}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please include your order number in the payment note and upload a screenshot of the payment
                    confirmation.
                  </p>
                </div>
              ))}
            {paymentMethods.filter((m) => m.status === "active").length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No active payment methods. Customers won't be able to checkout.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
