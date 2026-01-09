import { and, eq } from 'drizzle-orm';
import { getTrainingVideoCourseCreditCost } from '@/config/training.config';
import { creditService } from '@/lib/credits';
import { db } from '@/server/db';
import { creditTransactions } from '@/server/db/schema';

const TRAINING_COURSE_UNLOCK_PREFIX = 'training_course_unlock';

const isDuplicateReferenceError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('credit_user_reference_unique') ||
    message.includes('duplicate key value') ||
    message.includes('unique constraint')
  );
};

const getTrainingCourseUnlockReference = (courseId: string) =>
  `${TRAINING_COURSE_UNLOCK_PREFIX}_${courseId}`;

export async function hasTrainingCourseUnlock(userId: string, courseId: string): Promise<boolean> {
  const referenceId = getTrainingCourseUnlockReference(courseId);
  const existing = await db
    .select({ id: creditTransactions.id })
    .from(creditTransactions)
    .where(and(eq(creditTransactions.userId, userId), eq(creditTransactions.referenceId, referenceId)))
    .limit(1);

  return existing.length > 0;
}

export async function hasTrainingCourseAccess(userId: string, courseId: string): Promise<boolean> {
  const cost = getTrainingVideoCourseCreditCost(courseId);
  if (cost <= 0) {
    return true;
  }

  return await hasTrainingCourseUnlock(userId, courseId);
}

export type TrainingCourseAccessResult = {
  unlocked: boolean;
  charged: boolean;
  cost: number;
  reason?: 'insufficient' | 'error';
};

export async function ensureTrainingCourseAccess(
  userId: string,
  courseId: string
): Promise<TrainingCourseAccessResult> {
  const cost = getTrainingVideoCourseCreditCost(courseId);

  if (cost <= 0) {
    return { unlocked: true, charged: false, cost };
  }

  const alreadyUnlocked = await hasTrainingCourseUnlock(userId, courseId);
  if (alreadyUnlocked) {
    return { unlocked: true, charged: false, cost };
  }

  const hasCredits = await creditService.hasEnoughCredits(userId, cost);
  if (!hasCredits) {
    return { unlocked: false, charged: false, cost, reason: 'insufficient' };
  }

  try {
    await creditService.spendCredits({
      userId,
      amount: cost,
      source: 'purchase',
      description: `Training course access: ${courseId}`,
      referenceId: getTrainingCourseUnlockReference(courseId),
      metadata: {
        courseId,
        cost,
        kind: 'training_course',
      },
    });

    return { unlocked: true, charged: true, cost };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('Insufficient credits')) {
      return { unlocked: false, charged: false, cost, reason: 'insufficient' };
    }

    if (isDuplicateReferenceError(error)) {
      return { unlocked: true, charged: false, cost };
    }

    return { unlocked: false, charged: false, cost, reason: 'error' };
  }
}
