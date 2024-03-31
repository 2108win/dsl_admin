import { toolbarOptions } from "@/constants/quillBar";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = () => {
  const [editorValue, setEditorValue] = useState("");

  return (
    <ReactQuill
      value={editorValue}
      onChange={(value) => setEditorValue(value)}
      modules={{
        toolbar: toolbarOptions,
      }}
      theme="snow"
    />
  );
};

export default TextEditor;
