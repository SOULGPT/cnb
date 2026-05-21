"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Users, Palette, CreditCard, Database, Save, Receipt, Euro } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { StoreSettings, DEFAULT_STORE_SETTINGS } from "@/types/settings"
import { getStoreSettings, saveStoreSettings } from "@/lib/settings-utils"
import { Loader2 } from "lucide-react"

export function SettingsManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [settings, setSettings] = useState({
    siteName: "Curry&Burger",
    primaryColor: "#E78A00",
    secondaryColor: "#7B1E2D",
    enableNotifications: true,
    enableLoyalty: true,
    enableDelivery: true,
    enablePickup: true,
  })

  const [storeConfig, setStoreConfig] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS)

  useEffect(() => {
    async function load() {
      const config = await getStoreSettings()
      setStoreConfig(config)
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const success = await saveStoreSettings(storeConfig)
    setSaving(false)

    if (success) {
      toast({ title: "Settings saved successfully!" })
    } else {
      toast({ title: "Failed to save settings", variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Receipt Layout Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            <CardTitle>Receipt & Store Details</CardTitle>
          </div>
          <CardDescription>Configure the details printed on customer receipts and KOTs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input
                id="restaurantName"
                value={storeConfig.restaurantName}
                onChange={(e) => setStoreConfig({ ...storeConfig, restaurantName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pIva">P.IVA</Label>
              <Input
                id="pIva"
                value={storeConfig.pIva}
                onChange={(e) => setStoreConfig({ ...storeConfig, pIva: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={storeConfig.address}
              onChange={(e) => setStoreConfig({ ...storeConfig, address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={storeConfig.phone}
              onChange={(e) => setStoreConfig({ ...storeConfig, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL / Path</Label>
            <Input
              id="logoUrl"
              value={storeConfig.logoUrl || ""}
              placeholder="/logo.png"
              onChange={(e) => setStoreConfig({ ...storeConfig, logoUrl: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">For best thermal printing results, use a high-contrast monochrome image.</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="footerMessage">Footer Message</Label>
            <Input
              id="footerMessage"
              value={storeConfig.footerMessage}
              onChange={(e) => setStoreConfig({ ...storeConfig, footerMessage: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialAnnouncement">Special Announcement (Optional)</Label>
            <Input
              id="specialAnnouncement"
              value={storeConfig.specialAnnouncement || ""}
              placeholder="e.g. Closed on Mondays"
              onChange={(e) => setStoreConfig({ ...storeConfig, specialAnnouncement: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Taxes & Fees Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            <CardTitle>Taxes (IVA) & Fees</CardTitle>
          </div>
          <CardDescription>Configure Italian IVA brackets and order fees</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Service Charges (Coperto & Delivery)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableCoperto">Enable Coperto (Dine-in)</Label>
                  <Switch
                    id="enableCoperto"
                    checked={storeConfig.fees.enableCoperto}
                    onCheckedChange={(checked) => setStoreConfig({
                      ...storeConfig,
                      fees: { ...storeConfig.fees, enableCoperto: checked }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="copertoPerPerson">Coperto Fee per Person (€)</Label>
                  <Input
                    id="copertoPerPerson"
                    type="number"
                    step="0.10"
                    value={storeConfig.fees.copertoPerPerson}
                    disabled={!storeConfig.fees.enableCoperto}
                    onChange={(e) => setStoreConfig({
                      ...storeConfig,
                      fees: { ...storeConfig.fees, copertoPerPerson: parseFloat(e.target.value) || 0 }
                    })}
                  />
                </div>
              </div>
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="space-y-2 pt-[2px]">
                  <Label htmlFor="deliveryCharge">Delivery Charge (€)</Label>
                  <Input
                    id="deliveryCharge"
                    type="number"
                    step="0.50"
                    value={storeConfig.fees.deliveryCharge}
                    onChange={(e) => setStoreConfig({
                      ...storeConfig,
                      fees: { ...storeConfig.fees, deliveryCharge: parseFloat(e.target.value) || 0 }
                    })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Applied automatically to delivery orders.</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-3">Multi-Rate Italian IVA (%)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ivaFood">Food Items</Label>
                <div className="relative">
                  <Input
                    id="ivaFood"
                    type="number"
                    value={storeConfig.ivaRates.food * 100}
                    onChange={(e) => setStoreConfig({
                      ...storeConfig,
                      ivaRates: { ...storeConfig.ivaRates, food: (parseFloat(e.target.value) || 0) / 100 }
                    })}
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ivaDrinks">Drinks & Alcohol</Label>
                <div className="relative">
                  <Input
                    id="ivaDrinks"
                    type="number"
                    value={storeConfig.ivaRates.drinks * 100}
                    onChange={(e) => setStoreConfig({
                      ...storeConfig,
                      ivaRates: { ...storeConfig.ivaRates, drinks: (parseFloat(e.target.value) || 0) / 100 }
                    })}
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ivaDelivery">Delivery Service</Label>
                <div className="relative">
                  <Input
                    id="ivaDelivery"
                    type="number"
                    value={storeConfig.ivaRates.delivery * 100}
                    onChange={(e) => setStoreConfig({
                      ...storeConfig,
                      ivaRates: { ...storeConfig.ivaRates, delivery: (parseFloat(e.target.value) || 0) / 100 }
                    })}
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Branding</CardTitle>
          </div>
          <CardDescription>Customize your restaurant's appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input value={settings.primaryColor} readOnly />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input value={settings.secondaryColor} readOnly />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Features</CardTitle>
          </div>
          <CardDescription>Enable or disable app features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Send order updates to customers</p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Loyalty Program</Label>
              <p className="text-sm text-muted-foreground">Enable points and rewards system</p>
            </div>
            <Switch
              checked={settings.enableLoyalty}
              onCheckedChange={(checked) => setSettings({ ...settings, enableLoyalty: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Delivery Orders</Label>
              <p className="text-sm text-muted-foreground">Accept delivery orders</p>
            </div>
            <Switch
              checked={settings.enableDelivery}
              onCheckedChange={(checked) => setSettings({ ...settings, enableDelivery: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Pickup Orders</Label>
              <p className="text-sm text-muted-foreground">Accept pickup orders</p>
            </div>
            <Switch
              checked={settings.enablePickup}
              onCheckedChange={(checked) => setSettings({ ...settings, enablePickup: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end sticky bottom-6 z-10">
        <Button onClick={handleSave} size="lg" disabled={saving} className="shadow-lg">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Configuration
        </Button>
      </div>
    </div>
  )
}
