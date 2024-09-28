import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import path from 'path';

// Request type definition
interface ServiceRequest {
  id: string;
  guestName: string;
  roomNumber: number;
  requestDetails: string;
  priority: number;
  status: 'received' | 'in progress' | 'awaiting confirmation' | 'completed' | 'canceled';
}

const app = express();
const PORT = 3000;
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware to parse JSON request bodies
app.use(express.json());

// Helper function to read data from JSON file
const readData = async (): Promise<ServiceRequest[]> => {
  const data = await fs.readFile(dataFilePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write data to JSON file
const writeData = async (data: ServiceRequest[]): Promise<void> => {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// POST /requests - Create a new service request
app.post('/requests', async (req: Request, res: Response) => {
  try {
    const { guestName, roomNumber, requestDetails, priority } = req.body;
    const newRequest: ServiceRequest = {
      id: uuidv4(),
      guestName,
      roomNumber,
      requestDetails,
      priority,
      status: 'received',
    };
    const requests = await readData();
    requests.push(newRequest);
    await writeData(requests);
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// GET /requests - Retrieve all requests, sorted by priority
app.get('/requests', async (_req: Request, res: Response) => {
  try {
    const requests = await readData();
    requests.sort((a, b) => a.priority - b.priority);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve requests' });
  }
});

// GET /requests/:id - Retrieve a specific request by ID
app.get('/requests/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requests = await readData();
    const request = requests.find((req) => req.id === id);
    if (request) {
      res.json(request);
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve request' });
  }
});

// PUT /requests/:id - Update details or priority of an existing request
app.put('/requests/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { guestName, roomNumber, requestDetails, priority, status } = req.body;
    const requests = await readData();
    const index = requests.findIndex((req) => req.id === id);
    if (index !== -1) {
      const updatedRequest: ServiceRequest = { ...requests[index], guestName, roomNumber, requestDetails, priority, status };
      requests[index] = updatedRequest;
      await writeData(requests);
      res.json(updatedRequest);
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// DELETE /requests/:id - Remove a completed or canceled request
app.delete('/requests/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = req.params.id;

    // Read existing requests from JSON file
    const requests = await readData();

    // Check if request exists
    const requestIndex = requests.findIndex((r) => r.id === requestId);
    if (requestIndex === -1) {
      res.status(404).send('Request not found');
      return;
    }

    // Remove the request
    requests.splice(requestIndex, 1);

    // Write updated requests to JSON file
    await writeData(requests);

    // Send success response
    res.status(200).send(`Request with id ${requestId} deleted successfully`);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while deleting the request');
  }
});


// POST /requests/:id/complete - Mark a request as completed
app.post('/requests/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requests = await readData();
    const index = requests.findIndex((req) => req.id === id);
    if (index !== -1) {
      requests[index].status = 'completed';
      await writeData(requests);
      res.json(requests[index]);
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete request' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
