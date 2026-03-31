import { useState, useEffect, useCallback } from "react";
import { Heart, MessageCircle, Share2, Send, ChevronDown, ChevronUp, Copy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface PostData {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  likes_count: number;
  user_liked: boolean;
  comments: CommentData[];
}

interface CommentData {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  likes_count: number;
  user_liked: boolean;
  replies: CommentData[];
}

const initialFakePosts: PostData[] = [
  { id: "fake-1", content: "Just finished my latest painting inspired by the Cotton Tree 🌳 Can't wait to exhibit it at the National Museum!", image_url: null, created_at: "March 28, 2026", author_id: "fake-a1", author_name: "Aminata Kamara", author_avatar: null, likes_count: 24, user_liked: false, comments: [
    { id: "fc-1", content: "This is incredible! Your work keeps getting better 🔥", author_id: "fake-b1", author_name: "Ibrahim Koroma", created_at: "March 28, 2026", likes_count: 5, user_liked: false, replies: [
      { id: "fc-1r", content: "Thank you bro! Means a lot coming from you", author_id: "fake-a1", author_name: "Aminata Kamara", created_at: "March 28, 2026", likes_count: 2, user_liked: false, replies: [] },
    ]},
    { id: "fc-2", content: "The colours are amazing! Would love to see this in person", author_id: "fake-b2", author_name: "Fatmata Bangura", created_at: "March 28, 2026", likes_count: 3, user_liked: false, replies: [] },
    { id: "fc-3", content: "Sierra Leonean art is truly unmatched 🇸🇱", author_id: "fake-b3", author_name: "Mohamed Sesay", created_at: "March 29, 2026", likes_count: 8, user_liked: false, replies: [] },
  ]},
  { id: "fake-2", content: "Excited to announce my new sculpture series 'Guardians of Freetown' will be available on ArtVault next week! 🎨 Stay tuned for the drop.", image_url: null, created_at: "March 27, 2026", author_id: "fake-b1", author_name: "Ibrahim Koroma", author_avatar: null, likes_count: 31, user_liked: false, comments: [
    { id: "fc-4", content: "Can't wait! Your sculptures are always masterpieces", author_id: "fake-b2", author_name: "Fatmata Bangura", created_at: "March 27, 2026", likes_count: 4, user_liked: false, replies: [] },
    { id: "fc-5", content: "Will there be limited editions? I want to grab one early!", author_id: "fake-b4", author_name: "Abu Kamara", created_at: "March 27, 2026", likes_count: 2, user_liked: false, replies: [
      { id: "fc-5r", content: "Yes! Only 10 pieces in the first batch 🙏", author_id: "fake-b1", author_name: "Ibrahim Koroma", created_at: "March 27, 2026", likes_count: 6, user_liked: false, replies: [] },
    ]},
  ]},
  { id: "fake-3", content: "Just visited the 'Voices of the Land' exhibition preview. The energy was incredible! Sierra Leone's art scene is growing fast 🚀", image_url: null, created_at: "March 26, 2026", author_id: "fake-b3", author_name: "Mohamed Sesay", author_avatar: null, likes_count: 18, user_liked: false, comments: [
    { id: "fc-6", content: "I was there too! Amazing vibes and beautiful art everywhere", author_id: "fake-a1", author_name: "Aminata Kamara", created_at: "March 26, 2026", likes_count: 3, user_liked: false, replies: [] },
    { id: "fc-7", content: "Proud to be part of this community 🇸🇱❤️", author_id: "fake-b2", author_name: "Fatmata Bangura", created_at: "March 26, 2026", likes_count: 7, user_liked: false, replies: [] },
  ]},
  { id: "fake-4", content: "Working on a new country cloth collection blending traditional Mende patterns with contemporary fashion. Art meets wearable culture! 🧵", image_url: null, created_at: "March 25, 2026", author_id: "fake-b2", author_name: "Fatmata Bangura", author_avatar: null, likes_count: 22, user_liked: false, comments: [
    { id: "fc-8", content: "This sounds amazing! Can't wait to see the final pieces", author_id: "fake-b4", author_name: "Abu Kamara", created_at: "March 25, 2026", likes_count: 1, user_liked: false, replies: [] },
    { id: "fc-9", content: "Country cloth is so underrated. Love that you're keeping it alive!", author_id: "fake-b3", author_name: "Mohamed Sesay", created_at: "March 25, 2026", likes_count: 5, user_liked: false, replies: [] },
    { id: "fc-10", content: "Would you consider doing a workshop on this? I'd love to learn!", author_id: "fake-a1", author_name: "Aminata Kamara", created_at: "March 26, 2026", likes_count: 4, user_liked: false, replies: [
      { id: "fc-10r", content: "Great idea! Let me plan something for next month 💡", author_id: "fake-b2", author_name: "Fatmata Bangura", created_at: "March 26, 2026", likes_count: 3, user_liked: false, replies: [] },
    ]},
  ]},
  { id: "fake-5", content: "My pottery workshop at the British Council was fully booked! Thank you to everyone who came. Sierra Leonean ceramics have a bright future 🏺", image_url: null, created_at: "March 24, 2026", author_id: "fake-b4", author_name: "Abu Kamara", author_avatar: null, likes_count: 15, user_liked: false, comments: [
    { id: "fc-11", content: "I attended! It was so inspiring. You're a great teacher 👏", author_id: "fake-b3", author_name: "Mohamed Sesay", created_at: "March 24, 2026", likes_count: 3, user_liked: false, replies: [] },
  ]},
];

export default function Community() {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  const isFake = (id: string) => id.startsWith("fake-") || id.startsWith("fc-");

  const toggleFakePostLike = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, user_liked: !p.user_liked, likes_count: p.user_liked ? p.likes_count - 1 : p.likes_count + 1 } : p));
  };

  const toggleFakeCommentLike = (commentId: string) => {
    const toggleInComments = (comments: CommentData[]): CommentData[] =>
      comments.map(c => c.id === commentId
        ? { ...c, user_liked: !c.user_liked, likes_count: c.user_liked ? c.likes_count - 1 : c.likes_count + 1 }
        : { ...c, replies: toggleInComments(c.replies) }
      );
    setPosts(prev => prev.map(p => ({ ...p, comments: toggleInComments(p.comments) })));
  };

  const addFakeReply = (postId: string, commentId: string, content: string) => {
    if (!user || !profile) return;
    const newReply: CommentData = {
      id: `local-${Date.now()}`,
      content,
      author_id: user.id,
      author_name: profile.full_name,
      created_at: "Just now",
      likes_count: 0,
      user_liked: false,
      replies: [],
    };
    const addReplyToComments = (comments: CommentData[]): CommentData[] =>
      comments.map(c => c.id === commentId
        ? { ...c, replies: [...c.replies, newReply] }
        : { ...c, replies: addReplyToComments(c.replies) }
      );
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: addReplyToComments(p.comments) } : p));
  };

  const addFakeComment = (postId: string, content: string) => {
    if (!user || !profile) return;
    const newComment: CommentData = {
      id: `local-${Date.now()}`,
      content,
      author_id: user.id,
      author_name: profile.full_name,
      created_at: "Just now",
      likes_count: 0,
      user_liked: false,
      replies: [],
    };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
  };

  const fetchPosts = async () => {
    const { data: postsData } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    if (!postsData || postsData.length === 0) {
      setPosts(initialFakePosts);
      setLoading(false);
      return;
    }

    const postIds = postsData.map(p => p.id);
    const [{ data: profiles }, { data: comments }, { data: likes }] = await Promise.all([
      supabase.from("profiles").select("user_id, full_name, avatar_url"),
      supabase.from("comments").select("*").in("post_id", postIds).order("created_at", { ascending: true }),
      supabase.from("likes").select("*").in("post_id", postIds),
    ]);

    const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
    const commentLikes = comments?.length ?
      (await supabase.from("likes").select("*").in("comment_id", comments.map(c => c.id))).data || [] : [];

    const enrichedPosts: PostData[] = postsData.map(post => {
      const author = profileMap.get(post.author_id);
      const postLikes = (likes || []).filter(l => l.post_id === post.id);
      const postComments = (comments || []).filter(c => c.post_id === post.id && !c.parent_id);
      return {
        id: post.id,
        content: post.content,
        image_url: post.image_url,
        created_at: new Date(post.created_at).toLocaleDateString(),
        author_id: post.author_id,
        author_name: author?.full_name || "Unknown",
        author_avatar: author?.avatar_url,
        likes_count: postLikes.length,
        user_liked: !!postLikes.find(l => l.user_id === user?.id),
        comments: postComments.map(c => buildComment(c, comments || [], commentLikes, profileMap)),
      };
    });

    setPosts([...enrichedPosts, ...initialFakePosts]);
    setLoading(false);
  };

  const buildComment = (c: any, allComments: any[], allLikes: any[], profileMap: Map<string, any>): CommentData => {
    const author = profileMap.get(c.author_id);
    const cLikes = allLikes.filter(l => l.comment_id === c.id);
    const replies = allComments.filter(r => r.parent_id === c.id);
    return {
      id: c.id,
      content: c.content,
      author_id: c.author_id,
      author_name: author?.full_name || "Unknown",
      created_at: new Date(c.created_at).toLocaleDateString(),
      likes_count: cLikes.length,
      user_liked: !!cLikes.find((l: any) => l.user_id === user?.id),
      replies: replies.map(r => buildComment(r, allComments, allLikes, profileMap)),
    };
  };

  useEffect(() => { fetchPosts(); }, [user]);

  const handleCreatePost = async () => {
    if (!user || !newPost.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("posts").insert({ author_id: user.id, content: newPost.trim() });
    setPosting(false);
    if (error) { toast.error("Failed to create post"); return; }
    setNewPost("");
    fetchPosts();
  };

  const toggleLike = async (postId: string) => {
    if (!user) { toast.error("Please login to like posts"); return; }
    if (isFake(postId)) { toggleFakePostLike(postId); return; }
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    if (post.user_liked) {
      await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", postId);
    } else {
      await supabase.from("likes").insert({ user_id: user.id, post_id: postId });
    }
    fetchPosts();
  };

  return (
    <div className="container py-16 max-w-2xl">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">Community</h1>
        <p className="text-muted-foreground text-lg">Latest from Sierra Leonean artists</p>
      </div>

      {user ? (
        <div className="bg-card rounded-2xl border p-5 mb-10">
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Share something with the community..."
            rows={3}
            className="w-full text-sm bg-secondary rounded-xl px-4 py-3 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex justify-end">
            <button onClick={handleCreatePost} disabled={posting || !newPost.trim()} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
              <Send className="h-4 w-4" /> {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border p-8 mb-10 text-center">
          <p className="text-muted-foreground mb-3">Join the conversation</p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">Login to post</Link>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No posts yet. Be the first to share!</div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              index={i}
              onLike={() => toggleLike(post.id)}
              onRefresh={fetchPosts}
              isFake={isFake(post.id)}
              onToggleFakeCommentLike={toggleFakeCommentLike}
              onAddFakeReply={(commentId, content) => addFakeReply(post.id, commentId, content)}
              onAddFakeComment={(content) => addFakeComment(post.id, content)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({ post, index, onLike, onRefresh, isFake, onToggleFakeCommentLike, onAddFakeReply, onAddFakeComment }: {
  post: PostData; index: number; onLike: () => void; onRefresh: () => void;
  isFake: boolean;
  onToggleFakeCommentLike: (id: string) => void;
  onAddFakeReply: (commentId: string, content: string) => void;
  onAddFakeComment: (content: string) => void;
}) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [shareOpen, setShareOpen] = useState(false);

  const handleComment = async () => {
    if (!user || !newComment.trim()) return;
    if (isFake) {
      onAddFakeComment(newComment.trim());
      setNewComment("");
      return;
    }
    await supabase.from("comments").insert({ post_id: post.id, author_id: user.id, content: newComment.trim() });
    setNewComment("");
    onRefresh();
  };

  const shareUrl = `${window.location.origin}/community#${post.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-card rounded-2xl border p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-11 w-11 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
          {post.author_name[0]?.toUpperCase()}
        </div>
        <div>
          <h3 className="font-display font-semibold text-sm">{post.author_name}</h3>
          <p className="text-xs text-muted-foreground">{post.created_at}</p>
        </div>
      </div>

      <p className="text-[15px] leading-relaxed mb-5">{post.content}</p>

      <div className="flex items-center gap-6 pt-4 border-t relative">
        <button onClick={onLike} className={`flex items-center gap-1.5 text-sm transition-colors ${post.user_liked ? "text-red-500 font-medium" : "text-muted-foreground hover:text-foreground"}`}>
          <Heart className={`h-4 w-4 ${post.user_liked ? "fill-red-500" : ""}`} /> {post.likes_count}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle className="h-4 w-4" /> {post.comments.length}
          {showComments ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        <div className="relative ml-auto">
          <button onClick={() => setShareOpen(!shareOpen)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
          <AnimatePresence>
            {shareOpen && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute right-0 top-8 bg-background border rounded-xl p-2 shadow-lg z-10 w-48">
                <button onClick={() => { navigator.clipboard.writeText(shareUrl); toast.success("Link copied!"); setShareOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-secondary rounded-lg">
                  <Copy className="h-3.5 w-3.5" /> Copy Link
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" onClick={() => setShareOpen(false)} className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-secondary rounded-lg">
                  <Send className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3 pt-4 border-t">
          {post.comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={post.id}
              onRefresh={onRefresh}
              isFake={isFake}
              onToggleFakeCommentLike={onToggleFakeCommentLike}
              onAddFakeReply={onAddFakeReply}
            />
          ))}
          {user ? (
            <div className="flex gap-2 mt-3">
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                onKeyDown={e => e.key === "Enter" && handleComment()}
                className="flex-1 text-sm bg-secondary rounded-xl px-4 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button onClick={handleComment} className="p-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <Send className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground"><Link to="/login" className="text-foreground font-medium hover:underline">Login</Link> to comment</p>
          )}
        </div>
      )}
    </motion.div>
  );
}

function CommentItem({ comment, postId, onRefresh, isFake, onToggleFakeCommentLike, onAddFakeReply }: {
  comment: CommentData; postId: string; onRefresh: () => void;
  isFake: boolean;
  onToggleFakeCommentLike: (id: string) => void;
  onAddFakeReply: (commentId: string, content: string) => void;
}) {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  const isCommentFake = comment.id.startsWith("fc-") || comment.id.startsWith("fake-") || comment.id.startsWith("local-");

  const toggleLike = async () => {
    if (!user) { toast.error("Please login to like"); return; }
    if (isCommentFake || isFake) {
      onToggleFakeCommentLike(comment.id);
      return;
    }
    if (comment.user_liked) {
      await supabase.from("likes").delete().eq("user_id", user.id).eq("comment_id", comment.id);
    } else {
      await supabase.from("likes").insert({ user_id: user.id, comment_id: comment.id });
    }
    onRefresh();
  };

  const handleReply = async () => {
    if (!user || !replyText.trim()) return;
    if (isCommentFake || isFake) {
      onAddFakeReply(comment.id, replyText.trim());
      setReplyText("");
      setReplying(false);
      setShowReplies(true);
      return;
    }
    await supabase.from("comments").insert({ post_id: postId, author_id: user.id, parent_id: comment.id, content: replyText.trim() });
    setReplyText("");
    setReplying(false);
    onRefresh();
  };

  return (
    <div className="pl-2">
      <div className="flex items-start gap-2.5">
        <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold flex-shrink-0">
          {comment.author_name[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="font-semibold">{comment.author_name}</span>{" "}
            <span className="text-muted-foreground">{comment.content}</span>
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <button onClick={toggleLike} className={`hover:text-foreground transition-colors ${comment.user_liked ? "text-red-500 font-medium" : ""}`}>
              ♥ {comment.likes_count}
            </button>
            {user && (
              <button onClick={() => setReplying(!replying)} className="hover:text-foreground transition-colors">Reply</button>
            )}
            {comment.replies.length > 0 && (
              <button onClick={() => setShowReplies(!showReplies)} className="hover:text-foreground transition-colors">
                {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>

          {replying && (
            <div className="flex gap-2 mt-2">
              <input value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === "Enter" && handleReply()} placeholder="Reply..." className="flex-1 text-xs bg-secondary rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring" />
              <button onClick={handleReply} className="text-xs text-foreground font-medium hover:opacity-70">Send</button>
            </div>
          )}

          {showReplies && comment.replies.map(reply => (
            <div key={reply.id} className="mt-2.5 ml-4 flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {reply.author_name[0]?.toUpperCase()}
              </div>
              <p className="text-xs">
                <span className="font-semibold">{reply.author_name}</span>{" "}
                <span className="text-muted-foreground">{reply.content}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
