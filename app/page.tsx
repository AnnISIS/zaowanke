"use client";

import { useEffect, useState } from "react";
import { bodhicittaPrayer, guruPrayer, paragraphs } from "./prayers";

const firstPrayer = [
  "祈愿世界和平、和谐；祈愿中国和平、和谐。祈愿各国领袖能确实依因果定律领导自己的国家，祈愿佛法持有者、上师们都能长寿；祈愿他们免于障难；祈愿佛陀的教法长住于世。",
  "愿虔信佛法的人，都能长寿富足；愿战争和饥荒都消失或平息；愿佛法的研究与修持遍及一切处。",
  "从现在起一直到证悟为止，请看顾我；护卫我、照顾我、引导我、养育我、保护我。请您像看顾唯一的孩子一样地看顾我，满我所愿。让我与您无二无别。",
  "祈愿相对菩提心与究竟菩提心在心中毫不费力地增长。祈愿恶念及恶行永不出现，即使它们出现了，也不要出现太久，只短暂出现。",
  "祈愿我能长寿、健康、富裕；祈愿我的禅修能达至了悟的境界。并恳请保护我免于短暂危险的恐惧，譬如各种自然灾难、地震、山崩等等。",
  "也恳请保护我免于重大的危险、轮回中的危险。也请您保护我，并且祈愿这个地球维持和平、和谐。",
];

const taraPrayer = [
  "喔！",
  "至尊薄伽梵母圣度母，\n请消除我与一切有情众生的所有染垢，\n带领我们迅速获得证悟。",
  "在我们生生世世中，愿我们享有顺缘。\n愿步向证悟的各种外内障碍，\n诸如疾病、非时死亡、梦魇、恶兆及恐惧等，皆得以净除。",
  "愿我们的心转向佛法。\n请力促我们精进，促使我们见到您的容颜，\n驱使我们证得空性，亦即胜义菩提心。\n请令我们投生阿弥陀佛刹土。",
  "您是多么美丽！\n力量多么强大！\n多么无可限量！\n愿我们成为如您一般。",
  "以此祈请，无论我们身处何方，\n愿贫穷、饥馑或争端消逝无踪，\n愿佛法得以广弘。",
];

export default function Home() {
  const [fontSize, setFontSize] = useState(26);
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState("tara");

  useEffect(() => {
    const saved = Number(localStorage.getItem("prayer-font-size"));
    if (saved >= 22 && saved <= 38) setFontSize(saved);

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    const sections = ["tara", "bodhicitta", "guru"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveChapter(visible.target.id);
      },
      { rootMargin: "-18% 0px -60% 0px", threshold: [0, 0.08, 0.2] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener("scroll", updateProgress);
      observer.disconnect();
    };
  }, []);

  const changeFontSize = (next: number) => {
    const size = Math.max(22, Math.min(38, next));
    setFontSize(size);
    localStorage.setItem("prayer-font-size", String(size));
  };

  return (
    <main>
      <div className="progress" style={{ width: `${progress}%` }} />

      <header className="hero">
        <div className="lotus" aria-hidden="true">✦</div>
        <p className="eyebrow">每日晨诵</p>
        <h1>祈请度母</h1>
        <p className="subtitle">愿世界和平 · 众生安乐 · 菩提心增长</p>
        <div className="ornament" aria-hidden="true"><span />◇<span /></div>
      </header>

      <nav className="chapter-nav" aria-label="祈祷文目录">
        <a className={activeChapter === "tara" ? "active" : ""} href="#tara">祈请度母</a>
        <a className={activeChapter === "bodhicitta" ? "active" : ""} href="#bodhicitta">菩提心海之入口</a>
        <a className={activeChapter === "guru" ? "active" : ""} href="#guru">遥呼上师</a>
      </nav>

      <article className="prayer" style={{ fontSize: `${fontSize}px` }}>
        <section id="tara" aria-labelledby="morning-prayer">
          <h2 id="morning-prayer">祈愿文</h2>
          {firstPrayer.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="attribution">— 宗萨钦哲仁波切</p>
        </section>

        <div className="section-break" aria-hidden="true">❦</div>

        <section aria-labelledby="tara-praise">
          <h2 id="tara-praise">度母颂</h2>
          {taraPrayer.map((paragraph) => (
            <p className={paragraph === "喔！" ? "invocation" : "verse"} key={paragraph}>
              {paragraph}
            </p>
          ))}
          <p className="attribution">— 宗萨钦哲仁波切<br /><small>2017年4月3日撰写</small></p>
        </section>

        <div className="chapter-break" aria-hidden="true"><span>第二篇</span></div>

        <section id="bodhicitta" className="long-prayer" aria-labelledby="bodhicitta-title">
          <p className="chapter-label">修心祈愿文</p>
          <h2 id="bodhicitta-title">菩提心海之入口</h2>
          <p className="byline">蒋贡康楚罗卓泰耶</p>
          {paragraphs(bodhicittaPrayer).map((paragraph, index) => (
            <p className="verse" key={`bodhicitta-${index}`}>{paragraph}</p>
          ))}
        </section>

        <div className="chapter-break" aria-hidden="true"><span>第三篇</span></div>

        <section id="guru" className="long-prayer" aria-labelledby="guru-title">
          <p className="chapter-label">简体中文版</p>
          <h2 id="guru-title">虔心悲切遥呼上师祈请文</h2>
          <p className="byline">蒋贡康楚罗卓泰耶</p>
          {paragraphs(guruPrayer).map((paragraph, index) => (
            <p className="verse guru-verse" key={`guru-${index}`}>
              {paragraph.split("\n").map((line, lineIndex) => (
                <span
                  className={line.includes("上师鉴知我") || line.startsWith("加持") ? "refrain" : "verse-line"}
                  key={`${index}-${lineIndex}`}
                >
                  {line}
                </span>
              ))}
            </p>
          ))}
        </section>

        <footer>
          <div className="ornament" aria-hidden="true"><span />◇<span /></div>
          <p>愿一切吉祥</p>
        </footer>
      </article>

      <nav className="reader-controls" aria-label="阅读设置">
        <button onClick={() => changeFontSize(fontSize - 2)} aria-label="缩小字体" disabled={fontSize <= 22}>A−</button>
        <span aria-live="polite">{fontSize}</span>
        <button onClick={() => changeFontSize(fontSize + 2)} aria-label="放大字体" disabled={fontSize >= 38}>A＋</button>
        <i aria-hidden="true" />
        <button className="top-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="返回顶部">↑ 顶部</button>
      </nav>
    </main>
  );
}
