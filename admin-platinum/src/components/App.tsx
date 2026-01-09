import { useNavigation, useOutlet } from "react-router-dom";
import Loader from "./Loader";

export const App = () => {
  const navigation = useNavigation();
  const outlet = useOutlet();

  // Show only loader during navigation, hide content
  if (navigation.state === "loading") {
    return <Loader fullScreen message="Cargando..." />;
  }

  return <>{outlet}</>;
};

