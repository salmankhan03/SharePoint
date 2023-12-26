import React from "react";
import { Skeleton as SkeletonAntd } from "antd";

const paragraph = { rows: 1 };

const Skeleton = ({ loading, children }) => (
  <SkeletonAntd loading={loading} paragraph={paragraph} title={false} active>
    {children}
  </SkeletonAntd>
);

export default Skeleton;
