'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getDemoUsers() {
  return await prisma.user.findMany();
}

export async function authenticateUser(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username }
  });
  if (user && user.password === password) {
    return user;
  }
  return null;
}

// Fetch all jobs for the Owner Dashboard
export async function getOwnerDashboardData() {
  const jobs = await prisma.jobSite.findMany({
    include: {
      assignedCrew: true,
      tasks: true,
      photos: {
        orderBy: { timestamp: 'desc' }
      }
    },
    orderBy: { poNumber: 'asc' }
  });

  const recentPhotos = await prisma.photo.findMany({
    take: 10,
    orderBy: { timestamp: 'desc' },
    include: {
      job: true,
      uploadedBy: true
    }
  });

  return { jobs, recentPhotos };
}

// Fetch the job for an Employee today
export async function getEmployeeTodayJob(userId: string) {
  return await prisma.jobSite.findFirst({
    where: {
      assignedCrewId: userId,
      status: {
        not: 'COMPLETED'
      }
    },
    include: {
      tasks: true,
    }
  });
}

// Toggle task completion
export async function toggleTaskCompletion(taskId: string, isCompleted: boolean) {
  await prisma.task.update({
    where: { id: taskId },
    data: { isCompleted }
  });
  
  revalidatePath('/'); // Force UI to update
}

// Clock In Employee
export async function clockInEmployee(userId: string, jobId: string) {
  await prisma.timeLog.create({
    data: {
      userId,
      jobId,
      clockInTime: new Date()
    }
  });
  
  // Update job status to In Progress
  await prisma.jobSite.update({
    where: { id: jobId },
    data: { status: 'IN_PROGRESS' }
  });
  
  revalidatePath('/');
}

// Clock Out Employee
export async function clockOutEmployee(timeLogId: string) {
  await prisma.timeLog.update({
    where: { id: timeLogId },
    data: { clockOutTime: new Date() }
  });
  
  revalidatePath('/');
}

// Get active time log for a user on a job
export async function getActiveTimeLog(userId: string, jobId: string) {
  return await prisma.timeLog.findFirst({
    where: {
      userId,
      jobId,
      clockOutTime: null
    }
  });
}

// Upload Photo Mock
export async function uploadPhotoAction(jobId: string, userId: string, category: string, imageUrl: string) {
  await prisma.photo.create({
    data: {
      jobId,
      uploadedById: userId,
      category,
      imageUrl
    }
  });
  
  revalidatePath('/');
}
