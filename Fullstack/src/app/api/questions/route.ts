import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force dynamic rendering — do not pre-render at build time (requires live DB)
export const dynamic = 'force-dynamic';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const topicId = searchParams.get('topicId');
    const difficulty = searchParams.get('difficulty');
    const type = searchParams.get('type');

    const where: any = {};
    if (subjectId) where.subjectId = subjectId;
    if (topicId) where.topicId = topicId;
    if (difficulty) where.difficulty = difficulty;
    if (type) where.type = type;

    const questions = await prisma.question.findMany({
      where,
      include: {
        subject: true,
        topic: true,
        options: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(questions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      type, 
      text, 
      explanation, 
      difficulty, 
      marks, 
      timeLimit, 
      subjectId, 
      topicId, 
      options, 
      testCases 
    } = body;

    const question = await prisma.question.create({
      data: {
        type,
        text,
        explanation,
        difficulty,
        marks,
        timeLimit,
        subjectId,
        topicId,
        testCases,
        options: options ? {
          create: options.map((opt: any) => ({
            text: opt.text,
            isCorrect: opt.isCorrect
          }))
        } : undefined
      },
      include: {
        options: true
      }
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
