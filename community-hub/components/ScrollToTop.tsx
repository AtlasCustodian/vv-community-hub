"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Disable browser's automatic scroll restoration so it doesn't fight us
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // useLayoutEffect fires synchronously before the browser paints,
  // so we scroll before any scroll restoration can kick in
  useLayoutEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    window.scrollTo(0, 0);

    // Belt-and-suspenders: also scroll after paint in case
    // the new page content shifts layout during render
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [pathname]);

  return null;
}
