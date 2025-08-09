

function JoinSection() {
  const features = [
    { icon: "⬆️", title: "Submit Research", desc: "Share your research findings and get peer feedback." },
    { icon: "👥", title: "Collaborate", desc: "Connect with researchers across departments." },
    { icon: "🔔", title: "Stay Updated", desc: "Receive notifications about new papers and conferences." },
    { icon: "⬇️", title: "Full Access", desc: "Download complete papers and access academic content." },
  ];

  return (
    <section className="text-center px-4 md:h-screen sm:px-10 py-20 bg-gray-300">
      <h2 className="text-2xl sm:text-3xl md:mt-36 md:px-10 font-bold mb-16">
        Why Join Our Research Community?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-lg sm:text-xl">
        {features.map((item, index) => (
          <div key={index}>
            <div className="text-3xl mb-2">{item.icon}</div>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default JoinSection;


