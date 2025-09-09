
"use client";

import { projectsData } from "@/lib/projectsData";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import { useRef, useEffect, useState } from 'react';
import Link from "next/link";
import React from "react";

// A new component to handle the fade-in animation for each image.
const ProjectImage = ({ src, alt, scrollContainerRef, onImageLoad }: { src: string; alt: string; scrollContainerRef: React.RefObject<HTMLDivElement | null>; onImageLoad: () => void; }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the scroll container ref is available before setting up the observer.
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
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
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
          priority // Helps with layout calculation by loading the first images faster
          onLoad={onImageLoad}
        />
      </div>
    </section>
  );
};


export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentScroll = useRef(0);
  const targetScroll = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [areImagesLoaded, setAreImagesLoaded] = useState(false);
  const loadedImagesCount = useRef(0);

  const project = projectsData.find((p) => p.slug === slug);

  const handleImageLoad = () => {
    if (!project) return;
    loadedImagesCount.current += 1;
    if (loadedImagesCount.current === project.images.length) {
      setAreImagesLoaded(true);
    }
  };

  useEffect(() => {
    if (project && project.images.length === 0) {
        setAreImagesLoaded(true);
    }
  }, [project]);

  useEffect(() => {
    const titleTimer = setTimeout(() => setIsTitleVisible(true), 200);
    const infoTimer = setTimeout(() => setIsInfoVisible(true), 400);
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(infoTimer);
    };
  }, []);

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
    
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (element) {
        // Recalculate maxScroll on each wheel event
        const maxScroll = element.scrollWidth - element.clientWidth;
        
        targetScroll.current += e.deltaY + e.deltaX;
        targetScroll.current = Math.max(0, Math.min(targetScroll.current, maxScroll));

        if (animationFrameId.current === null) {
          animationFrameId.current = requestAnimationFrame(smoothScroll);
        }
      }
    };

    if (element) {
        currentScroll.current = element.scrollLeft;
        targetScroll.current = element.scrollLeft;
        element.addEventListener('wheel', onWheel, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('wheel', onWheel);
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  if (!project) {
    if (slug) { // Only call notFound if slug is defined but not found
        notFound();
    }
    return null; // Return null during initial render if slug is not yet available
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
      className={`h-screen w-full overflow-x-auto overflow-y-hidden whitespace-nowrap no-scrollbar transition-opacity duration-500 ${isExiting ? 'page-fade-out' : 'page-fade-in'} ${areImagesLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="inline-flex h-full items-center gap-12 px-5 md:px-16">
        {/* Fixed close button at the top right */}
        <Link
          href="/#works"
          onClick={handleClose}
          className="fixed top-8 right-8 z-10 grid cursor-pointer place-items-center group"
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
              {/* <a
                href="#"
                className="mt-8 inline-block text-base uppercase font-bold"
              >
                Open Project
              </a> */}
            </div>
          </div>
        </section>

        {/* Panels 2+: Project Images */}
        {project.images.map((src, index) => (
          <ProjectImage
            key={index}
            src={src}
            alt={`${project.title} image ${index + 1}`}
            scrollContainerRef={scrollRef}
            onImageLoad={handleImageLoad}
          />
        ))}
        
        {/* Panel: Vertical Close Button at the end */}
        <section className="h-full inline-flex items-center justify-center flex-shrink-0 px-8">
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
