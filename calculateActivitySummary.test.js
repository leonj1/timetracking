// Function to be implemented
function calculateActivitySummary(person, selectedYear) {
    const activitySummary = {};

    if (person && person.activities) {
        person.activities.forEach(activity => {
            const days = calculateDaysInYear(activity, selectedYear);
            if (days > 0) {
                if (!activitySummary[activity.reason]) {
                    activitySummary[activity.reason] = 0;
                }
                activitySummary[activity.reason] += days;
            }
        });
    }

    return Object.entries(activitySummary).sort((a, b) => b[1] - a[1]);
}

// Helper function
function calculateDaysInYear(activity, year) {
    const startDate = new Date(activity.startDate);
    const endDate = activity.endDate ? new Date(activity.endDate) : new Date(startDate);
    const yearStart = new Date(Date.UTC(year, 0, 1));
    const yearEnd = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

    const effectiveStart = new Date(Math.max(startDate, yearStart));
    const effectiveEnd = new Date(Math.min(endDate, yearEnd));

    if (effectiveEnd < effectiveStart) {
        return 0;
    }

    // Add 1 to include both start and end dates
    return Math.floor((effectiveEnd - effectiveStart) / (1000 * 60 * 60 * 24)) + 1;
}

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

describe('calculateDaysInYear', () => {
    test('calculates days within the year correctly', () => {
        const activity = { startDate: '2023-01-01', endDate: '2023-01-05' };
        expect(calculateDaysInYear(activity, 2023)).toBe(5);
    });

    test('handles activities starting before the year', () => {
        const activity = { startDate: '2022-12-30', endDate: '2023-01-02' };
        expect(calculateDaysInYear(activity, 2023)).toBe(2);
    });

    test('handles activities ending after the year', () => {
        const activity = { startDate: '2023-12-30', endDate: '2024-01-02' };
        expect(calculateDaysInYear(activity, 2023)).toBe(2);
    });

    test('handles single-day activities', () => {
        const activity = { startDate: '2023-03-15', endDate: '2023-03-15' };
        expect(calculateDaysInYear(activity, 2023)).toBe(1);
    });

    test('returns 0 for activities completely outside the year', () => {
        const activity = { startDate: '2022-01-01', endDate: '2022-12-31' };
        expect(calculateDaysInYear(activity, 2023)).toBe(0);
    });
});