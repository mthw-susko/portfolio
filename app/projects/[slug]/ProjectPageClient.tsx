"use client";

import { projectsData } from "@/lib/projectsData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from 'react';
import Link from "next/link";
import React from "react";

// A new component to handle the fade-in animation for each image.
const ProjectImage = ({ src, alt, index, scrollContainerRef }: { src: string; alt: string; index: number; scrollContainerRef: React.RefObject<HTMLDivElement | null>; }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the image is intersecting the viewport, trigger the animation.
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve the image after it has become visible to prevent re-triggering.
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        root: scrollContainerRef.current, // Use the main scroll container as the viewport.
        threshold: 0.2, // Trigger when 20% of the image is visible.
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [scrollContainerRef]);

  return (
    <section
      ref={ref}
      className={`h-full inline-flex items-center justify-center flex-shrink-0 transition-all duration-700 ease-in-out ${
        isVisible && isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="relative w-auto h-[85vh] rounded-[20px] overflow-hidden shadow-lg">
        <Image
          src={src}
          alt={alt}
          height={0}
          width={0}
          sizes="100vw"
          style={{ height: '100%', width: 'auto' }}
          // Only preload the first image; the rest still load eagerly (lazy
          // loading interacts badly with the custom horizontal scroll) but
          // don't compete for bandwidth as preloads.
          priority={index === 0}
          loading="eager"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </section>
  );
};


export default function ProjectPageClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentScroll = useRef(0);
  const targetScroll = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const project = projectsData.find((p) => p.slug === slug);
  const hasImages = (project?.images.length ?? 0) > 0;

  // Reveal the page as soon as the first image is ready instead of waiting
  // for the whole gallery — later images fade in individually as they load.
  useEffect(() => {
    if (!hasImages) {
      setIsReady(true);
      return;
    }
    const firstImage = new window.Image();
    firstImage.src = project!.images[0];
    const reveal = () => setIsReady(true);
    if (firstImage.complete) {
      reveal();
    } else {
      firstImage.onload = reveal;
      firstImage.onerror = reveal; // never leave the page stuck on the spinner
    }
    return () => {
      firstImage.onload = null;
      firstImage.onerror = null;
    };
  }, [project, hasImages]);

  useEffect(() => {
    if (!isReady) return;

    const titleTimer = setTimeout(() => setIsTitleVisible(true), 200);
    const infoTimer = setTimeout(() => setIsInfoVisible(true), 400);
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(infoTimer);
    };
  }, [isReady]);

  useEffect(() => {
    const element = scrollRef.current;

    const smoothScroll = () => {
      if (scrollRef.current) {
        currentScroll.current = lerp(currentScroll.current, targetScroll.current, 0.075);
        scrollRef.current.scrollLeft = currentScroll.current;

        if (Math.abs(targetScroll.current - currentScroll.current) > 0.5) {
          animationFrameId.current = requestAnimationFrame(smoothScroll);
        } else {
          animationFrameId.current = null;
          currentScroll.current = targetScroll.current;
        }
      }
    };

    const scrollBy = (delta: number) => {
      if (!element) return;
      // Recalculate maxScroll on each scroll event
      const maxScroll = element.scrollWidth - element.clientWidth;

      targetScroll.current += delta;
      targetScroll.current = Math.max(0, Math.min(targetScroll.current, maxScroll));

      if (animationFrameId.current === null) {
        animationFrameId.current = requestAnimationFrame(smoothScroll);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollBy(e.deltaY + e.deltaX);
    };

    // Keyboard support for the horizontal gallery.
    const onKeyDown = (e: KeyboardEvent) => {
      const step = window.innerWidth * 0.5;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          scrollBy(step);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          scrollBy(-step);
          break;
        case "PageDown":
          e.preventDefault();
          scrollBy(window.innerWidth);
          break;
        case "PageUp":
          e.preventDefault();
          scrollBy(-window.innerWidth);
          break;
        case "Home":
          e.preventDefault();
          scrollBy(-Number.MAX_SAFE_INTEGER);
          break;
        case "End":
          e.preventDefault();
          scrollBy(Number.MAX_SAFE_INTEGER);
          break;
      }
    };

    if (element) {
        currentScroll.current = element.scrollLeft;
        targetScroll.current = element.scrollLeft;
        element.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      if (element) {
        element.removeEventListener('wheel', onWheel);
        window.removeEventListener('keydown', onKeyDown);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  if (!project) {
    return null; // The server component already 404s unknown slugs.
  }

  const lerp = (current: number, target: number, factor: number) => {
    return current + (target - current) * factor;
  };

  const handleClose = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
        router.push('/#works');
    }, 500); // This duration should match the animation time
  };

  return (
    <main
      ref={scrollRef}
      className={`h-screen w-full overflow-x-auto overflow-y-hidden whitespace-nowrap no-scrollbar transition-opacity duration-500 ${isExiting ? 'page-fade-out' : 'page-fade-in'} ${isReady ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Loading Indicator */}
      {!isReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]">
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-2 border-[var(--foreground)] border-t-transparent rounded-full animate-spin opacity-40"></div>
            <p className="font-imperial text-xs uppercase tracking-[0.4em] text-[var(--foreground)] opacity-50">
              Loading
            </p>
          </div>
        </div>
      )}

      <div className="inline-flex h-full items-center gap-12 px-5 md:px-16">
        {/* Fixed close button at the top right */}
        <Link
          href="/#works"
          onClick={handleClose}
          className={`fixed top-8 right-8 z-10 grid cursor-pointer place-items-center group transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          {/* Invisible text to reserve space for the widest state */}
          <span className="invisible col-start-1 row-start-1 font-imperial text-xl uppercase tracking-[0.4em]">
            Close
          </span>
          {/* Visible text that animates */}
          <span className="col-start-1 row-start-1 font-imperial text-xl uppercase tracking-[0.4em] transition-all duration-300 ease-in-out group-hover:tracking-wide">
            Close
          </span>
        </Link>

        {/* Panel 1: Project Details */}
        <section className="inline-flex flex-col justify-center align-top flex-shrink-0 w-screen sm:w-auto sm:max-w-[50vw] mr-20 whitespace-normal overflow-y-auto py-24 no-scrollbar">
          <div className="w-full lg:max-w-md">
            <h1 className={`font-imperial text-4xl leading-tight transition-all duration-500 ease-out ${isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {project.title}
            </h1>
            <div className={`transition-all duration-500 ease-out ${isInfoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="mt-6 text-base uppercase leading-relaxed whitespace-normal">
                {project.description}
              </p>
              <div className="mt-8 text-sm uppercase space-y-2">
                {Object.entries(project.details).map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="w-24 font-bold">{key}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Panels 2+: Project Images */}
        {project.images.map((src, index) => (
          <ProjectImage
            key={index}
            src={src}
            alt={`${project.title} image ${index + 1}`}
            index={index}
            scrollContainerRef={scrollRef}
          />
        ))}

        {/* Panel: Vertical Close Button at the end */}
        <section className={`h-full inline-flex items-center justify-center flex-shrink-0 px-8 transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Link
                href="/#works"
                onClick={handleClose}
                className="grid place-items-center cursor-pointer group [writing-mode:vertical-rl] rotate-180"
            >
                {/* Invisible text to reserve space for the widest state */}
                <span className="invisible col-start-1 row-start-1 font-imperial text-6xl uppercase tracking-[0.4em]">
                    Close
                </span>
                {/* Visible text that animates */}
                <span className="col-start-1 row-start-1 font-imperial text-6xl uppercase tracking-[0.4em] transition-all duration-300 ease-in-out group-hover:tracking-wide">
                    Close
                </span>
            </Link>
        </section>
      </div>
    </main>
  );
}
