# Wild-Sense-Enhanced
# WildSense — Local nature companion

A responsive nature-mission website with searchable outdoor activities, saved progress, a private field journal, and optional local AI chat through Ollama.

## Files

- `index.html` — page structure and content
- `style.css` — responsive styling and light/dark themes
- `app.js` — mission search and duration filters, progress meter, random mission picker, browser-local journal, export, and chat UI
- `server.py` — local web server and Ollama API bridge (Python standard library only)
- `start.bat` — Windows launcher
- `.gitignore` — excludes local environment and generated files

## Run on Windows

1. Install **Python 3** from <https://www.python.org/downloads/windows/>. During installation, enable **Add Python to PATH**.
2. Optional but needed for AI chat: install **Ollama** from <https://ollama.com/download>.
3. Open the project folder and double-click `start.bat`.
4. Open <http://127.0.0.1:8765> if it does not open automatically.
5. For first-time AI setup, `start.bat` downloads `llama3.2:1b` through Ollama. This requires internet, disk space, and enough memory. Keep the terminal open while using the website.

You can run the website without Ollama; missions and the field journal still work. The initial download of Ollama and its model requires internet. After installation, the app and model can run locally offline, provided the dependencies are already installed.

## GitHub upload

Upload the source files listed above to the root of your repository. Do **not** commit downloaded AI model files; Ollama manages them on the computer. GitHub Pages can host the static front end, but the local AI endpoint at `127.0.0.1:11434` and this Python server will not run on GitHub Pages. For the intended full local experience, clone/download the repository and run `start.bat` on Windows.

## Recent usability improvements

- Search missions by title, description, or category.
- Track completion with an accessible progress meter.
- Use **Choose a mission for me** to jump to an unfinished mission.
- Improved keyboard focus states, screen-reader status messages, and social-preview metadata.

## Privacy and limitations

- The Python server binds only to `127.0.0.1`, not to your local network.
- Journal entries and mission progress are saved in this browser's `localStorage`; clearing site data will remove them. Use **Export JSON** for a backup.
- Chat prompts go to the Ollama service running on your own computer; this project does not intentionally send them to a hosted AI service.
- AI answers may be wrong. Do not eat unknown plants, touch wildlife, or enter unsafe/private areas.
- The font import in `style.css` uses Google Fonts when internet is available; if offline, the browser uses fallback fonts.

## Product requirements

See [`PRD.md`](PRD.md) for the product goals, requirements, architecture, API contract, acceptance criteria, known limitations, and roadmap.

## Added companion features

- **Daily nature mission:** a date-based mission recommendation that rotates daily without tracking streaks or requiring an account.
- **Field badges:** non-competitive milestones for completing missions and writing field notes.
- **Journal backup import:** export a JSON backup and later import it to restore notes and completed missions. Import merges with current local data; keep backups in a safe location.

All new progress and journal features remain in browser `localStorage`. No account or cloud sync is used. Import only JSON backups you trust.
