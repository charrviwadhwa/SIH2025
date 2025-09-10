// database.js
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

// Database connection string
const connectionString = process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/attendance_db';

// Create postgres client
const client = postgres(connectionString, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
});

// Create drizzle database instance
export const db = drizzle(client, { schema });

// Test database connection
export async function testConnection() {
  try {
    await client`SELECT 1`;
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Initialize database (create tables if they don't exist)
export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // You would typically run your migrations here
    // For now, we'll just test the connection
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ Database initialized successfully');
    } else {
      throw new Error('Failed to connect to database');
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Gracefully close database connection
export async function closeConnection() {
  try {
    await client.end();
    console.log('📦 Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, closing database connection...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, closing database connection...');
  await closeConnection();
  process.exit(0);
});