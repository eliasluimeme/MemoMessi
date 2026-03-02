// import WebSocket from 'ws';

// const apiKey = process.env.COINAPI_KEY; // Ensure you have your API key in the environment variables
// const url = 'wss://ws.coinapi.io/v1/';

// let ws: WebSocket;

// export const connectCoinAPI = () => {
//     console.log("in coin api");
//     ws = new WebSocket(url, {
//         headers: {
//             'X-CoinAPI-Key': apiKey,
//         },
//     });

//     ws.onopen = () => {
//         console.log('Connected to CoinAPI');
//         // Subscribe to a specific asset pair (e.g., BTC/USD)
//         ws.send(JSON.stringify({
//             type: 'subscribe',
//             channels: [{
//                 name: 'trade',
//                 symbols: ['BTC/USD'], // Change this to your desired token pair
//                 subscribe_data_type: ['bidask', 'trade'],
//             }],
//         }));
//     };

//     ws.onmessage = (event) => {
//         if (event.data) {
//             const parsedData = typeof event.data === 'string' ? JSON.parse(event.data) : JSON.parse(event.data.toString());
//             console.log('Real-time data:', parsedData);
//             // Here you can handle the incoming data, e.g., store it in a database or update the UI
//         } else {
//             console.error('Received empty message from WebSocket');
//         }
//     };

//     ws.onerror = (error) => {
//         console.error('WebSocket error:', error);
//     };

//     ws.onclose = () => {
//         console.log('Disconnected from CoinAPI');
//         // Optionally, you can implement reconnection logic here
//     };
// };

// export const disconnectCoinAPI = () => {
//     if (ws) {
//         ws.close();
//     }
// };
