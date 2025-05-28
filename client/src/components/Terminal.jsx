// src/components/Terminal.jsx
const Terminal = ({ output }) => {
  return (
    <div className="bg-black text-green-500 p-4 h-64 overflow-y-auto rounded border border-green-500">
      <pre>{output}</pre>
    </div>
  )
}

export default Terminal
