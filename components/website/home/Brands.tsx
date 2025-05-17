import Link from 'next/link';

export const Brands = () => {
  // List of fishing brands
  const brands = [
    { name: 'NASH', link: '/brands/nash' },
    { name: 'KORDA', link: '/brands/korda' },
    { name: 'MAINLINE', link: '/brands/mainline' },
    { name: 'STICKY', link: '/brands/sticky' },
    { name: 'ESP', link: '/brands/esp' },
    { name: 'GARDNER', link: '/brands/gardner' },
    { name: 'PROLOGIC', link: '/brands/prologic' },
  ];

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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">FEATURED BRANDS</h2>
          <Link 
            href="/brands" 
            className="text-sm uppercase tracking-wider text-white hover:text-blue-400 transition-colors font-medium"
          >
            VIEW ALL BRANDS
          </Link>
        </div>

        <div className="flex justify-between items-center py-6">
          {brands.map((brand) => (
            <Link 
              key={brand.name} 
              href={brand.link}
              className="text-white text-xl md:text-2xl font-bold hover:text-blue-400 transition-colors"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands; 