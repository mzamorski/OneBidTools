class AssetRowInfo {
    constructor(assetType, isExpanded, assetName, amount, description) {
        this.assetType = assetType;
        this.isExpanded = isExpanded;
        this.name = assetName;
        this.amount = amount;
        this.description = description;
    }

    static fromRow(row) {
        const assetTypeNode = row.querySelector("span.xs-btn-asset-class");
        const assetType = assetTypeNode ? assetTypeNode.textContent.trim() : '';

        const toggleNode = row.querySelector('span.slick-group-toggle');
        const isExpanded = toggleNode?.classList.contains('expanded') || false;

        const assetInfoNode = row.querySelector("span.slick-group-title > div");

        // Nazwa akcji – tylko tekst spoza spanów (czyli czysty tekstowy node)
        const assetName = assetInfoNode
            ? Array.from(assetInfoNode.childNodes)
                .filter(n => n.nodeType === Node.TEXT_NODE)
                .map(n => n.textContent.trim())
                .join('')
            : '';

        // Ilość – zawartość .slick-group-rectangle
        const amount = assetInfoNode?.querySelector('.slick-group-rectangle')?.textContent.trim() ?? '';

        // Opis – zawartość .slick-group-toggle-description
        const description = assetInfoNode?.querySelector('.slick-group-toggle-description')?.textContent.trim() ?? '';

        return new AssetRowInfo(assetType, isExpanded, assetName, amount, description);
    }
}