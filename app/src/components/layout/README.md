# Layout Component

## Overview
The Layout component serves as the main structural wrapper for the Mine Demo Dashboard application. It provides a consistent layout structure across all pages with a header container for navigation and a main content area for child routes.

## Structure
- **Header**: Contains a placeholder for the Navbar component (to be implemented in Phase 2)
- **Main Content**: Uses React Router's `Outlet` to render child routes

## Usage Example

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="analysis" element={<Analysis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## Styling
The Layout uses Tailwind CSS utility classes for:
- Full-height flexbox layout (`h-screen`, `flex`, `flex-col`)
- Responsive container with padding
- Clean white header with subtle shadow
- Scrollable main content area

## Future Enhancements
- Phase 2: Integration of Navbar component in the header section
- Potential addition of footer or sidebar components as needed
