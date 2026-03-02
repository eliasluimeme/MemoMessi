import type { NextApiRequest, NextApiResponse } from 'next';

import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Incoming request:', req.method, req.cookies);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' }); // Method not allowed
  }

  const { token } = req.body; // Get the token from the request body

  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ message: 'Unauthorized' }); // No token provided
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!); // Verify the token
    return res.status(200).json({ user: decoded }); // Return the decoded user data
  } catch (error) {
    console.error('Token verification failed:', error); // Log the error
    return res.status(401).json({ message: 'Invalid token' }); // Token verification failed
  }
}
