'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, Loader2, Clock } from "lucide-react";
import { Blog } from "@/lib/types";
import { getFeaturedBlogs, getLatestBlogs } from "@/lib/blog-service";
import { formatDistanceToNow } from 'date-fns';

export const FeaturedBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      setLoading(true);
      try {
        // Try to get featured blogs first
        let data = await getFeaturedBlogs(3);
        
        // If no featured blogs found, fetch latest blogs as fallback
        if (!data || data.length === 0) {
          console.log("No featured blogs found, using latest blogs as fallback");
          data = await getLatestBlogs(3);
        }
        
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching featured blogs:', error);
        setError('Failed to load blogs');
        // Fallback to sample data if API fails
        setBlogs(sampleBlogs);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBlogs();
  }, []);

  // Backup sample blogs in case the database fetch fails
  const sampleBlogs: Blog[] = [
    {
      id: '1',
      title: 'How to Set Up a Perfect Carp Fishing Rig',
      slug: 'how-to-set-up-perfect-carp-fishing-rig',
      summary: 'Master the art of creating the perfect carp rig with our step-by-step guide for beginners and seasoned anglers alike.',
      content: '',
      feature_image: '/blogs/carp-rig-setup.jpg',
      author: 'Jacob Worth',
      author_image: '/team/jacob.jpg',
      category: 'tutorials',
      tags: ['featured', 'beginner', 'rig-guide'],
      published: true,
      featured: true,
      read_time: 8,
      views: 1240,
      likes: 87,
      created_at: '2023-06-15T00:00:00Z',
      updated_at: '2023-06-15T00:00:00Z',
      published_at: '2023-06-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Top 5 UK Carp Fishing Venues for 2024',
      slug: 'top-5-uk-carp-fishing-venues-2024',
      summary: 'Discover the best lakes and venues to fish for carp in the UK this year, with insider tips on each location.',
      content: '',
      feature_image: '/blogs/uk-carp-venues.jpg',
      author: 'Henry Lennon',
      author_image: '/team/henry.jpg',
      category: 'venues',
      tags: ['featured', 'venue-review'],
      published: true,
      featured: true,
      read_time: 12,
      views: 2450,
      likes: 132,
      created_at: '2023-07-20T00:00:00Z',
      updated_at: '2023-07-20T00:00:00Z',
      published_at: '2023-07-20T00:00:00Z'
    },
    {
      id: '3',
      title: 'Winter Carp Fishing: Essential Tips for Cold Weather Success',
      slug: 'winter-carp-fishing-essential-tips',
      summary: 'Don\'t let the cold stop you from landing monster carp. Our expert guide covers bait, timing, and gear for winter success.',
      content: '',
      feature_image: '/blogs/winter-carp-fishing.jpg',
      author: 'Jacob Worth',
      author_image: '/team/jacob.jpg',
      category: 'tips',
      tags: ['featured', 'seasonal'],
      published: true,
      featured: true,
      read_time: 10,
      views: 1890,
      likes: 104,
      created_at: '2023-11-10T00:00:00Z',
      updated_at: '2023-11-10T00:00:00Z',
      published_at: '2023-11-10T00:00:00Z'
    }
  ];

  const formatReadTime = (minutes: number) => {
    return `${minutes} min read`;
  };

  const formatPublishedDate = (dateString: string) => {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <section className="relative bg-[#0d1622] py-12 overflow-hidden">
      {/* Real lake topography map overlay - CENTERED SINGLE LAKE */}
      <div className="absolute inset-0">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="100%" 
          height="100%" 
          viewBox="0 0 800 400" 
          className="opacity-75"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Subtle Grid lines */}
          <g stroke="#ffffff10" strokeWidth="0.5">
            <line x1="0" y1="0" x2="800" y2="0" />
            <line x1="0" y1="50" x2="800" y2="50" />
            <line x1="0" y1="100" x2="800" y2="100" />
            <line x1="0" y1="150" x2="800" y2="150" />
            <line x1="0" y1="200" x2="800" y2="200" />
            <line x1="0" y1="250" x2="800" y2="250" />
            <line x1="0" y1="300" x2="800" y2="300" />
            <line x1="0" y1="350" x2="800" y2="350" />
            <line x1="0" y1="400" x2="800" y2="400" />
            
            <line x1="0" y1="0" x2="0" y2="400" />
            <line x1="50" y1="0" x2="50" y2="400" />
            <line x1="100" y1="0" x2="100" y2="400" />
            <line x1="150" y1="0" x2="150" y2="400" />
            <line x1="200" y1="0" x2="200" y2="400" />
            <line x1="250" y1="0" x2="250" y2="400" />
            <line x1="300" y1="0" x2="300" y2="400" />
            <line x1="350" y1="0" x2="350" y2="400" />
            <line x1="400" y1="0" x2="400" y2="400" />
            <line x1="450" y1="0" x2="450" y2="400" />
            <line x1="500" y1="0" x2="500" y2="400" />
            <line x1="550" y1="0" x2="550" y2="400" />
            <line x1="600" y1="0" x2="600" y2="400" />
            <line x1="650" y1="0" x2="650" y2="400" />
            <line x1="700" y1="0" x2="700" y2="400" />
            <line x1="750" y1="0" x2="750" y2="400" />
            <line x1="800" y1="0" x2="800" y2="400" />
          </g>

          {/* DIAGONAL LINES ACROSS ENTIRE AREA */}
          <g stroke="#ffffff20" strokeWidth="0.5">
            <line x1="0" y1="0" x2="800" y2="400" />
            <line x1="200" y1="0" x2="800" y2="300" />
            <line x1="400" y1="0" x2="800" y2="200" />
            <line x1="600" y1="0" x2="800" y2="100" />
            <line x1="0" y1="100" x2="700" y2="400" />
            <line x1="0" y1="200" x2="500" y2="400" />
            <line x1="0" y1="300" x2="300" y2="400" />
          </g>

          {/* CENTERED SINGLE LAKE WITH CONTOUR LINES */}
          <g transform="translate(150, 50)">
            {/* Outer lake boundary */}
            <path
              d="M250,100 C320,70 420,80 480,100 C550,120 580,150 590,200 C600,250 580,300 520,330 C450,360 350,350 280,330 C210,310 170,280 150,220 C130,160 170,130 250,100 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
            />
            
            {/* Contour lines - from outside to inside */}
            <path
              d="M260,110 C325,82 410,92 470,110 C535,128 565,155 575,200 C585,245 567,290 510,318 C445,346 355,336 290,318 C225,300 185,272 165,220 C145,165 185,142 260,110 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            
            <path
              d="M270,120 C330,95 400,105 460,120 C520,135 550,162 560,200 C570,240 555,280 500,305 C440,330 360,320 300,305 C240,290 198,265 180,220 C165,170 200,155 270,120 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            
            <path
              d="M280,130 C335,108 390,118 450,130 C505,142 535,168 545,200 C555,235 542,270 490,292 C435,315 365,305 310,292 C255,280 210,257 195,220 C180,175 215,168 280,130 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            
            <path
              d="M290,140 C340,120 380,130 440,140 C490,150 520,175 530,200 C540,230 528,260 480,280 C430,300 370,290 320,280 C270,270 225,250 210,220 C195,185 230,180 290,140 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            
            <path
              d="M300,150 C345,132 370,142 430,150 C475,157 505,182 515,200 C525,225 515,250 470,267 C425,285 375,275 330,267 C285,260 240,242 225,220 C210,195 245,192 300,150 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            
            <path
              d="M310,160 C350,145 360,155 420,160 C460,165 490,190 500,200 C510,220 502,240 460,255 C420,270 380,260 340,255 C300,250 255,235 240,220 C225,205 260,205 310,160 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            
            <path
              d="M320,170 C355,155 350,167 410,170 C445,172 475,195 485,200 C495,215 488,230 450,242 C415,255 385,245 350,242 C315,240 270,227 255,220 C240,212 275,217 320,170 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            
            <path
              d="M330,180 C360,168 350,180 400,180 C430,182 460,200 470,200 C480,210 475,220 440,230 C410,240 390,230 360,230 C330,230 285,220 270,215 C255,210 290,230 330,180 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            
            {/* Center of the lake - deepest point */}
            <path
              d="M350,190 C370,180 380,190 390,190 C410,192 430,200 435,200 C445,205 440,210 420,215 C400,220 385,215 370,215 C355,215 325,210 315,205 C305,200 330,200 350,190 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            
            {/* Small islands */}
            <ellipse cx="240" cy="170" rx="15" ry="20" fill="none" stroke="#ffffff" strokeWidth="0.8" />
            <ellipse cx="500" cy="250" rx="20" ry="15" fill="none" stroke="#ffffff" strokeWidth="0.8" />
            
            {/* Depth indicators - small circles */}
            <circle cx="380" cy="200" r="3" fill="#ffffff" opacity="0.7" />
            <circle cx="420" cy="210" r="2" fill="#ffffff" opacity="0.7" />
            <circle cx="350" cy="220" r="2" fill="#ffffff" opacity="0.7" />
          </g>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Featured Articles</h2>
            <p className="text-gray-300">Expert tips and guides from Team Rippa</p>
          </div>
          <Link 
            href="/blogs" 
            className="mt-4 md:mt-0 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FileText className="mr-2 h-4 w-4" />
            View All Articles
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
                <Link href={`/blogs/${blog.slug}`} className="block">
                  <div className="relative h-52 group">
                    {blog.feature_image ? (
                      <Image 
                        src={blog.feature_image} 
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <FileText className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                    {blog.category && (
                      <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {blog.category.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                </Link>
                
                <div className="p-5">
                  <Link href={`/blogs/${blog.slug}`} className="block">
                    <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  
                  {blog.summary && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {blog.summary}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center">
                      {blog.author_image ? (
                        <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
                          <Image
                            src={blog.author_image}
                            alt={blog.author || 'Author'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-slate-200 mr-2"></div>
                      )}
                      <span>{blog.author || 'Rippa Team'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      {blog.read_time && (
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatReadTime(blog.read_time)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-slate-600">No featured articles found</p>
          </div>
        )}
      </div>
    </section>
  );
}; 