import { Mark, mergeAttributes } from '@tiptap/core';

export const Spoiler = Mark.create({
  name: 'spoiler',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'tg-spoiler',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          return (element as HTMLElement).classList.contains('tg-spoiler') && null;
        },
      },
      {
        tag: 'tg-spoiler',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});
