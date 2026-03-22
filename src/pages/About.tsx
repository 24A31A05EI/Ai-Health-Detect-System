export default function About() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">About Us</h1>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Project Overview</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">An AI-Driven chronic disease prediction platform inspired by the research from Pragati Engineering College, designed to offer personalized risk analytics and preventive guidance.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Research Team</h2>
        <ul className="mt-2 grid gap-3 sm:grid-cols-2">
          {['M.Ratna Sahithi', 'M.Veera Venkata Manikanta', 'P.Mahesh', 'K.Durga Prasad'].map((name) => (
            <li key={name} className="rounded-lg border p-3 dark:border-slate-700">{name}<br/><small className="text-xs text-slate-500">Computer Science and Engineering, Pragati Engineering College (Surampalem)</small></li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Technology Stack</h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Zustand'].map((tech) => (
            <span key={tech} className="rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">{tech}</span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Mission & Vision</h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border p-3 dark:border-slate-700">
            <h3 className="font-semibold">Mission</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Enable proactive chronic disease management using AI insights and evidence-based guidance.</p>
          </article>
          <article className="rounded-lg border p-3 dark:border-slate-700">
            <h3 className="font-semibold">Vision</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Reduce global disease burden through early detection and digital health empowerment.</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Contact</h2>
        <form className="mt-2 grid gap-3 sm:grid-cols-2">
          <input type="text" placeholder="Name" className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800" />
          <input type="email" placeholder="Email" className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800" />
          <textarea placeholder="Message" className="col-span-2 h-24 rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800" />
          <button type="submit" className="col-span-2 rounded-lg bg-blue-600 px-4 py-2 text-white">Send Message</button>
        </form>
      </section>
    </div>
  )
}
