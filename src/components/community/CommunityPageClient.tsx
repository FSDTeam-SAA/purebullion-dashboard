"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, Filter, Heart, ImagePlus, MessageCircle, Send, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  useCommunityPosts,
  useCommunityStatistics,
  useAnnouncements,
  useCreatePost,
  useToggleLikePost,
  useDeletePost,
  useDeleteAnnouncement,
} from "./hooks/useCommunity";

type Topic = "All discussions" | "Signals" | "Education" | "Market discussion" | "Platform help";

export default function CommunityPageClient() {
  const [topic, setTopic] = useState<Topic>("All discussions");
  const [sort, setSort] = useState("Trending");
  const [open, setOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useCommunityStatistics();
  const { data: postsData, refetch: refetchPosts, isLoading: postsLoading, isError: postsError } = useCommunityPosts({
    topic: topic === "All discussions" ? undefined : topic.toLowerCase(),
  });
  const { data: announcementsData } = useAnnouncements();
  const createPostMutation = useCreatePost();
  const likeMutation = useToggleLikePost();
  const deleteMutation = useDeletePost();
  const deleteAnnouncementMutation = useDeleteAnnouncement();

  const posts = useMemo(() => {
    if (postsData?.posts && postsData.posts.length > 0) {
      return postsData.posts.map((p: any, idx: number) => ({
        id: p._id || p.id || String(idx),
        name: p.author?.name || "Community Member",
        initial: (p.author?.name || "M").charAt(0).toUpperCase(),
        topic: p.topic || "General",
        time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Recently",
        title: p.title,
        body: p.content,
        likes: p.likesCount ?? 0,
        comments: p.commentsCount ?? 0,
        image: p.media?.[0] || undefined,
      }));
    }
    return [];
  }, [postsData]);

  const visiblePosts = useMemo(
    () => (topic === "All discussions" ? posts : posts.filter((post: any) => post.topic.toLowerCase() === topic.toLowerCase())),
    [posts, topic]
  );

  const activeAnnouncements = useMemo(() => {
    if (announcementsData && announcementsData.length > 0) {
      return announcementsData.map((a) => ({
        id: a._id || a.id || "",
        title: a.title,
        createdAt: a.createdAt,
      }));
    }
    return [];
  }, [announcementsData]);

  function addPost(post: { topic: string; title: string; body: string; image?: string }) {
    createPostMutation.mutate({
      title: post.title,
      content: post.body,
      topic: post.topic.toLowerCase(),
    });
    setOpen(false);
  }

  const dash = statsLoading ? "…" : "—";
  const totalMembers = stats?.totalMembers !== undefined ? stats.totalMembers.toLocaleString() : dash;
  const userPosts = stats?.userTotalPosts !== undefined ? String(stats.userTotalPosts) : dash;
  const totalLikes = stats?.totalLikes !== undefined ? (stats.totalLikes >= 1000 ? `${(stats.totalLikes / 1000).toFixed(1)}k` : String(stats.totalLikes)) : dash;
  const trending = [...posts].sort((a: any, b: any) => (b.comments + b.likes) - (a.comments + a.likes)).slice(0, 7);

  return <div className="space-y-4 pb-8 font-raleway">
    <div><h2 className="text-base font-bold text-[#F1F4F3]">Community</h2></div>
    <section className="grid gap-4 xl:grid-cols-[254px_minmax(0,1fr)_320px]">
      <aside className="space-y-4 xl:row-span-2">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-1"><Metric title="Total Members" value={totalMembers} /><Metric title="Your total Post" value={userPosts} /><Metric title="Total Likes" value={totalLikes} extra="hidden xl:flex" /></div>
        <div className="rounded-lg border border-[#293033] bg-[#0C0F10] p-3">
          <div className="flex items-center justify-between border-b border-[#1B2227] pb-4"><span className="flex items-center gap-2 text-sm font-semibold"><Filter className="h-4 w-4" /> Filters</span><button onClick={() => { setTopic("All discussions"); setSort("Trending"); }} className="text-[10px] text-[#718090]">Reset</button></div>
          <FilterGroup label="TOPICS:" values={["All discussions", "Signals", "Education", "Market discussion", "Platform help"]} selected={topic} onClick={(item) => setTopic(item as Topic)} />
          <FilterGroup label="SORT:" values={["Trending", "Newest", "Most replies"]} selected={sort} onClick={setSort} />
          <button onClick={() => refetchPosts()} className="gold-gradient-btn mt-5 w-full rounded-md py-2.5 text-xs">Apply filter</button>
        </div>
      </aside>

      <section className="rounded-lg border border-[#293033] bg-[#0C0F10] p-3 sm:p-4">
        <div className="mb-5 flex items-center justify-between"><h3 className="text-xl font-semibold">Feed</h3><div className="text-right"><button onClick={() => setOpen(true)} className="gold-gradient-btn rounded-lg px-6 py-2.5 text-xs">Add New Post</button><button onClick={() => refetchPosts()} className="mt-2 block w-full text-right text-[11px] text-[#D7A43A]">Refresh</button></div></div>
        <div className="space-y-3">{visiblePosts.length ? visiblePosts.map((post: any) => <Post key={post.id} post={post} onLike={() => likeMutation.mutate(String(post.id))} onDelete={() => deleteMutation.mutate(String(post.id))} />) : <div className="py-16 text-center text-sm text-[#718090]">{postsLoading ? "Loading discussions…" : postsError ? "Could not load discussions." : "No discussions in this topic yet."}</div>}</div>
      </section>

      <aside className="space-y-3">
        <Panel title="Announcements">{activeAnnouncements.map((item) => <div key={item.id} className="rounded-md bg-[#121719] px-2 py-1.5"><div className="text-xs font-semibold text-[#F1F4F3]">{item.title}</div><div className="mt-1 flex items-center justify-between text-[9px] text-[#A2ABA8]"><span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</span><button onClick={() => deleteAnnouncementMutation.mutate(item.id)}><Trash2 className="h-3 w-3 text-[#EF4444]" /></button></div></div>)}</Panel>
        <Panel title="Trending discussions">{trending.length ? trending.map((p: any) => <div key={p.id} className="py-1.5"><div className="text-xs font-semibold text-[#F1F4F3]">{p.title}</div><div className="mt-1 flex gap-3 text-[9px] text-[#A2ABA8]"><span>{p.topic}</span><span>·</span><span>{p.comments} Comments</span></div></div>) : <div className="text-xs text-[#718090]">No discussions yet.</div>}</Panel>
      </aside>
    </section>
    <NewPostDialog open={open} onOpenChange={setOpen} onPublish={addPost} />
  </div>;
}

function Metric({ title, value, extra = "" }: { title: string; value: string; extra?: string }) { return <article className={cn("rounded-lg border border-[#D7A43A]/70 bg-[radial-gradient(circle_at_15%_0%,rgba(175,104,32,.25),transparent_58%),#121719] p-3", extra)}><p className="text-[10px] font-medium text-[#F1F4F3]">{title}</p><strong className="mt-1 block text-base font-bold">{value}</strong></article>; }
function FilterGroup({ label, values, selected, onClick }: { label: string; values: string[]; selected: string; onClick: (value: string) => void }) { return <div className="border-b border-[#1B2227] py-3"><p className="mb-2 text-[8px] text-[#718090]">{label}</p><div className="flex flex-wrap gap-1.5">{values.map((item) => <button key={item} onClick={() => onClick(item)} className={cn("rounded-md border px-2 py-1 text-[10px]", selected === item ? "border-[#D7A43A] bg-[#A48226]/20 text-[#E7C042]" : "border-[#293033] bg-[#171D1F] text-[#A2ABA8]")}>{item}</button>)}</div></div>; }
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-lg border border-[#293033] bg-[#0C0F10] p-3"><h3 className="mb-3 text-lg font-semibold">{title}</h3><div className="space-y-3">{children}</div></section>; }
function Post({ post, onLike, onDelete }: { post: any; onLike: () => void; onDelete: () => void }) { return <article className="rounded-lg bg-[#121719] p-3"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#D7A43A] to-[#574014] text-xs font-bold text-black">{post.initial}</div><div><div className="text-xs font-semibold">{post.name} <span className="ml-1 text-[9px] font-normal text-[#A2ABA8]">{post.topic}　·　{post.time}</span></div></div></div><button onClick={onDelete} className="rounded-full bg-white p-1 text-[#EF4444]"><Trash2 className="h-3 w-3" /></button></div><div className={cn("mt-3", post.image && "grid gap-3 md:grid-cols-[1fr_135px]")}><div><h4 className="text-xs font-semibold text-[#F1F4F3]">{post.title}</h4><p className="mt-3 text-[10px] leading-[1.45] text-[#A2ABA8]">{post.body}</p></div>{post.image && <img src={post.image} alt="Post attachment" className="h-24 w-full rounded-md object-cover md:h-full" />}</div><div className="mt-3 flex gap-3 text-[9px] text-[#A2ABA8]"><span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {post.comments}</span><button onClick={onLike} className="flex items-center gap-1 hover:text-[#E7C042]"><Heart className="h-3 w-3" /> {post.likes}</button><span className="flex items-center gap-1"><Send className="h-3 w-3" /> Report</span></div></article>; }

function NewPostDialog({ open, onOpenChange, onPublish }: { open: boolean; onOpenChange: (value: boolean) => void; onPublish: (post: { topic: string; title: string; body: string; image?: string }) => void }) {
  const [topic, setTopic] = useState("Signals"); const [topicOpen, setTopicOpen] = useState(false); const [title, setTitle] = useState(""); const [body, setBody] = useState(""); const [image, setImage] = useState<string | null>(null); const [uploadError, setUploadError] = useState(""); const inputRef = useRef<HTMLInputElement>(null); const postTopics = ["Signals", "Market discussion", "Platform help", "Education", "Announcements"];
  const readFile = (file?: File) => { if (!file) return; if (!file.type.startsWith("image/")) { setUploadError("Please choose an image file."); return; } if (file.size > 5 * 1024 * 1024) { setUploadError("Image must be 5 MB or smaller."); return; } const reader = new FileReader(); reader.onload = () => { setImage(String(reader.result)); setUploadError(""); }; reader.readAsDataURL(file); };
  function close() { setTopicOpen(false); onOpenChange(false); }
  function publish() { if (!title.trim() || !body.trim()) return; onPublish({ topic, title: title.trim(), body: body.trim(), image: image || undefined }); setTitle(""); setBody(""); setImage(null); }
  return <Dialog open={open} onOpenChange={(value) => { setTopicOpen(false); onOpenChange(value); }}><DialogContent showCloseButton={false} className="max-h-[94vh] max-w-[390px] gap-0 overflow-y-auto rounded-xl border-[#293033] bg-[#121719] p-4 text-white shadow-2xl sm:p-4"><div className="mb-5 flex items-center justify-between"><DialogTitle className="text-lg font-bold">New Post</DialogTitle><button onClick={close} className="flex h-7 w-7 items-center justify-center rounded-md border border-[#293033] text-[#A2ABA8] hover:border-[#A2ABA8] hover:text-white"><X className="h-3.5 w-3.5" /></button></div><div className="space-y-3"><Field label="Topic"><div><button type="button" onClick={() => setTopicOpen((current) => !current)} className="flex h-9 w-full items-center justify-between rounded-lg border border-[#293033] bg-[#121719] px-2 text-left text-xs font-semibold hover:border-[#697370]"><span>{topic}</span><ChevronDown className={cn("h-4 w-4 transition-transform", topicOpen && "rotate-180")} /></button>{topicOpen && <div className="mt-2 flex w-36 flex-col gap-2">{postTopics.map((item) => <button key={item} type="button" onClick={() => { setTopic(item); setTopicOpen(false); }} className={cn("min-h-9 w-full rounded-md border bg-[#18181B] px-3 py-2 text-center text-sm font-medium leading-4 transition-colors", item === topic ? "border-[#FB923C] text-[#FB923C]" : "border-[#27272A] text-[#D6D3D1] hover:border-[#52525B]")}>{item}</button>)}</div>}</div></Field><Field label="Title"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="title" className="h-9 w-full rounded-lg border border-[#293033] bg-[#121719] px-2 text-xs outline-none placeholder:text-[#A2ABA8] focus:border-[#D7A43A]" /></Field><Field label="Post"><textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Enter your post" className="h-24 w-full resize-none rounded-lg border border-[#293033] bg-[#121719] p-2 text-xs outline-none placeholder:text-[#A2ABA8] focus:border-[#D7A43A]" /></Field><Field label="Upload Photo (optional)"><input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => readFile(event.target.files?.[0])} /><div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); readFile(event.dataTransfer.files?.[0]); }} className="relative flex h-[108px] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#293033] bg-[#121719] text-white/50">{image ? <><img src={image} alt="Selected upload preview" className="h-full w-full object-cover" /><button type="button" onClick={() => setImage(null)} className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white"><X className="h-3 w-3" /></button></> : <button type="button" onClick={() => inputRef.current?.click()} className="flex h-full w-full flex-col items-center justify-center gap-2 hover:bg-white/[.03]"><ImagePlus className="h-7 w-7" /><span className="text-[10px]">Click or drag an image here</span></button>}</div>{uploadError && <p className="mt-1 text-[10px] text-[#EF4444]">{uploadError}</p>}</Field></div><div className="mt-3 border-t border-[#293033] pt-3"><div className="flex justify-end gap-2"><button onClick={close} className="rounded-lg border border-white px-5 py-2 text-xs hover:bg-white/10">Cancel</button><button onClick={publish} className="gold-gradient-btn rounded-lg px-5 py-2 text-xs disabled:opacity-50" disabled={!title.trim() || !body.trim()}>Publish post</button></div></div></DialogContent></Dialog>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-xs text-white"><span className="mb-2 block">{label}</span>{children}</label>; }
