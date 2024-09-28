function optimizeBookings(bookings: number[][]): number[][] {
    
    if (bookings.length === 0) {  // handled empty booking case
        return [];
    }

    bookings.sort((a, b) => a[0] - b[0]);

    const optimizedBookings: number[][] = [];

    let currentBooking = bookings[0];

    for (let i = 1; i < bookings.length; i++) {
        const [currentStart, currentEnd] = currentBooking;
        const [nextStart, nextEnd] = bookings[i];

        if (nextStart <= currentEnd) {
            currentBooking = [currentStart, Math.max(currentEnd, nextEnd)];
        } else {
            optimizedBookings.push(currentBooking);
            currentBooking = bookings[i];
        }
    }
    optimizedBookings.push(currentBooking);

    return optimizedBookings;
}

// Test Cases
console.log(optimizeBookings([[9, 12], [11, 13], [14, 17], [16, 18]])); // Example testcase
console.log(optimizeBookings([[1, 3], [5, 8], [10, 12]])); // Non-overlapping
console.log(optimizeBookings([[8, 9], [9, 10], [11, 12]])); // Consecutive bookings
console.log(optimizeBookings([[1, 2], [3, 4], [5, 6]])); // Already Non-Overlapping
console.log(optimizeBookings([])); // empty list of bookings
