import React, { lazy, Suspense } from 'react';
import { LoaderCircle } from 'lucide-react';

const PageLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <LoaderCircle className="h-6 w-6 animate-spin" />
  </div>
);

// Lazy load pages
export const ProfilePageLazy = lazy(() => import('@/pages/ProfilePage'));
export const SettingsPageLazy = lazy(() => import('@/pages/SettingsPage'));
export const ReportsPageLazy = lazy(() => import('@/pages/ReportsPage'));
export const HelpPageLazy = lazy(() => import('@/pages/HelpPage'));
export const TaskDetailsPageLazy = lazy(() => import('@/pages/TaskDetailsPage'));

// Wrapper component for lazy-loaded pages
interface LazyPageProps {
  component: React.LazyExoticComponent<React.FC>;
}

export const LazyPage: React.FC<LazyPageProps> = ({ component: Component }) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
};
