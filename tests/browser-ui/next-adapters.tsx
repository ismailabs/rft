import React, { lazy, Suspense } from "react";
export function useRouter() {
  return {
    refresh: () => {},
    push: (href: string) => location.assign(href),
    replace: (href: string) => location.replace(href),
  };
}
export function Link({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
export function dynamic(loader: () => Promise<React.ComponentType<object>>) {
  const Component = lazy(async () => ({ default: await loader() }));
  return function Deferred(props: object) {
    return (
      <Suspense fallback={null}>
        <Component {...props} />
      </Suspense>
    );
  };
}
