import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const MarkdownConvert = ({ markdown }) => {
  if (!markdown) return null;

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside" {...props}>
              {children}
            </ol>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside" {...props}>
              {children}
            </ul>
          )
        }}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
