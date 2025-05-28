import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, setCode }) => {
  return (
    <div>
      <label className="block font-medium mb-1">Code Editor:</label>
      <Editor
        height="300px"
        language="python"
        theme="vs-dark"
        value={code}
        onChange={(newValue) => setCode(newValue)}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
        }}
      />
    </div>
  );
};

export default CodeEditor;
