import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeContainer = ({ language, children }) => {
    return (
        <>
            <SyntaxHighlighter
                language={language}
                style={dracula}
                showLineNumbers
                // wrapLines
                // wrapLongLines
                lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
            >
                {children}
            </SyntaxHighlighter>
        </>
    );
}

export default CodeContainer;
