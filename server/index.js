import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/run', (req, res) => {
    const { code, input } = req.body;

    const codeId = uuidv4();
    const codeFile = `code-${codeId}.py`;
    const inputFile = `input-${codeId}.txt`;

    // Relative paths inside container
    const codePath = path.join(process.cwd(), codeFile);
    const inputPath = path.join(process.cwd(), inputFile);

    try {
        writeFileSync(codePath, code);
        if (input) writeFileSync(inputPath, input);

        // Run python code inside container (python3 command)
        const cmd = input
            ? `python3 ${codeFile} < ${inputFile}`
            : `python3 ${codeFile}`;

        exec(cmd, { cwd: process.cwd() }, (err, stdout, stderr) => {
            // Cleanup temp files
            try {
                unlinkSync(codePath);
                if (input) unlinkSync(inputPath);
            } catch (cleanupErr) {
                console.error("Cleanup error:", cleanupErr);
            }

            if (err) {
                return res.json({ output: stderr || err.message });
            }

            return res.json({ output: stdout });
        });
    } catch (e) {
        return res.json({ output: 'Error: ' + e.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
