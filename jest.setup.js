import { TextEncoder, TextDecoder } from 'util';
import { jest } from '@jest/globals';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock console.error to reduce noise in tests
console.error = jest.fn();

// Setup nodemailer mock