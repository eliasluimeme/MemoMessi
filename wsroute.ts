// import { Server as SocketIOServer } from 'socket.io';

// let io: SocketIOServer | null = null;

// export async function GET() {
//   try {
//     if (!io) {
//       // Create Socket.IO server if it doesn't exist
//       io = new SocketIOServer({
//         cors: {
//           origin: '*',
//           methods: ['GET', 'POST'],
//         },
//         transports: ['websocket'],
//         path: '/api/ws/socket.io',
//         addTrailingSlash: false,
//         connectionStateRecovery: {
//           maxDisconnectionDuration: 2 * 60 * 1000,
//         }
//       });

//       // Store io instance globally
//       (global as any).io = io;

//       // Handle connections
//       io.on('connection', (socket) => {
//         console.log('Client connected to WebSocket server');

//         socket.emit('connection-status', { connected: true });

//         socket.on('disconnect', () => {
//           console.log('Client disconnected from WebSocket server');
//         });

//         socket.on('error', (error: unknown) => {
//           console.error('Socket error:', error);
//         });
//       });

//       // Start the server
//       const port = parseInt(process.env.PORT || '3002', 10);
//       await new Promise<void>((resolve) => {
//         const server = io!.listen(port);
//         server.on('listening', () => {
//           console.log(`WebSocket server is running on port ${port}`);
//           resolve();
//         });
//       });
//     }

//     return new Response('WebSocket server is running', {
//       status: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'GET, POST',
//       },
//     });
//   } catch (error) {
//     console.error('Failed to initialize WebSocket server:', error);
//     return new Response('Failed to initialize WebSocket server', { status: 500 });
//   }
// } 