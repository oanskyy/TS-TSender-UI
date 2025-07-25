import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
// Polyfill for TextEncoder and TextDecoder in Jest environment
// This is necessary for environments that do not support these APIs natively, such as Node.js
