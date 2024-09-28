# Calry Internship Assignment

This repository contains the solutions to the Carly Internship Assignment, including two separate tasks:

1. **Meeting Scheduler**
2. **Hotel Room Service Request API**

## Question 1 - [Meeting Scheduler](https://github.com/raunak-dev-edu/Calry-Internship-Assignment/tree/main/question1)

### Approach

The Meeting Scheduler function optimizes the given list of meeting times by merging overlapping or consecutive bookings. It follows these steps:

1. **Sorting:** Sort the meeting times by their start times.
2. **Merging:** Iterate through the sorted meetings and merge them if they overlap or are consecutive. Consecutive meetings are defined as when one meeting ends exactly when the next one begins.
3. **Output:** Return the optimized list of non-overlapping and merged meeting times.

### Input & Output Test Results

For a detailed view of input test cases and their corresponding output results, refer to the screenshots available [here](https://github.com/raunak-dev-edu/Calry-Internship-Assignment/tree/main/question1/Screenshots).

## Question 2 - [Hotel Room Service Request API (No Database, No Auth)](https://github.com/raunak-dev-edu/Calry-Internship-Assignment/tree/main/question2/)

### Approach

The Hotel Room Service Request API is designed to handle room service requests efficiently using JSON files for temporary data storage. Here's how the solution is structured:

1. **API Endpoints:**
   - **POST /requests:** Create a new room service request.
   - **GET /requests:** Retrieve all room service requests, sorted by priority.
   - **GET /requests/{id}:** Retrieve a specific request using its ID.
   - **PUT /requests/{id}:** Update the details or priority of an existing request.
   - **DELETE /requests/{id}:** Remove a completed or canceled request.
   - **POST /requests/{id}/complete:** Mark a request as completed.

2. **Data Storage:**
   - All requests are stored temporarily in JSON files.
   - The application handles file read/write operations using a locking mechanism to ensure safe access in concurrent scenarios.

3. **Request Prioritization:**
   - Requests are prioritized based on the `priority` field, where a lower number indicates higher priority.

### Postman API Responses

The results of various API requests and their responses in Postman can be viewed [here](https://github.com/raunak-dev-edu/Calry-Internship-Assignment/tree/main/question2/screenshots).
