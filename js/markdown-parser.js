function parseMarkdown(md) {
    if (!md) return "";

    // 1. Strip YAML Frontmatter
    md = md.replace(/^---[\s\S]*?---\s*/, "");

    return md
        // 2. Horizontal Rules (----)
        .replace(/^[-*_]{3,}\s*$/gm, '<hr>')

        // 3. Headings
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')

        // 4. Blockquotes (> Text)
        // This handles lines like "> ❗️We do not collect..."
        .replace(/^>\s?(.*$)/gim, '<div class="info-box">$1</div>')

        // 5. Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener">$1</a>')

        // 6. Bold & Italic
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')

        // 7. Meta Text (Text in brackets)
        // Adds a break before the bracket so it sits nicely under the main text
        .replace(/^\s*\((.*?)\)\s*$/gim, '<br><span class="meta-text">($1)</span>')

        // 8. List Items (The Supabase Fix)
        // Wraps content in <span> so Flexbox works perfectly
        .replace(/^\s*-\s+(.*$)/gim, '<div class="list-item"><span>$1</span></div>')

        // 9. Newlines
        // Converts double newlines to double breaks, single to single.
        .replace(/\n\n/gim, '<br><br>')
        .replace(/\n/gim, '<br>');
}