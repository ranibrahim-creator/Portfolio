import assert from 'node:assert/strict';
import test from 'node:test';

import { calorieTarget, calorieStatus, goalsFromProfile, mifflinStJeor, scaleMacros, sumEntries, tdee } from './nutrition.ts';

test('mifflin-st jeor female sample', () => {
  assert.equal(mifflinStJeor('female', 65, 165, 28), 1380);
});

test('calorie targets respect goal', () => {
  assert.equal(calorieTarget(2000, 'maintain'), 2000);
  assert.equal(calorieTarget(2000, 'lose'), 1500);
  assert.equal(calorieTarget(2000, 'gain'), 2300);
  assert.equal(calorieTarget(1600, 'lose'), 1200);
});

test('tdee scales with activity', () => {
  const sedentary = tdee('female', 65, 165, 28, 'sedentary');
  const active = tdee('female', 65, 165, 28, 'active');
  assert.ok(active > sedentary);
});

test('goalsFromProfile returns macros that fit calories', () => {
  const goals = goalsFromProfile({
    sex: 'female',
    weightKg: 65,
    heightCm: 165,
    age: 28,
    activity: 'moderate',
    goal: 'lose',
  });
  const kcalFromMacros = goals.proteinGoal * 4 + goals.carbsGoal * 4 + goals.fatGoal * 9;
  assert.ok(Math.abs(kcalFromMacros - goals.calorieGoal) < 20);
});

test('calorieStatus bands', () => {
  assert.equal(calorieStatus(0, 1800), 'empty');
  assert.equal(calorieStatus(400, 1800), 'under');
  assert.equal(calorieStatus(1200, 1800), 'track');
  assert.equal(calorieStatus(1750, 1800), 'near');
  assert.equal(calorieStatus(1900, 1800), 'over');
});

test('scaleMacros and sumEntries', () => {
  const scaled = scaleMacros({ calories: 100, protein: 10, carbs: 5, fat: 2 }, 2);
  assert.deepEqual(scaled, { calories: 200, protein: 20, carbs: 10, fat: 4 });
  const total = sumEntries([
    { id: '1', foodId: 'a', name: 'A', meal: 'lunch', servings: 1, servingLabel: '1', ...scaled },
    { id: '2', foodId: 'b', name: 'B', meal: 'lunch', servings: 1, servingLabel: '1', calories: 50, protein: 1, carbs: 2, fat: 3 },
  ]);
  assert.deepEqual(total, { calories: 250, protein: 21, carbs: 12, fat: 7 });
});
