import { CheckCircle2, User } from "lucide-react"

interface ResolvedTicket {
  id: string
  product: string
  issue: string
  resolution: string
  resolvedBy: string
  resolvedDate: string
}

interface ResolvedIssuesProps {
  tickets: ResolvedTicket[]
}

export function ResolvedIssues({ tickets }: ResolvedIssuesProps) {
  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="bg-card border rounded-lg p-6 flex items-start gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground text-lg">{ticket.id}</h3>
                <p className="text-sm text-muted-foreground mt-1">{ticket.product}</p>
              </div>
              <span className="text-sm text-muted-foreground">{ticket.resolvedDate}</span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Issue</p>
                <p className="text-foreground">{ticket.issue}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Resolution</p>
                <p className="text-green-600 dark:text-green-400">{ticket.resolution}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <User className="w-4 h-4" />
                <span>Resolved by {ticket.resolvedBy}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
