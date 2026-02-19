import { useRef, useCallback, useEffect } from "react";
import { $getRoot, $getSelection, $insertNodes, $createParagraphNode, $createTextNode } from "lexical";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { $createHeadingNode, $createQuoteNode, HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode, ListItemNode } from "@lexical/list";
import { $createCodeNode, CodeNode } from "@lexical/code";
import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Minus,
  Quote,
  Code,
  ImageIcon,
} from "lucide-react";
import { useS3FileManager } from "@/hooks/useS3FileManager";
import { useToast } from "@/hooks/use-toast";
import type { EditorState } from "lexical";

const theme = {
  paragraph: "mb-2",
  heading: {
    h1: "text-xl font-bold mb-2",
    h2: "text-lg font-semibold mb-2",
    h3: "text-base font-medium mb-2",
  },
  list: {
    ul: "list-disc pl-6 mb-2",
    ol: "list-decimal pl-6 mb-2",
  },
  link: "text-primary underline",
  quote: "border-l-4 border-muted-foreground pl-4 italic my-2",
  code: "bg-muted px-1 rounded text-sm font-mono",
};

const EDITOR_NODES = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  CodeNode,
  LinkNode,
];

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
};

function ToolbarPlugin({
  onInsertImage,
  uploading,
}: {
  onInsertImage: () => void;
  uploading: boolean;
}) {
  const [editor] = useLexicalComposerContext();

  const dispatchFormat = useCallback((format: "bold" | "italic" | "underline") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  }, [editor]);

  const dispatchHeading = useCallback((tag: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createHeadingNode(tag));
    });
  }, [editor]);

  return (
    <div className="flex flex-wrap gap-1 p-2 border rounded-t-lg bg-muted/50 border-b-0">
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => dispatchFormat("bold")} title="Negrita">
        <Bold className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => dispatchFormat("italic")} title="Cursiva">
        <Italic className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => dispatchFormat("underline")} title="Subrayado">
        <Underline className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => dispatchHeading("h1")} title="Título 1">
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => dispatchHeading("h2")} title="Título 2">
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => dispatchHeading("h3")} title="Título 3">
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        title="Lista"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        title="Lista numerada"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          const url = window.prompt("URL del enlace:", "https://");
          if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }}
        title="Enlace"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            $setBlocksType(selection, () => $createQuoteNode());
          });
        }}
        title="Cita"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            $setBlocksType(selection, () => $createCodeNode());
          });
        }}
        title="Bloque de código"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          editor.update(() => {
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode("---"));
            $insertNodes([paragraph]);
          });
        }}
        title="Separador"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={uploading}
        onClick={onInsertImage}
        title="Insertar imagen"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

function SyncMarkdownPlugin({
  value,
  lastEmittedRef,
}: {
  value: string;
  lastEmittedRef: React.MutableRefObject<string>;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (value === lastEmittedRef.current) return;
    lastEmittedRef.current = value;
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      $convertFromMarkdownString(value || "", TRANSFORMERS, root);
    });
  }, [value, editor, lastEmittedRef]);

  return null;
}

function InsertMarkdownListenerPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handler = (e: CustomEvent<string>) => {
      const markdown = e.detail;
      if (!markdown) return;
      editor.update(() => {
        const nodes = $createParagraphNode().append($createTextNode(markdown));
        $insertNodes([nodes]);
      });
    };
    window.addEventListener("lexical-insert-markdown", handler as EventListener);
    return () => window.removeEventListener("lexical-insert-markdown", handler as EventListener);
  }, [editor]);

  return null;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Escribe aquí... Usa la barra de herramientas para negritas, títulos, listas, etc.",
  minHeight = "200px",
  label = "Contenido",
}: MarkdownEditorProps) {
  const lastEmittedRef = useRef(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading } = useS3FileManager();
  const { toast } = useToast();

  const handleEditorChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const md = $convertToMarkdownString(TRANSFORMERS);
        lastEmittedRef.current = md;
        onChange(md);
      });
    },
    [onChange]
  );

  const handleImageButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInsertImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !file.type.startsWith("image/")) {
        toast({
          title: "Selecciona una imagen",
          variant: "destructive",
          description: "El archivo debe ser una imagen (JPG, PNG, GIF, etc.).",
        });
        return;
      }
      try {
        await new Promise<void>((resolve, reject) => {
          uploadFile(file, (_key: string, location?: string) => {
            if (location) {
              const alt = file.name.replace(/\.[^.]+$/, "") || "imagen";
              const markdownImage = `![${alt}](${location})`;
              // Insertamos vía un plugin que tenga acceso al editor; usamos custom event o ref
              window.dispatchEvent(new CustomEvent("lexical-insert-markdown", { detail: markdownImage }));
              toast({ title: "Imagen insertada", variant: "success" });
            }
            resolve();
          }).catch(reject);
        });
      } catch {
        toast({ title: "Error al subir la imagen", variant: "destructive" });
      }
    },
    [uploadFile, toast]
  );

  const initialValueRef = useRef(value);
  initialValueRef.current = value;
  const initialEditorState = useCallback(() => {
    const root = $getRoot();
    $convertFromMarkdownString(initialValueRef.current || "", TRANSFORMERS, root);
  }, []);

  return (
    <div className="space-y-3">
      {label && <Label className="flex items-center gap-2">{label}</Label>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInsertImage}
      />
      <LexicalComposer
        initialConfig={{
          namespace: "MarkdownEditor",
          nodes: EDITOR_NODES,
          theme,
          onError: (err: Error) => console.error(err),
          editorState: initialEditorState,
        }}
      >
        <ToolbarPlugin onInsertImage={handleImageButtonClick} uploading={uploading} />
        <SyncMarkdownPlugin value={value} lastEmittedRef={lastEmittedRef} />
        <InsertMarkdownListenerPlugin />
        <div className="relative rounded-b-lg rounded-t-none border border-t-0 bg-background">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="w-full p-3 text-sm outline-none min-h-[200px] prose prose-sm max-w-none dark:prose-invert [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-medium [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline [&_pre]:bg-muted [&_pre]:p-2 [&_pre]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_img]:max-w-full [&_img]:rounded [&_img]:my-2"
                style={{ minHeight }}
              />
            }
            placeholder={
              <div className="absolute left-3 top-3 text-muted-foreground pointer-events-none text-sm">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <OnChangePlugin ignoreSelectionChange onChange={handleEditorChange} />
      </LexicalComposer>
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs">
          Markdown 
        </Label>
        <pre className="rounded-lg border bg-muted/30 p-4 min-h-[120px] text-sm font-mono whitespace-pre-wrap break-words overflow-auto">
          {value.trim() || <span className="text-muted-foreground italic"> Markdown</span>}
        </pre>
      </div>
    </div>
  );
}
