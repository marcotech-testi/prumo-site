import type { ComponentPropsWithoutRef, ElementType } from "react";

type Props<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

export function Container<T extends ElementType = "div">({
  as,
  className = "",
  ...rest
}: Props<T>) {
  const Tag = as ?? "div";
  return <Tag className={`mx-auto w-full max-w-[1200px] px-5 md:px-10 ${className}`} {...rest} />;
}
