import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import profileImage from '../assests/profile.jpg';
// Starfield (3D background) removed per user request

type Project = {
  title: string;
  category: string;
  images: string[];
};

type Service = {
  number: string;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    number: '01',
    title: 'Custom Website Development',
    description:
      'Modern, responsive websites tailored to your business needs.',
  },
  {
    number: '02',
    title: 'UI/UX Design',
    description:
      'Beautiful, user-friendly interfaces that enhance customer experience.',
  },
  {
    number: '03',
    title: 'E-Commerce Solutions',
    description:
      'Online stores with secure payments, product management, and order tracking.',
  },
  {
    number: '04',
    title: 'Website Optimization & SEO',
    description:
      'Faster loading speeds, mobile optimization, and search engine visibility.',
  },
  {
    number: '05',
    title: 'Maintenance & Support',
    description:
      'Ongoing updates, security, backups, bug fixes, and technical support.',
  },
];

const projects: Project[] = [
  {
    title: 'AKSA Fitness Studio',
    category: 'Client',
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
      'https://ih1.redbubble.net/image.609629961.7905/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.u1.jpg',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Tuition Center Website',
    category: 'Client',
    images: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
      'https://ih1.redbubble.net/image.609629961.7905/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.u1.jpg',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Personal Portfolio',
    category: 'Personal',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'E-Commerce Store',
    category: 'Client',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'Healthcare Clinic Website',
    category: 'Client',
    images: [
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1200&q=80',
      'https://ih1.redbubble.net/image.609629961.7905/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.u1.jpg',
      'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    title: 'NextGen Devs Agency Website',
    category: 'Personal',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

const marqueeImages = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];



const LiveProjectButton = () => (
  <button className="rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-[0.35em] text-[#D7E2EA] transition hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base">
    Live Project
  </button>
);

const FadeIn = ({ children, delay = 0, duration = 0.7, x = 0, y = 30 }: { children: ReactNode; delay?: number; duration?: number; x?: number; y?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration, ease: [0.25, 0.1, 0.25, 1], delay }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
};

const Magnet = ({ children, padding = 150, strength = 3 }: { children: ReactNode; padding?: number; strength?: number }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const inside = Math.abs(deltaX) <= padding && Math.abs(deltaY) <= padding;
    if (inside) {
      setPosition({ x: deltaX / strength, y: deltaY / strength });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      style={{ willChange: 'transform', transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      className="transition-[transform] duration-300 ease-out"
    >
      {children}
    </div>
  );
};

const DeveloperCenterpiece = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
      transition={{ duration: 1.2, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto flex w-[min(82vw,420px)] items-center justify-center"
    >
      <div className="hero-centerpiece absolute inset-0 rounded-full blur-3xl" />
      <div className="relative flex h-[280px] w-[280px] items-center justify-center overflow-hidden rounded-full border border-white/20 bg-[radial-gradient(circle_at_top_left,rgba(182,0,168,0.25),rgba(255,255,255,0.04)_45%,rgba(255,255,255,0.02)_100%)] shadow-[0_25px_90px_rgba(96,13,142,0.28)] backdrop-blur-xl sm:h-[320px] sm:w-[320px] md:h-[360px] md:w-[360px]">
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <div className="absolute inset-10 rounded-full border border-white/10" />
        <img src={profileImage} alt="Garapati Manohar" className="h-full w-full object-cover" />
      </div>
    </motion.div>
  );
};

const AnimatedText = ({ text }: { text: string }) => {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const chars = useMemo(() => text.split(''), [text]);

  return (
    <p ref={ref} className="mx-auto max-w-[560px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-[#D7E2EA]">
      {chars.map((char, index) => (
        <motion.span key={`${char}-${index}`} style={{ opacity }} className="inline-block">
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </p>
  );
};

const ProjectCard = ({ project, index, scrollY }: { project: Project; index: number; scrollY: any }) => {
  const targetScale = 1 - (projects.length - 1 - index) * 0.03;
  const cardScale = useTransform(scrollY, [0, 1500], [1, targetScale]);

  return (
    <motion.div style={{ scale: cardScale, top: `${index * 28}px` }} className="sticky top-24 h-[85vh] overflow-hidden rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:top-32 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <p className="text-[clamp(3rem,10vw,140px)] font-black leading-none text-[#D7E2EA]">0{index + 1}</p>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#D7E2EA]/70">{project.category}</p>
            <h3 className="mt-2 text-[clamp(1.3rem,3vw,2.2rem)] font-medium uppercase">{project.title}</h3>
          </div>
        </div>
        <LiveProjectButton />
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row">
        <div className="flex w-full flex-col gap-4 md:w-[40%]">
          <img src={project.images[0]} alt={`${project.title} preview 1`} className="h-[clamp(130px,16vw,230px)] w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]" />
          <img src={project.images[1]} alt={`${project.title} preview 2`} className="h-[clamp(160px,22vw,340px)] w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]" />
        </div>
        <div className="w-full md:w-[60%]">
          <img src={project.images[2]} alt={`${project.title} preview 3`} className="h-full min-h-[320px] w-full rounded-[40px] object-cover sm:rounded-[50px] md:rounded-[60px]" />
        </div>
      </div>
    </motion.div>
  );
};

const App = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300, 600], [1, 0.7, 0]);

  useEffect(() => {
    let frameId: number | null = null;
    let targetX = -100;
    let targetY = -100;

    const updateCursor = () => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      cursorRef.current.style.opacity = '1';
      frameId = null;
    };

    const handlePointerMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (frameId === null) {
        frameId = requestAnimationFrame(updateCursor);
      }
    };

    const handlePointerLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseout', handlePointerLeave);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseout', handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!marqueeRef.current) return;
      const rect = marqueeRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setScrollOffset(offset);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#0C0C0C] text-[#D7E2EA]">
      <div ref={cursorRef} className="custom-cursor hidden sm:block" />
      <main className="bg-[#0C0C0C]">
        <motion.section ref={heroRef} id="hero" style={{ opacity: heroOpacity }} className="relative flex h-screen flex-col overflow-x-clip">
          <div className="hero-bg-wave absolute inset-0 -z-10" />
          <nav className="flex justify-between px-4 pt-4 text-xs font-medium uppercase tracking-[0.2em] text-[#D7E2EA] sm:px-6 sm:pt-6 sm:text-sm md:px-10 md:pt-8 md:text-lg md:tracking-[0.3em] lg:text-[1.4rem]">
            {['About', 'Services', 'Projects', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.6 }}
                className="transition-opacity duration-200 hover:opacity-70"
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="mt-10 overflow-hidden sm:mt-12 md:mt-16 lg:mt-20">
            <h1 className="hero-title max-w-[720px] text-[clamp(1.8rem,7vw,6.5rem)] leading-[0.95] text-left ml-4 sm:ml-6 sm:text-[clamp(3rem,10vw,8rem)] md:ml-10">
              Hi I am
            </h1>
            <h2 className="hero-name-small max-w-[720px] text-[clamp(1.2rem,4.2vw,3.4rem)] mt-2 ml-4 sm:ml-6 sm:text-[clamp(2rem,5.8vw,4rem)] md:ml-10">Garapati Manohar</h2>
          </motion.div>

          <div className="mt-auto flex items-end justify-between px-6 pb-7 sm:px-8 sm:pb-8 md:px-10 md:pb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }} className="max-w-[220px] sm:max-w-[280px] md:max-w-[320px]">
              <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-[#8C99A6] sm:text-[0.7rem]">
                <a href="https://nextgendevs.kadaliadithya123.workers.dev/" target="_blank" rel="noopener noreferrer" className="underline decoration-[#B600A8]/40 hover:text-white transition-colors">
                  NextGen Devs
                </a>
                <span className="ml-2">• Full Stack Web Developer</span>
              </p>
              <p className="text-[clamp(0.78rem,1.4vw,1.35rem)] font-light uppercase leading-snug tracking-[0.2em] text-[#D7E2EA]">
                I build premium software and modern websites.
              </p>
            </motion.div>
            
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex justify-center sm:absolute sm:left-1/2 sm:top-1/2 z-10 sm:z-10 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:top-auto sm:bottom-0 sm:translate-y-0 sm:translate-x-[-50%]">
            <Magnet padding={150} strength={3}>
              <DeveloperCenterpiece />
            </Magnet>
          </motion.div>
        </motion.section>

        <section ref={marqueeRef} id="projects" className="bg-[#0C0C0C] pt-24 pb-10 sm:pt-32 md:pt-40">
          <div className="space-y-3">
            <div className="flex gap-3 overflow-hidden" style={{ transform: `translateX(${scrollOffset - 200}px)` }}>
              {[...marqueeImages.slice(0, 11), ...marqueeImages.slice(0, 11), ...marqueeImages.slice(0, 11)].map((src, index) => (
                <img key={`row1-${index}`} src={src} alt="Project preview" loading="lazy" className="h-[270px] w-[420px] rounded-2xl object-cover will-change-transform" />
              ))}
            </div>
            <div className="flex gap-3 overflow-hidden" style={{ transform: `translateX(${-scrollOffset + 200}px)` }}>
              {[...marqueeImages.slice(11), ...marqueeImages.slice(11), ...marqueeImages.slice(11)].map((src, index) => (
                <img key={`row2-${index}`} src={src} alt="Project preview" loading="lazy" className="h-[270px] w-[420px] rounded-2xl object-cover will-change-transform" />
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="relative min-h-screen px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28">
          <FadeIn delay={0.1} duration={0.9} x={-80} y={0}>
            <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" alt="moon" className="absolute left-[1%] top-[4%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]" />
          </FadeIn>
          <FadeIn delay={0.25} duration={0.9} x={-80} y={0}>
            <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" alt="3d object" className="absolute bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]" />
          </FadeIn>
          <FadeIn delay={0.15} duration={0.9} x={80} y={0}>
            <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" alt="lego" className="absolute right-[1%] top-[4%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]" />
          </FadeIn>
          <FadeIn delay={0.3} duration={0.9} x={80} y={0}>
            <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" alt="3d group" className="absolute bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]" />
          </FadeIn>

          <div className="flex min-h-[80vh] flex-col items-center justify-center gap-10 text-center sm:gap-14 md:gap-16">
            <FadeIn delay={0} duration={0.8} y={40}>
              <h2 className="hero-heading text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-[-0.06em]">About me</h2>
            </FadeIn>
            <AnimatedText text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!" />
            
          </div>
        </section>

        <section id="services" className="relative min-h-screen px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28 bg-[#0C0C0C] text-[#D7E2EA]">
          <h2 className="hero-heading mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-[-0.06em] sm:mb-20 md:mb-28">Services</h2>
          <div className="mx-auto flex max-w-5xl flex-col space-y-6">
            {services.map((service, index) => (
              <FadeIn key={service.title} delay={index * 0.1} duration={0.7} y={20}>
                <div className="flex flex-col rounded-[28px] border border-white/6 bg-gradient-to-tr from-[#07101a]/60 via-[#0B0B10]/30 to-[#0C0C0C]/30 p-6 sm:p-8 md:flex-row md:items-start md:py-6">
                  <div className="mb-4 md:mb-0 md:w-40 flex items-start">
                    <p className="text-[clamp(3rem,10vw,140px)] font-black leading-none text-[#D7E2EA]">{service.number}</p>
                  </div>
                  <div className="md:ml-8 md:flex-1">
                    <h3 className="text-[clamp(1rem,2.2vw,2.1rem)] font-medium uppercase text-white">{service.title}</h3>
                    <p className="mt-3 max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] font-light leading-relaxed text-[#D7E2EA]/80">{service.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:py-28">
          <h2 className="hero-heading text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-[-0.06em]">Project</h2>
          <div ref={projectsRef} className="mx-auto mt-12 flex max-w-6xl flex-col gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} scrollY={scrollY} />
            ))}
          </div>
        </section>

        <section id="contact" className="border-t border-white/10 bg-[#050505] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }} className="mx-auto flex max-w-5xl flex-col items-center rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] px-6 py-12 text-center shadow-[0_20px_90px_rgba(96,13,142,0.18)] sm:px-10 sm:py-16 md:px-14 md:py-20">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.4em] text-[#8C99A6]">Let&apos;s build something premium</p>
            <h2 className="mt-4 text-[clamp(2rem,6vw,3.6rem)] font-black uppercase leading-[0.95] tracking-[-0.05em] text-[#F5F7FA]">Ready to launch your next idea?</h2>
            <p className="mt-5 max-w-2xl text-[clamp(0.95rem,1.5vw,1.2rem)] font-light leading-relaxed text-[#D7E2EA]/70">
              I create polished websites and software experiences with a luxury feel, clear strategy, and clean execution.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="https://wa.me/918897643625?text=Hello%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener noreferrer" className="rounded-full border border-transparent px-8 py-3 text-sm font-medium uppercase tracking-[0.35em] text-white transition hover:opacity-90" style={{ background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)' }}>
                Say Hello
              </a>
              <a href="#hero" className="rounded-full border border-white/15 px-8 py-3 text-sm font-medium uppercase tracking-[0.35em] text-[#D7E2EA] transition hover:bg-white/5">
                Back to Top
              </a>
            </div>
          </motion.div>
        </section>

        <footer className="mt-12">
          <div className="py-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-6">
              <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-[#9CA3AF] hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.5A4.5 4.5 0 1016.5 13 4.5 4.5 0 0012 8.5zm4.8-3.9a1.2 1.2 0 11-1.2-1.2 1.2 1.2 0 011.2 1.2z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-[#9CA3AF] hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.5 3.3-3.5.96 0 1.96.17 1.96.17v2.1h-1.08c-1.07 0-1.4.67-1.4 1.36V12h2.38l-.38 2.9h-2v7A10 10 0 0022 12z" />
                </svg>
              </a>
              <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-[#9CA3AF] hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .5C5.7.5.6 5.6.6 11.9c0 5 3.3 9.2 7.9 10.7.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.3-3.9-1.3-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.6.7 2 1.1.1-.8.4-1.4.7-1.8-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.4 0 0 1-.3 3.4 1.2a11.8 11.8 0 016.2 0c2.4-1.6 3.4-1.2 3.4-1.2.6 1.8.2 3.1.1 3.4.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.7 7.9-10.7C23.4 5.6 18.3.5 12 .5z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/garapati-manohar-3780173b2?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-[#9CA3AF] hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4h4v16H4zM6 2a2 2 0 110 4 2 2 0 010-4zM10 8h4v2h.1c.6-1.2 2-2.5 4.2-2.5C22 7.5 22 12 22 16v4h-4v-4c0-1.5 0-3.5-2.2-3.5-2.3 0-2.6 1.7-2.6 3.4V20h-4z" />
                </svg>
              </a>
            </div>
            <p className="text-sm text-[#9CA3AF]">Made with <span aria-hidden>❤️</span></p>
            <p className="text-sm text-[#9CA3AF]">© 2026 NextGen Devs. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
