// import axios from 'axios';

// // Define interface for cryptocurrency data
// export interface Cryptocurrency {
//   id: string;
//   rank: string;
//   symbol: string;
//   name: string;
//   priceUsd: string;
//   marketCapUsd: string;
//   volumeUsd24Hr: string;
//   changePercent24Hr: string;
// }

// // CoinCap API service class
// export class CoinCapService {
//   private baseUrl = 'https://api.coincap.io/v2';

//   // Fetch top cryptocurrencies
//   async getTopCryptocurrencies(limit: number = 10): Promise<Cryptocurrency[]> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/assets`, {
//         params: {
//           limit: limit
//         }
//       });

//       return response.data.data;
//     } catch (error) {
//       console.error('Error fetching cryptocurrencies:', error);
//       throw error;
//     }
//   }

//   // Fetch specific cryptocurrency by ID
//   async getCryptocurrencyById(id: string): Promise<Cryptocurrency> {
//     try {
//       const response = await axios.get(`${this.baseUrl}/assets/${id}`);
//       return response.data.data;
//     } catch (error) {
//       console.error(`Error fetching cryptocurrency ${id}:`, error);
//       throw error;
//     }
//   }

//   // New method: Fetch cryptocurrency by name
//   async getCryptocurrencyByName(name: string): Promise<Cryptocurrency> {
//     try {
//       // Convert name to lowercase for case-insensitive search
//       const normalizedName = name.toLowerCase();

//       // Fetch all cryptocurrencies and find by name
//       const response = await axios.get(`${this.baseUrl}/assets`, {
//         params: {
//           limit: 2000 // Fetch a large number of cryptocurrencies
//         }
//       });

//       const cryptocurrencies: Cryptocurrency[] = response.data.data;

//       // Find the cryptocurrency by name (case-insensitive)
//       const foundCrypto = cryptocurrencies.find(
//         crypto => crypto.name.toLowerCase() === normalizedName
//       );

//       if (!foundCrypto) {
//         throw new Error(`Cryptocurrency with name ${name} not found`);
//       }

//       return foundCrypto;
//     } catch (error) {
//       console.error(`Error fetching cryptocurrency by name ${name}:`, error);
//       throw error;
//     }
//   }

//   // Fetch cryptocurrency price
//   async getCryptocurrencyPrice(id: string): Promise<string> {
//     try {
//       const crypto = await this.getCryptocurrencyById(id);
//       return crypto.priceUsd;
//     } catch (error) {
//       console.error(`Error fetching price for ${id}:`, error);
//       throw error;
//     }
//   }
// }

// // Instantiate the service
// export const coinCapService = new CoinCapService();
