// lib/projectsData.ts

export interface Project {
  slug: string;
  title: string;
  description: string;
  details: {
    agency: string;
    job: string;
    position: string;
    stack: string;
    year: string;
  };
  images: string[]; // URLs or paths to images
}

export const projectsData: Project[] = [
  {
    slug: 'metronomics-redesign',
    title: 'Metronomics Application Redesign',
    description:
      'While a front-end developer at Metronomics, I identified a key opportunity to refresh and modernize the application’s interface. I took the initiative to independently develop a comprehensive redesign, creating high-fidelity prototypes that focused on a cleaner user experience and a more intuitive layout. My goal was to demonstrate a forward-thinking vision for the product, and I presented these concepts to the team to inspire and inform future development.',
    details: {
      agency: 'METRONOMICS',
      job: 'UI/UX DESIGN, PROTOTYPING',
      position: 'IN-HOUSE',
      stack: 'FIGMA',
      year: '2023',
    },
    images: ['/images/metronomics-1.png', '/images/metronomics-2.png', '/images/metronomics-3.png', '/images/metronomics-4.png'],
  },
  {
    slug: 'qswap',
    title: 'QSwap Marketplace App',
    description:
      'Recognizing the need for a secure and centralized marketplace for students at my university, I designed and developed the mobile app QSwap from concept to completion. I handled the entire product lifecycle, including UI/UX design, full-stack development, and implementation of a Queen\'s University email verification system. The project was a practical exercise in building a community-focused solution that promotes both affordability and sustainability on campus.',
    details: {
      agency: 'PERSONAL PROJECT',
      job: 'PRODUCT DESIGN, FULL-STACK DEVELOPMENT',
      position: 'PERSONAL',
      stack: 'REACT NATIVE, FIREBASE, TYPESCRIPT, NODE.JS',
      year: '2025',
    },
    images: ['/images/qswap-1.png', '/images/qswap-2.png', '/images/qswap-3.png', '/images/qswap-4.png', '/images/qswap-5.png', '/images/qswap-6.png', '/images/qswap-7.png'],
  },
  {
    slug: 'hottake',
    title: 'Hottake Social Polling App',
    description:
      'I created Hottake, a social app built around the engaging premise of finding the "most popular unpopular opinion." As the sole developer, I designed and implemented all core features, including a real-time voting system, a competitive weekly leaderboard, and a user profile and achievement system. The project was a focused effort to build a polished and interactive mobile experience that encourages user engagement through friendly debate.',
    details: {
      agency: 'PERSONAL PROJECT',
      job: 'UI/UX DESIGN, MOBILE DEVELOPMENT',
      position: 'PERSONAL',
      stack: 'SWIFTUI, FIREBASE, FIGMA',
      year: '2025',
    },
    images: ['/images/hottake-2.png', '/images/hottake-3.png', '/images/hottake-4.png', '/images/hottake-5.png', '/images/hottake-6.png', '/images/hottake-1.png'],
  },
  {
    slug: 'qweb-redesign',
    title: 'QWEB Website Redesign',
    description:
      'In my role as a Design Executive for the Queen\'s Web Development Club (QWEB), I led a team initiative to completely overhaul the club\'s website. Our focus was on modernizing the UI/UX and improving content strategy to create a more engaging and informative hub for aspiring student developers. This project was key to revitalizing the club\'s online presence and increasing member engagement within the Queen\'s tech community.',
    details: {
      agency: 'QUEEN\'S WEB DEVELOPMENT CLUB',
      job: 'DESIGN EXECUTIVE, UI/UX LEAD',
      position: 'VOLUNTEER LEADERSHIP',
      stack: 'FIGMA, REACT, TYPESCRIPT, CSS',
      year: '2024',
    },
    images: ['/images/qweb-1.png', '/images/qweb-2.png', '/images/qweb-3.png' , '/images/qweb-4.png'],
  },
  {
    slug: 'qgdc-redesign',
    title: 'Queen\'s Game Dev Club Website Redesign',
    description:
      'As the Design Executive for the Queen\'s Game Development Club, I spearheaded the redesign of their primary website. Collaborating with a team of designers, we aimed to create a dynamic platform to better showcase student projects, promote game jams, and attract new members. By building a modern digital storefront for the club, we significantly boosted its visibility and professional appeal on campus.',
    details: {
      agency: 'QUEEN\'S GAME DEVELOPMENT CLUB',
      job: 'DESIGN EXECUTIVE, WEB DESIGN',
      position: 'DESIGN EXECUTIVE',
      stack: 'FIGMA, WEBFLOW, JAVASCRIPT',
      year: '2023',
    },
    images: ['/images/qgdc-1.png', '/images/qgdc-2.png', '/images/qgdc-3.png', '/images/qgdc-4.png', '/images/qgdc-5.png', '/images/qgdc-6.png', '/images/qgdc-7.png', '/images/qgdc-8.png'],
  },
  {
    slug: 'mintypi',
    title: 'mintyPi Handheld Emulator',
    description:
      'This project was a deep dive into custom electronics, involving the construction of a mintyPi retro gaming console inside an Altoids tin. I managed the complete hardware assembly, a process that required precision soldering of a Raspberry Pi Zero W, a custom PCB, screen, and controls into a compact, functional device. I then configured the RetroPie emulation software, completing a build that showcases strong skills in both hardware integration and system setup.',
    details: {
      agency: 'PERSONAL PROJECT',
      job: 'HARDWARE ENGINEERING, SYSTEM INTEGRATION',
      position: 'PERSONAL',
      stack: 'RASPBERRY PI, RETROPIE, LINUX',
      year: '2020',
    },
    images: ['/images/mintypi-1.png', '/images/mintypi-2.png', '/images/mintypi-4.png', '/images/mintypi-5.png'],
  },
  {
    slug: 'caldera-keyboard',
    title: 'Caldera Custom Split Keyboard',
    description:
      'I executed the end-to-end creation of the Caldera, a fully custom, split ergonomic keyboard with Bluetooth connectivity. The project involved 3D printing the enclosure, hand-soldering every low-profile switch and electronic component, and flashing the board with open-source firmware for full customization. This build demonstrates a comprehensive ability to manage a complex hardware project from design and assembly to final firmware implementation.',
    details: {
      agency: 'PERSONAL PROJECT',
      job: 'HARDWARE DESIGN, FIRMWARE DEVELOPMENT',
      position: 'PERSONAL',
      stack: '3D PRINTING, QMK FIRMWARE, C, SOLDERING',
      year: '2024',
    },
    images: ['/images/caldera-1.png', '/images/caldera-2.png', '/images/caldera-3.png'],
  },
  {
    slug: 'rabbit-r1',
    title: 'Rabbit R1 Android Modification',
    description:
      'To explore the versatility of the Rabbit R1 AI device, I took on the challenge of converting it into a functional Android smartphone. The project required reverse-engineering the device\'s bootloader to flash a custom operating system. From there, I developed custom software drivers to successfully enable core hardware like the camera and SIM card, showcasing advanced skills in system modification and hardware-software integration.',
    details: {
      agency: 'PERSONAL PROJECT',
      job: 'REVERSE ENGINEERING, SYSTEM MODIFICATION',
      position: 'PERSONAL',
      stack: 'ANDROID (AOSP), LINUX KERNEL, ADB',
      year: '2025',
    },
    images: ['/images/rabbit-1.png'],
  },
];