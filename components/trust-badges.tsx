import { Shield, Truck, RotateCcw, CreditCard, Award, Clock } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "Secure Payment",
      description: "SSL encrypted checkout",
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $100",
    },
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Hassle-free returns",
    },
    {
      icon: CreditCard,
      title: "Multiple Payment",
      description: "PayPal & Cash App",
    },
    {
      icon: Award,
      title: "Authentic Products",
      description: "100% genuine items",
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Same-day shipping",
    },
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Thorp Christopher?</h2>
          <p className="text-xl text-muted-foreground">Your trusted gaming partner with unbeatable service</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{badge.title}</h3>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
