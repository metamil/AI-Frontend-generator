const htmlEditor = document.getElementById('html-code');
const cssEditor = document.getElementById('css-code');
const jsEditor = document.getElementById('js-code');
const iframe = document.getElementById('live-preview');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');


function updatePreview() {
    const html = htmlEditor.value;
    const css = `<style>${cssEditor.value}</style>`;
    const js = `<script>${jsEditor.value}<\/script>`;
    iframe.srcdoc = html + css + js;
}

htmlEditor.addEventListener('input', updatePreview);
cssEditor.addEventListener('input', updatePreview);
jsEditor.addEventListener('input', updatePreview);




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


makeResizable(document.getElementById('chat-panel'), document.getElementById('chat-resize-handle'));
makeResizable(document.getElementById('output-panel'), document.getElementById('output-resize-handle'));
makeResizable(document.getElementById('code-editors'), document.getElementById('code-editors-resize-handle'));


const tabs = document.querySelectorAll('.tab-button');
const codeEditors = document.querySelectorAll('.code-editor');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
       
        tabs.forEach(t => t.classList.remove('active'));

     
        codeEditors.forEach(editor => editor.style.display = 'none');

       
        const targetEditor = document.getElementById(tab.id.replace('-tab', '-editor'));
        targetEditor.style.display = 'block';

       
        tab.classList.add('active');
    });
});

// Activate the first tab by default
document.getElementById('html-tab').classList.add('active');
document.getElementById('html-editor').style.display = 'block';




async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    
    const userMsgDiv = document.createElement('div');
    userMsgDiv.textContent = `You: ${userMessage}`;
    chatMessages.appendChild(userMsgDiv);

   
    const response = await fetch('https://server-ai-frondend-generator.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();


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

