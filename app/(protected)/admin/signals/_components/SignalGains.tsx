import { Target } from '@/types/signal';

import { Badge } from '@/components/ui/badge';

export default function SignalGains({ targets }: { targets: Target[] }) {
  return (
    <div className="flex min-w-[150px] max-w-fit flex-wrap justify-end gap-1">
      {targets.map((target) => (
        <Badge
          key={target.id}
          variant={target.hit ? 'default' : 'secondary'}
          size="sm"
          className={target.hit ? 'bg-green-500 hover:bg-green-600' : 'bg-muted hover:bg-muted/80'}
        >
          TP{target.number}
        </Badge>
      ))}
    </div>
  );
}
