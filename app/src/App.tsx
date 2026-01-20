/*
 * Description: Main application component implementing React Router for navigation between pages,
 *              wrapped with ErrorBoundary for graceful error handling across the application
 * Sample input: Application load and route navigation events
 * Expected output: Rendered application with routing structure, Layout wrapper, page components,
 *                  and error boundary protection for unhandled exceptions
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { ErrorBoundary } from './components/ui';
import QuickOverview from './pages/QuickOverview';
import LiveTerrain from './pages/LiveTerrain';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<QuickOverview />} />
            <Route path="live-terrain" element={<LiveTerrain />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
