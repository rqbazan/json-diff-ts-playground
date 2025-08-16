import "nprogress/nprogress.css";
import nProgress, { type NProgress } from "nprogress";
import { type Ref, useEffect, useImperativeHandle } from "react";

type NProgressBarProps = {
  id?: string;
  ref: Ref<NProgress>;
};

export type { NProgress };

export function NProgressBar({ id = "nprogress-container", ref }: NProgressBarProps) {
  useEffect(() => {
    nProgress.configure({
      parent: `#${id}`,
    });
  }, [id]);

  useImperativeHandle(ref, () => nProgress, []);

  return <div id={id} style={{ height: 2, position: "sticky", top: 0, width: "100%" }} />;
}
