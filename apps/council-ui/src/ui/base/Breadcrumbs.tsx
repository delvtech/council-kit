import Link from "next/link";
import { ReactElement, ReactNode } from "react";

interface BreadcrumbProps {
  crumbs: {
    href: string;
    content: ReactNode;
  }[];
  currentPage: ReactNode;
}

/**
 * Create a chain of breadcrumb links to show the user where they currently are
 * within the UI.
 *
 * @example
 *
 * ```tsx
 * <Breadcrumbs
 *   crumbs={[
 *     { href: "/", content: "Home" },
 *     { href: Routes.PROPOSALS, content: "All proposals" },
 *   ]}
 *   currentPage="Proposal 4"
 * />
 * ```
 */
export function Breadcrumbs({
  crumbs,
  currentPage,
}: BreadcrumbProps): ReactElement {
  return (
    <div className="daisy-breadcrumbs text-lg md:text-base lg:text-sm">
      <ul>
        {crumbs.map(({ href, content }, i) => (
          <li key={i}>
            <Link href={href} className="opacity-50 hover:opacity-100">
              {content}
            </Link>
          </li>
        ))}
        <li>{currentPage}</li>
      </ul>
    </div>
  );
}
