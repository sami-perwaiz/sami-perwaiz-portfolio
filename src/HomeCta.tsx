import Snake from "./Snake";

export default function HomeCta() {
  return (
    <section className="cta-wrap">
      <div className="cta">
        <div className="cta-copy">
          <div className="cta-text">
            <h2>Your Idea, Thoughtfully Designed</h2>
            <p>Let's transform your vision into a simple, engaging experience that people genuinely enjoy using.</p>
          </div>
          <div className="cta-btn">
            <span>Start Something New</span>
          </div>
        </div>
        <div className="cta-art">
          <Snake />
        </div>
      </div>
    </section>
  );
}
