import "./styles.css";

import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import Image from "@tiptap/extension-image";

import { Controller, useForm } from "react-hook-form";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const buttonBaseStyles = "px-2 py-1 rounded border border-gray-300";
  const activeButtonStyles = "bg-primary text-white";
  const inactiveButtonStyles = "bg-secondary text-gray-700";
  const addImage = () => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${buttonBaseStyles} ${
          editor.isActive("heading", { level: 1 })
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        h1
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${buttonBaseStyles} ${
          editor.isActive("heading", { level: 2 })
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${buttonBaseStyles} ${
          editor.isActive("heading", { level: 3 })
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`${buttonBaseStyles} ${
          editor.isActive("paragraph")
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${buttonBaseStyles} ${
          editor.isActive("bold") ? activeButtonStyles : inactiveButtonStyles
        }`}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${buttonBaseStyles} ${
          editor.isActive("italic") ? activeButtonStyles : inactiveButtonStyles
        }`}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${buttonBaseStyles} ${
          editor.isActive("strike") ? activeButtonStyles : inactiveButtonStyles
        }`}
      >
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`${buttonBaseStyles} ${
          editor.isActive("highlight")
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        highlight
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`${buttonBaseStyles} ${
          editor.isActive({ textAlign: "left" })
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`${buttonBaseStyles} ${
          editor.isActive({ textAlign: "center" })
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`${buttonBaseStyles} ${
          editor.isActive({ textAlign: "right" })
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        right
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`${buttonBaseStyles} ${
          editor.isActive({ textAlign: "justify" })
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        justify
      </button>
      <button
        className={`${(buttonBaseStyles, inactiveButtonStyles)} `}
        onClick={addImage}
      >
        add image from URL
      </button>
    </>
  );
};

export default ({ setValue, field }) => {
  const editor = useEditor({
    onUpdate: ({ editor }) => {
      console.log("updating to", editor.getHTML());
      // Update the form field value when the editor's content changes
      field.onChange(editor.getHTML());
    },
    onMounted: () => {
      // Set the initial value when the editor is mounted
      setValue(fieldName, editor.getHTML());
      console.log("mounte");
    },
    extensions: [
      StarterKit,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: ``,
  });

  return (
    <div>
      <MenuBar editor={editor} />
      {console.log(editor?.getHTML())}
      <EditorContent editor={editor} />
    </div>
  );
};
