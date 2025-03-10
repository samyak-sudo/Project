import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading Component', () => {
    test('renders loading component with correct text', () => {
        render(<Loading />);
        
        // Check if the loading text is present
        const loadingText = screen.getByText('Loading...');
        expect(loadingText).toBeInTheDocument();
        
        // Check if it's inside a div with correct class
        const loadingDiv = loadingText.parentElement;
        expect(loadingDiv).toHaveClass('loading');
    });

    test('matches snapshot', () => {
        const { container } = render(<Loading />);
        expect(container).toMatchSnapshot();
    });

    test('renders h2 element', () => {
        render(<Loading />);
        const headingElement = screen.getByRole('heading', { level: 2 });
        expect(headingElement).toBeInTheDocument();
    });
}); 