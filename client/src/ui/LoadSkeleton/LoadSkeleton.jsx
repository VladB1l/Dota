import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadSkeleton = () => (
  <div>
    <Skeleton circle width={100} height={100} />
    <Skeleton height={30} width={200} />
  </div>
);

export default LoadSkeleton;
