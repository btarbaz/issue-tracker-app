import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { issueSchema } from '../../issueValidationSchema';

export async function POST(request: NextRequest) {
  const body: { title: string; description: string } = await request.json();
  const validated = issueSchema.safeParse(body);
  if (!validated.success) {
    // we can use .format() to make errors message more simpler
    return NextResponse.json(validated.error.format(), { status: 400 });
  }

  const newIssueCreated = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(newIssueCreated, { status: 201 });
}
