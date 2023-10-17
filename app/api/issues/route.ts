import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createIssueSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body: { title: string; description: string } = await request.json();
  const validated = createIssueSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json(validated.error.errors, { status: 400 });
  }

  const newIssueCreated = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(newIssueCreated, { status: 201 });
}
