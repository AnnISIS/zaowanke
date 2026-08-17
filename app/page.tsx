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

const themes = ["gold", "ink"] as const;
type ReaderTheme = (typeof themes)[number];
const themeNames: Record<ReaderTheme, string> = { gold: "古金", ink: "墨金" };

function PracticeText({ text }: { text: string }) {
  return text.split("\n").map((rawLine, index) => {
    const line = rawLine.trim();
    if (!line || line.startsWith("# ")) return null;
    if (line.startsWith("### ")) {
      return <h3 key={index}>{line.slice(4)}</h3>;
    }
    const emphasized = line.startsWith("**") && line.endsWith("**");
    const clean = line.replace(/^\*\*/, "").replace(/\*\*$/, "").replaceAll("**", "");
    const note = clean.startsWith("（") && clean.endsWith("）");
    return (
      <p className={`practice-line${emphasized ? " emphasized" : ""}${note ? " note" : ""}`} key={index}>
        {clean}
      </p>
    );
  });
}

export default function Home() {
  const [fontSize, setFontSize] = useState(26);
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState("morning");
  const [practiceText, setPracticeText] = useState("");
  const [guruPractice, setGuruPractice] = useState("");
  const [theme, setTheme] = useState<ReaderTheme>("gold");

  const [morningPractice, eveningPractice = ""] = practiceText.split("# 晚课");

  useEffect(() => {
    const saved = Number(localStorage.getItem("prayer-font-size"));
    if (saved >= 22 && saved <= 38) setFontSize(saved);
    const savedTheme = localStorage.getItem("prayer-theme");
    if (savedTheme === "night" || savedTheme === "purple" || savedTheme === "ink") setTheme("ink");

    fetch("/daily-practice.md")
      .then((response) => response.text())
      .then(setPracticeText)
      .catch(() => setPracticeText("原稿暂时无法载入，请刷新页面重试。"));
    fetch("/guru-practice.md")
      .then((response) => response.text())
      .then(setGuruPractice)
      .catch(() => setGuruPractice("莲师修法暂时无法载入，请刷新页面重试。"));
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    const sections = ["morning", "padmasambhava", "bodhicitta", "tara", "guru", "evening"]
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
  }, [practiceText]);

  const changeFontSize = (next: number) => {
    const size = Math.max(22, Math.min(38, next));
    setFontSize(size);
    localStorage.setItem("prayer-font-size", String(size));
  };

  const cycleTheme = () => {
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(next);
    localStorage.setItem("prayer-theme", next);
  };

  return (
    <main className={`theme-${theme}`}>
      <div className="progress" style={{ width: `${progress}%` }} />

      <header className="hero">
        <img className="cover-art" src="/guru-rinpoche-full.jpg" alt="莲花生大师完整画像" />
      </header>

      <nav className="chapter-nav" aria-label="祈祷文目录">
        <a className={activeChapter === "morning" ? "active" : ""} href="#morning">早课</a>
        <a className={activeChapter === "padmasambhava" ? "active" : ""} href="#padmasambhava">莲师修法</a>
        <a className={activeChapter === "bodhicitta" ? "active" : ""} href="#bodhicitta">菩提心海之入口</a>
        <a className={activeChapter === "tara" ? "active" : ""} href="#tara">祈请度母</a>
        <a className={activeChapter === "guru" ? "active" : ""} href="#guru">遥呼上师</a>
        <a className={activeChapter === "evening" ? "active" : ""} href="#evening">晚课</a>
      </nav>

      <article className="prayer" style={{ fontSize: `${fontSize}px` }}>
        <div className="lotus-watermark" aria-hidden="true">莲</div>
        <section id="morning" className="long-prayer practice-section" aria-labelledby="morning-title">
          <p className="chapter-label">原稿全文</p>
          <h2 id="morning-title">早课</h2>
          {practiceText ? <PracticeText text={morningPractice.replace("# 日课", "").trim()} /> : <p className="loading">正在展开早课原稿…</p>}
        </section>

        <div className="chapter-break" aria-hidden="true"><span>莲师修法</span></div>

        <section id="padmasambhava" className="long-prayer practice-section padma-practice" aria-labelledby="padmasambhava-title">
          <p className="chapter-label">简约仪轨</p>
          <h2 id="padmasambhava-title">莲师心咒修法</h2>
          {guruPractice ? <PracticeText text={guruPractice.replace("# 莲师心咒修法简约仪轨", "").trim()} /> : <p className="loading">正在展开莲师修法…</p>}
        </section>

        <div className="chapter-break" aria-hidden="true"><span>菩提心</span></div>

        <section id="bodhicitta" className="long-prayer" aria-labelledby="bodhicitta-title">
          <p className="chapter-label">修心祈愿文</p>
          <h2 id="bodhicitta-title">菩提心海之入口</h2>
          <p className="byline">蒋贡康楚罗卓泰耶</p>
          {paragraphs(bodhicittaPrayer).map((paragraph, index) => (
            <p className="verse" key={`bodhicitta-${index}`}>{paragraph}</p>
          ))}
        </section>

        <div className="chapter-break" aria-hidden="true"><span>祈请度母</span></div>

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

        <div className="chapter-break" aria-hidden="true"><span>遥呼上师</span></div>

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

        <div className="chapter-break" aria-hidden="true"><span>晚课</span></div>

        <section id="evening" className="long-prayer practice-section" aria-labelledby="evening-title">
          <p className="chapter-label">原稿全文</p>
          <h2 id="evening-title">晚课</h2>
          {practiceText ? <PracticeText text={eveningPractice.trim()} /> : <p className="loading">正在展开晚课原稿…</p>}
        </section>

        <footer>
          <div className="closing-dot" aria-hidden="true" />
          <p>愿一切吉祥</p>
        </footer>
      </article>

      <nav className="reader-controls" aria-label="阅读设置">
        <button onClick={() => changeFontSize(fontSize - 2)} aria-label="缩小字体" disabled={fontSize <= 22}>A−</button>
        <span aria-live="polite">{fontSize}</span>
        <button onClick={() => changeFontSize(fontSize + 2)} aria-label="放大字体" disabled={fontSize >= 38}>A＋</button>
        <i aria-hidden="true" />
        <button className="theme-button" onClick={cycleTheme} aria-label={`切换纸色，当前为${themeNames[theme]}`}>{themeNames[theme]}</button>
        <i aria-hidden="true" />
        <button className="top-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="返回顶部">↑ 顶部</button>
      </nav>
    </main>
  );
}
