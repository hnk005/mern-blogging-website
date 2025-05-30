import { useEditor } from "@/context/EditorContext";
import { useEffect, useRef } from "react";

const Tag = ({ tag, tagIndex }: { tag: string; tagIndex: number }) => {
  const { editTag, removeTag } = useEditor();
  const pRef = useRef<HTMLParagraphElement>(null);

  const handleRemoveTag = () => {
    removeTag(tag);
  };

  const handleEditTag = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      const target = e.target as HTMLParagraphElement;
      const newTag = target.innerText.trim();
      if (newTag !== tag) {
        editTag(tagIndex, newTag);
      }
    }
  };

  useEffect(() => {
    if (pRef.current) {
      pRef.current.innerText = tag;
    }
  }, [tag]);

  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
      <p
        onKeyDown={handleEditTag}
        ref={pRef}
        className="outline-none"
        contentEditable
        suppressContentEditableWarning
      />
      <button
        onClick={handleRemoveTag}
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
      >
        <i className="fi fi-br-cross text-sm pointer-events-none" />
      </button>
    </div>
  );
};

export default Tag;
