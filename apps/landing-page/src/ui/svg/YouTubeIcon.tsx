import { ReactElement } from "react";

interface YouTubeIconProps {
  className?: string;
}

export function YouTubeIcon({ className }: YouTubeIconProps): ReactElement {
  return (
    <svg
      viewBox="0 0 176 124"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M172.32 19.36C170.3 11.74 164.33 5.74 156.76 3.7C143.04 0 88 0 88 0C88 0 32.96 0 19.24 3.7C11.67 5.74 5.7 11.74 3.68 19.36C0 33.18 0 62 0 62C0 62 0 90.82 3.68 104.64C5.7 112.26 11.67 118.26 19.24 120.3C32.97 124 88 124 88 124C88 124 143.04 124 156.76 120.3C164.33 118.26 170.3 112.26 172.32 104.64C176 90.83 176 62 176 62C176 62 176 33.18 172.32 19.36ZM70 88.17V35.83L116 62L70 88.17Z" />
      <clipPath>
        <rect width="176" height="124" />
      </clipPath>
    </svg>
  );
}
