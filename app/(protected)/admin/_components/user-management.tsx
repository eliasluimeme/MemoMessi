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

const users = [
  { id: '1', email: 'user1@example.com', role: 'user', status: 'active' },
  { id: '2', email: 'user2@example.com', role: 'admin', status: 'inactive' },
];

export function UserManagement() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ email: '', role: '', status: '' });

  const handleEdit = (user: (typeof users)[0]) => {
    setEditingId(user.id);
    setEditForm({ email: user.email, role: user.role, status: user.status });
  };

  const handleSave = (id: string) => {
    // Here you would typically make an API call to update the user
    console.log(`Saving user ${id}`, editForm);
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {editingId === user.id ? (
                    <Input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>
                <TableCell>
                  {editingId === user.id ? (
                    <Select
                      value={editForm.role}
                      onValueChange={(value) => setEditForm({ ...editForm, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    user.role
                  )}
                </TableCell>
                <TableCell>
                  {editingId === user.id ? (
                    <Select
                      value={editForm.status}
                      onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    user.status
                  )}
                </TableCell>
                <TableCell>
                  {editingId === user.id ? (
                    <Button onClick={() => handleSave(user.id)}>Save</Button>
                  ) : (
                    <Button onClick={() => handleEdit(user)}>Edit</Button>
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
