import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/run', (req, res) => {
    const { code, input } = req.body;

    const codeId = uuidv4();
    const codeFile = `code-${codeId}.py`;
    const inputFile = `input-${codeId}.txt`;
    const codePath = path.join(process.cwd(), codeFile);
    const inputPath = path.join(process.cwd(), inputFile);

    try {
        writeFileSync(codePath, code);
        if (input) writeFileSync(inputPath, input);

        const baseCmd = `docker run --rm -v "${process.cwd().replace(/\\/g, "/")}:/app" python:3.11-slim`;

        const dockerCmd = input
            ? `${baseCmd} sh -c "python /app/${codeFile} < /app/${inputFile}"`
            : `${baseCmd} python /app/${codeFile}`;

        exec(dockerCmd, (err, stdout, stderr) => {
            try {
                unlinkSync(codePath);
                if (input) unlinkSync(inputPath);
            } catch (cleanupErr) {
                console.error("Cleanup Error:", cleanupErr);
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
