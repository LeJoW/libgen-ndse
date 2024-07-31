export function preprocess(content: string): string[] {
    return content
        .replace(/(%[^\n]*\n?\s*)/g, "")
        .replace(/\\\$/g, "$$")
        .replace(/([^\n]+\n)>/g, "$1")
        .replace(/\n\s*\$([^$]*)\$/g, function (_, traduction) {
            return ` $${traduction.trim()}$`;
        })
        .split(/\s*\n\n\s*/)
        .map(function (block) {
            return block.replace(/\s*\n\s*/g, " ");
        });
}
