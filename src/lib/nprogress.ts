import "nprogress/nprogress.css";
import nProgress from "nprogress";
import { useEffect } from "react";

export type UseNProgressBarOptions = {
  parent?: string;
  delayedTimeout?: number;
};

export function useNProgressBar({ parent }: UseNProgressBarOptions) {
  useEffect(() => {
    nProgress.configure({
      parent,
      showSpinner: false,
    });
  }, [parent]);

  return nProgress;
}
