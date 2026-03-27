import { useState } from "react";
import { Heart, MessageCircle, Share2, Send, ChevronDown, ChevronUp } from "lucide-react";
import { mockPosts, Post, Comment } from "@/lib/social";
import { motion } from "framer-motion";

export default function Community() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const toggleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  return (
    <div className="container py-12 max-w-2xl">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Community</h1>
        <p className="text-muted-foreground">Latest from Sierra Leonean artists</p>
      </div>

      <div className="space-y-6">
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} onLike={() => toggleLike(post.id)} />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post, index, onLike }: { post: Post; index: number; onLike: () => void }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-card rounded-xl border p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <img src={post.authorImage} alt={post.authorName} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <h3 className="font-display font-semibold text-sm">{post.authorName}</h3>
          <p className="text-xs text-muted-foreground">{post.createdAt}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-4">{post.content}</p>

      <div className="flex items-center gap-6 pt-2 border-t">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${post.liked ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Heart className={`h-4 w-4 ${post.liked ? "fill-primary" : ""}`} />
          {post.likes}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          {post.comments.length}
          {showComments ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3 pt-3 border-t">
          {post.comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          <div className="flex gap-2 mt-3">
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 text-sm bg-secondary rounded-md px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button className="p-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="pl-2">
      <div className="flex items-start gap-2">
        <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
          {comment.authorName[0]}
        </div>
        <div className="flex-1">
          <p className="text-xs">
            <span className="font-semibold">{comment.authorName}</span>{" "}
            <span className="text-muted-foreground">{comment.content}</span>
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <button className="hover:text-foreground">Like ({comment.likes})</button>
            {comment.replies.length > 0 && (
              <button onClick={() => setShowReplies(!showReplies)} className="hover:text-foreground">
                {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
          {showReplies && comment.replies.map(reply => (
            <div key={reply.id} className="mt-2 ml-4 flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                {reply.authorName[0]}
              </div>
              <p className="text-xs">
                <span className="font-semibold">{reply.authorName}</span>{" "}
                <span className="text-muted-foreground">{reply.content}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
