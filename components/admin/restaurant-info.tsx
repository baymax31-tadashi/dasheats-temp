'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Clock, MapPin, Phone, Mail, Edit2, Save, X } from 'lucide-react'
import { toast } from 'sonner'

interface RestaurantInfo {
  name: string
  description: string
  phone: string
  email: string
  address: string
  deliveryTime: string
  deliveryRadius: string
  openingHours: string
  closingHours: string
  cuisineTypes: string
}

export function RestaurantInfo() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [info, setInfo] = useState<RestaurantInfo>({
    name: 'DashEats Restaurant',
    description: 'Premium restaurant with a wide variety of cuisines',
    phone: '+1 (555) 123-4567',
    email: 'info@dasheats.com',
    address: '123 Main St, City, State 12345',
    deliveryTime: '30-45 minutes',
    deliveryRadius: '5 km',
    openingHours: '10:00 AM',
    closingHours: '11:00 PM',
    cuisineTypes: 'Italian, Indian, Chinese, American',
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/restaurant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      })
      if (res.ok) {
        toast.success('Restaurant info updated successfully!')
        setIsEditing(false)
      } else {
        toast.error('Failed to update restaurant info')
      }
    } catch {
      toast.error('Failed to update restaurant info')
    }
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Restaurant Information</CardTitle>
          {!isEditing ? (
            <Button 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label>Restaurant Name</Label>
              {isEditing ? (
                <Input 
                  value={info.name}
                  onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  placeholder="Restaurant name"
                />
              ) : (
                <p className="font-medium">{info.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              {isEditing ? (
                <Input 
                  value={info.email}
                  onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  placeholder="email@example.com"
                  type="email"
                />
              ) : (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {info.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>Phone</Label>
              {isEditing ? (
                <Input 
                  value={info.phone}
                  onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              ) : (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {info.phone}
                </p>
              )}
            </div>

            {/* Delivery Time */}
            <div className="space-y-2">
              <Label>Delivery Time</Label>
              {isEditing ? (
                <Input 
                  value={info.deliveryTime}
                  onChange={(e) => setInfo({ ...info, deliveryTime: e.target.value })}
                  placeholder="30-45 minutes"
                />
              ) : (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {info.deliveryTime}
                </p>
              )}
            </div>

            {/* Delivery Radius */}
            <div className="space-y-2">
              <Label>Delivery Radius</Label>
              {isEditing ? (
                <Input 
                  value={info.deliveryRadius}
                  onChange={(e) => setInfo({ ...info, deliveryRadius: e.target.value })}
                  placeholder="5 km"
                />
              ) : (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {info.deliveryRadius}
                </p>
              )}
            </div>

            {/* Opening Hours */}
            <div className="space-y-2">
              <Label>Opening Hours</Label>
              {isEditing ? (
                <Input 
                  value={info.openingHours}
                  onChange={(e) => setInfo({ ...info, openingHours: e.target.value })}
                  placeholder="10:00 AM"
                  type="time"
                />
              ) : (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {info.openingHours}
                </p>
              )}
            </div>

            {/* Closing Hours */}
            <div className="space-y-2">
              <Label>Closing Hours</Label>
              {isEditing ? (
                <Input 
                  value={info.closingHours}
                  onChange={(e) => setInfo({ ...info, closingHours: e.target.value })}
                  placeholder="11:00 PM"
                  type="time"
                />
              ) : (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {info.closingHours}
                </p>
              )}
            </div>

            {/* Cuisines */}
            <div className="space-y-2">
              <Label>Cuisine Types</Label>
              {isEditing ? (
                <Input 
                  value={info.cuisineTypes}
                  onChange={(e) => setInfo({ ...info, cuisineTypes: e.target.value })}
                  placeholder="Italian, Indian, Chinese"
                />
              ) : (
                <p className="text-muted-foreground">{info.cuisineTypes}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label>Address</Label>
            {isEditing ? (
              <Textarea 
                value={info.address}
                onChange={(e) => setInfo({ ...info, address: e.target.value })}
                placeholder="123 Main St, City, State 12345"
                rows={2}
              />
            ) : (
              <p className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {info.address}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            {isEditing ? (
              <Textarea 
                value={info.description}
                onChange={(e) => setInfo({ ...info, description: e.target.value })}
                placeholder="Restaurant description"
                rows={3}
              />
            ) : (
              <p className="text-muted-foreground">{info.description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
