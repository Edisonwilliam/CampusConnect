import CTA from "./components/Cta";
import FeaturedContent from "./components/FeaturedContent";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import WhatYouCanDo from "./components/WhatYouCanDo";
import WhyCampusConnect from "./components/WhyCampusConnect";


export default function Home() {
  return (
    <div>
      <Hero />
      <WhatYouCanDo />
      <WhyCampusConnect/>
      <FeaturedContent/>
      <HowItWorks />
      <CTA />
    </div>
  );
}
