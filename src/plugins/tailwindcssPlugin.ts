import { Editor } from "grapesjs";
import grapeTailwindcssPlugin from "grapesjs-tailwindcss-plugin";

export const TailwindCssPlugin = (editor: Editor) => {
  grapeTailwindcssPlugin(editor, {
    autobuild: true,
    autocomplete: false, // Prevents UI collision with Studio
  });
};
