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

// Main function
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

// Export the functions if in a Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateActivitySummary, calculateDaysInYear };
}