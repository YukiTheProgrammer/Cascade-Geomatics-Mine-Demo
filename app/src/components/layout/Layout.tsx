/**
 * Layout Component
 *
 * Description:
 * Main layout wrapper for the Mine Demo Dashboard application. Provides the structural
 * container for the navigation bar and renders child routes through React Router's Outlet.
 * This component serves as the parent layout for all pages in the application.
 *
 * Input:
 * None (renders through React Router)
 *
 * Output:
 * JSX.Element - A full-height layout container with:
 *   - Fixed header section with Navbar component
 *   - Main content area that displays child routes via Outlet
 *   - Responsive design using Tailwind CSS
 */

import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

const Layout = () => {
  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area - Renders child routes */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
