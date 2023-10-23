import { useCallback, useEffect, useState } from "react";

function getColorThemeFromBodyEl() {
  const bodyEl = document.querySelector("body");
  if (bodyEl.classList.contains("dt-polar-dark")) return "polar-dark";
  else if (bodyEl.classList.contains("dt-polar-light")) return "polar-light";
  else return "";
}

/**
 * Handles managing the state of the color theme which is set on the <body> element
 *
 * @example const [colorTheme, setColorTheme] = useColorTheme();
 * @returns {[string, Function]}
 */
export function useColorTheme(useDeviceSettings = false) {
  const [colorTheme, setColorTheme] = useState(getColorThemeFromBodyEl());

  const setColorThemeOnBodyEl = useCallback((theme) => {
    if (typeof theme === "function") theme = theme(colorTheme);

    const bodyEl = document.querySelector("body");
    if (bodyEl.classList.contains("dt-polar-dark") && theme !== "polar-dark") bodyEl.classList.remove(`dt-polar-dark`);
    if (bodyEl.classList.contains("dt-polar-light") && theme !== "polar-light") bodyEl.classList.remove(`dt-polar-light`);
    if (theme && !bodyEl.classList.contains(`dt-${theme}`)) bodyEl.classList.add(`dt-${theme}`);
    setColorTheme(theme);
  }, []);

  function changeDeviceSettingsColorThemeEventListener({ matches }) {
    if (!useDeviceSettings) return;
    if (matches) setColorThemeOnBodyEl("polar-dark");
    else setColorThemeOnBodyEl("polar-light");
  }

  useEffect(() => {
    // add class change listener to the body element
    const bodyEl = document.querySelector("body");
    const observer = new MutationObserver(() => setColorTheme(getColorThemeFromBodyEl()));
    observer.observe(bodyEl, { attributeFilter: ["class"] });

    // allow changing by device settings (useDeviceSettings)
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeDeviceSettingsColorThemeEventListener);

    return () => {
      observer.disconnect();
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", changeDeviceSettingsColorThemeEventListener);
    };
  }, []);

  return [colorTheme, setColorThemeOnBodyEl];
}
