// SM-2 Spaced Repetition Algorithm

export type Rating = 'Again' | 'Hard' | 'Good' | 'Easy';

export interface SM2Data {
  repetitions: number;
  interval: number;
  easeFactor: number;
}

export function calculateSM2(
  rating: Rating,
  data: SM2Data
): SM2Data {
  let { repetitions, interval, easeFactor } = data;
  
  let grade: number;
  switch (rating) {
    case 'Again': grade = 0; break;
    case 'Hard': grade = 3; break; // usually SM-2 grades are 0-5. Again=0, Hard=3, Good=4, Easy=5
    case 'Good': grade = 4; break;
    case 'Easy': grade = 5; break;
  }

  if (grade >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  return {
    repetitions,
    interval,
    easeFactor
  };
}

export function getNextDueDate(interval: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + interval);
  return date;
}
