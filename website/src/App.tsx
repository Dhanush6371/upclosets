import { Suspense, lazy, useState } from 'react';
import { RouterProvider, useRouter } from './utils/router';
import Header from './components/Header';
import Footer from './components/Footer';
import LiveKitWidget from './components/ai_avatar/LiveKitWidget';
import ScrollToTop from './components/ScrollToTop';
import ScrollReveal from './components/ScrollReveal';
import { MessageCircle } from 'lucide-react';
const Home = lazy(() => import('./pages/Home'));
const WalkInClosets = lazy(() => import('./pages/WalkInClosets'));
const ReachInClosets = lazy(() => import('./pages/ReachInClosets'));
const OfficeRoom = lazy(() => import('./pages/OfficeRoom'));
const HobbyRoom = lazy(() => import('./pages/HobbyRoom'));
const MudRoom = lazy(() => import('./pages/MudRoom'));
const LaundryRoom = lazy(() => import('./pages/LaundryRoom'));
const KitchenPantry = lazy(() => import('./pages/KitchenPantry'));
const Garages = lazy(() => import('./pages/Garages'));
const Process = lazy(() => import('./pages/Process'));
const Catalog = lazy(() => import('./pages/Catalog'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));

function AppContent() {
  const { currentPath } = useRouter();
  const [showSupport, setShowSupport] = useState(false);

  const routes: { [key: string]: React.ComponentType } = {
    '/': Home,
    '/walk-in-closets': WalkInClosets,
    '/reach-in-closets': ReachInClosets,
    '/office-room': OfficeRoom,
    '/hobby-room': HobbyRoom,
    '/mud-room': MudRoom,
    '/laundry-room': LaundryRoom,
    '/kitchen-pantry': KitchenPantry,
    '/garages': Garages,
    '/process': Process,
    '/catalog': Catalog,
    '/contact': Contact,
    '/about': About,
    '/services': Services,
  };

  const Component = routes[currentPath] || Home;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-36" data-reveal>
        <Suspense fallback={
          <div className="container-custom mx-auto px-6 py-12">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-dark-text text-lg font-semibold">Loading...</p>
            </div>
          </div>
        }>
          <Component />
        </Suspense>
      </main>
      <Footer />
      
      {/* Voice Assistant Button */}
      {!showSupport && (
        <button
          onClick={() => setShowSupport(true)}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#D4AF37",
            color: "white",
            border: "none",
            boxShadow: "0 8px 24px rgba(212, 175, 55, 0.4)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            zIndex: 1000,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(212, 175, 55, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(212, 175, 55, 0.4)";
          }}
          aria-label="Open Voice Assistant"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* LiveKit Voice Agent */}
      {showSupport && <LiveKitWidget setShowSupport={setShowSupport} voiceOnly={false} />}
      
      <ScrollToTop />
      <ScrollReveal />
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

export default App;
