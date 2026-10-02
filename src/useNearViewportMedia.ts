import { useEffect, useState, type RefObject } from "react";

export default function useNearViewportMedia<T extends Element>(
  targetRef: RefObject<T | null>,
  rootMargin = "1000px 0px",
) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || shouldLoad) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [rootMargin, shouldLoad, targetRef]);

  return shouldLoad;
}
