import { Hero } from "@/sections/Hero"
import { About } from "@/sections/About"
import { Experience } from "@/sections/Experience"
import { Projects } from "@/sections/Projects"
import { Testimonials } from "@/sections/Testimonials"
import { Contact } from "@/sections/Contact"
import { Navbar } from "@/layouts/Navbar"
import { useState } from "react"
import { Footer } from "@/layouts/Footer"

function App() {
  const [count, setCount] = useState(0)

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
