import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const tg = window.Telegram?.WebApp;
const APP_VERSION = "daily-character-v1";

const intentions = [
  ["energy", "Больше энергии", "хочу проснуться телом и вернуть тонус"],
  ["health", "Улучшить здоровье", "тазовое дно, профилактика, мягкая регулярность"],
  ["sensitivity", "Больше чувствительности", "хочу лучше ощущать тело и удовольствие"],
  ["libido", "Вернуть либидо", "желание снизилось, хочу разобраться мягко"],
  ["confidence", "Уверенность и пластика", "хочу чувствовать себя сексуальнее"],
];

const symptoms = [
  ["tension", "Зажимы в тазу"],
  ["low-energy", "Мало энергии"],
  ["low-desire", "Низкое желание"],
  ["cycle-pain", "Цикл ощущается тяжело"],
  ["posture", "Хочу больше пластики"],
];

const bodyZones = [
  {
    id: "pelvic",
    title: "Тазовое дно",
    caption: "расслабление, тонус, чувствительность",
    x: "50%",
    y: "65%",
    practices: [
      {
        id: "reverse-kegel",
        title: "Обратный Кегель",
        duration: 5,
        motion: "breathe",
        tracker: "10 дыхательных циклов",
        intro: "База: не сжимать сильнее, а научиться отпускать тазовое дно.",
        steps: ["Вдох животом", "Мягкое раскрытие вниз", "Выдох без сжатия", "10-15 спокойных циклов"],
        praise: "Ты молодец. Сегодня тело получило сигнал: можно отпускать.",
      },
      {
        id: "soft-control",
        title: "Мягкий контроль",
        duration: 6,
        motion: "pulse",
        tracker: "8 мягких повторов",
        intro: "Включение на 20-30% силы и полное расслабление после.",
        steps: ["Мягкое подтягивание", "2 секунды удержания", "Полный отпуск", "Проверка живота и ягодиц"],
        praise: "Отлично. Контроль начинается не с силы, а с точности.",
      },
    ],
  },
  {
    id: "hips",
    title: "Бедра и таз",
    caption: "мобильность, волна, энергия",
    x: "50%",
    y: "55%",
    practices: [
      {
        id: "pelvis-wave",
        title: "Волна таза",
        duration: 8,
        motion: "wave",
        tracker: "16 плавных волн",
        intro: "Фитнес-Камасутра: красивая пластика таза без пошлости и спешки.",
        steps: ["Таз назад на вдохе", "Грудь мягко вперед", "Таз вперед на выдохе", "Собери движение в волну"],
        praise: "Очень хорошо. Пластика приходит через мягкость, не через экзамен.",
      },
      {
        id: "rider-base",
        title: "База наездницы",
        duration: 10,
        motion: "rise",
        tracker: "3 круга по 8 движений",
        intro: "Ноги, ягодицы, амплитуда и уверенность в движении.",
        steps: ["Стопы шире таза", "Мягкая пружина вниз-вверх", "Маленький круг тазом", "Дыхание без зажима"],
        praise: "Сильно. Ты тренируешь не позу, а владение телом.",
      },
    ],
  },
  {
    id: "chest",
    title: "Грудь и дыхание",
    caption: "окситоцин, безопасность, расслабление",
    x: "50%",
    y: "34%",
    practices: [
      {
        id: "heart-breath",
        title: "Дыхание безопасности",
        duration: 4,
        motion: "breathe",
        tracker: "6 длинных выдохов",
        intro: "Практика для нервной системы, когда желание блокируется тревогой.",
        steps: ["Ладонь на грудь", "Вдох в ребра", "Длинный выдох", "Фраза: я в безопасности"],
        praise: "Нежно и точно. Безопасность часто важнее техники.",
      },
    ],
  },
];

const nlpCards = [
  {
    id: "pressure",
    belief: "Со мной что-то не так, если я не хочу",
    reframe: "Мое желание не сломано. Я могу возвращать контакт с телом постепенно.",
    ritual: "Положи ладонь на низ живота и повтори новую фразу 5 раз после длинного выдоха.",
  },
  {
    id: "shame",
    belief: "Мне нельзя быть слишком сексуальной",
    reframe: "Моя сексуальность может быть спокойной, красивой и моей.",
    ritual: "Выпрями спину, расслабь живот и скажи фразу медленно 3 раза.",
  },
  {
    id: "control",
    belief: "Я должна все делать правильно",
    reframe: "Я не сдаю экзамен. Я учусь чувствовать и выбирать свой ритм.",
    ritual: "Сделай 6 кругов тазом и каждый раз отпускай оценку.",
  },
];

const vault = [
  ["free", "◒", "Вводный материал: тазовое дно", "6 мин", "Бесплатно"],
  ["free", "✦", "Практика: обратный Кегель", "5 мин", "Бесплатно"],
  ["paid", "∿", "Закрытая запись: чувствительность", "18 мин", "Pro"],
  ["paid", "◇", "Практика: фитнес-Камасутра", "22 мин", "Pro"],
  ["paid", "⌁", "НЛП-сессия: новая команда тела", "12 мин", "Pro"],
  ["paid", "∞", "Медитация: сексуальная энергия", "14 мин", "Pro"],
];

const dailyCharacters = {
  soft: {
    title: "Мягкая волна",
    tone: "сегодня телу нужна нежность, дыхание и отсутствие давления",
    icon: "∿",
  },
  spark: {
    title: "Искра тела",
    tone: "сегодня можно добавить движение, таз и больше живости",
    icon: "✦",
  },
  magnet: {
    title: "Магнит",
    tone: "сегодня фокус на уверенности, пластике и чувственном внимании",
    icon: "∞",
  },
  calm: {
    title: "Тихая сила",
    tone: "сегодня лучше держать опору, спокойный ритм и бережный контакт",
    icon: "◐",
  },
};

const tabs = [
  ["pulse", "Пульс", "✦"],
  ["body", "Тело", "◒"],
  ["nlp", "НЛП", "⌁"],
  ["vault", "Практикум", "◇"],
  ["profile", "Профиль", "∞"],
];

function initialState() {
  return {
    appVersion: APP_VERSION,
    onboarded: false,
    intention: "health",
    symptoms: ["tension"],
    cycleKnown: true,
    cycleDay: 12,
    cycleLength: 28,
    phase: "follicular",
    experience: "beginner",
    minutes: 7,
    done: [],
    points: 120,
    checkin: { energy: 3, stress: 2, tension: 4, desire: 3 },
    beliefId: "pressure",
  };
}

function loadState() {
  const saved = localStorage.getItem("gensexa-state");
  if (!saved) return initialState();
  const parsed = JSON.parse(saved);
  if (parsed.appVersion !== APP_VERSION) return initialState();
  return { ...initialState(), ...parsed };
}

function saveState(state) {
  localStorage.setItem("gensexa-state", JSON.stringify(state));
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function BrandMark({ compact = false }) {
  return (
    <div className={cx("brand-mark", compact && "brand-mark--compact")}>
      <img src="/brand-icon.jpg" alt="" />
      <div className="brand-glow" />
    </div>
  );
}

function App() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState("pulse");
  const [zoneId, setZoneId] = useState("pelvic");
  const [practiceId, setPracticeId] = useState("reverse-kegel");

  useEffect(() => {
    const isNative = Boolean(window.Capacitor?.isNativePlatform?.());
    document.body.classList.toggle("native-app", isNative);
    tg?.ready();
    tg?.expand();
    tg?.setHeaderColor?.("#16021f");
    tg?.setBackgroundColor?.("#16021f");
  }, []);

  useEffect(() => saveState(state), [state]);

  const patchState = (patch) => setState((current) => ({ ...current, ...patch }));
  const complete = (id) => {
    setState((current) => ({
      ...current,
      points: current.done.includes(id) ? current.points : current.points + 15,
      done: current.done.includes(id) ? current.done : [...current.done, id],
    }));
  };

  if (!state.onboarded) return <Onboarding state={state} patchState={patchState} />;

  const zone = bodyZones.find((item) => item.id === zoneId) || bodyZones[0];
  const practice = zone.practices.find((item) => item.id === practiceId) || zone.practices[0];

  return (
    <div className="app-shell">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <header className="topbar">
        <div>
          <p className="micro">Ген сексуальности</p>
          <h1>{tabs.find((item) => item[0] === tab)?.[1]}</h1>
        </div>
        <BrandMark compact />
      </header>

      <main className="content">
        {tab === "pulse" && (
          <Pulse state={state} patchState={patchState} setTab={setTab} setZoneId={setZoneId} setPracticeId={setPracticeId} complete={complete} />
        )}
        {tab === "body" && (
          <Body zone={zone} practice={practice} setZoneId={setZoneId} setPracticeId={setPracticeId} complete={complete} done={state.done} />
        )}
        {tab === "nlp" && <Nlp state={state} patchState={patchState} complete={complete} />}
        {tab === "vault" && <Vault />}
        {tab === "profile" && <Profile state={state} patchState={patchState} />}
      </main>

      <nav className="tabbar">
        {tabs.map(([id, label, icon]) => (
          <button key={id} className={cx(tab === id && "is-active")} onClick={() => setTab(id)}>
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Onboarding({ state, patchState }) {
  const [step, setStep] = useState(0);
  const toggleSymptom = (id) => {
    const next = state.symptoms.includes(id) ? state.symptoms.filter((item) => item !== id) : [...state.symptoms, id];
    patchState({ symptoms: next });
  };

  return (
    <div className="onboarding">
      <div className="aurora aurora-one" />
      <BrandMark />
      {step === 0 && (
        <section className="onboarding-card">
          <p className="micro">умный старт</p>
          <h1>Соберем твой пульс дня</h1>
          <p>Приложение подберет практику тазового дна, движение, НЛП-ритуал и трекер с учетом цели и дня цикла.</p>
          <button className="primary" onClick={() => setStep(1)}>Начать диагностику</button>
        </section>
      )}
      {step === 1 && (
        <section className="onboarding-card">
          <h2>Что хочется изменить?</h2>
          <div className="choice-list">
            {intentions.map(([id, title, caption]) => (
              <button key={id} className={cx("choice-row", state.intention === id && "selected")} onClick={() => { patchState({ intention: id }); setStep(2); }}>
                <span><b>{title}</b><small>{caption}</small></span><i>→</i>
              </button>
            ))}
          </div>
        </section>
      )}
      {step === 2 && (
        <section className="onboarding-card">
          <h2>Что сейчас чувствуется?</h2>
          <div className="chip-grid">
            {symptoms.map(([id, label]) => (
              <button key={id} className={cx("chip", state.symptoms.includes(id) && "selected")} onClick={() => toggleSymptom(id)}>{label}</button>
            ))}
          </div>
          <button className="primary" onClick={() => setStep(3)}>Дальше</button>
        </section>
      )}
      {step === 3 && (
        <section className="onboarding-card">
          <h2>День цикла</h2>
          <p>Это поможет не давать телу лишнюю нагрузку и подбирать мягкость/энергию.</p>
          <div className="cycle-setup">
            <label><span>День</span><input type="number" min="1" max="45" value={state.cycleDay} onChange={(event) => patchState({ cycleDay: Number(event.target.value) })} /></label>
            <label><span>Длина</span><input type="number" min="21" max="40" value={state.cycleLength} onChange={(event) => patchState({ cycleLength: Number(event.target.value) })} /></label>
          </div>
          <button className="ghost" onClick={() => patchState({ cycleKnown: false })}>Не знаю день цикла</button>
          <button className="primary" onClick={() => setStep(4)}>Дальше</button>
        </section>
      )}
      {step === 4 && (
        <section className="onboarding-card">
          <h2>Твой формат</h2>
          <div className="minute-grid">
            {[3, 7, 12].map((minutes) => (
              <button key={minutes} className={cx("choice", state.minutes === minutes && "selected")} onClick={() => patchState({ minutes })}>
                {minutes}<span>минут</span>
              </button>
            ))}
          </div>
          <div className="choice-list">
            {["beginner", "soft", "active"].map((level) => (
              <button key={level} className={cx("choice-row", state.experience === level && "selected")} onClick={() => patchState({ experience: level })}>
                <span>{level === "beginner" ? "Я новичок" : level === "soft" ? "Хочу мягко" : "Готова активнее"}</span><b>✓</b>
              </button>
            ))}
          </div>
          <button className="primary" onClick={() => setStep(5)}>Собрать мой план</button>
        </section>
      )}
      {step === 5 && <OnboardingSummary state={state} patchState={patchState} />}
    </div>
  );
}

function OnboardingSummary({ state, patchState }) {
  const portrait = getOnboardingPortrait(state);
  return (
    <section className="onboarding-card summary-card">
      <p className="micro">готово</p>
      <h2>{portrait.title}</h2>
      <p>{portrait.text}</p>
      <div className="summary-grid">
        <span><b>Цель</b>{intentions.find(([id]) => id === state.intention)?.[1]}</span>
        <span><b>Цикл</b>{state.cycleKnown ? `${state.cycleDay} день` : "уточним позже"}</span>
        <span><b>Фокус</b>{portrait.focus}</span>
        <span><b>Ритм</b>{state.minutes} минут</span>
      </div>
      <div className="note">Сегодня я дам телесную практику, убеждение дня и короткий трекер. Без давления, но с живым daily-пульсом.</div>
      <button className="primary" onClick={() => patchState({ onboarded: true })}>Приступить</button>
    </section>
  );
}

function getOnboardingPortrait(state) {
  if (state.intention === "energy" || state.intention === "confidence") {
    return {
      title: "Я вижу запрос на энергию и пластичность",
      text: "Сегодняшний характер будет собираться через таз, бедра, дыхание и фитнес-Камасутру. Тазовое дно оставим базой безопасности.",
      focus: "движение",
    };
  }
  if (state.intention === "libido") {
    return {
      title: "Я вижу запрос на желание без давления",
      text: "Начнем с нервной системы, мягкого тазового дна и перепрошивки убеждений, которые гасят контакт с телом.",
      focus: "либидо",
    };
  }
  if (state.symptoms.includes("tension")) {
    return {
      title: "Я вижу напряжение в теле",
      text: "Первый этап - не качать сильнее, а научиться отпускать. Так чувствительность возвращается спокойнее.",
      focus: "расслабление",
    };
  }
  return {
    title: "Я собрала мягкий старт для здоровья",
    text: "Будем сочетать тазовое дно, цикл, короткие практики и наблюдение за энергией.",
    focus: "тазовое дно",
  };
}

function Pulse({ state, patchState, setTab, setZoneId, setPracticeId, complete }) {
  const recommendation = getDailyRecommendation(state);
  const character = getDailyCharacter(state);
  const cycleText = state.cycleKnown ? `${state.cycleDay} день цикла` : "цикл не указан";
  const bodyDone = state.done.includes(recommendation.body.id);
  const nlpDone = state.done.includes(`nlp-${recommendation.nlp.id}`);
  const level = Math.floor(state.points / 100) + 1;
  const levelProgress = state.points % 100;
  return (
    <div className="stack">
      <section className="daily-board">
        <div className="daily-board-head">
          <div>
            <p className="micro">пульс дня · {cycleText}</p>
            <h2>{recommendation.headline}</h2>
          </div>
          <button className="round-action" onClick={() => setTab("profile")}>⋯</button>
        </div>

        <div className="status-icons">
          <button className="status-tile status-tile--wide" onClick={() => setTab("body")}>
            <span>◒</span>
            <b>{character.title}</b>
            <small>{character.tone}</small>
          </button>
          <button className="status-tile" onClick={() => setTab("profile")}>
            <span>✦</span>
            <b>{state.points}</b>
            <small>сияние</small>
          </button>
          <button className="status-tile" onClick={() => setTab("profile")}>
            <span>↗</span>
            <b>{level}</b>
            <small>уровень</small>
          </button>
        </div>

        <div className="daily-progress">
          <i style={{ "--score": `${levelProgress}%` }} />
        </div>
      </section>

      <section className="today-actions">
        <div className="section-title">
          <p className="micro">сегодня</p>
          <h3>Три коротких шага</h3>
        </div>
        <DayItem done={bodyDone} label="Тело" title={recommendation.body.title} time={bodyDone ? "готово" : `${recommendation.body.duration} мин`} onClick={() => { setZoneId(recommendation.zone); setPracticeId(recommendation.body.id); setTab("body"); }} />
        <DayItem done={nlpDone} label="Убеждение дня" title={recommendation.nlp.reframe} time={nlpDone ? "в пульсе" : "4 мин"} onClick={() => setTab("nlp")} />
        <DayItem label="Материал" title="Вводный материал из практикума" time="free" onClick={() => setTab("vault")} />
      </section>

      <Checkin state={state} patchState={patchState} />
      <CalendarStrip state={state} patchState={patchState} />
    </div>
  );
}

function getDailyCharacter(state) {
  if (state.cycleKnown && state.cycleDay <= 5) return dailyCharacters.soft;
  if (state.intention === "energy") return dailyCharacters.spark;
  if (state.intention === "confidence") return dailyCharacters.magnet;
  if (state.checkin.stress >= 4 || state.symptoms.includes("tension")) return dailyCharacters.calm;
  return dailyCharacters.soft;
}

function DayItem({ label, title, time, done = false, onClick }) {
  return (
    <button className={cx("day-item", done && "is-done")} onClick={onClick}>
      <span><small>{label}</small><b>{title}</b></span>
      <i>{time}</i>
    </button>
  );
}

function getDailyRecommendation(state) {
  const nlp = nlpCards.find((item) => item.id === state.beliefId) || nlpCards[0];
  const wantEnergy = ["energy", "confidence"].includes(state.intention);
  const zone = wantEnergy ? "hips" : "pelvic";
  const body = wantEnergy ? bodyZones[1].practices[0] : bodyZones[0].practices[0];
  const headline = wantEnergy ? "Сегодня добавляем телу сладость движения" : "Сегодня мягко возвращаем контакт с тазовым дном";
  const caption = state.cycleDay > 24 ? "Фаза цикла ближе к мягкости: меньше давления, больше дыхания." : "День подходит для аккуратной практики и наблюдения.";
  return { headline, caption, zone, body, nlp };
}

function Checkin({ state, patchState }) {
  const update = (key, value) => patchState({ checkin: { ...state.checkin, [key]: value } });
  const sliders = [["energy", "Энергия"], ["stress", "Стресс"], ["tension", "Напряжение"], ["desire", "Желание"]];
  return (
    <section className="panel">
      <h3>Чек-ин тела</h3>
      {sliders.map(([key, label]) => (
        <label className="slider-row" key={key}>
          <span>{label}</span>
          <input type="range" min="1" max="5" value={state.checkin[key]} onChange={(event) => update(key, Number(event.target.value))} />
          <b>{state.checkin[key]}</b>
        </label>
      ))}
    </section>
  );
}

function CalendarStrip({ state, patchState }) {
  const length = Number(state.cycleLength) || 28;
  const current = Math.min(Math.max(Number(state.cycleDay) || 1, 1), length);
  const days = useMemo(() => Array.from({ length }, (_, index) => index + 1), [length]);
  const phase = getCyclePhase(current, length);
  return (
    <section className="cycle-card">
      <div className="card-head">
        <div>
          <p className="micro">календарь цикла</p>
          <h3>{current} день · {phase.title}</h3>
        </div>
        <span className="duration">{length} дней</span>
      </div>
      <p>{phase.advice}</p>
      <div className="cycle-phase-bar">
        <i style={{ "--cycle": `${(current / length) * 100}%` }} />
      </div>
      <div className="cycle-grid">
        {days.map((day) => (
          <button
            key={day}
            className={cx(
              day === current && "active",
              day <= 5 && "period",
              Math.abs(day - Math.round(length / 2)) <= 1 && "ovulation"
            )}
            onClick={() => patchState({ cycleDay: day, cycleKnown: true })}
          >
            {day}
          </button>
        ))}
      </div>
    </section>
  );
}

function getCyclePhase(day, length) {
  const ovulation = Math.round(length / 2);
  if (day <= 5) {
    return {
      title: "менструальная фаза",
      advice: "Лучше мягкость: дыхание, расслабление тазового дна, минимум давления.",
    };
  }
  if (day < ovulation - 2) {
    return {
      title: "рост энергии",
      advice: "Можно добавлять движение, мобилизацию таза и легкую пластичность.",
    };
  }
  if (Math.abs(day - ovulation) <= 2) {
    return {
      title: "пик чувствительности",
      advice: "Хороший день для пластики, контакта с телом и практик на удовольствие.",
    };
  }
  if (day < length - 5) {
    return {
      title: "ровный ритм",
      advice: "Держим регулярность: тазовое дно, короткий НЛП-ритуал и чек-ин.",
    };
  }
  return {
    title: "мягкое снижение",
    advice: "Больше заботы и меньше силы: расслабление, дыхание, спокойная практика.",
  };
}

function Body({ zone, practice, setZoneId, setPracticeId, complete, done }) {
  const [runningId, setRunningId] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [paused, setPaused] = useState(false);
  const activePractice = zone.practices.find((item) => item.id === runningId) || practice;
  const totalSeconds = Math.max(30, activePractice.duration * 60);
  const progress = runningId ? 1 - remaining / totalSeconds : 0;
  const stepIndex = Math.min(activePractice.steps.length - 1, Math.floor(progress * activePractice.steps.length));

  useEffect(() => {
    if (!runningId || paused || remaining <= 0) return;
    const timer = window.setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [runningId, paused, remaining]);

  useEffect(() => {
    if (runningId && remaining === 0) {
      complete(runningId);
      setRunningId(null);
      setPaused(false);
    }
  }, [runningId, remaining, complete]);

  const launch = (item) => {
    setPracticeId(item.id);
    setRunningId(item.id);
    setRemaining(Math.max(30, item.duration * 60));
    setPaused(false);
  };

  const finish = () => {
    complete(activePractice.id);
    setRunningId(null);
    setPaused(false);
    setRemaining(0);
  };

  return (
    <div className="stack">
      {!runningId && (
        <section className="body-map-panel">
          <div className="card-head">
            <div><p className="micro">сладость · фитнес-камасутра</p><h3>Выбери зону тела</h3></div>
            <span className="duration">{zone.title}</span>
          </div>
          <div className="body-visual">
            <div className="body-line" />
            {bodyZones.map((item) => (
              <button key={item.id} className={cx("zone-dot", zone.id === item.id && "active")} style={{ left: item.x, top: item.y }} onClick={() => { setZoneId(item.id); setPracticeId(item.practices[0].id); }} />
            ))}
          </div>
          <p>{zone.caption}</p>
        </section>
      )}

      {!runningId && (
        <section className="practice-list">
          <div className="card-head">
            <div>
              <p className="micro">практики зоны</p>
              <h3>{zone.title}</h3>
            </div>
            <span className="duration">{zone.practices.length} шт</span>
          </div>
          {zone.practices.map((item) => (
            <article key={item.id} className={cx("practice-option", item.id === practice.id && "selected")}>
              <div className={cx("motion-preview", `motion-${item.motion}`)}>
                <span className="figure-head" />
                <span className="figure-spine" />
                <span className="figure-hips" />
                <span className="figure-ribbon" />
              </div>
              <button className="practice-option-main" onClick={() => setPracticeId(item.id)}>
                <span>
                  <small>{item.tracker} · {item.duration} мин</small>
                  <b>{item.title}</b>
                  <em>{item.intro}</em>
                </span>
              </button>
              <button className="launch-button" onClick={() => launch(item)}>
                {done.includes(item.id) ? "Повторить" : "Запуск"}
              </button>
            </article>
          ))}
        </section>
      )}

      {runningId && (
        <section className="active-session">
          <div className="session-top">
            <button className="back" onClick={() => setRunningId(null)}>← Практики</button>
            <span className="duration">{activePractice.tracker}</span>
          </div>
          <div className={cx("motion-figure session-figure", `motion-${activePractice.motion}`, paused && "is-paused")}>
            <span className="figure-head" />
            <span className="figure-spine" />
            <span className="figure-hips" />
            <span className="figure-ribbon" />
          </div>
          <div className="timer-display">
            <span>{formatTime(remaining)}</span>
            <i style={{ "--session": `${progress * 100}%` }} />
          </div>
          <div className="instruction-card">
            <p className="micro">сейчас</p>
            <h2>{activePractice.steps[stepIndex]}</h2>
            <p>{activePractice.title} · {activePractice.intro}</p>
          </div>
          <div className="session-actions">
            <button className="ghost" onClick={() => setPaused((value) => !value)}>{paused ? "Продолжить" : "Пауза"}</button>
            <button className="primary" onClick={finish}>{done.includes(activePractice.id) ? activePractice.praise : "Завершить"}</button>
          </div>
        </section>
      )}

    </div>
  );
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}

function Nlp({ state, patchState, complete }) {
  const card = nlpCards.find((item) => item.id === state.beliefId) || nlpCards[0];
  return (
    <div className="stack">
      <section className="nlp-hero">
        <div className="consultant-avatar">⌁</div>
        <div>
          <p className="micro">НЛП · 4 минуты</p>
          <h2>Переписать сценарий дня</h2>
          <p>Выбери фразу, которую тело держит как напряжение. Приложение даст новую команду и короткий телесный якорь.</p>
        </div>
      </section>
      <section className="belief-card">
        <div className="rewrite-flow">
          <div><span>1</span><small>старый сценарий</small><b>{card.belief}</b></div>
          <div><span>2</span><small>новая команда</small><b>{card.reframe}</b></div>
          <div><span>3</span><small>якорь в теле</small><b>{card.ritual}</b></div>
        </div>
        <button className="primary" onClick={() => complete(`nlp-${card.id}`)}>Переписала сегодня</button>
      </section>
      <section className="practice-grid">
        {nlpCards.map((item) => (
          <button key={item.id} className={cx("mini-card", item.id === card.id && "selected")} onClick={() => patchState({ beliefId: item.id })}>
            <span>убеждение</span><b>{item.belief}</b><small>4 мин</small>
          </button>
        ))}
      </section>
    </div>
  );
}

function Vault() {
  return (
    <div className="stack">
      <section className="paywall">
        <BrandMark compact />
        <h2>Практикум</h2>
        <p>Здесь будут записи клиента: бесплатная база и закрытые материалы Pro. Сейчас это структура витрины, чтобы показать механику доступа.</p>
      </section>
      {vault.map(([access, icon, title, time, badge]) => (
        <button key={title} className={cx("lesson-row", access === "paid" && "locked")}>
          <em>{icon}</em>
          <span><b>{title}</b><small>{time}</small></span>
          <i>{access === "paid" ? "🔒 " : ""}{badge}</i>
        </button>
      ))}
      <section className="panel">
        <h3>Покупка курса</h3>
        <div className="course-links">
          <a href="https://annashilko.com/energysex" target="_blank" rel="noreferrer">Ген сексуальности</a>
          <a href="https://annashilko.com/new" target="_blank" rel="noreferrer">Наездница. Уровень ТОП</a>
        </div>
      </section>
    </div>
  );
}

function Profile({ state, patchState }) {
  const level = Math.floor(state.points / 100) + 1;
  const character = getDailyCharacter(state);
  return (
    <div className="stack">
      <section className="profile-card">
        <BrandMark compact />
        <div><p className="micro">персонаж дня</p><h2>{character.title}</h2><p>{state.points} сияния · уровень {level}</p></div>
      </section>
      <section className="panel">
        <h3>Настройки пульса</h3>
        <div className="insights">
          <span>Цель: {intentions.find(([id]) => id === state.intention)?.[1]}</span>
          <span>День цикла: {state.cycleKnown ? state.cycleDay : "не указан"}</span>
          <span>Формат: {state.minutes} минут</span>
          <span>Сегодня: {character.title}</span>
        </div>
      </section>
      <section className="panel settings-panel">
        <h3>Изменить цель</h3>
        <div className="chip-grid">
          {intentions.map(([id, label]) => (
            <button key={id} className={cx("chip", state.intention === id && "selected")} onClick={() => patchState({ intention: id })}>{label}</button>
          ))}
        </div>
      </section>
      <section className="panel settings-panel">
        <h3>Цикл и ритм</h3>
        <label className="cycle-row"><span>День цикла</span><input type="number" min="1" max="45" value={state.cycleDay} onChange={(event) => patchState({ cycleDay: Number(event.target.value), cycleKnown: true })} /><b></b></label>
        <div className="minute-grid">
          {[3, 7, 12].map((minutes) => (
            <button key={minutes} className={cx("choice", state.minutes === minutes && "selected")} onClick={() => patchState({ minutes })}>
              {minutes}<span>мин</span>
            </button>
          ))}
        </div>
        <button className="ghost secondary-reset" onClick={() => patchState({ onboarded: false })}>Пересобрать онбординг</button>
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
