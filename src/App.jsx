import { Hero } from "@/sections/Hero"
import { About } from "@/sections/About"
import { Experience } from "@/sections/Experience"
import { Projects } from "@/sections/Projects"
import { Testimonials } from "@/sections/Testimonials"
import { Contact } from "@/sections/Contact"
import { Navbar } from "@/layouts/Navbar"
import { Footer } from "@/layouts/Footer"
import { ContentManager } from "@/pages/ContentManager"

function App() {
  if (window.location.pathname === "/admin") return <ContentManager />

  return (
    <div className="overflow-x-hidden" >
      <Navbar />
      <main>
        <Hero />
        <About /> 
         <Projects />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
