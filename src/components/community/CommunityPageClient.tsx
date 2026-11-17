"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, Filter, Heart, ImagePlus, MessageCircle, Send, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Topic = "All discussions" | "Signals" | "Education" | "Market discussion" | "Platform help";

const announcements = [
  "Scanner update: two new exit conditions are live",
  "Community guidelines updated",
  "New feature launch: Dark mode",
  "Bug fixes and performance improvements",
];

const discussions = [
  ["Scanner update: two new exit conditions are live", "Signals", "34 Comments"],
  ["Bug fix: resolved issues with user notifications", "Fixes", "12 Comments"],
  ["Performance report: increased efficiency by 25%", "Reports", "10 Comments"],
  ["Feature launch: improved speed optimization available", "Updates", "20 Comments"],
  ["Maintenance notice: scheduled downtime this weekend", "Alerts", "15 Comments"],
  ["Scanner update: two new exit conditions are live", "Signals", "34 Comments"],
  ["User feedback: new interface receives positive reviews", "Reviews", "8 Comments"],
];

const starterPosts = [
  { id: 1, name: "Marcus D.", initial: "M", topic: "Signals", time: "2h ago", title: "How are people sizing the NVDA setup relative to their stop?", body: "The stop is 2% away which is tighter than most of the signals I’ve taken this quarter. Curious whether people size to a fixed dollar risk or a fixed position size. I’ve been doing fixed dollar risk for about six months and it has changed how the losing trades feel more than how the winners pay.", likes: 19, comments: 19, image: "/images/community/figma-01.png" },
  { id: 2, name: "Samantha L.", initial: "S", topic: "Market Trends", time: "1h ago", title: "Has anyone noticed the recent volatility in tech stocks?", body: "It’s been quite a ride lately, with some stocks jumping while others are falling. I wonder if this is a temporary phase or a sign of a bigger market shift. Are traders adjusting their strategies in response to this?", likes: 15, comments: 15 },
  { id: 3, name: "Alex T.", initial: "A", topic: "Options Strategies", time: "30m ago", title: "What are the best strategies for trading options in this market?", body: "Given the current market dynamics, I’m curious about strategies that have worked well for others. Should we focus on spreads or straddles? Any insights on risk management would also be appreciated!", likes: 22, comments: 22, image: "/images/community/figma-15.jpg" },
];

export default function CommunityPageClient() {
  const [topic, setTopic] = useState<Topic>("All discussions");
  const [sort, setSort] = useState("Trending");
  const [posts, setPosts] = useState(starterPosts);
  const [open, setOpen] = useState(false);
  const visiblePosts = useMemo(() => topic === "All discussions" ? posts : posts.filter((post) => post.topic === topic), [posts, topic]);

  function addPost(post: { topic: string; title: string; body: string; image?: string }) {
    setPosts((current) => [{ id: Date.now(), name: "Peter", initial: "P", topic: post.topic, time: "Just now", title: post.title, body: post.body, image: post.image, likes: 0, comments: 0 }, ...current]);
    setOpen(false);
  }

  return <div className="space-y-4 pb-8 font-raleway">
    <div><h2 className="text-base font-bold text-[#F1F4F3]">Community</h2><p className="mt-2 text-[10px] text-[#A2ABA8]">512 securities screened continuously — 502 S&amp;P 500 constituents and 10 liquid ETFs</p></div>
    <section className="grid gap-4 xl:grid-cols-[254px_minmax(0,1fr)_320px]">
      <aside className="space-y-4 xl:row-span-2">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-1"><Metric title="Total Members" value="1,240" /><Metric title="Your total Post" value="47" /><Metric title="Total Likes" value="1.2k" extra="hidden xl:flex" /></div>
        <div className="rounded-lg border border-[#293033] bg-[#0C0F10] p-3">
          <div className="flex items-center justify-between border-b border-[#1B2227] pb-4"><span className="flex items-center gap-2 text-sm font-semibold"><Filter className="h-4 w-4" /> Filters</span><button className="text-[10px] text-[#718090]">Reset</button></div>
          <FilterGroup label="TOPICS:" values={["All discussions", "Signals", "Education", "Market discussion", "Platform help"]} selected={topic} onClick={(item) => setTopic(item as Topic)} />
          <FilterGroup label="SORT:" values={["Trending", "Newest", "Most replies"]} selected={sort} onClick={setSort} />
          <button className="gold-gradient-btn mt-5 w-full rounded-md py-2.5 text-xs">Apply filter</button>
        </div>
      </aside>

      <section className="rounded-lg border border-[#293033] bg-[#0C0F10] p-3 sm:p-4">
        <div className="mb-5 flex items-center justify-between"><h3 className="text-xl font-semibold">Feed</h3><div className="text-right"><button onClick={() => setOpen(true)} className="gold-gradient-btn rounded-lg px-6 py-2.5 text-xs">Add New Post</button><button className="mt-2 block w-full text-right text-[11px] text-[#D7A43A]">Refresh</button></div></div>
        <div className="space-y-3">{visiblePosts.length ? visiblePosts.map((post) => <Post key={post.id} post={post} />) : <div className="py-16 text-center text-sm text-[#718090]">No discussions in this topic yet.</div>}</div>
      </section>

      <aside className="space-y-3">
        <Panel title="Announcements">{announcements.map((item) => <div key={item} className="rounded-md bg-[#121719] px-2 py-1.5"><div className="text-xs font-semibold text-[#F1F4F3]">{item}</div><div className="mt-1 flex items-center justify-between text-[9px] text-[#A2ABA8]"><span>5h ago</span><Trash2 className="h-3 w-3 text-[#EF4444]" /></div></div>)}</Panel>
        <Panel title="Trending discussions">{discussions.map(([name, category, count], index) => <div key={`${name}-${index}`} className="py-1.5"><div className="text-xs font-semibold text-[#F1F4F3]">{name}</div><div className="mt-1 flex gap-3 text-[9px] text-[#A2ABA8]"><span>{category}</span><span>·</span><span>{count}</span></div></div>)}</Panel>
      </aside>
    </section>
    <NewPostDialog open={open} onOpenChange={setOpen} onPublish={addPost} />
  </div>;
}

function Metric({ title, value, extra = "" }: { title: string; value: string; extra?: string }) { return <article className={cn("rounded-lg border border-[#D7A43A]/70 bg-[radial-gradient(circle_at_15%_0%,rgba(175,104,32,.25),transparent_58%),#121719] p-3", extra)}><p className="text-[10px] font-medium text-[#F1F4F3]">{title}</p><strong className="mt-1 block text-base font-bold">{value}</strong></article>; }
function FilterGroup({ label, values, selected, onClick }: { label: string; values: string[]; selected: string; onClick: (value: string) => void }) { return <div className="border-b border-[#1B2227] py-3"><p className="mb-2 text-[8px] text-[#718090]">{label}</p><div className="flex flex-wrap gap-1.5">{values.map((item) => <button key={item} onClick={() => onClick(item)} className={cn("rounded-md border px-2 py-1 text-[10px]", selected === item ? "border-[#D7A43A] bg-[#A48226]/20 text-[#E7C042]" : "border-[#293033] bg-[#171D1F] text-[#A2ABA8]")}>{item}</button>)}</div></div>; }
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-lg border border-[#293033] bg-[#0C0F10] p-3"><h3 className="mb-3 text-lg font-semibold">{title}</h3><div className="space-y-3">{children}</div></section>; }
function Post({ post }: { post: typeof starterPosts[number] }) { return <article className="rounded-lg bg-[#121719] p-3"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#D7A43A] to-[#574014] text-xs font-bold text-black">{post.initial}</div><div><div className="text-xs font-semibold">{post.name} <span className="ml-1 text-[9px] font-normal text-[#A2ABA8]">{post.topic}　·　{post.time}</span></div></div></div><button className="rounded-full bg-white p-1 text-[#EF4444]"><Trash2 className="h-3 w-3" /></button></div><div className={cn("mt-3", post.image && "grid gap-3 md:grid-cols-[1fr_135px]")}><div><h4 className="text-xs font-semibold text-[#F1F4F3]">{post.title}</h4><p className="mt-3 text-[10px] leading-[1.45] text-[#A2ABA8]">{post.body}</p></div>{post.image && <img src={post.image} alt="Post attachment" className="h-24 w-full rounded-md object-cover md:h-full" />}</div><div className="mt-3 flex gap-3 text-[9px] text-[#A2ABA8]"><span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {post.comments}</span><span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post.likes}</span><span className="flex items-center gap-1"><Send className="h-3 w-3" /> Report</span></div></article>; }

function NewPostDialog({ open, onOpenChange, onPublish }: { open: boolean; onOpenChange: (value: boolean) => void; onPublish: (post: { topic: string; title: string; body: string; image?: string }) => void }) {
  const [topic, setTopic] = useState("Signals"); const [topicOpen, setTopicOpen] = useState(false); const [title, setTitle] = useState(""); const [body, setBody] = useState(""); const [image, setImage] = useState<string | null>(null); const [uploadError, setUploadError] = useState(""); const inputRef = useRef<HTMLInputElement>(null); const postTopics = ["Signals", "Market discussion", "Platform help", "Education", "Announcements"];
  const readFile = (file?: File) => { if (!file) return; if (!file.type.startsWith("image/")) { setUploadError("Please choose an image file."); return; } if (file.size > 5 * 1024 * 1024) { setUploadError("Image must be 5 MB or smaller."); return; } const reader = new FileReader(); reader.onload = () => { setImage(String(reader.result)); setUploadError(""); }; reader.readAsDataURL(file); };
  function close() { setTopicOpen(false); onOpenChange(false); }
  function publish() { if (!title.trim() || !body.trim()) return; onPublish({ topic, title: title.trim(), body: body.trim(), image: image || undefined }); setTitle(""); setBody(""); setImage(null); }
  return <Dialog open={open} onOpenChange={(value) => { setTopicOpen(false); onOpenChange(value); }}><DialogContent showCloseButton={false} className="max-h-[94vh] max-w-[390px] gap-0 overflow-y-auto rounded-xl border-[#293033] bg-[#121719] p-4 text-white shadow-2xl sm:p-4"><div className="mb-5 flex items-center justify-between"><DialogTitle className="text-lg font-bold">New Post</DialogTitle><button onClick={close} className="flex h-7 w-7 items-center justify-center rounded-md border border-[#293033] text-[#A2ABA8] hover:border-[#A2ABA8] hover:text-white"><X className="h-3.5 w-3.5" /></button></div><div className="space-y-3"><Field label="Topic"><div><button type="button" onClick={() => setTopicOpen((current) => !current)} className="flex h-9 w-full items-center justify-between rounded-lg border border-[#293033] bg-[#121719] px-2 text-left text-xs font-semibold hover:border-[#697370]"><span>{topic}</span><ChevronDown className={cn("h-4 w-4 transition-transform", topicOpen && "rotate-180")} /></button>{topicOpen && <div className="mt-2 flex w-36 flex-col gap-2">{postTopics.map((item) => <button key={item} type="button" onClick={() => { setTopic(item); setTopicOpen(false); }} className={cn("min-h-9 w-full rounded-md border bg-[#18181B] px-3 py-2 text-center text-sm font-medium leading-4 transition-colors", item === topic ? "border-[#FB923C] text-[#FB923C]" : "border-[#27272A] text-[#D6D3D1] hover:border-[#52525B]")}>{item}</button>)}</div>}</div></Field><Field label="Title"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="title" className="h-9 w-full rounded-lg border border-[#293033] bg-[#121719] px-2 text-xs outline-none placeholder:text-[#A2ABA8] focus:border-[#D7A43A]" /></Field><Field label="Post"><textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Enter your post" className="h-24 w-full resize-none rounded-lg border border-[#293033] bg-[#121719] p-2 text-xs outline-none placeholder:text-[#A2ABA8] focus:border-[#D7A43A]" /></Field><Field label="Upload Photo (optional)"><input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => readFile(event.target.files?.[0])} /><div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); readFile(event.dataTransfer.files?.[0]); }} className="relative flex h-[108px] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#293033] bg-[#121719] text-white/50">{image ? <><img src={image} alt="Selected upload preview" className="h-full w-full object-cover" /><button type="button" onClick={() => setImage(null)} className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white"><X className="h-3 w-3" /></button></> : <button type="button" onClick={() => inputRef.current?.click()} className="flex h-full w-full flex-col items-center justify-center gap-2 hover:bg-white/[.03]"><ImagePlus className="h-7 w-7" /><span className="text-[10px]">Click or drag an image here</span></button>}</div>{uploadError && <p className="mt-1 text-[10px] text-[#EF4444]">{uploadError}</p>}</Field></div><div className="mt-3 border-t border-[#293033] pt-3"><div className="flex justify-end gap-2"><button onClick={close} className="rounded-lg border border-white px-5 py-2 text-xs hover:bg-white/10">Cancel</button><button onClick={publish} className="gold-gradient-btn rounded-lg px-5 py-2 text-xs disabled:opacity-50" disabled={!title.trim() || !body.trim()}>Publish post</button></div></div></DialogContent></Dialog>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-xs text-white"><span className="mb-2 block">{label}</span>{children}</label>; }
