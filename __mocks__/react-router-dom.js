import React from 'react';

// const actualReactRouterDom = jest.requireActual("react-router-dom");

// module.exports = {
//   ...actualReactRouterDom, // Spread actual implementation
//   useNavigate: jest.fn(),
//   useLocation: () => ({ pathname: "/" }),
//   useParams: () => ({}),
//   Link: ({ to, children }) => <a href={to}>{children}</a>, // Preserve `to` prop
//   NavLink: ({ to, children }) => <a href={to}>{children}</a>, // Mock `NavLink`
// };
export const useNavigate = jest.fn();
export const useParams = jest.fn();
export const useLocation = jest.fn(() => ({ pathname: '/' }));
export const Link = ({ children, to }) => <a href={to}>{children}</a>;
export const NavLink = ({ children, to }) => <a href={to}>{children}</a>;
export const MemoryRouter = ({ children }) => <div>{children}</div>;
export const BrowserRouter = ({ children }) => <div>{children}</div>;
export const Routes = ({ children }) => <div>{children}</div>;
export const Route = ({ children }) => <div>{children}</div>;
// module.exports = 'test-file-stub';