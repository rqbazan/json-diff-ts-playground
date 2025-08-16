import "nprogress/nprogress.css";
import nProgress from "nprogress";
import { useEffect } from "react";

export type UseNProgressBarOptions = {
  parent?: string;
  delayedTimeout?: number;
};

export function useNProgressBar({ parent, delayedTimeout }: UseNProgressBarOptions) {
  useEffect(() => {
    nProgress.configure({
      parent,
      showSpinner: false,
    });
  }, [parent]);

  return {
    start: () => nProgress.start(),
    done: () => nProgress.done(),
    delayed: (timeout?: number) => {
      nProgress.start();
      setTimeout(() => nProgress.done(), timeout ?? delayedTimeout ?? 700);
    },
  };
}
