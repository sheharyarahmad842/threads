'use server';
import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import connectDB from '../mongoose';

interface UserParams {
  userId: string;
  name: string;
  username: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  name,
  username,
  image,
  bio,
  path,
}: UserParams) {
  try {
    await connectDB();
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        onboarded: true,
        name,
        bio,
        image,
      },
      { upsert: true }
    );
    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Error creating/updating user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectDB();
    const user = await User.findOne({ id: userId });
    return user;
  } catch (error: any) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
}