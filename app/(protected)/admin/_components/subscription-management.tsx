'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ status: '', expiresAt: '', plan: '' });

  const handleEdit = (subscription: (typeof subscriptions)[0]) => {
    setEditingId(subscription.id);
    setEditForm({
      status: subscription.status,
      expiresAt: subscription.expiresAt,
      plan: subscription.plan,
    });
  };

  const handleSave = (id: string) => {
    // Here you would typically make an API call to update the subscription
    console.log(`Saving subscription ${id}`, editForm);
    setEditingId(null);
  };

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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.userId}</TableCell>
                <TableCell>
                  {editingId === subscription.id ? (
                    <Select
                      value={editForm.plan}
                      onValueChange={(value) => setEditForm({ ...editForm, plan: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Pro">Pro</SelectItem>
                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    subscription.plan
                  )}
                </TableCell>
                <TableCell>
                  {editingId === subscription.id ? (
                    <Select
                      value={editForm.status}
                      onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    subscription.status
                  )}
                </TableCell>
                <TableCell>
                  {editingId === subscription.id ? (
                    <Input
                      type="date"
                      value={editForm.expiresAt}
                      onChange={(e) => setEditForm({ ...editForm, expiresAt: e.target.value })}
                    />
                  ) : (
                    new Date(subscription.expiresAt).toLocaleDateString()
                  )}
                </TableCell>
                <TableCell>
                  {editingId === subscription.id ? (
                    <Button onClick={() => handleSave(subscription.id)}>Save</Button>
                  ) : (
                    <Button onClick={() => handleEdit(subscription)}>Edit</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
