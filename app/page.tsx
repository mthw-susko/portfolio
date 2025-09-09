"use client";

import MarbleScene from "./components/MarbleScene";
import ShaderText from "./components/ShaderText";
import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const personalProjects = [
  { name: "METRONOMICS", category: "WEB", href: "/projects/metronomics-redesign" },
  { name: "QWEB", category: "WEB", href: "/projects/qweb-redesign" },
  { name: "QGDC", category: "WEB", href: "/projects/qgdc-redesign" },
  { name: "QSWAP", category: "IOS", href: "/projects/qswap" },
  { name: "HOTTAKE", category: "IOS", href: "/projects/hottake " },
  { name: "MINTY PI", category: "HARDWARE", href: "/projects/mintypi" },
  { name: "RABBIT R1", category: "OS", href: "/projects/rabbit-r1" },
];
const allProjects = [...personalProjects];

const getCategoryGroup = (category: string) => {
  if (['OS', 'HARDWARE'].includes(category)) return 'OS_HARDWARE';
  return category;
};

export default function Home() {
  // --- All your existing state and refs ---
  const projectColors = useMemo(() => ['#ff6b6b', '#f0e68c', '#87ceeb', '#98fb98', '#dda0dd', '#ffA500', '#ffc0cb'], []);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const socials = [{ name: "LINKEDIN", href: "https://www.linkedin.com/in/matthew-mb-susko/" }, { name: "MAIL", href: "mailto:matthew@susko.ca" }, { name: "GITHUB", href: "https://github.com/mthw-susko" }];
  const [fontSize, setFontSize] = useState(5);
  const main = useRef<HTMLDivElement>(null);
  const marbleSceneWrapper = useRef<HTMLDivElement>(null);
  const worksSectionRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const marbleSceneContainerRef = useRef<HTMLDivElement>(null);
  
  // NEW: State to control when the page fades in and out
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  // NEW: Effect to trigger the fade-in after the component has mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); 

    return () => clearTimeout(timer);
  }, []);

  // NEW: Click handler for fade-out navigation
  const handleLinkClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
        router.push(href);
    }, 700); // Match transition duration
  };


  // --- All your existing useLayoutEffect and useEffect hooks ---
  useLayoutEffect(() => {
    if (!main.current || !marbleSceneWrapper.current || !worksSectionRef.current || !marbleSceneContainerRef.current || !aboutSectionRef.current) {
      return;
    }
    const targetContainer = marbleSceneContainerRef.current;
    const aboutSection = aboutSectionRef.current;
    
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add({
        isMobile: "(max-width: 767px)",
        isDesktop: "(min-width: 768px)"
      }, (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };

        if (isDesktop) {
          const finalWidth = targetContainer.offsetWidth;
          const finalX = targetContainer.offsetLeft - (window.innerWidth - finalWidth) / 2;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: worksSectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 2,
              pin: marbleSceneWrapper.current,
              pinSpacing: false,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(marbleSceneWrapper.current, { x: 0, y: 0, scale: 1 }, { x: finalX, y: 0, scale: 1, ease: "power1.inOut" });
        }
        
        // This timeline will be active for all screen sizes
        const tl2 = gsap.timeline({
          scrollTrigger: {
              trigger: aboutSection,
              start: "top bottom",
              end: "top top",
              scrub: 2,
          },
        });
        tl2.to(marbleSceneWrapper.current, { x: 0, y: 0, scale: 1, autoAlpha: 0, ease: "power1.inOut" });
      });
    }, main);
    
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { setFontSize(2); } 
      else if (window.innerWidth < 1024) { setFontSize(3); } 
      else { setFontSize(4); }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <main 
        ref={main} 
        className={`flex flex-col items-center min-h-screen py-24 px-4 pointer-events-none transition-opacity duration-700 ease-in ${isLoaded && !isExiting ? 'opacity-100' : 'opacity-0'}`}
      >
        <section className="text-center mt-36 min-w-screen]">
          <div className="min-w-96">
            <ShaderText fontSize={fontSize} height={"50vh"} lineHeight={0.8}>
              {`Matthew\nSusko`}
            </ShaderText>
            <p className="font-helvetica text-base uppercase lg:max-w-2/3 sm:min-w-1 mx-auto">
              A Canada-based computer scientist specializing in all things user
              experience, design, and interaction
            </p>
          </div>
        </section>
        
        <div ref={marbleSceneWrapper} className="fixed top-0 left-0 w-full h-full z-[-1]">
          <MarbleScene
            hoveredIndex={hoveredIndex}
            hoverColor={hoveredIndex !== -1 ? projectColors[hoveredIndex] : null}
          />
        </div>

        <section ref={worksSectionRef} id="works" className="lg:pt-[150px] w-full flex justify-center items-center gap-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 relative z-10 bg-transparent">
          <div className="md:w-1/2 lg:w-5/6">
            <div className="max-w-64 w-full">
              <ShaderText fontSize={1} height={"15vh"} lineHeight={1} textAlign="left">
                {`SELECTED\nWORKS`}
              </ShaderText>
            </div>
            <div>
              <div className="flex flex-col">
                {allProjects.map((project, index) => {
                  const currentGroup = getCategoryGroup(project.category);
                  const prevGroup = index > 0 ? getCategoryGroup(allProjects[index - 1].category) : null;
                  const addMargin = prevGroup && currentGroup !== prevGroup;

                  return (
                    <React.Fragment key={project.name}>
                      <a
                        href={project.href}
                        onClick={handleLinkClick(project.href)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(-1)}
                        className={`flex w-fit text-lg uppercase hover:opacity-75 transition-opacity pointer-events-auto ${addMargin ? 'mt-4' : ''}`}>
                        <span>{project.name}&nbsp;</span>
                        <span className="text-gray-400">{"// " + project.category}</span>
                      </a>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
          <div ref={marbleSceneContainerRef} id="marble-scene-container" className="w-1/2 h-[700px]">
          </div>
        </section>

        <section ref={aboutSectionRef} className="lg:mt-[800px] w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 text-center">
            <div className="w-full">
              <ShaderText fontSize={(fontSize-1.2)} height={"40vh"} lineHeight={1} textAlign="left">
                {"MORE ABOUT ME"}
              </ShaderText>
            </div>
          <p className=" text-base uppercase leading-relaxed text-left md:max-w-full lg:max-w-3/4 mx-auto mt-[-60px]">
            I&apos;m a final-year Computer Science student at Queen&apos;s University, specializing in Software Design. My passion lies at the intersection of creativity and utility—specifically in UI/UX design, where I can apply my <strong>lifelong love of drawing</strong> to build software that <strong>genuinely improves people&apos;s lives</strong>.
            <br/><br/>
            Originally from Whistler, BC, my background is also shaped by a decade as a competitive national gymnast. The <strong>discipline, precision, and iterative process</strong> required to perfect a routine are the same principles I now bring to designing <strong>intuitive and elegant user experiences</strong>. I thrive on <strong>creating, experimenting, and ultimately, empowering users</strong>.
            <br/><br/>
            I am <strong>always looking for new opportunities</strong> to collaborate on exciting projects. If you&apos;d like to get in touch, please feel free to send me an email at <a href="mailto:matthew@susko.ca" className="underline pointer-events-auto">matthew@susko.ca</a>.
          </p>
        </section>

        <section className="mt-48 w-full">
          <h2 className="text-sm tracking-widest uppercase text-center">Socials</h2>
          <div className="flex justify-center items-center gap-12 mt-8">
            {socials.map((social) => (
              <a
                href={social.href}
                key={social.name}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm tracking-widest uppercase hover:opacity-75 transition-opacity pointer-events-auto"
              >
                {social.name}
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
