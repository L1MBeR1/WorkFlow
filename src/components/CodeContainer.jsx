import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeContainer = ({ language, children }) => {
    return (
        <div style={{ height: '400px', overflow: 'auto' }}>
            <SyntaxHighlighter
                language={language}
                style={dracula}
                showLineNumbers
                lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
            >
                {children}
            </SyntaxHighlighter>
        </div>
    );
}

export default CodeContainer;
