import React, { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import axios from "axios";

export default function App() {
  const [code, setCode] = useState(`name = input("Enter your name: ")\nprint("Hello", name)`);
  const [input, setInput] = useState("Ali");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    try {
      const res = await axios.post("https://code-editor-terminal.onrender.com/run", { code, input });
      setOutput(res.data.output);
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Code Editor with Terminal</h1>

      <CodeEditor code={code} setCode={setCode} />

      <div className="mt-4">
        <label className="block font-medium mb-1">Input (if any):</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700"
          placeholder="Enter multiple inputs, line by line..."
        />
      </div>

      <button
        onClick={runCode}
        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Run Code
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Output:</h2>
        <pre className="bg-black p-4 mt-2 rounded text-green-400 whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
}
