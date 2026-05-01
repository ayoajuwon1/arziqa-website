"use client";

import FadeIn from "./FadeIn";

const articles = [
  {
    title: "Arziqa secures strategic partnerships across Northern Nigeria",
    date: "March 2026",
    gradient: "from-primary-light to-primary",
  },
  {
    title: "How warehouse receipts are transforming agricultural finance",
    date: "February 2026",
    gradient: "from-amber-700 to-amber-500",
  },
  {
    title: "Nigeria's commodity export opportunity: a $12B gap",
    date: "January 2026",
    gradient: "from-teal-700 to-emerald-500",
  },
];

export default function NewsCards() {
  return (
    <section className="bg-bg-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <h2 className="mb-12 font-display text-3xl font-bold text-text-primary md:text-4xl">
            Latest
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((article, i) => (
            <FadeIn key={article.title} delay={i * 0.1}>
              <article className="group cursor-pointer">
                <div
                  className={`mb-4 h-48 rounded-bento bg-gradient-to-br ${article.gradient}`}
                />
                <time className="text-xs text-text-secondary">
                  {article.date}
                </time>
                <h3 className="mt-1 font-display text-lg font-semibold text-text-primary transition-colors group-hover:text-accent">
                  {article.title}
                </h3>
                <span className="mt-2 inline-block text-sm font-medium text-accent">
                  Read &rarr;
                </span>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
