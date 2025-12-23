import { differenceInCalendarDays } from "date-fns";
import { Badge } from "~/components/ui/badge";

type Props = {
  expiresAt: Date;
};

export function DocumentStatusBadge({ expiresAt }: Props) {
  const days = differenceInCalendarDays(expiresAt, new Date());

  if (days < 0) {
    return <Badge variant="destructive">Expired</Badge>;
  }

  if (days <= 30) {
    return <Badge variant="secondary">{days}d left</Badge>;
  }

  return <Badge variant="outline">Valid</Badge>;
}
