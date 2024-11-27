export default function loading() {
  return (
    <section className="border-2 border-slate-500 bg-zinc-600 rounded-md text-gray-500 flex justify-center items-center bg-zinc-900" style={{ height: '80vh' }}>
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary mx-auto"></span>
        <div className="text-center">Loading Network Graph</div>
      </div>
    </section>
  );
}