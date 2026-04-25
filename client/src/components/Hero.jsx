import { useEffect, useRef, useState } from 'react';

export default function Hero({ onStartLearning }) {
  const videoRef = useRef(null);
  const opacityRef = useRef(0);
  const rafRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let fadeState = 'in';
    let startTime = null;
    const FADE_DURATION = 500;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (fadeState === 'in') {
        opacityRef.current = Math.min(elapsed / FADE_DURATION, 1);
        if (opacityRef.current >= 1) {
          fadeState = 'visible';
        }
      }

      // Check if near end for fade out
      if (video.duration && video.currentTime >= video.duration - 0.5) {
        if (fadeState !== 'out') {
          fadeState = 'out';
          startTime = timestamp;
        }
      }

      if (fadeState === 'out') {
        const outElapsed = timestamp - startTime;
        opacityRef.current = Math.max(1 - outElapsed / FADE_DURATION, 0);
      }

      video.style.opacity = opacityRef.current;
      rafRef.current = requestAnimationFrame(animate);
    }

    function handleEnded() {
      video.style.opacity = 0;
      opacityRef.current = 0;
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        fadeState = 'in';
        startTime = null;
      }, 100);
    }

    function handleCanPlay() {
      video.play().catch((err) => {
        console.log('Video autoplay prevented:', err);
      });
      rafRef.current = requestAnimationFrame(animate);
    }

    function handleError(e) {
      console.error('Video error:', e);
      setVideoError(true);
    }

    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-white">
      {!isMobile && !videoError && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0 }}
          muted
          playsInline
          preload="metadata"
          loading="lazy"
          crossOrigin="anonymous"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'%3E%3Crect fill='%23f5f5f5' width='1280' height='720'/%3E%3C/svg%3E"
          onError={(e) => {
            console.error('Video error:', e);
            setVideoError(true);
          }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
            type="video/mp4"
          />
        </video>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent pointer-events-none z-[1]" />

      {(isMobile || videoError) && (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-50 pointer-events-none z-0" />
      )}

      <div className="relative z-10 flex flex-col items-center justify-start h-full pt-40 px-6 text-center max-w-5xl mx-auto">
        <h1
          className="font-display text-5xl md:text-8xl leading-tight md:leading-none tracking-tight text-black
                     animate-on-load animate-fade-rise"
        >
          Turn your <em className="italic text-neutral-400">notes</em> into <em className="italic text-neutral-400">knowledge that sticks.</em>
        </h1>

        <p
          className="mt-2 md:mt-3 text-black-500 text-base md:text-lg max-w-2xl font-body leading-relaxed
                     animate-on-load animate-fade-rise-delay"
        >
          Transform raw notes into structured summaries, smart quizzes, and active recall flashcards.
          Learn faster, revise smarter, and retain more with AI.
        </p>

        <button
          onClick={onStartLearning}
          className="mt-12 md:mt-16 bg-black text-white px-8 py-3.5 rounded-full text-sm font-medium font-body
                     transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-black/10
                     btn-press animate-on-load animate-fade-rise-delay-2"
        >
          Start Learning
        </button>
      </div>
    </section>
  );
}
