// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { renderWithProviders } from '../test-utils';
// import Location from './Location';

// describe('Location Component', () => {
//   test('renders location text', () => {
//     renderWithProviders(<Location />);
//     expect(screen.getByText(/Location/i)).toBeInTheDocument();
//   });
// });






// import React from 'react';
// import { screen } from '@testing-library/react';
// import { renderWithProviders } from '../test-utils';
// import Location from './Location';

// // Mock the component's dependencies if any


// describe('Location Component', () => {
//   beforeEach(() => {
//     renderWithProviders(<Location />);
//   });

//   test('renders location component', () => {
//     const locationComponent = screen.getByTestId('location-component');
//     expect(locationComponent).toBeInTheDocument();
//   });

//   test('has correct role attribute', () => {
//     const regionElement = screen.getByRole('region');
//     expect(regionElement).toBeInTheDocument();
//   });

//   test('displays correct text content', () => {
//     const locationText = screen.getByText(/location/i);
//     expect(locationText).toBeInTheDocument();
//     expect(locationText.textContent).toBe('Location');
//   });

//   test('renders with correct HTML structure', () => {
//     const element = screen.getByRole('region');
//     expect(element.tagName).toBe('DIV');
//     expect(element).toHaveAttribute('data-testid', 'location-component');
//   });
// });


import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Location from './Location';

describe('Location Component', () => {
  beforeEach(() => {
    renderWithProviders(<Location />);
  });

  test('renders location component', () => {
    const locationComponent = screen.getByTestId('location-component');
    expect(locationComponent).toBeInTheDocument();
  });

  test('has correct role attribute', () => {
    const regionElement = screen.getByRole('region');
    expect(regionElement).toBeInTheDocument();
  });

  test('displays correct text content', () => {
    const locationText = screen.getByText(/location/i);
    expect(locationText).toBeInTheDocument();
    expect(locationText.textContent).toBe('Location');
  });

  test('renders with correct HTML structure', () => {
    const element = screen.getByRole('region');
    expect(element.tagName).toBe('DIV');
    expect(element).toHaveAttribute('data-testid', 'location-component');
  });
});