import { useEffect, useState } from "react";

export const initialContent = {
  projects: [
    { title: "Fintech Dashboard", description: "A comprehensive financial analytics platform with data visualization.", image: "/dashboard.png", tags: ["React", "Typescript", "NodeJS"], link: "#", github: "#" },
    { title: "E-Commerce Platform", description: "A full-featured e-commerce solution with real-time cart management, payment processing, and analytics dashboard.", image: "/Ecommerce.png", tags: ["django", "paypal", "SQLite", "Bootstrap/Css"], link: "#", github: "#" },
    { title: "NoteApp", description: "A simple and efficient note-taking application with real-time synchronization.", image: "/Notes-project.png", tags: ["React", "django", "Python", "rest framework API"], link: "#", github: "#" },
    { title: "Movie ticket booking web application", description: "A web application for booking movie tickets with real-time availability updates and secure payment processing.", image: "/Movie-app.png", tags: ["django", "REST framework API", "SQLite", "python"], link: "#", github: "#" },
  ],
  experience: [
    { period: "2022 — Present", role: "Freelancer developer/Data analyst", company: "Self-Employed", description: "Delivered custom web solutions for small businesses and startups. Built 15+ websites and visualizations, handling everything from design to deployment.", technologies: ["React", "Python", "Node.js", "Django", "Power BI", "Excel", "PostgreSQL"], current: true },
    { period: "2020 — 2022", role: "Data Analyst", company: "Self-Employed", description: "Built and maintained multiple data pipelines and dashboards for clients across various industries. Analyzed large datasets to extract actionable insights and presented findings to stakeholders.", technologies: ["Excel", "Power BI", "PostgreSQL", "Python"], current: false },
  ],
  testimonials: [
    { quote: "Pedro is one of the most talented engineers I've worked with. His attention to detail and ability to translate complex requirements into elegant solutions is remarkable.", author: "Sarah Chen", role: "CTO, Tech Innovators Inc.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    { quote: "Working with Pedro was a game-changer for our project. He delivered ahead of schedule with code quality that set a new standard for our team.", author: "Michael Rodriguez", role: "Product Manager, Digital Solutions", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    { quote: "Pedro's expertise in React and TypeScript helped us rebuild our entire frontend in record time. His architectural decisions continue to pay dividends.", author: "Emily Watson", role: "Engineering Lead, StartUp Labs", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
    { quote: "Not only is Pedro technically brilliant, but he's also a fantastic communicator and team player. He elevated everyone around him.", author: "David Kim", role: "CEO, Innovation Hub", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  ],
};

export function readContent(type) {
  return initialContent[type];
}

export async function loadContent(type) {
  const response = await fetch(`/api/content?type=${encodeURIComponent(type)}`, { cache: "no-store" });
  if (response.status === 404) return initialContent[type];
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !Array.isArray(data.items)) throw new Error(data.error || "Could not load published content.");
  return data.items;
}

export async function saveContent(type, items, password, reset = false) {
  const response = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, items, password, reset }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Could not publish the content.");
  window.dispatchEvent(new Event("portfolio-content-updated"));
}

export async function authenticateContent(password) {
  const response = await fetch("/api/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "auth", password }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "The password was not accepted.");
}

export function useContent(type) {
  const [items, setItems] = useState(() => readContent(type));
  useEffect(() => {
    let active = true;
    const update = async () => {
      try {
        const content = await loadContent(type);
        if (active) setItems(content);
      } catch {
        // Keep the bundled starter content if the live content service is unavailable.
      }
    };
    update();
    window.addEventListener("portfolio-content-updated", update);
    return () => {
      active = false;
      window.removeEventListener("portfolio-content-updated", update);
    };
  }, [type]);
  return items;
}
