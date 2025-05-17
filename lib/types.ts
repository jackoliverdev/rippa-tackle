export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  created_at: string;
  updated_at: string;
  role: string;
  first_name?: string | null;
  last_name?: string | null;
  profile_image_url?: string | null;
}

export interface UserProfile {
  id: string;
  user_id: string;
  user_firebase_uid: string;
  user_email: string;
  quiz_summary?: string | null;
  partner_first_name?: string | null;
  partner_last_name?: string | null;
  wedding_date?: string | null;
  guest_count?: number | null;
  location?: string | null;
  max_distance?: number | null;
  budget_min?: number | null;
  budget_max?: number | null;
  preferences?: any;
  created_at: string;
  updated_at: string;
}

export interface VenueAccount {
  id: string;
  firebase_uid: string;
  email: string;
  created_at: string;
  updated_at: string;
  role: string;
  venue_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  profile_image_url?: string | null;
}

// Blog related types
export interface Blog {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  author?: string;
  author_image?: string;
  feature_image?: string;
  category?: string;
  tags?: string[];
  published: boolean;
  featured: boolean;
  read_time?: number;
  views: number;
  likes: number;
  images?: BlogImage[];
  metadata?: any;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface BlogImage {
  id: string;
  url: string;
  alt?: string;
  position?: number;
  isPrimary?: boolean;
}

export type BlogCategory = 'carp-fishing' | 'tackle-guides' | 'tutorials' | 'venues' | 'reviews' | 'tips' | 'news';

export type BlogTag = 'featured' | 'popular' | 'beginner' | 'advanced' | 'seasonal' | 'tutorial' | 
                       'rig-guide' | 'bait-guide' | 'product-review' | 'venue-review' | 'interview';

// Video related types
export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  embed_id: string;
  views?: string;
  duration?: string;
  published_date?: string;
  display_date?: string;
  channel: string;
  description?: string;
  published: boolean;
  featured: boolean;
  category?: string;
  tags?: string[];
  view_count?: number;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export type VideoCategory = 'Fishing Sessions' | 'Tutorials' | 'Reviews' | 'Adventure' | 'Tips and Tactics' | 'Product Reviews';

export type VideoChannel = 'Jacob London Carper' | 'Henry Lennon' | 'Other';

// Vibe Quiz: User-facing
export interface VibeQuizConversation {
  id: string;
  user_id: string;
  thread_id?: string;
  title?: string;
  summary?: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  extracted_preferences?: any;
}

export interface VibeQuizMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  openai_message_id?: string;
  openai_response_id?: string;
  token_count?: number;
}

export interface VibeQuizHistory {
  id: string;
  conversation_id: string;
  message_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  openai_message_id?: string;
  openai_response_id?: string;
  token_count?: number;
}

// Vibe Quiz: Admin-facing
export interface AdminVibeQuizInstructions {
  id: string;
  instructions?: string;
  context?: string;
  language?: string;
  personality?: string;
  avoid?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminVibeQuizQuestion {
  id: string;
  question_text: string;
  conditional_response: boolean;
  question_type: string;
  category?: string;
  fallback_response?: string;
  active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface AdminVibeQuizConditionalResponse {
  id: string;
  question_id: string;
  conditional_trigger: string;
  conditional_response: string;
  created_at: string;
}

export interface AdminVibeQuizDocument {
  id: string;
  title: string;
  file_url: string;
  description?: string;
  created_at: string;
}

// Fishing Assistant: Admin-facing
export interface AdminFishingAssistantSettings {
  id: string;
  instructions?: string;
  context?: string;
  language?: string;
  personality?: string;
  avoid_topics?: string;
  initial_question?: string;
  openai_vector_store_id: string;
  created_at: string;
  updated_at: string;
}

// Fishing Assistant: User-facing
export interface FishingAssistantConversation {
  id: string;
  user_id?: string;
  status: string;
  summary?: string;
  user_preferences?: {
    location?: string;
    species?: string[];
    methods?: string[];
  };
  created_at: string;
  updated_at: string;
  last_message_at?: string;
}

export interface FishingAssistantMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  openai_response_id?: string;
  token_count?: number;
  created_at: string;
}

export interface AdminFishingAssistantDocument {
  id: string;
  title: string;
  description?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  file_id: string;
  vector_store_id: string;
  processing_status: string;
  uploaded_by_user_id?: string;
  created_at: string;
  updated_at: string;
} 