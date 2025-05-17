import { ShieldCheck, Clock, Droplet } from 'lucide-react';

export default function AboutMission() {
  const values = [
    {
      icon: <ShieldCheck className="h-12 w-12 text-blue-600" />,
      title: "Quality Assurance",
      description: "Every product we stock is tested on the bank by our team. If it doesn't meet our standards, we don't sell it."
    },
    {
      icon: <Clock className="h-12 w-12 text-blue-600" />,
      title: "Angler First",
      description: "We're anglers ourselves, so we understand what matters when you're planning the perfect session."
    },
    {
      icon: <Droplet className="h-12 w-12 text-blue-600" />,
      title: "Water Conservation",
      description: "We're committed to protecting the waters we fish. A portion of every sale goes towards lake conservation."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-blue-50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Mission</h2>
          <p className="text-lg text-slate-600">
            Founded by Jacob Worth in 2019, Rippa Tackle was born from frustration with the tackle industry. Why settle for generic gear when specialist equipment delivers better results on the bank?
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
              <p className="text-slate-600">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-900 rounded-xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Wave pattern background */}
          <div className="absolute inset-0 opacity-10" 
               style={{
                 backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 20, 50 10 T 100 10' stroke='white' fill='none' stroke-width='2'/%3E%3C/svg%3E\")",
                 backgroundRepeat: "repeat"
               }}>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Our Commitment</h2>
            <p className="text-blue-100 text-lg mb-0 max-w-3xl mx-auto">
              "I started Rippa Tackle to provide anglers with gear that actually works. Every product we sell has been tested extensively on different waters and in various conditions. I won't put my name on anything that I wouldn't use myself on a crucial session."
            </p>
            <div className="mt-6 flex justify-center">
              <div className="flex items-center">
                <div className="h-px w-8 bg-blue-500 mr-4"></div>
                <span className="text-blue-300 font-medium">Jacob Worth, Founder</span>
                <div className="h-px w-8 bg-blue-500 ml-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 