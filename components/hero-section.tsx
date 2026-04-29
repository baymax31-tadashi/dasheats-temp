'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronDown, Clock, Star, Truck } from 'lucide-react'

interface HeroSectionProps {
  onScrollToMenu: () => void
}

export function HeroSection({ onScrollToMenu }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background border-b">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[500px] py-12">
          {/* Content */}
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Star className="h-4 w-4 fill-primary" />
              4.9 Rating on 2,500+ Reviews
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Order <span className="text-primary">Food Online</span>, <br className="hidden md:block" />
              Get it on <span className="text-primary">DashEats</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Order from thousands of restaurants. Fast delivery, easy ordering, and your favorite food at your doorstep.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={onScrollToMenu} className="gap-2">
                Order Now
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                View Menu
              </Button>
            </div>
            
            {/* Features */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Fast Delivery</p>
                  <p className="text-muted-foreground">30-45 mins</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-muted-foreground">Orders $50+</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Top Rated</p>
                  <p className="text-muted-foreground">Premium Quality</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative h-[450px] w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl" />
              <Image
                src="/images/hero-food.jpg"
                alt="Delicious food spread"
                fill
                className="object-cover rounded-3xl shadow-2xl"
                priority
              />
              
              {/* Floating Cards */}
              <div className="absolute -left-4 bottom-20 bg-card p-4 rounded-xl shadow-lg flex items-center gap-3 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-2xl">🍕</span>
                </div>
                <div>
                  <p className="font-semibold">Fresh & Hot</p>
                  <p className="text-sm text-muted-foreground">Made to order</p>
                </div>
              </div>
              
              <div className="absolute -right-4 top-20 bg-card p-4 rounded-xl shadow-lg flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <p className="font-semibold">2,500+ Orders</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
