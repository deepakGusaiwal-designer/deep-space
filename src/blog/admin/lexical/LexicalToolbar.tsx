import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  $createParagraphNode,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode, type HeadingTagType } from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $createCodeNode } from '@lexical/code';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List as ListIcon,
  ListOrdered,
  Undo2,
  Redo2,
  FileText,
} from 'lucide-react';

export default function LexicalToolbar() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [blockType, setBlockType] = useState<string>('paragraph');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload);
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload);
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
      setBlockType(headingSize);
    } else {
      formatParagraph();
    }
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
    setBlockType('paragraph');
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
      setBlockType('quote');
    } else {
      formatParagraph();
    }
  };

  const formatCodeBlock = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
      setBlockType('code');
    } else {
      formatParagraph();
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      setBlockType('ul');
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      setBlockType('paragraph');
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      setBlockType('ol');
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      setBlockType('paragraph');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-white/[0.04] p-2 backdrop-blur-md rounded-t-2xl">
      {/* Undo / Redo */}
      <button
        type="button"
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-dim transition-colors hover:bg-white/10 hover:text-soft disabled:cursor-not-allowed disabled:opacity-30"
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
      >
        <Undo2 className="size-3.5" />
      </button>

      <button
        type="button"
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-dim transition-colors hover:bg-white/10 hover:text-soft disabled:cursor-not-allowed disabled:opacity-30"
        title="Redo (Ctrl+Y)"
        aria-label="Redo"
      >
        <Redo2 className="size-3.5" />
      </button>

      <span className="mx-1 h-4 w-px bg-white/15" />

      {/* Block Types */}
      <button
        type="button"
        onClick={formatParagraph}
        className={`flex size-7 cursor-pointer items-center justify-center rounded-lg text-xs transition-colors ${
          blockType === 'paragraph'
            ? 'bg-white/20 text-white font-bold'
            : 'text-dim hover:bg-white/10 hover:text-soft'
        }`}
        title="Paragraph"
        aria-label="Paragraph format"
      >
        <FileText className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={() => formatHeading('h1')}
        className={`flex size-7 cursor-pointer items-center justify-center rounded-lg text-xs transition-colors ${
          blockType === 'h1'
            ? 'bg-white/20 text-white font-bold'
            : 'text-dim hover:bg-white/10 hover:text-soft'
        }`}
        title="Heading 1"
        aria-label="Heading 1"
      >
        <Heading1 className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={() => formatHeading('h2')}
        className={`flex size-7 cursor-pointer items-center justify-center rounded-lg text-xs transition-colors ${
          blockType === 'h2'
            ? 'bg-white/20 text-white font-bold'
            : 'text-dim hover:bg-white/10 hover:text-soft'
        }`}
        title="Heading 2"
        aria-label="Heading 2"
      >
        <Heading2 className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={() => formatHeading('h3')}
        className={`flex size-7 cursor-pointer items-center justify-center rounded-lg text-xs transition-colors ${
          blockType === 'h3'
            ? 'bg-white/20 text-white font-bold'
            : 'text-dim hover:bg-white/10 hover:text-soft'
        }`}
        title="Heading 3"
        aria-label="Heading 3"
      >
        <Heading3 className="size-3.5" />
      </button>

      <span className="mx-1 h-4 w-px bg-white/15" />

      {/* Inline Formats */}
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
          isBold ? 'bg-white/20 text-white font-bold' : 'text-dim hover:bg-white/10 hover:text-soft'
        }`}
        title="Bold (Ctrl+B)"
        aria-label="Format Bold"
      >
        <Bold className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
          isItalic
            ? 'bg-white/20 text-white font-bold'
            : 'text-dim hover:bg-white/10 hover:text-soft'
        }`}
        title="Italic (Ctrl+I)"
        aria-label="Format Italic"
      >
        <Italic className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={`flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
          isUnderline
            ? 'bg-white/20 text-white font-bold'
            : 'text-dim hover:bg-white/10 hover:text-soft'
        }`}
        title="Underline (Ctrl+U)"
        aria-label="Format Underline"
      >
        <Underline className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        className={`flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
          isStrikethrough
            ? 'bg-white/20 text-white font-bold'
            : 'text-dim hover:bg-white/10 hover:text-soft'
        }`}
        title="Strikethrough"
        aria-label="Format Strikethrough"
      >
        <Strikethrough className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        className={`flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
          isCode ? 'bg-white/20 text-white font-bold' : 'text-dim hover:bg-white/10 hover:text-soft'
        }`}
        title="Inline Code"
        aria-label="Format Inline Code"
      >
        <Code className="size-3.5" />
      </button>

      <span className="mx-1 h-4 w-px bg-white/15" />

      {/* Lists & Quotes */}
      <button
        type="button"
        onClick={formatBulletList}
        className={`flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
          blockType === 'ul'
            ? 'bg-white/20 text-white font-bold'
            : 'text-dim hover:bg-white/10 hover:text-soft'
        }`}
        title="Bullet List"
        aria-label="Bullet List"
      >
        <ListIcon className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={formatNumberedList}
        className={`flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
          blockType === 'ol'
            ? 'bg-white/20 text-white font-bold'
            : 'text-dim hover:bg-white/10 hover:text-soft'
        }`}
        title="Numbered List"
        aria-label="Numbered List"
      >
        <ListOrdered className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={formatQuote}
        className={`flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
          blockType === 'quote'
            ? 'bg-white/20 text-white font-bold'
            : 'text-dim hover:bg-white/10 hover:text-soft'
        }`}
        title="Quote Block"
        aria-label="Quote Block"
      >
        <Quote className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={formatCodeBlock}
        className={`flex size-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
          blockType === 'code'
            ? 'bg-white/20 text-white font-bold'
            : 'text-dim hover:bg-white/10 hover:text-soft'
        }`}
        title="Code Block"
        aria-label="Code Block"
      >
        <span className="font-mono text-[10px] font-bold">{'</>'}</span>
      </button>
    </div>
  );
}
