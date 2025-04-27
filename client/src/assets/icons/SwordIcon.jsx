import React from "react";

const SwortIcon = ({ className, size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    className={className}
    height={size}
    width={size}
    fill="none"
  >
    <path d="M0 0h256v256H0z" fill="none" />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
      d="m76.2 132.2 76-92L216 40l-.2 63.8-92 76M100 156l60-60"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
      d="m82.1 197.5-29.9 29.9a8 8 0 0 1-11.3 0l-12.3-12.3a8 8 0 0 1 0-11.3l29.9-29.9a8 8 0 0 0 0-11.4l-20.8-20.8a8 8 0 0 1 0-11.4l12.6-12.6a8 8 0 0 1 11.4 0l76.6 76.6a8 8 0 0 1 0 11.4l-12.6 12.6a8 8 0 0 1-11.4 0l-20.8-20.8a8 8 0 0 0-11.4 0"
    />
  </svg>
);

export default SwortIcon;
