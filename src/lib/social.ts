import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  content: string;
  image?: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  authorName: string;
  content: string;
  likes: number;
  replies: Reply[];
}

export interface Reply {
  id: string;
  authorName: string;
  content: string;
}

export const mockPosts: Post[] = [
  {
    id: "1",
    authorId: "1",
    authorName: "Aminata Kamara",
    authorImage: artist1,
    content: "Just finished my latest piece — 'Echoes of the River'. Inspired by the beautiful sunsets along the Rokel River. The warm tones remind me of home. 🎨",
    image: undefined,
    likes: 42,
    liked: false,
    comments: [
      { id: "c1", authorName: "Sarah M.", content: "Absolutely stunning work! The colors are incredible.", likes: 5, replies: [{ id: "r1", authorName: "Aminata Kamara", content: "Thank you so much Sarah! 🙏" }] },
      { id: "c2", authorName: "John D.", content: "When will this be available in the shop?", likes: 2, replies: [] },
    ],
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    authorId: "2",
    authorName: "Ibrahim Koroma",
    authorImage: artist2,
    content: "Behind the scenes of my carving process. Each piece takes about 3 weeks of careful work. The wood speaks to me and tells me what shape it wants to become. 🪵✨",
    image: undefined,
    likes: 38,
    liked: false,
    comments: [
      { id: "c3", authorName: "Art Lover", content: "This is beautiful craftsmanship!", likes: 3, replies: [] },
    ],
    createdAt: "5 hours ago",
  },
  {
    id: "3",
    authorId: "3",
    authorName: "Mohamed Sesay",
    authorImage: artist3,
    content: "Excited to announce that my work will be featured at the upcoming 'New Horizons' exhibition at Cotton Tree Gallery! If you're in Freetown, come say hi. 🌟",
    image: undefined,
    likes: 56,
    liked: false,
    comments: [
      { id: "c4", authorName: "Gallery Fan", content: "Can't wait to see your work in person!", likes: 7, replies: [] },
      { id: "c5", authorName: "Fatima K.", content: "Congratulations Mohamed! Well deserved! 🎉", likes: 4, replies: [] },
    ],
    createdAt: "1 day ago",
  },
];
