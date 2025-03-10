const React = require('react');

module.exports = {
    Link: ({ children, to }) => React.createElement('a', { href: to }, children),
    NavLink: ({ children, to }) => React.createElement('a', { href: to }, children),
    useNavigate: jest.fn(),
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({}),
    BrowserRouter: ({ children }) => React.createElement('div', null, children),
    MemoryRouter: ({ children }) => React.createElement('div', null, children)
}; 