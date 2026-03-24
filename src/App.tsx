import { Navbar } from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import OurStory from "./components/sections/OurStory";
import Products from "./components/sections/Products";
import Newsletter from "./components/sections/Newsletter";
import Contact from "./components/sections/Contact";

const App = () => {

  
  return (
    <div className="min-h-screen bg-(--color-plum) text-(--color-milk) overflow-x-hidden">
      <Navbar />
      <Hero />
      <OurStory />
      <Products />
      <Newsletter />
      <Contact />
    </div>
  );
};

export default App;