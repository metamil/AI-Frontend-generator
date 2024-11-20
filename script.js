const htmlEditor = document.getElementById('html-code');
const cssEditor = document.getElementById('css-code');
const jsEditor = document.getElementById('js-code');
const iframe = document.getElementById('live-preview');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

// Live Preview Functionality
function updatePreview() {
    const html = htmlEditor.value;
    const css = `<style>${cssEditor.value}</style>`;
    const js = `<script>${jsEditor.value}<\/script>`;
    iframe.srcdoc = html + css + js;
}

htmlEditor.addEventListener('input', updatePreview);
cssEditor.addEventListener('input', updatePreview);
jsEditor.addEventListener('input', updatePreview);



// Resizable panels logic
function makeResizable(panel, handle) {
    let startX, startWidth;

    handle.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startWidth = panel.offsetWidth;

        const mouseMoveHandler = (e) => {
            const newWidth = startWidth + (e.clientX - startX);
            panel.style.width = `${newWidth}px`;
        };

        const mouseUpHandler = () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });
}

// Apply resizable behavior to each panel
makeResizable(document.getElementById('chat-panel'), document.getElementById('chat-resize-handle'));
makeResizable(document.getElementById('output-panel'), document.getElementById('output-resize-handle'));
makeResizable(document.getElementById('code-editors'), document.getElementById('code-editors-resize-handle'));

// Tab Switching Logic
const tabs = document.querySelectorAll('.tab-button');
const codeEditors = document.querySelectorAll('.code-editor');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));

        // Hide all code editors
        codeEditors.forEach(editor => editor.style.display = 'none');

        // Show the corresponding code editor
        const targetEditor = document.getElementById(tab.id.replace('-tab', '-editor'));
        targetEditor.style.display = 'block';

        // Add active class to the clicked tab
        tab.classList.add('active');
    });
});

// Activate the first tab by default
document.getElementById('html-tab').classList.add('active');
document.getElementById('html-editor').style.display = 'block';


// Frontend JS to handle sending messages to the server


async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Append user message to chat
    const userMsgDiv = document.createElement('div');
    userMsgDiv.textContent = `You: ${userMessage}`;
    chatMessages.appendChild(userMsgDiv);

    // Call backend for response
    const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    // Append AI response to chat
    const aiMsgDiv = document.createElement('div');
    aiMsgDiv.textContent = `AI: ${data.response}`;
    chatMessages.appendChild(aiMsgDiv);
    htmlEditor.textContent = data["html"];
    cssEditor.textContent = data["css"];
    jsEditor.textContent = data["js"];
    updatePreview();

    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendButton.addEventListener('click', sendMessage);

