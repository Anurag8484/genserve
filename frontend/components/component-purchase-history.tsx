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
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground">{order.product}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "Active"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Order ID</p>
                <p className="font-medium text-foreground">{order.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Purchase Date</p>
                <p className="font-medium text-foreground">{order.orderDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Service Tier</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    order.serviceTier === "Gold"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {order.serviceTier}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
