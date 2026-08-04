import mongoose from 'mongoose';

let connected = false;

export async function connectDB(uri) {
  if (!uri) {
    console.log('MONGO_URI not set — using in-memory store');
    connected = false;
    return connected;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    connected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.warn('MongoDB unavailable — using in-memory store:', err.message);
    connected = false;
  }
  return connected;
}

export function isDBConnected() {
  return connected && mongoose.connection.readyState === 1;
}
