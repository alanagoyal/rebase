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
        onClick={(e) => {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
          e.preventDefault();
        }}
        className={`${buttonBaseStyles} ${
          editor.isActive("heading", { level: 1 })
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        h1
      </button>

      <button
        onClick={(e) => {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
          e.preventDefault();
        }}
        className={`${buttonBaseStyles} ${
          editor.isActive("heading", { level: 2 })
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        h2
      </button>
      <button
        onClick={(e) => {
          editor.chain().focus().toggleHeading({ level: 3 }).run();
          e.preventDefault();
        }}
        className={`${buttonBaseStyles} ${
          editor.isActive("heading", { level: 3 })
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        h3
      </button>
      <button
        onClick={(e) => {
          editor.chain().focus().setParagraph().run();
          e.preventDefault();
        }}
        className={`${buttonBaseStyles} ${
          editor.isActive("paragraph")
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        paragraph
      </button>
      <button
        onClick={(e) => {
          editor.chain().focus().toggleBold().run();
          e.preventDefault();
        }}
        className={`${buttonBaseStyles} ${
          editor.isActive("bold") ? activeButtonStyles : inactiveButtonStyles
        }`}
      >
        bold
      </button>
      <button
        onClick={(e) => {
          editor.chain().focus().toggleItalic().run();
          e.preventDefault();
        }}
        className={`${buttonBaseStyles} ${
          editor.isActive("italic") ? activeButtonStyles : inactiveButtonStyles
        }`}
      >
        italic
      </button>
      <button
        onClick={(e) => {
          editor.chain().focus().toggleStrike().run();
          e.preventDefault();
        }}
        className={`${buttonBaseStyles} ${
          editor.isActive("strike") ? activeButtonStyles : inactiveButtonStyles
        }`}
      >
        strike
      </button>
      <button
        onClick={(e) => {
          editor.chain().focus().toggleHighlight().run();
          e.preventDefault();
        }}
        className={`${buttonBaseStyles} ${
          editor.isActive("highlight")
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        highlight
      </button>
      <button
        onClick={(e) => {
          editor.chain().focus().setTextAlign("left").run();
          e.preventDefault();
        }}
        className={`${buttonBaseStyles} ${
          editor.isActive({ textAlign: "left" })
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        left
      </button>
      <button
        onClick={(e) => {
          editor.chain().focus().setTextAlign("center").run();
          e.preventDefault();
        }}
        className={`${buttonBaseStyles} ${
          editor.isActive({ textAlign: "center" })
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        center
      </button>
      <button
        onClick={(e) => {
          editor.chain().focus().setTextAlign("right").run();
          e.preventDefault();
        }}
        className={`${buttonBaseStyles} ${
          editor.isActive({ textAlign: "right" })
            ? activeButtonStyles
            : inactiveButtonStyles
        }`}
      >
        right
      </button>
      <button
        onClick={(e) => {
          editor.chain().focus().setTextAlign("justify").run();
          e.preventDefault();
        }}
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
      // Update the form field value when the editor's content changes
      field.onChange(editor.getHTML());
    },
    onMounted: () => {
      // Set the initial value when the editor is mounted
      setValue(fieldName, editor.getHTML());
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
      <EditorContent editor={editor} />
    </div>
  );
};
