class RowMarker {
    apply(row) {
        throw new Error("Not implemented");
    }

    clear(row) {
        row.style.removeProperty('background-color');
        row.style.removeProperty('opacity');
        row.style.removeProperty('display');
    }
}

class EmptyRowMarker extends RowMarker {
    apply(row) {
    }

    clear(row) {
    }
}

class HighlightRowMarker extends RowMarker {
    apply(row) {
        row.style.setProperty('background-color', 'rgba(255, 255, 0, 0.15)', 'important');
        row.style.setProperty('opacity', '1');
    }
}

class LowlightRowMarker extends RowMarker {
    apply(row) {
        row.style.setProperty('background-color', 'rgba(0, 0, 0, 0.05)', 'important');
        row.style.setProperty('opacity', '0.2');
    }
}

class GrayedRowMarker extends RowMarker {
    apply(row) {
        row.style.setProperty('background-color', 'rgba(0, 0, 0, 0.05)', 'important');
        row.style.setProperty('opacity', '0.2');

        const computedColor = getComputedStyle(row).color;

        row.querySelectorAll("*").forEach(el => {
            el.style.setProperty('color', computedColor, 'important');
        });
    }

    clear(row) {
        super.clear(row);

        row.querySelectorAll("*").forEach(el => {
            el.style.removeProperty('color');
        });
    }
}

class HiddenRowMarker extends RowMarker {
    apply(row) {
        row.style.setProperty('display', 'none');
    }
}
