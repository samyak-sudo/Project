import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';

// Mock ReactDOM
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

// Mock reportWebVitals
jest.mock('./reportWebVitals', () => jest.fn());

describe('Index.js', () => {
  let container;
  let mockRoot;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup DOM element
    container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);

    // Create mock root
    mockRoot = {
      render: jest.fn()
    };
    createRoot.mockReturnValue(mockRoot);
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.resetModules();
  });

  test('renders without crashing', () => {
    // Import index.js to trigger its execution
    require('./index.js');
    
    // Verify createRoot was called with the correct element
    expect(createRoot).toHaveBeenCalledWith(container);
    
    // Verify render was called with the Provider and App
    expect(mockRoot.render).toHaveBeenCalled();
    const renderCall = mockRoot.render.mock.calls[0][0];
    expect(renderCall.type).toBe(Provider);
    expect(renderCall.props.store).toBe(store);
    expect(renderCall.props.children.type).toBe(App);
  });

  test('calls reportWebVitals', () => {
    // Import index.js to trigger its execution
    require('./index.js');
    
    // Verify reportWebVitals was called
    expect(reportWebVitals).toHaveBeenCalled();
  });

  test('creates root element correctly', () => {
    require('./index.js');
    
    // Verify the root element exists and was used
    expect(document.getElementById('root')).toBe(container);
    expect(createRoot).toHaveBeenCalledWith(container);
  });

  test('renders App component with Redux Provider', () => {
    require('./index.js');
    
    // Get the rendered component from the mock
    const renderedComponent = mockRoot.render.mock.calls[0][0];
    
    // Verify Provider props
    expect(renderedComponent.type).toBe(Provider);
    expect(renderedComponent.props.store).toBe(store);
    
    // Verify App is child of Provider
    expect(renderedComponent.props.children.type).toBe(App);
  });
});