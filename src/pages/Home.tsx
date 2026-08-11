import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Lab } from '@/components/sections/Lab';
import { Work } from '@/components/sections/Work';
import { Skills } from '@/components/sections/Skills';
import { Process } from '@/components/sections/Process';
import { About } from '@/components/sections/About';
import { Agent } from '@/components/sections/Agent';
import { Contact } from '@/components/sections/Contact';
import { ChainDivider } from '@/components/ui/ChainDivider';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <ChainDivider />
      <Lab />
      <ChainDivider />
      <Work />
      <Skills />
      <ChainDivider />
      <Process />
      <About />
      <ChainDivider />
      <Agent />
      <Contact />
    </>
  );
}
