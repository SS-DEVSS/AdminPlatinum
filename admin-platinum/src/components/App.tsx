import { useNavigation, useOutlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "./Loader";

export const App = () => {
  const navigation = useNavigation();
  const outlet = useOutlet();
  const [showLoader, setShowLoader] = useState(false);
  const [loaderStartTime, setLoaderStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (navigation.state === "loading") {
      setLoaderStartTime(Date.now());
      setShowLoader(true);
    } else if (navigation.state === "idle" && showLoader) {
      // Ensure loader is shown for at least 600ms for better UX
      const elapsed = loaderStartTime ? Date.now() - loaderStartTime : 0;
      const minDisplayTime = 600;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);
      
      setTimeout(() => {
        setShowLoader(false);
        setLoaderStartTime(null);
      }, remainingTime);
    }
  }, [navigation.state, showLoader, loaderStartTime]);

  // Show only loader during navigation, hide content
  if (showLoader) {
    return <Loader fullScreen message="Cargando..." />;
  }

  return <>{outlet}</>;
};

