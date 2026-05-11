//Sohan's work


import { Shield, Users, Heart, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-500 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">Reimagining home services</h1>
          <p className="mt-4 text-lg text-white/85">A marketplace built on trust, transparency, and the people who power Bangladesh's homes.</p>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold">Our mission</h2>
        <p className="mt-3 leading-relaxed text-gray-600">Booking a reliable plumber, cleaner, or electrician shouldn't take half a day. Servico exists to make every home service in Bangladesh just a tap away — at a fair, fixed price, delivered by a verified professional.</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, title: "Verified pros", desc: "Every pro is background-checked and skill-assessed before joining." },
            { icon: Users, title: "100k+ users", desc: "Trusted by households across Dhaka and growing fast." },
            { icon: Heart, title: "Customer first", desc: "100% satisfaction guarantee on every single booking." },
            { icon: Sparkles, title: "Quality service", desc: "4.8/5 average rating across 200,000+ reviews." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-soft">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-bold">Our story</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">Founded in 2023 in Dhaka, Servico was born out of a simple frustration: why is it so hard to find a trustworthy electrician or cleaner? Our founders set out to build Bangladesh's first fully-verified, transparent home services marketplace.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
            <h3 className="text-lg font-bold">Our reach</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">Currently serving 50+ areas across Dhaka with plans to expand to Chittagong, Sylhet, and Rajshahi in 2026. Every city we enter, we bring our same standard of verified, on-demand service.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
