"use client"

import { useState, useEffect } from "react"
import { HomeBanner, BannerTemplateId } from "@/types"
import { subscribeToHomeBanners, addHomeBanner, updateHomeBanner, deleteHomeBanner } from "@/lib/firebase-home"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Edit2, GripVertical, Save, X, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function HomeBannersManager() {
  const [banners, setBanners] = useState<HomeBanner[]>([])
  const [editingBanner, setEditingBanner] = useState<Partial<HomeBanner> | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = subscribeToHomeBanners((newBanners) => {
      setBanners(newBanners)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleSave = async () => {
    if (!editingBanner?.title || !editingBanner?.imageUrl) {
      toast({ title: "Error", description: "Title and Image URL are required", variant: "destructive" })
      return
    }

    try {
      if (editingBanner.id) {
        await updateHomeBanner(editingBanner.id, editingBanner)
        toast({ title: "Updated", description: "Banner updated successfully" })
      } else {
        await addHomeBanner({
          ...editingBanner as HomeBanner,
          order: banners.length,
          isActive: true
        })
        toast({ title: "Created", description: "Banner created successfully" })
      }
      setEditingBanner(null)
    } catch (error) {
      toast({ title: "Error", description: "Failed to save banner", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      await deleteHomeBanner(id)
      toast({ title: "Deleted", description: "Banner deleted" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Home Banners</h2>
          <p className="text-muted-foreground">Manage dynamic banners and professional combos.</p>
        </div>
        <Button onClick={() => setEditingBanner({ templateId: "orange-heat", actionType: "link" })}>
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {editingBanner && (
        <Card className="p-6 border-2 border-primary/20 bg-primary/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{editingBanner.id ? "Edit Banner" : "New Banner"}</h3>
            <Button variant="ghost" size="icon" onClick={() => setEditingBanner(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={editingBanner.title || ""} 
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="e.g. SUMMER COMBO"
                />
              </div>

              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input 
                  value={editingBanner.subtitle || ""} 
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  placeholder="e.g. Taste the heat"
                />
              </div>

              <div className="space-y-2">
                <Label>Price (Optional)</Label>
                <Input 
                  value={editingBanner.price || ""} 
                  onChange={(e) => setEditingBanner({ ...editingBanner, price: e.target.value })}
                  placeholder="e.g. 10.99"
                />
              </div>

              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input 
                  value={editingBanner.imageUrl || ""} 
                  onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                  placeholder="Full bleed image path"
                />
              </div>

              <div className="space-y-2">
                <Label>Template Design</Label>
                <Select 
                  value={editingBanner.templateId} 
                  onValueChange={(v: BannerTemplateId) => setEditingBanner({ ...editingBanner, templateId: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orange-heat">The Orange Heat (Solid)</SelectItem>
                    <SelectItem value="summer-gradient">The Summer Gradient</SelectItem>
                    <SelectItem value="dark-emerald">The Dark Emerald</SelectItem>
                    <SelectItem value="split">The Split</SelectItem>
                    <SelectItem value="hero-card">The Hero Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={editingBanner.backgroundColor || "#E78A00"} 
                      onChange={(e) => setEditingBanner({ ...editingBanner, backgroundColor: e.target.value })}
                      className="w-12 p-1 h-10"
                    />
                    <Input 
                      value={editingBanner.backgroundColor || "#E78A00"} 
                      onChange={(e) => setEditingBanner({ ...editingBanner, backgroundColor: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Gradient (Optional)</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                      <Input 
                        type="color" 
                        value={editingBanner.backgroundGradient?.from || "#E78A00"} 
                        onChange={(e) => setEditingBanner({ 
                          ...editingBanner, 
                          backgroundGradient: { ...editingBanner.backgroundGradient || { direction: "to right", to: "#E78A00" }, from: e.target.value } 
                        })}
                        className="w-full h-8 p-1"
                      />
                      <Input 
                        type="color" 
                        value={editingBanner.backgroundGradient?.to || "#7B1E2D"} 
                        onChange={(e) => setEditingBanner({ 
                          ...editingBanner, 
                          backgroundGradient: { ...editingBanner.backgroundGradient || { direction: "to right", from: "#E78A00" }, to: e.target.value } 
                        })}
                        className="w-full h-8 p-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Action Type</Label>
                  <Select 
                    value={editingBanner.actionType} 
                    onValueChange={(v: any) => setEditingBanner({ ...editingBanner, actionType: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">External/Internal Link</SelectItem>
                      <SelectItem value="category">Menu Category</SelectItem>
                      <SelectItem value="item">Specific Item</SelectItem>
                      <SelectItem value="deal">Specific Deal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Action ID / URL</Label>
                  <Input 
                    value={editingBanner.actionValue || ""} 
                    onChange={(e) => setEditingBanner({ ...editingBanner, actionValue: e.target.value })}
                    placeholder="ID or URL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time (Locked)</Label>
                  <Input 
                    type="time" 
                    value={editingBanner.startTime || ""} 
                    onChange={(e) => setEditingBanner({ ...editingBanner, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time (Locked)</Label>
                  <Input 
                    type="time" 
                    value={editingBanner.endTime || ""} 
                    onChange={(e) => setEditingBanner({ ...editingBanner, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="banner-active" 
                    checked={editingBanner.isActive !== false} 
                    onCheckedChange={(v) => setEditingBanner({ ...editingBanner, isActive: v })}
                  />
                  <Label htmlFor="banner-active">Active</Label>
                </div>
                <Button className="ml-auto" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Banner
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="cursor-move text-muted-foreground">
              <GripVertical className="w-5 h-5" />
            </div>
            <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold truncate">{banner.title}</h4>
                {!banner.isActive && <Badge variant="destructive">Inactive</Badge>}
                {banner.startTime && <Badge variant="outline" className="text-[10px]">⏰ {banner.startTime}-{banner.endTime}</Badge>}
              </div>
              <p className="text-xs text-muted-foreground truncate">{banner.actionType}: {banner.actionValue}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setEditingBanner(banner)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(banner.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
