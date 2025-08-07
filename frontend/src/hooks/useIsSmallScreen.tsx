import { useEffect, useState } from "react";

export const useIsSmallScreen = ():boolean => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
		const checkSmallScreen = () => {
			setIsSmallScreen(window.innerWidth < 768);
		};

		checkSmallScreen();
		window.addEventListener("resize", checkSmallScreen);

		return () => window.removeEventListener("resize", checkSmallScreen);
	}, []);

  return isSmallScreen;
}