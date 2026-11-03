import { useEffect } from "react";

export default function usePageTitle(pageName: string) {
  useEffect(() => {
    document.title = pageName;
  }, [pageName]);
}
