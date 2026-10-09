import { capabilities, providers, filterModels, getModel } from "./modelConfig.ts";
import { load, save } from "./store.js";
import { icons } from "./icons.js";

// Sidebar model picker: search + capability chips + provider filter + selectable list

export function createModelPicker({ onSelect }) {
    const searchInput = document.getElementById("model-search");
    const capabilityChips = document.getElementById("capability-chips");
    const platformSelect = document.getElementById("platform-select");
    const modelList = document.getElementById("model-list");
    const modelCount = document.getElementById("model-count");
    const resetBtn = document.getElementById("filters-reset");

    const saved = load("filters", {});
    const state = {
        query: "",
        provider: providers.includes(saved.provider) ? saved.provider : "",
        capabilities: (saved.capabilities ?? []).filter(c => capabilities.includes(c)),
        selected: getModel(load("model", null))?.id ?? null,
    };

    // Provider options
    providers.forEach(provider => {
        const option = document.createElement("option");
        option.value = provider;
        option.textContent = provider;
        platformSelect.appendChild(option);
    });
    platformSelect.value = state.provider;

    // Capability chips (toggle buttons)
    capabilities.forEach(capability => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip";
        chip.dataset.value = capability;
        chip.textContent = capability.charAt(0).toUpperCase() + capability.slice(1);
        chip.setAttribute("aria-pressed", String(state.capabilities.includes(capability)));
        chip.addEventListener("click", () => {
            const active = state.capabilities.includes(capability);
            state.capabilities = active
                ? state.capabilities.filter(c => c !== capability)
                : [...state.capabilities, capability];
            chip.setAttribute("aria-pressed", String(!active));
            persistFilters();
            render();
        });
        capabilityChips.appendChild(chip);
    });

    searchInput.addEventListener("input", () => {
        state.query = searchInput.value;
        render();
    });

    platformSelect.addEventListener("change", () => {
        state.provider = platformSelect.value;
        persistFilters();
        render();
    });

    resetBtn.addEventListener("click", () => {
        state.query = "";
        state.provider = "";
        state.capabilities = [];
        searchInput.value = "";
        platformSelect.value = "";
        capabilityChips.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", "false"));
        persistFilters();
        render();
    });

    // Keyboard navigation inside the listbox
    modelList.addEventListener("keydown", event => {
        const items = [...modelList.querySelectorAll(".model-item")];
        const index = items.indexOf(document.activeElement);
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const next = event.key === "ArrowDown" ? index + 1 : index - 1;
            items[Math.max(0, Math.min(items.length - 1, next))]?.focus();
        } else if ((event.key === "Enter" || event.key === " ") && index >= 0) {
            event.preventDefault();
            select(items[index].dataset.id);
        }
    });

    function persistFilters() {
        save("filters", { provider: state.provider, capabilities: state.capabilities });
    }

    function hasActiveFilters() {
        return !!(state.query || state.provider || state.capabilities.length);
    }

    function select(id) {
        state.selected = id;
        save("model", id);
        modelList.querySelectorAll(".model-item").forEach(item => {
            const isSelected = item.dataset.id === id;
            item.classList.toggle("is-selected", isSelected);
            item.setAttribute("aria-selected", String(isSelected));
        });
        onSelect(getModel(id));
    }

    function render() {
        const models = filterModels(state);
        resetBtn.hidden = !hasActiveFilters();
        modelCount.textContent = `${models.length} model${models.length === 1 ? "" : "s"}`;
        modelList.innerHTML = "";

        if (models.length === 0) {
            const empty = document.createElement("li");
            empty.className = "model-empty";
            empty.textContent = "No models match these filters.";
            modelList.appendChild(empty);
            return;
        }

        const fragment = document.createDocumentFragment();
        models.forEach(model => {
            const isSelected = model.id === state.selected;
            const li = document.createElement("li");
            li.className = "model-item" + (isSelected ? " is-selected" : "");
            li.dataset.id = model.id;
            li.tabIndex = 0;
            li.setAttribute("role", "option");
            li.setAttribute("aria-selected", String(isSelected));
            li.title = model.id;

            const text = document.createElement("div");
            text.className = "model-item-text";

            const name = document.createElement("span");
            name.className = "model-item-name";
            name.textContent = model.name;

            const meta = document.createElement("span");
            meta.className = "model-item-meta";
            meta.textContent = `${model.provider} · ${model.capabilities.join(", ")}`;

            text.append(name, meta);

            const check = document.createElement("span");
            check.className = "model-item-check";
            check.innerHTML = icons.check;

            li.append(text, check);
            li.addEventListener("click", () => select(model.id));
            fragment.appendChild(li);
        });
        modelList.appendChild(fragment);
    }

    render();

    return {
        get selected() {
            return getModel(state.selected);
        },
        focusSearch() {
            searchInput.focus();
        },
    };
}
