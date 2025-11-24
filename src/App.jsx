import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoadingSpinner from './components/ui/Loader';
import { Toaster } from 'react-hot-toast';
import HelpButton from './components/core/HelpButton';
import { Helmet } from "react-helmet";

const Home = lazy(() => import('./pages/Home'));
const Event = lazy(() => import('./pages/Event'));
const DetailEvent = lazy(() => import('./pages/DetailEvent'));
const About = lazy(() => import('./pages/About'));
const Auth = lazy(() => import('./pages/Auth'));
const Member = lazy(() => import('./pages/Member'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Help = lazy(() => import('./pages/Help'));
const queryClient = new QueryClient();

function App() {
  const currentUrl = window.location.href;
  const baseUrl = window.location.origin;

  return (
    <QueryClientProvider client={queryClient}>
    <div className="font-openSans">
      <Helmet>
        <title>Digistar Club</title>
        <meta name="description" content="Official Community from Telkom Indonesia" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Digistar Club" />
        <meta property="og:description" content="Official Community from Telkom Indonesia" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={`${baseUrl}/logo-digiclub.png`} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Digistar Club" />
        <meta property="twitter:description" content="Official Community from Telkom Indonesia" />
        <meta property="twitter:url" content={currentUrl} />
        <meta property="twitter:image" content={`${baseUrl}/logo-digiclub.png`} />
      </Helmet>

      <HelpButton />
      <Toaster position="top-right" reverseOrder={false} />
        <Suspense fallback={<LoadingSpinner />}>
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/event" element={<Event />} />
              <Route path="/event/:id" element={<DetailEvent />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Auth mode="login" />} />
              <Route path="/register" element={<Auth mode="register" />} />
              <Route path="/forgot-password" element={<Auth mode="forgotPassword" />} />
              <Route path="/contact/:campusId" element={<Auth mode="contactPerson" />} />
              <Route path="/member" element={<Member />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/help" element={<Help />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
    </div>
    </QueryClientProvider>
  );
}

export default App;