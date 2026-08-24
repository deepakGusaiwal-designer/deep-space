import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { TRANSFORMERS } from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $createParagraphNode, $createTextNode, type EditorState } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef } from 'react';
import { LexicalTheme } from './LexicalTheme';
import LexicalToolbar from './LexicalToolbar';

interface BlogLexicalEditorProps {
  initialParagraphs?: string[];
  onChange: (paragraphs: string[], rawHtml: string) => void;
  placeholder?: string;
}

function InitialContentPlugin({ content }: { content?: string[] }) {
  const [editor] = useLexicalComposerContext();
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    if (content && content.length > 0) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();

        // Check if content looks like HTML
        const joined = content.join('\n\n');
        if (joined.includes('<p>') || joined.includes('<h1>') || joined.includes('<h2>')) {
          const parser = new DOMParser();
          const dom = parser.parseFromString(joined, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          root.append(...nodes);
        } else {
          content.forEach((para) => {
            if (para.trim()) {
              const p = $createParagraphNode();
              p.append($createTextNode(para));
              root.append(p);
            }
          });
        }
      });
      isLoaded.current = true;
    }
  }, [editor, content]);

  return null;
}

export default function BlogLexicalEditor({
  initialParagraphs,
  onChange,
  placeholder = 'Write your article thoughts and engineering insights here...',
}: BlogLexicalEditorProps) {
  const initialConfig = {
    namespace: 'DeepSpaceBlogEditor',
    theme: LexicalTheme,
    onError(error: Error) {
      console.error('Lexical Editor Error:', error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  const handleEditorChange = (editorState: EditorState, editor: any) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor, null);
      const root = $getRoot();
      const textParagraphs: string[] = [];

      root.getChildren().forEach((node) => {
        const text = node.getTextContent();
        if (text.trim().length > 0) {
          textParagraphs.push(text);
        }
      });

      onChange(textParagraphs.length > 0 ? textParagraphs : [''], html);
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.02] shadow-inner backdrop-blur-md transition-all focus-within:border-white/40">
      <LexicalComposer initialConfig={initialConfig}>
        <LexicalToolbar />

        <div className="relative min-h-[300px] p-4 text-xs">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[260px] outline-none select-text text-xs leading-relaxed text-slate-200"
                aria-label="Blog Article Editor"
              />
            }
            placeholder={
              <div className="pointer-events-none absolute left-4 top-4 select-none text-xs text-dim">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={handleEditorChange} />
          <InitialContentPlugin content={initialParagraphs} />
        </div>
      </LexicalComposer>
    </div>
  );
}
