import { ShoppingBag } from "lucide-react"

interface Order {
  id: string
  product: string
  orderDate: string
  serviceTier: string
  status: "Active" | "Expired"
}

interface PurchaseHistoryProps {
  orders: Order[]
}

export function PurchaseHistory({ orders }: PurchaseHistoryProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-card border rounded-lg p-6 flex items-start gap-4">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 flex-shrink-0">
            <ShoppingBag className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>

          <div className="flex-1">
            <div className="mb-3">
              <h3 className="font-semibold text-foreground">{order.product}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Order ID</p>
                <p className="font-medium text-foreground">{order.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Purchase Date</p>
                <p className="font-medium text-foreground">{order.orderDate}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
