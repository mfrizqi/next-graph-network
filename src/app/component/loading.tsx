export default function loading() {
  return (
    <section className="border-2 border-slate-500 rounded-md text-gray-500 flex justify-center items-center bg-zinc-900" style={{ height: '80vh', backgroundColor: '#1A1E2B' }}>
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary mx-auto"></span>
        <div className="text-center">Loading Network Graph</div>
      </div>
    </section>
  );
}