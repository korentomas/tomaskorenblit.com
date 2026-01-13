import { useEffect, useRef } from 'react';

export default function Studio() {
  const studioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically import Sanity Studio only on client side
    async function loadStudio() {
      const { Studio } = await import('sanity');

      if (studioRef.current) {
        // Import the config
        const config = (await import('../../sanity.config')).default;

        // Clear container
        studioRef.current.innerHTML = '';

        // Render Studio
        const studioApp = Studio({ config, unstable_noAuthBoundary: true });
        studioRef.current.appendChild(studioApp);
      }
    }

    loadStudio();
  }, []);

  return (
    <div
      ref={studioRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    />
  );
}
