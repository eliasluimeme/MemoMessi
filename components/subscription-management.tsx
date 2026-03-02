'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const subscriptions = [
  { id: '1', userId: 'user1', status: 'active', expiresAt: '2023-12-31', plan: 'Pro' },
  { id: '2', userId: 'user2', status: 'expired', expiresAt: '2023-06-30', plan: 'Basic' },
];

export function SubscriptionManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.userId}</TableCell>
                <TableCell>{subscription.plan}</TableCell>
                <TableCell>{subscription.status}</TableCell>
                <TableCell>{new Date(subscription.expiresAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
