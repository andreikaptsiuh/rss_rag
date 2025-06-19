import ReactMarkdown from "react-markdown";

export const MarkdownContainer = ({ children }) => {
    return (
        <ReactMarkdown
            components={{
                p: ({ children }) => <p className="mb-1 leading-snug">{children}</p>,
                strong: ({ children }) => <strong className="font-medium">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                pre: ({ children }) => <pre className="bg-gray-900 p-2 rounded-md overflow-x-auto text-xs mb-1">{children}</pre>,
                a: ({ href, children }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline hover:text-blue-300"
                    >
                        {children}
                    </a>
                ),
                ul: ({ children }) => <ul className="list-disc list-inside mb-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-1 ml-1">{children}</ol>,
                li: ({ children }) => <li className="ml-4 marker:text-gray-300">{children}</li>,
                blockquote: ({ children }) => <blockquote className="border-l-2 border-gray-500 pl-2 italic text-gray-300 mb-1">{children}</blockquote>,
                hr: ({ children }) => <hr className="pt-2 mt-2 text-gray-600">{children}</hr>
            }}
        >
            {children}
        </ReactMarkdown>
    )
};
