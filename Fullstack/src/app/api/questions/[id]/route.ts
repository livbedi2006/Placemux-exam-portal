import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force dynamic rendering — do not pre-render at build time (requires live DB)
export const dynamic = 'force-dynamic';


export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        subject: true,
        topic: true,
        options: true,
      }
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    // Simplistic update: delete existing options and recreate them if options are provided
    if (body.options) {
      await prisma.option.deleteMany({
        where: { questionId: id }
      });
    }

    const { options, ...updateData } = body;

    const question = await prisma.question.update({
      where: { id },
      data: {
        ...updateData,
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

    return NextResponse.json(question);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await prisma.question.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

