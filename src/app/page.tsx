"use client";
import { ThreeJs3DViewerStudioPlugin } from "@/plugins/threeJsPlugin";
import grapesjs from "grapesjs";
import GjsEditor from "@grapesjs/react";
import { useCallback } from "react";
import { TailwindCssPlugin } from "@/plugins/tailwindcssPlugin";

export default function Page() {
  const onEditor = useCallback((editor: any) => {
    // Simple React-like component
    editor.BlockManager.add("react-box", {
      label: "React Box",
      category: "React",
      content: {
        type: "react-box",
      },
    });

    editor.DomComponents.addType("react-box", {
      model: {
        defaults: {
          tagName: "div",
          attributes: { class: "react-box" },
          components: [
            {
              tagName: "h3",
              content: "Hello from React Component 👋",
            },
            {
              tagName: "p",
              content: "This block was added via @grapesjs/react",
            },
          ],
          style: {
            padding: "16px",
            background: "#f4f4f5",
            borderRadius: "8px",
            textAlign: "center",
          },
        },
      },
    });
  }, []);

  return (
    <GjsEditor
      grapesjs={grapesjs}
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      onEditor={onEditor}
      options={{
        height: "100vh",
        storageManager: false,
      }}
      plugins={[ThreeJs3DViewerStudioPlugin, TailwindCssPlugin]}
    ></GjsEditor>
  );
}
