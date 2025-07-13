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

class EmptyMarker extends RowMarker {
    apply(row) {
    }

    clear(row) {
    }
}

class HighlightMarker extends RowMarker {
    apply(row) {
        row.style.setProperty('background-color', 'rgba(255, 255, 0, 0.15)', 'important');
        row.style.setProperty('opacity', '1');
    }
}

class LowlightMarker extends RowMarker {
    apply(row) {
        row.style.setProperty('background-color', 'rgba(0, 0, 0, 0.05)', 'important');
        row.style.setProperty('opacity', '0.2');
    }
}

class GrayedMarker extends RowMarker {
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

class HiddenMarker extends RowMarker {
    apply(row) {
        row.style.setProperty('display', 'none');
    }
}

class RowMarkerFactory {
    static create(type) {
        switch (type) {
            case 'highlight':
                return new HighlightMarker();
            case 'lowlight':
                return new LowlightMarker();
            case 'grayed':
                return new GrayedMarker();                
            case 'hidden':
                return new HiddenMarker();
            case 'none':
            case 'empty':
                return new EmptyMarker();
            default:
                console.warn(`Nieznany typ markera: "${type}". Zwracam EmptyMarker.`);
                return new EmptyMarker();
        }
    }
}