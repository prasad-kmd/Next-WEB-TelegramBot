import { Mark, mergeAttributes } from '@tiptap/core';

export const CustomCode = Mark.create({
  name: 'customCode',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'tg-code',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'code',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['code', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addKeyboardShortcuts() {
    return {
      'Mod-e': () => this.editor.commands.toggleMark(this.name),
    };
  },
});
