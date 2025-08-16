import "./style.css";
import nProgress from "nprogress";
import { useEffect } from "react";

export type UseNProgressBarOptions = {
  parent?: string;
};

export function useNProgressBar({ parent }: UseNProgressBarOptions) {
  useEffect(() => {
    nProgress.configure({
      parent,
      // @ts-expect-error untyped option
      prepend: true,
    });
  }, [parent]);

  return nProgress;
}
