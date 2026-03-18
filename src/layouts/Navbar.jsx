import { Button } from "@/components/Button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Testimonials", href: "#testimonials" },
]


export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // This should be managed with state in a real implementation
    const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
    return (
        <header className={`fixed top-0 left-0 w-full transition-all duration-500 ${isScrolled ? "glass-strong py-3" : "bg-transparent py-5"} z-50`}>
        <nav className="container mx-auto px-6 flex items-center justify-between" >
        <a href="#" className="text-2xl font-bold tracking-tight hover:text-primary">
            KD<span className="text-primary">DEV</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
            <div className="glass rounded-full flex items-center gap-1">
               {navLinks.map((link) => (
                    <a key={link.name} href={link.href} className="px-6 py-2 text-sm text-muted-foreground hover:text-foreground rounded-full hover:bg-surface">
                        {link.name}
                    </a>
                ))}
            </div>
        </div>

        {/* Contact Button for Desktop */}

        <div className="hidden md:block">
            <a href="#contact">
                <Button size="sm">Contact me</Button>
            </a>
        </div>
        
        {/* Mobile Menu Button */}

        <div className="md:hidden p-2 text-foreground cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu />
        </div>

         </nav> 

        {/* Mobile Menu (hidden by default, can be toggled with state) */}
       {isMobileMenuOpen && (
            <div className="md:hidden glass-strong animate-fade-in">
                <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
                  {navLinks.map((link) => (
                        <a key={link.name} 
                        href={link.href} 
                        className="text-lg text-muted-foreground hover:text-foreground py-2"
                        onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
                        >
                            {link.name}
                        </a>
                ))} 

                 <a
                    href="#contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    >
                    <Button className="w-full">
                        Contact me
                    </Button>
                </a> 
            </div>

        </div>
       )}
        </header>
        
    )
}