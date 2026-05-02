import { BottomNav } from "@/components/bottom-nav"
import { BranchLocator } from "@/components/branches/branch-locator"

export default function BranchesPage() {
  return (
    <div className="bg-background">
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Find a Branch</h1>
          <p className="text-lg text-muted-foreground">Locate the nearest Curry&Burger restaurant</p>
        </div>
        <BranchLocator />
      </div>
    </div>
  )
}
