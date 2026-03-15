// Markdown rendering and code highlighting functions
      function renderMarkdown(text) {
        // Configure marked with the new highlight extension
        const markedHighlight = globalThis.markedHighlight;
        
        if (markedHighlight) {
          // Use the new marked-highlight extension
          marked.use(markedHighlight.markedHighlight({
            highlight(code, lang) {
              if (lang && Prism.languages[lang]) {
                return Prism.highlight(code, Prism.languages[lang], lang);
              }
              return code;
            }
          }));
        }

        // Configure other marked options
        marked.setOptions({
          mangle:false,
          headerIds:false,
          breaks: true,
          gfm: true
        });

        return marked.parse(text);
      }

      function addCopyButtonsToCodeBlocks(container) {
        const codeBlocks = container.querySelectorAll('pre code');
        codeBlocks.forEach((codeBlock, index) => {
          const pre = codeBlock.parentElement;
          
          // Wrap in container if not already wrapped
          if (!pre.parentElement.classList.contains('code-block-container')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-container';
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
          }

          // Add copy button
          const copyButton = document.createElement('button');
          copyButton.className = 'copy-button';
          copyButton.textContent = 'Copy';
          copyButton.onclick = () => copyCodeToClipboard(codeBlock.textContent, copyButton);
          
          pre.parentElement.appendChild(copyButton);
        });
      }

      function copyCodeToClipboard(code, button) {
        navigator.clipboard.writeText(code).then(() => {
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          button.style.background = 'rgba(40, 167, 69, 0.8)';
          
          setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'rgba(255, 255, 255, 0.1)';
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy code: ', err);
          button.textContent = 'Failed';
          setTimeout(() => {
            button.textContent = 'Copy';
          }, 2000);
        });
      }

    export  function displayMessage(content, role, isStreaming = false) {
        const messagesDiv = document.getElementById('response-display');
        
        // Create message container
        const messageContainer = document.createElement('div');
        messageContainer.className = `message-container ${role}`;
        
        // Create message header
        const messageHeader = document.createElement('div');
        messageHeader.className = `message-header ${role}`;
        messageHeader.textContent = role === 'user' ? 'You' : (selectedPlatform || 'Assistant');
        
        // Create message content
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (isStreaming) {
          // For streaming, start with raw text and update
          messageContent.textContent = content;
        } else {
          // For complete messages, render markdown
          messageContent.innerHTML = renderMarkdown(content);
          addCopyButtonsToCodeBlocks(messageContent);
        }
        
        messageContainer.appendChild(messageHeader);
        messageContainer.appendChild(messageContent);
        messagesDiv.appendChild(messageContainer);
        
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        return messageContent; // Return content div for streaming updates
      }

    export  function updateStreamingMessage(contentDiv, fullContent) {
        // Update with rendered markdown
        contentDiv.innerHTML = renderMarkdown(fullContent);
        addCopyButtonsToCodeBlocks(contentDiv);
        
        // Scroll to bottom
        const messagesDiv = document.getElementById('response-display');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }