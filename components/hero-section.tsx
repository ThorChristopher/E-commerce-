"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Gamepad2, Zap, Trophy } from "lucide-react"
import Link from "next/link"

const heroSlides = [
  {
    id: 1,
    title: "PlayStation 5 & Xbox Series X",
    subtitle: "Next-Gen Gaming",
    description: "Experience the future of gaming with lightning-fast loading and stunning 4K visuals",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&h=600&fit=crop&crop=center",
    cta: "Shop Consoles",
    link: "/products",
    badge: "In Stock Now",
  },
  {
    id: 2,
    title: "RTX 4080 Graphics Cards",
    subtitle: "Up to 25% OFF",
    description: "Unleash ultimate gaming performance with ray tracing and DLSS 3 technology",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&h=600&fit=crop&crop=center",
    cta: "View Graphics Cards",
    link: "/products",
    badge: "Limited Time",
  },
  {
    id: 3,
    title: "Gaming Laptops & PCs",
    subtitle: "Starting at $1,599",
    description: "High-performance gaming systems ready to dominate any battlefield",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&h=600&fit=crop&crop=center",
    cta: "Shop Gaming PCs",
    link: "/products",
    badge: "Free Shipping",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const currentHero = heroSlides[currentSlide]

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden min-h-[600px] lg:min-h-[700px]">
      <div className="absolute inset-0 bg-black/30" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 opacity-20">
          <Gamepad2 className="h-24 w-24 animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Trophy className="h-32 w-32 animate-bounce" />
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-10">
          <Zap className="h-16 w-16 animate-ping" />
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <Badge className="bg-yellow-500 text-black text-lg px-6 py-3 font-bold">{currentHero.badge}</Badge>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">{currentHero.title}</h1>
              <p className="text-xl md:text-2xl text-blue-100 font-medium">{currentHero.subtitle}</p>
            </div>

            <p className="text-lg md:text-xl text-blue-100 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {currentHero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-yellow-500 text-black hover:bg-yellow-400 text-lg px-8 py-4 font-bold"
                asChild
              >
                <Link href={currentHero.link}>{currentHero.cta}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-900 text-lg px-8 py-4"
                asChild
              >
                <Link href="/deals">View All Deals</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src={currentHero.image || "/placeholder.svg"}
                alt={currentHero.title}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors backdrop-blur-sm"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors backdrop-blur-sm"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
