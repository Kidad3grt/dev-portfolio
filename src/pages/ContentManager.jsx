import { useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, Save, RotateCcw } from "lucide-react";
import { authenticateContent, initialContent, loadContent, readContent, saveContent } from "@/contentStore";

const sections = {
  projects: { label: "Projects", fields: ["title", "description", "image", "tags", "link", "github"] },
  experience: { label: "Experience", fields: ["period", "role", "company", "description", "technologies", "current"] },
  testimonials: { label: "Testimonials", fields: ["quote", "author", "role", "avatar"] },
};
const title = (field) => field[0].toUpperCase() + field.slice(1);
const freshItem = (type) => Object.fromEntries(sections[type].fields.map((field) => [field, field === "tags" || field === "technologies" ? [] : field === "current" ? false : ""]));

export function ContentManager() {
  const [type, setType] = useState("projects");
  const [items, setItems] = useState(() => readContent("projects"));
  const [draft, setDraft] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);
  const [notice, setNotice] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const section = sections[type];
  const changeType = async (value) => { setType(value); setDraft(null); setNotice(""); try { setItems(await loadContent(value)); } catch (error) { setItems(initialContent[value]); setNotice(error.message); } };
  const login = async (event) => {
    event.preventDefault();
    setLoginError("");
    try { await authenticateContent(password); setItems(await loadContent(type)); setAuthenticated(true); }
    catch (error) { setLoginError(error.message); }
  };
  const save = async (event) => {
    event.preventDefault();
    const next = [...items];
    if (editIndex < 0) next.unshift(draft); else next[editIndex] = draft;
    try {
      await saveContent(type, next, password);
      setItems(next); setDraft(null); setNotice("Published. Visitors can now see this content.");
    } catch (error) { setNotice(error.message); }
  };
  const remove = async (index) => {
    const next = items.filter((_, i) => i !== index);
    try { await saveContent(type, next, password); setItems(next); setNotice("Published. Visitors can now see this content."); }
    catch (error) { setNotice(error.message); }
  };
  const reset = async () => {
    const next = initialContent[type].map((item) => ({ ...item }));
    try { await saveContent(type, next, password); setItems(next); setDraft(null); setNotice("Starter content published again."); }
    catch (error) { setNotice(error.message); }
  };

  if (!authenticated) return <main className="min-h-screen bg-background text-foreground grid place-items-center px-4"><form onSubmit={login} className="glass rounded-2xl p-7 w-full max-w-md"><p className="text-primary text-sm uppercase tracking-widest">Portfolio admin</p><h1 className="text-3xl font-bold mt-2">Sign in to manage content</h1><p className="text-sm text-muted-foreground mt-2">Use the admin password configured in your Netlify site settings.</p><label className="block mt-6 text-sm text-muted-foreground">Admin password<input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full bg-surface border border-border rounded-xl p-3 text-foreground"/></label>{loginError && <p role="alert" className="mt-3 text-sm text-red-400">{loginError}</p>}<button className="mt-5 w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 font-medium">Sign in</button></form></main>;

  return <main className="min-h-screen bg-background text-foreground px-4 py-8 md:px-8"><div className="max-w-6xl mx-auto">
    <a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft size={16}/> View portfolio</a>
    <div className="mt-8 flex flex-wrap justify-between items-end gap-4"><div><p className="text-primary text-sm uppercase tracking-widest">Portfolio admin</p><h1 className="text-4xl font-bold mt-2">Content manager</h1><p className="text-muted-foreground mt-2">Add and edit content displayed on your portfolio.</p></div><button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:border-primary text-sm"><RotateCcw size={16}/> Restore defaults</button></div>
    <div className="mt-8 flex gap-2 border-b border-border">{Object.entries(sections).map(([id, value]) => <button key={id} onClick={() => changeType(id)} className={`px-5 py-3 text-sm border-b-2 ${type === id ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>{value.label}</button>)}</div>
    <div className="mt-6 flex justify-between items-center"><h2 className="text-2xl font-semibold">{section.label}</h2><button onClick={() => { setEditIndex(-1); setDraft(freshItem(type)); }} className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5"><Plus size={18}/> Add item</button></div>
    {notice && <p role="status" className="mt-4 text-sm text-green-400">{notice}</p>}
    {draft && <form onSubmit={save} className="mt-6 glass rounded-2xl p-5 md:p-7 grid md:grid-cols-2 gap-4"><h3 className="md:col-span-2 text-xl font-semibold">{editIndex < 0 ? "Add" : "Edit"} {section.label.slice(0, -1)}</h3>
      {section.fields.map((field) => <label key={field} className={`text-sm text-muted-foreground ${["description", "quote"].includes(field) ? "md:col-span-2" : ""}`}>{title(field)}{field === "current" ? <input type="checkbox" checked={Boolean(draft[field])} onChange={(e) => setDraft({ ...draft, [field]: e.target.checked })} className="ml-3 accent-blue-500"/> : ["description", "quote"].includes(field) ? <textarea required value={draft[field] || ""} rows={3} onChange={(e) => setDraft({ ...draft, [field]: e.target.value })} className="mt-2 w-full bg-surface border border-border rounded-xl p-3 text-foreground"/> : <input required={! ["link", "github", "image", "avatar"].includes(field)} value={Array.isArray(draft[field]) ? draft[field].join(", ") : draft[field] || ""} onChange={(e) => setDraft({ ...draft, [field]: ["tags", "technologies"].includes(field) ? e.target.value.split(",").map((v) => v.trim()).filter(Boolean) : e.target.value })} placeholder={["tags", "technologies"].includes(field) ? "Separate items with commas" : ""} className="mt-2 w-full bg-surface border border-border rounded-xl p-3 text-foreground"/>}</label>)}
      <div className="md:col-span-2 flex gap-3"><button className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5"><Save size={16}/> Save</button><button type="button" onClick={() => setDraft(null)} className="rounded-xl border border-border px-4 py-2.5">Cancel</button></div>
    </form>}
    <div className="mt-5 grid md:grid-cols-2 gap-4">{items.map((item, index) => <article key={`${item.title || item.author || item.role}-${index}`} className="glass rounded-2xl p-5 flex gap-4 justify-between"><div className="min-w-0"><h3 className="font-semibold truncate">{item.title || item.author || item.role}</h3><p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description || item.quote || item.company}</p><p className="mt-3 text-xs text-muted-foreground">{item.tags?.join(", ") || item.technologies?.join(", ") || item.role}</p></div><div className="flex shrink-0 gap-2"><button aria-label="Edit item" onClick={() => { setEditIndex(index); setDraft({ ...item }); }} className="h-10 w-10 grid place-items-center rounded-lg hover:bg-primary/10 hover:text-primary"><Pencil size={16}/></button><button aria-label="Delete item" onClick={() => remove(index)} className="h-10 w-10 grid place-items-center rounded-lg hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16}/></button></div></article>)}</div>
    {!items.length && <p className="mt-8 text-center text-muted-foreground">No items yet. Use “Add item” to create one.</p>}
    <p className="mt-10 text-xs text-muted-foreground">Saved in this browser only. Other visitors and devices will keep seeing the deployed content. This admin page has no sign-in protection.</p>
  </div></main>;
}
