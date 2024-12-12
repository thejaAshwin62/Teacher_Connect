import mongoose from 'mongoose';

afterAll(async () => {
  await mongoose.disconnect();
  await new Promise(resolve => setTimeout(resolve, 500)); // Add a small delay
}); 