"use client"

import { useState } from "react"
import { Eye, Check, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    amount: 299.99,
    status: "pending",
    paymentMethod: "PayPal",
    paymentProof: "paypal_screenshot_001.jpg",
    items: [{ name: "Gaming Headset 7.1 Surround", quantity: 2, price: 149.99 }],
    shippingAddress: "123 Main St, City, State 12345",
    orderDate: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: 899.99,
    status: "approved",
    paymentMethod: "Cash App",
    paymentProof: "cashapp_screenshot_002.jpg",
    items: [{ name: "RTX 4080 Gaming Graphics Card", quantity: 1, price: 899.99 }],
    shippingAddress: "456 Oak Ave, City, State 67890",
    orderDate: "2024-01-14",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    amount: 149.99,
    status: "pending",
    paymentMethod: "PayPal",
    paymentProof: "paypal_screenshot_003.jpg",
    items: [{ name: "Mechanical Gaming Keyboard RGB", quantity: 1, price: 129.99 }],
    shippingAddress: "789 Pine St, City, State 54321",
    orderDate: "2024-01-13",
  },
]

export function OrderManagement() {
  const [orders, setOrders] = useState(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default">
            <Check className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex gap-2">
          <Badge variant="outline">Pending: {orders.filter((o) => o.status === "pending").length}</Badge>
          <Badge variant="outline">Approved: {orders.filter((o) => o.status === "approved").length}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders Requiring Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>${order.amount}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.id}</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Customer</Label>
                                  <p>{selectedOrder.customer}</p>
                                  <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                                </div>
                                <div>
                                  <Label>Payment Method</Label>
                                  <p>{selectedOrder.paymentMethod}</p>
                                </div>
                              </div>

                              <div>
                                <Label>Items Ordered</Label>
                                <div className="border rounded p-4 mt-2">
                                  {selectedOrder.items.map((item: any, index: number) => (
                                    <div key={index} className="flex justify-between">
                                      <span>
                                        {item.name} x{item.quantity}
                                      </span>
                                      <span>${item.price}</span>
                                    </div>
                                  ))}
                                  <div className="border-t pt-2 mt-2 font-bold">Total: ${selectedOrder.amount}</div>
                                </div>
                              </div>

                              <div>
                                <Label>Shipping Address</Label>
                                <p className="mt-1">{selectedOrder.shippingAddress}</p>
                              </div>

                              <div>
                                <Label>Payment Proof</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Screenshot: {selectedOrder.paymentProof}
                                </p>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mt-2">
                                  <p className="text-muted-foreground">Payment screenshot would be displayed here</p>
                                </div>
                              </div>

                              {selectedOrder.status === "pending" && (
                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => updateOrderStatus(selectedOrder.id, "approved")}
                                    className="flex-1"
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve Order
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => updateOrderStatus(selectedOrder.id, "rejected")}
                                    className="flex-1"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject Order
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {order.status === "pending" && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => updateOrderStatus(order.id, "approved")}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => updateOrderStatus(order.id, "rejected")}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
