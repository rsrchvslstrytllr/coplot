import React, { useState } from 'react';

function CodePanel({ code }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    let success = false;

    // Try modern Clipboard API first (HTTPS/localhost/Vercel)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(code);
        success = true;
      } catch (err) {
        console.log('Clipboard API failed, trying fallback');
      }
    }

    // Fallback for HTTP or when Clipboard API fails
    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {
        console.error('Both copy methods failed:', err);
      }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chart.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`${expanded ? 'flex-1' : 'h-64'} flex flex-col bg-white transition-all`}>
      {/* Header with copy and download buttons */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-black">
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          Generated Code
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs px-3 py-1 border border-black bg-white text-black hover:bg-gray-100 transition-colors"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
          <button
            onClick={handleDownload}
            className="text-xs px-3 py-1 border border-black bg-white text-black hover:bg-gray-100 transition-colors"
          >
            Download .py
          </button>
          <button
            onClick={handleCopy}
            className={`
              text-xs px-3 py-1 border transition-colors
              ${copied 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-black border-black hover:bg-gray-100'
              }
            `}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className="flex-1 overflow-auto p-4 bg-gray-50">
        <pre className="text-xs leading-relaxed">
          <code>
            <SyntaxHighlight code={code} />
          </code>
        </pre>
      </div>
    </div>
  );
}

// Simple Python syntax highlighting
function SyntaxHighlight({ code }) {
  if (!code) return null;

  // Split into lines and process each
  const lines = code.split('\n');
  
  return (
    <>
      {lines.map((line, i) => (
        <div key={i}>
          {highlightLine(line)}
        </div>
      ))}
    </>
  );
}

function highlightLine(line) {
  // Handle comments
  if (line.trim().startsWith('#')) {
    return <span className="text-gray-400">{line}</span>;
  }

  // Simple keyword highlighting
  const keywords = ['import', 'from', 'as', 'def', 'return', 'if', 'else', 'elif', 'for', 'in', 'try', 'except', 'True', 'False', 'None'];
  
  let result = line;
  
  // Highlight strings (simplified - just handles single and double quotes)
  result = result.replace(/(["'])((?:\\.|[^\\])*?)\1/g, '<string>$1$2$1</string>');
  
  // Highlight numbers
  result = result.replace(/\b(\d+\.?\d*)\b/g, '<number>$1</number>');
  
  // Highlight keywords
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b(${kw})\\b`, 'g');
    result = result.replace(regex, '<keyword>$1</keyword>');
  });

  // Convert to React elements
  const parts = result.split(/(<\/?(?:string|number|keyword)>)/);
  let currentTag = null;
  
  return parts.map((part, i) => {
    if (part === '<string>') {
      currentTag = 'string';
      return null;
    } else if (part === '</string>') {
      currentTag = null;
      return null;
    } else if (part === '<number>') {
      currentTag = 'number';
      return null;
    } else if (part === '</number>') {
      currentTag = null;
      return null;
    } else if (part === '<keyword>') {
      currentTag = 'keyword';
      return null;
    } else if (part === '</keyword>') {
      currentTag = null;
      return null;
    }

    if (currentTag === 'string') {
      return <span key={i} className="text-gray-500">{part}</span>;
    } else if (currentTag === 'number') {
      return <span key={i} className="text-gray-600">{part}</span>;
    } else if (currentTag === 'keyword') {
      return <span key={i} className="font-semibold">{part}</span>;
    }
    
    return <span key={i}>{part}</span>;
  });
}

export default CodePanel;
