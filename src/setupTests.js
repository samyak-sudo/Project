// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Define BroadcastChannel directly here instead of importing
global.BroadcastChannel = class {
  constructor() {}
  postMessage() {}
  close() {}
};

// Add TransformStream mock if needed
global.TransformStream = class {
  constructor() {}
};
