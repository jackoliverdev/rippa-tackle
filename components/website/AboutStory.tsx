'use client';

import Image from 'next/image';
import { Fish, Award, TrendingUp, Users, Package, Dumbbell } from 'lucide-react';

export default function AboutStory() {
  const milestones = [
    {
      year: "2018",
      title: "The Idea",
      description: "Frustrated with poor quality tackle available on the market, Jacob began developing his own terminal tackle for personal use.",
      icon: <Fish className="h-8 w-8 text-blue-600" />
    },
    {
      year: "2019",
      title: "First Products",
      description: "Rippa Tackle officially launched with a small range of terminal tackle, including our now-famous Ronnie Rigs.",
      icon: <Award className="h-8 w-8 text-blue-600" />
    },
    {
      year: "2020",
      title: "Online Growth",
      description: "Our social media following exploded as anglers discovered our specialist approach to tackle design and field testing.",
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />
    },
    {
      year: "2021",
      title: "Team Expansion",
      description: "Henry and Sarah joined the team, bringing expertise in product development and operations management.",
      icon: <Users className="h-8 w-8 text-blue-600" />
    },
    {
      year: "2022",
      title: "Mystery Box Launch",
      description: "Our groundbreaking Monthly Mystery Box service launched, quickly becoming a favourite among UK carp anglers.",
      icon: <Package className="h-8 w-8 text-blue-600" />
    },
    {
      year: "2023",
      title: "Boilie Range",
      description: "After 18 months of testing, we introduced our premium boilie range, featuring our signature Scopex Squid formula.",
      icon: <Dumbbell className="h-8 w-8 text-blue-600" />
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background pattern - subtle fish scales */}
      <div className="absolute inset-0 opacity-5 bg-repeat"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 C 40 5, 50 15, 50 30 C 50 45, 40 55, 30 55 C 20 55, 10 45, 10 30 C 10 15, 20 5, 30 5' stroke='%230c4a6e' fill='none' stroke-width='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px"
        }}>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Journey</h2>
          <p className="text-lg text-slate-600">
            From humble beginnings to becoming one of the UK's most trusted specialist carp tackle providers.
          </p>
        </div>
        
        {/* Desktop Timeline */}
        <div className="hidden md:block relative mt-10 mb-16">
          {/* Main central timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-blue-600 z-10"></div>
          
          <div className="relative">
            {milestones.map((milestone, index) => (
              <div 
                key={milestone.year} 
                className={`flex ${index % 2 === 0 ? '' : 'flex-row-reverse'} ${index !== 0 ? 'mt-[-30px]' : ''} mb-4`}
                style={{ zIndex: 30 - index }}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-6' : 'pl-6'}`}>
                  <div className="bg-blue-50 p-5 rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300">
                    <p className="text-sm font-bold text-blue-600 mb-1">{milestone.year}</p>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{milestone.title}</h3>
                    <p className="text-sm text-slate-600">{milestone.description}</p>
                  </div>
                </div>
                
                <div className="w-2/12 flex justify-center">
                  {/* Timeline circle with icon */}
                  <div className="z-20 relative top-5">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-blue-600 flex items-center justify-center shadow-md">
                      {milestone.icon}
                    </div>
                  </div>
                </div>
                
                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden relative">
          {/* Vertical timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-1 bg-blue-600 z-0"></div>
          
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="relative pl-16">
                {/* Timeline circle */}
                <div className="absolute left-0 top-3 flex items-center justify-center z-10">
                  <div className="w-10 h-10 rounded-full bg-white border-4 border-blue-600 flex items-center justify-center shadow-md" style={{ marginLeft: '0.5px' }}>
                    {milestone.icon}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg shadow-md border border-blue-100">
                  <p className="text-sm font-bold text-blue-600 mb-1">{milestone.year}</p>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{milestone.title}</h3>
                  <p className="text-sm text-slate-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Vision for the future */}
        <div className="mt-20 bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl overflow-hidden shadow-xl">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Looking Forward</h3>
              <p className="text-blue-100 mb-4">
                "We're just getting started. Our vision for Rippa Tackle is to revolutionise carp fishing in the UK by focusing on specialist gear that makes a real difference on the bank. 
                We'll continue developing innovative products that help our community land more and bigger fish."
              </p>
              <p className="text-blue-300 font-medium">- Jacob Worth</p>
            </div>
            <div className="md:w-1/2 relative min-h-[300px]">
              <Image 
                src="/products/rippa_pva_bundle.png"
                alt="Rippa Tackle products" 
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 