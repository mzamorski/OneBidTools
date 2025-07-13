class RowFilter {
    matches(rowInfo) {
        throw new Error("Not implemented");
    }
}

class CfdRowFilter {
    matches(rowInfo) {
        return rowInfo.assetType === "CFD";
    }
}

class StockRowFilter {
    matches(rowInfo) {
        return rowInfo.assetType === "Akcje";
    }
}

class AssetNameFilter extends RowFilter {
    constructor(substrings) {
        super();
        this.substrings = Array.isArray(substrings) ? substrings : [substrings];
    }

    matches(rowInfo) {
        const name = rowInfo.assetName?.toLowerCase() ?? "";
        
        return this.substrings.some(s => name.includes(s.toLowerCase()));
    }
}

class EmptyRowFilter extends RowFilter {
    matches(rowInfo) {
        return true;
    }
}

// ------------------------------------------------------------------------------------------------------------------------

class AndFilter extends RowFilter {
    constructor(...filters) {
        super();
        this.filters = filters;
    }

    matches(rowInfo) {
        return this.filters.every(f => f.matches(rowInfo));
    }
}

class OrFilter extends RowFilter {
    constructor(...filters) {
        super();
        this.filters = filters;
    }

    matches(rowInfo) {
        return this.filters.some(f => f.matches(rowInfo));
    }
}