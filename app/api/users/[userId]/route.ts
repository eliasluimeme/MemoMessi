import { createClient, createAdminClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !currentUser || currentUser.user_metadata.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { userId } = params;
    const body = await req.json();
    const { fullName, email, phoneNumber, password, expiresAt } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: true },
    });

    if (!existingUser) return new NextResponse('User not found', { status: 404 });

    const adminClient = createAdminClient();
    const updateAuthData: {
      email?: string;
      password?: string;
      user_metadata?: {
        full_name?: string;
        phone_number?: string;
      };
    } = {};
    if (email && email !== existingUser.email) updateAuthData.email = email;
    if (password) updateAuthData.password = password;
    if (fullName) {
      updateAuthData.user_metadata = {
        ...updateAuthData.user_metadata,
        full_name: fullName
      };
    }
    if (phoneNumber) {
      updateAuthData.user_metadata = {
        ...updateAuthData.user_metadata,
        phone_number: phoneNumber
      };
    }

    if (Object.keys(updateAuthData).length > 0) {
      const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, updateAuthData);
      if (updateError) return NextResponse.json({ message: updateError.message }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        email,
        phoneNumber,
        subscriptions:
          expiresAt && existingUser.subscriptions
            ? {
              update: {
                expiresAt: new Date(expiresAt),
                updatedAt: new Date(),
              },
            }
            : undefined,
      },
      include: {
        subscriptions: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
