import Image from 'next/image';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function AboutTeam() {
  const teamMembers = [
    {
      name: "Jacob Worth",
      role: "Founder & Lead Angler",
      bio: "Professional carp angler with over 15 years of experience on the bank. Jacob has fished everything from small day ticket waters to the most challenging European venues.",
      image: "/jacob_henry.jpg",
      social: {
        instagram: "#",
        facebook: "#",
        youtube: "#"
      }
    },
    {
      name: "Henry Carter",
      role: "Product Development",
      bio: "With a background in materials engineering, Henry ensures our tackle meets the demands of modern carp fishing, combining strength with finesse.",
      image: "/products/rippa_ronnie_bundle.png",
      social: {
        instagram: "#",
        facebook: "#"
      }
    },
    {
      name: "Sarah Matthews",
      role: "Operations Manager",
      bio: "The organisational force behind Rippa, Sarah ensures your orders are processed quickly and arrive when you need them for your next session.",
      image: "/products/rippa_mystery.png",
      social: {
        instagram: "#"
      }
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Meet The Team</h2>
          <p className="text-lg text-slate-600">
            Every person at Rippa Tackle is a dedicated angler with a passion for carp fishing. 
            We don't just sell tackle – we use it ourselves every week on the bank.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-blue-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative w-full h-[300px]">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium text-sm mb-3">{member.role}</p>
                <p className="text-slate-600 mb-4">{member.bio}</p>
                
                <div className="flex space-x-3">
                  {member.social.instagram && (
                    <a href={member.social.instagram} className="text-slate-500 hover:text-blue-600 transition-colors">
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {member.social.facebook && (
                    <a href={member.social.facebook} className="text-slate-500 hover:text-blue-600 transition-colors">
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  {member.social.youtube && (
                    <a href={member.social.youtube} className="text-slate-500 hover:text-blue-600 transition-colors">
                      <Youtube className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-xl p-8 md:p-12">
          <div className="md:flex items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Join the Rippa Team</h3>
              <p className="text-slate-600">
                We're always looking for passionate anglers to join our team. If you love carp fishing and want to be part of a growing tackle company, get in touch.
              </p>
            </div>
            <div>
              <a 
                href="mailto:careers@rippatackle.com" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md inline-block transition-colors"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 