// Append-only event log whose rows are rendered on demand as the list is scrolled.
// Every row has the same fixed height, so only the rows in (or near) view exist in the DOM.
var BattleEventLog = (function () {
    var ROW_HEIGHT = 40;
    var OVERSCAN = 6;
    var MAX_ENTRIES = 5000;
    var BOTTOM_TOLERANCE = 4;

    function BattleEventLog() {
        this.entries = [];
        this.firstRendered = -1;
        this.lastRendered = -1;
        this.stickToBottom = true;
        this.unseenCount = 0;
        this.element = this.buildElement();
    }

    BattleEventLog.prototype.buildElement = function () {
        var log = this;

        var panel = document.createElement("section");
        panel.className = "battle-event-log";
        panel.setAttribute("aria-label", "Event log");

        var header = document.createElement("header");
        header.className = "battle-status-header";
        var eyebrow = document.createElement("p");
        eyebrow.className = "battle-status-eyebrow";
        eyebrow.textContent = "Event log";
        var title = document.createElement("h1");
        title.textContent = "Activity";
        header.appendChild(eyebrow);
        header.appendChild(title);
        panel.appendChild(header);

        var body = document.createElement("div");
        body.className = "battle-event-log-body";

        var viewport = document.createElement("div");
        viewport.className = "battle-event-log-viewport";
        viewport.tabIndex = 0;
        viewport.setAttribute("role", "log");
        viewport.setAttribute("aria-label", "Battle events");
        viewport.setAttribute("aria-live", "off");

        var spacer = document.createElement("div");
        spacer.className = "battle-event-log-spacer";
        var rows = document.createElement("div");
        rows.className = "battle-event-log-rows";
        spacer.appendChild(rows);
        viewport.appendChild(spacer);

        var empty = document.createElement("p");
        empty.className = "battle-event-log-empty";
        empty.textContent = "No events yet.";

        var latest = document.createElement("button");
        latest.className = "battle-event-log-latest";
        latest.type = "button";
        latest.hidden = true;
        latest.addEventListener("click", function () {
            log.scrollToLatest();
        });

        viewport.addEventListener("scroll", function () {
            log.handleScroll();
        });

        body.appendChild(viewport);
        body.appendChild(empty);
        body.appendChild(latest);
        panel.appendChild(body);

        this.viewport = viewport;
        this.spacer = spacer;
        this.rows = rows;
        this.emptyMessage = empty;
        this.latestButton = latest;
        this.render(true);

        return panel;
    };

    BattleEventLog.prototype.add = function (message, accent) {
        this.entries.push({ message: message, accent: accent || null });

        var trimmed = this.entries.length - MAX_ENTRIES;
        if (trimmed > 0) {
            this.entries.splice(0, trimmed);
        }

        this.spacer.style.height = this.entries.length * ROW_HEIGHT + "px";
        this.emptyMessage.hidden = true;

        if (this.stickToBottom) {
            this.viewport.scrollTop = this.viewport.scrollHeight;
        } else {
            if (trimmed > 0) {
                this.viewport.scrollTop = Math.max(0, this.viewport.scrollTop - trimmed * ROW_HEIGHT);
            }
            this.unseenCount++;
            this.updateLatestButton();
        }

        this.render(true);
    };

    BattleEventLog.prototype.scrollToLatest = function () {
        this.stickToBottom = true;
        this.unseenCount = 0;
        this.viewport.scrollTop = this.viewport.scrollHeight;
        this.updateLatestButton();
        this.render(false);
    };

    BattleEventLog.prototype.handleScroll = function () {
        var viewport = this.viewport;
        var distanceFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
        this.stickToBottom = distanceFromBottom <= BOTTOM_TOLERANCE;
        if (this.stickToBottom) {
            this.unseenCount = 0;
        }
        this.updateLatestButton();
        this.render(false);
    };

    BattleEventLog.prototype.updateLatestButton = function () {
        var show = !this.stickToBottom && this.unseenCount > 0;
        this.latestButton.hidden = !show;
        if (show) {
            this.latestButton.textContent = this.unseenCount === 1
                ? "1 new event ↓"
                : this.unseenCount + " new events ↓";
        }
    };

    BattleEventLog.prototype.render = function (force) {
        var viewport = this.viewport;
        var viewportHeight = viewport.clientHeight || ROW_HEIGHT * 6;
        var first = Math.max(0, Math.floor(viewport.scrollTop / ROW_HEIGHT) - OVERSCAN);
        var last = Math.min(
            this.entries.length,
            Math.ceil((viewport.scrollTop + viewportHeight) / ROW_HEIGHT) + OVERSCAN
        );

        if (!force && first === this.firstRendered && last === this.lastRendered) {
            return;
        }
        this.firstRendered = first;
        this.lastRendered = last;

        var fragment = document.createDocumentFragment();
        for (var index = first; index < last; index++) {
            var entry = this.entries[index];
            var row = document.createElement("div");
            row.className = "battle-event-log-row";
            row.title = entry.message;
            if (entry.accent) {
                row.style.setProperty("--school-accent", entry.accent);
            }
            var text = document.createElement("span");
            text.textContent = entry.message;
            row.appendChild(text);
            fragment.appendChild(row);
        }

        this.rows.style.transform = "translateY(" + first * ROW_HEIGHT + "px)";
        this.rows.replaceChildren(fragment);
    };

    return BattleEventLog;
})();
