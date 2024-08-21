const { calculateActivitySummary } = require('./activitySummary');

describe('calculateActivitySummary', () => {
  test('calculates summary correctly for a given year', () => {
    const person = {
      activities: [
        { startDate: '2023-01-01', endDate: '2023-01-05', reason: 'Vacation' },
        { startDate: '2023-02-01', endDate: '2023-02-03', reason: 'Sick' },
        { startDate: '2023-03-15', endDate: '2023-03-15', reason: 'Personal' },
        { startDate: '2022-12-30', endDate: '2023-01-02', reason: 'Holiday' },
        { startDate: '2024-01-01', endDate: '2024-01-03', reason: 'Vacation' },
      ]
    };

    const result = calculateActivitySummary(person, 2023);

    expect(result).toEqual([
      ['Vacation', 5],
      ['Sick', 3],
      ['Holiday', 2],
      ['Personal', 1],
    ]);
  });

  test('returns empty array for person with no activities', () => {
    const person = { activities: [] };
    const result = calculateActivitySummary(person, 2023);
    expect(result).toEqual([]);
  });

  test('ignores activities outside the selected year', () => {
    const person = {
      activities: [
        { startDate: '2022-01-01', endDate: '2022-01-05', reason: 'Vacation' },
        { startDate: '2024-02-01', endDate: '2024-02-03', reason: 'Sick' },
      ]
    };

    const result = calculateActivitySummary(person, 2023);
    expect(result).toEqual([]);
  });

  test('handles activities spanning multiple years correctly', () => {
    const person = {
      activities: [
        { startDate: '2022-12-30', endDate: '2023-01-02', reason: 'Holiday' },
        { startDate: '2023-12-30', endDate: '2024-01-02', reason: 'Holiday' },
      ]
    };

    const result = calculateActivitySummary(person, 2023);
    expect(result).toEqual([['Holiday', 4]]);
  });
});