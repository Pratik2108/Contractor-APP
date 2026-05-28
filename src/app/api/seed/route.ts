import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Check if database is already seeded
    const count = await prisma.user.count();
    if (count > 0) {
      return NextResponse.json({ message: 'Database already seeded' });
    }

    // Create Demo Owner (Contractor)
    const owner = await prisma.user.create({
      data: {
        name: 'Demo Contractor',
        username: 'Cont1',
        password: 'Cont1',
        role: 'OWNER',
      },
    });

    // Create Demo Employee
    const employee = await prisma.user.create({
      data: {
        name: 'Demo Employee',
        username: 'EMP1',
        password: 'EMP123',
        role: 'EMPLOYEE',
      },
    });

    // Create Mock Jobs
    const job1 = await prisma.jobSite.create({
      data: {
        poNumber: 'PO-1001',
        clientName: 'Acme Corp',
        address: '123 Main St, Springfield',
        status: 'UNSCHEDULED',
      },
    });

    const job2 = await prisma.jobSite.create({
      data: {
        poNumber: 'PO-1002',
        clientName: 'Jane Smith',
        address: '456 Oak Ave, Springfield',
        status: 'SCHEDULED',
        assignedCrewId: employee.id,
        tasks: {
          create: [
            { description: 'Tear off shingles' },
            { description: 'Inspect decking' },
            { description: 'Install underlayment' },
            { description: 'Install new shingles' },
            { description: 'Cleanup site' },
          ],
        },
      },
    });

    const job3 = await prisma.jobSite.create({
      data: {
        poNumber: 'PO-1003',
        clientName: 'Bob Jones',
        address: '789 Pine Ln, Springfield',
        status: 'COMPLETED',
        assignedCrewId: employee.id,
      },
    });

    // Add some sample photos to job 3 to populate the live feed
    await prisma.photo.createMany({
      data: [
        {
          jobId: job3.id,
          uploadedById: employee.id,
          category: 'BEFORE',
          imageUrl: 'https://images.unsplash.com/photo-1620894042858-a55427d19760?auto=format&fit=crop&q=80&w=400&h=300',
        },
        {
          jobId: job3.id,
          uploadedById: employee.id,
          category: 'AFTER',
          imageUrl: 'https://images.unsplash.com/photo-1518717838528-765ec2788e22?auto=format&fit=crop&q=80&w=400&h=300',
        },
      ]
    });

    return NextResponse.json({ message: 'Seed successful' });
  } catch (error) {
    console.error('Seed Error:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
