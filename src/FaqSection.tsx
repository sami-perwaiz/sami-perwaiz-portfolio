import { useRef, useState } from "react";
import { a } from "./assets";

const FAQ_TAP_MOVE_TOLERANCE = 10;
const FAQ_HOVER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";

type FaqTouchGesture = {
  pointerId: number;
  startX: number;
  startY: number;
  moved: boolean;
};

const faqItems = [
  {
    question: "What kind of projects do you enjoy working on?",
    answer:
      "I enjoy working on websites, mobile apps, SaaS products, dashboards, and digital experiences where thoughtful design can turn a complex idea into something simple and enjoyable to use.",
  },
  {
    question: "How do you approach a new design project?",
    answer:
      "I start by understanding the problem, the people using the product, and the goals behind it. From there, I explore ideas, build wireframes, refine the visual direction, prototype the experience, and keep improving it until everything feels right.",
  },
  {
    question: "What's it like working with you?",
    answer:
      "I like keeping the process open, collaborative, and easy to follow. I share progress along the way, listen to feedback, and make sure every design decision has a clear purpose.",
  },
  {
    question: "Do you collaborate with developers and product teams?",
    answer:
      "Absolutely. I enjoy working closely with developers and product teams from early ideas through the final product, making sure the design is thoughtful, practical, and ready to build.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Every project is different, so the timeline depends on its scope and complexity. I keep the process focused and organized, with clear milestones so the work keeps moving without unnecessary delays.",
  },
  {
    question: "What's the best way to get started?",
    answer:
      "Simply send me a message and tell me a little about what you're working on. Whether you have a clear direction or just an early idea, we can start from there.",
  },
] as const;

function FaqAnswer({ isOpen, answer }: { isOpen: boolean; answer: string }) {
  return (
    <div className={`faq-answer${isOpen ? " is-open" : ""}`} aria-hidden={!isOpen}>
      <div className="faq-answer-inner">
        <p className="faq-a sf sf-reg">{answer}</p>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const touchGestureRef = useRef<FaqTouchGesture | null>(null);
  const lastTouchTimestampRef = useRef(0);

  const canUseHover = () =>
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function" ||
    window.matchMedia(FAQ_HOVER_MEDIA_QUERY).matches;

  const isSyntheticMouseEvent = () => Date.now() - lastTouchTimestampRef.current < 700;

  const handlePointerEnter = (event: React.PointerEvent<HTMLElement>, index: number) => {
    if (event.pointerType !== "mouse" || !canUseHover() || isSyntheticMouseEvent()) return;

    setOpenIndex(index);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !canUseHover() || isSyntheticMouseEvent()) return;

    setOpenIndex(null);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "touch" || !event.isPrimary) {
      touchGestureRef.current = null;
      return;
    }

    lastTouchTimestampRef.current = Date.now();
    touchGestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const gesture = touchGestureRef.current;
    if (!gesture || event.pointerId !== gesture.pointerId) return;

    if (
      Math.abs(event.clientX - gesture.startX) > FAQ_TAP_MOVE_TOLERANCE ||
      Math.abs(event.clientY - gesture.startY) > FAQ_TAP_MOVE_TOLERANCE
    ) {
      gesture.moved = true;
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>, index: number) => {
    const gesture = touchGestureRef.current;
    if (!gesture || event.pointerId !== gesture.pointerId) return;

    touchGestureRef.current = null;
    lastTouchTimestampRef.current = Date.now();

    const movedBeyondTapTolerance =
      gesture.moved ||
      Math.abs(event.clientX - gesture.startX) > FAQ_TAP_MOVE_TOLERANCE ||
      Math.abs(event.clientY - gesture.startY) > FAQ_TAP_MOVE_TOLERANCE;

    if (movedBeyondTapTolerance) return;

    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLElement>) => {
    if (touchGestureRef.current?.pointerId === event.pointerId) {
      touchGestureRef.current = null;
    }
  };

  return (
    <section className="section faq">
      <div className="section-head faq-head">
        <h2 className="sf sf-med">Popular Queries</h2>
        <p className="sf sf-reg">
          From strategy to execution, we’re trusted to deliver outcomes that make a difference.
        </p>
      </div>

      <div className="faq-list">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <article
              className="faq-item"
              key={item.question}
              onPointerEnter={(event) => handlePointerEnter(event, index)}
              onPointerLeave={handlePointerLeave}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={(event) => handlePointerUp(event, index)}
              onPointerCancel={handlePointerCancel}
            >
              <div className={`faq-row${isOpen ? " is-open" : ""}`} aria-expanded={isOpen}>
                <div className="faq-content">
                  <p className="faq-q sf sf-reg">{item.question}</p>
                  <FaqAnswer isOpen={isOpen} answer={item.answer} />
                </div>
                <div className="faq-toggle" aria-hidden="true">
                  <img className="faq-icon faq-icon--plus" src={a.faqPlus} alt="" loading="lazy" decoding="async" />
                  <img className="faq-icon faq-icon--minus" src={a.faqMinus} alt="" loading="lazy" decoding="async" />
                </div>
              </div>
              <div className="faq-line" aria-hidden="true">
                <img src={a.faqLine} alt="" loading="lazy" decoding="async" />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
