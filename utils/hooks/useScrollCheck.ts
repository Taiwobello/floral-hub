import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

const useScrollCheck = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  const hasScrolledRef = useRef(hasScrolled);
  const { pathname: _pathname } = useRouter();
  const pathname = _pathname.split("/").pop();

  useEffect(() => {
    hasScrolledRef.current = hasScrolled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasScrolled]);

  const onUserScroll = useCallback(() => {
    if (hasScrolledRef.current && window.scrollY === 0) {
      setHasScrolled(false);
    } else if (!hasScrolledRef.current && window.scrollY > 0) {
      setHasScrolled(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onUserScroll);
    return () => {
      window.removeEventListener("scroll", onUserScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return hasScrolled;
};

export default useScrollCheck;
