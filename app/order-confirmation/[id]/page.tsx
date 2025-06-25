import { Check, Clock, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const orderId = params.id

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order. We've received your payment screenshot and it's being reviewed by our team.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Order Number:</span>
              <Badge variant="outline">{orderId}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <span>Status:</span>
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                Pending Approval
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span>Total Amount:</span>
              <span className="font-bold">$1,029.98</span>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <Package className="h-8 w-8 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">What happens next?</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>1. Our admin team will review your payment screenshot</p>
            <p>2. Once approved, your order will be processed and shipped</p>
            <p>3. You'll receive tracking information via email</p>
            <p>4. Estimated delivery: 3-5 business days</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
