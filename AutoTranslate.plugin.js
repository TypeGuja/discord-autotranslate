/**
 * @name AutoTranslate
 * @author Type_Guja
 * @description Auto-translates Discord messages: incoming ones under the message, your own before sending. Google Translate, no API keys.
 * @version 1.5.1
 * @source https://github.com/TypeGuja/discord-autotranslate
 * @website https://github.com/TypeGuja/discord-autotranslate
 */

const LANGS = {
    auto: null, ru: "Русский", en: "English", uk: "Українська", de: "Deutsch", fr: "Français",
    es: "Español", it: "Italiano", pt: "Português", pl: "Polski", tr: "Türkçe", ja: "日本語",
    ko: "한국어", "zh-CN": "中文 (简体)", ar: "العربية", kk: "Қазақша", be: "Беларуская",
    cs: "Čeština", nl: "Nederlands", sv: "Svenska", fi: "Suomi", hi: "हिन्दी", vi: "Tiếng Việt"
};

const DEFAULTS = {
    incoming: true,       // переводить входящие
    incomingTo: null,     // на какой язык (null = язык интерфейса Discord)
    outgoing: false,      // переводить исходящие
    outgoingFrom: "auto", // с какого (auto = определить)
    outgoingTo: "en",     // на какой
    skipPrefix: "!!",     // сообщение с этим префиксом уходит без перевода (префикс срезается)
    showLang: true,       // показывать код исходного языка
    slang: true,          // расшифровывать сленг перед переводом исходящих
    slangCustom: "",      // свой словарь: строки "слово = замена"
    preview: true         // показывать перевод и обратный перевод перед отправкой
};

// Надписи интерфейса: русские для русского Discord, английские для всех остальных.
const STRINGS = {
    ru: {
        auto: "Авто",
        noSend: "не нашёл sendMessage, исходящие не переводятся",
        sendError: "ошибка перевода (%s), отправлено как есть",
        backFail: "(не удалось: %s)",
        checkTitle: "Проверь перевод",
        willSend: "Отправится (%s)",
        backTitle: "Обратный перевод (%s) — так это поймут",
        send: "Отправить",
        fix: "Исправить",
        copied: "текст скопирован в буфер — вставь и поправь",
        catIn: "Входящие",
        incoming: "Переводить чужие сообщения",
        incomingTo: "Переводить на",
        showLang: "Показывать исходный язык",
        catOut: "Исходящие",
        outgoing: "Переводить мои сообщения перед отправкой",
        outgoingFrom: "С языка",
        outgoingTo: "На язык",
        skipPrefix: "Префикс «без перевода»",
        skipPrefixNote: "Сообщение, начинающееся с него, уйдёт как есть (префикс срежется)",
        preview: "Проверка перед отправкой",
        previewNote: "Показывает перевод и обратный перевод; «Исправить» вернёт текст в поле ввода",
        catSlang: "Сленг",
        slang: "Расшифровывать сленг перед переводом",
        slangNote: "Встроено %s слов: хз → не знаю, го → давай, катку → игру…",
        slangCustom: "Свой словарь",
        slangCustomNote: "По строке: слово = замена. Перекрывает встроенный.",
        slangPlaceholder: "имба = очень сильный\nтащер = лучший игрок",
        menuChannel: "AutoTranslate: мои сообщения",
        menuDM: "AutoTranslate: мои сообщения в личке",
        chDefault: "Как в настройках (%s)",
        chOff: "Не переводить",
        globalOff: "выкл",
        chSet: "мои сообщения в этом чате: %s",
        chDefaultSet: "в этом чате — как в общих настройках",
        catCh: "Языки по чатам",
        chList: "Чаты со своим языком",
        chNote: "ПКМ по каналу, личке или группе → «AutoTranslate: мои сообщения». Своя настройка чата важнее общей.",
        chNone: "Пока нет. Нажми ПКМ по каналу или личке, чтобы задать язык.",
        autoPeer: "Авто — как пишет собеседник",
        autoShort: "авто",
        noPeer: "не понял язык собеседника, отправлено как есть",
        netFail: "Google не отвечает (%s) — проверь интернет/VPN"
    },
    en: {
        auto: "Auto",
        noSend: "sendMessage not found, outgoing translation is off",
        sendError: "translation failed (%s), sent as is",
        backFail: "(failed: %s)",
        checkTitle: "Check the translation",
        willSend: "Will be sent (%s)",
        backTitle: "Back-translation (%s) — how it will be understood",
        send: "Send",
        fix: "Edit",
        copied: "text copied to clipboard — paste it and edit",
        catIn: "Incoming",
        incoming: "Translate other people's messages",
        incomingTo: "Translate to",
        showLang: "Show source language",
        catOut: "Outgoing",
        outgoing: "Translate my messages before sending",
        outgoingFrom: "From",
        outgoingTo: "To",
        skipPrefix: "\"No translation\" prefix",
        skipPrefixNote: "A message starting with it is sent as is (the prefix is removed)",
        preview: "Check before sending",
        previewNote: "Shows the translation and its back-translation; \"Edit\" puts the text back into the input box",
        catSlang: "Slang",
        slang: "Expand slang before translating",
        slangNote: "%s Russian slang words built in (хз → не знаю, го → давай…)",
        slangCustom: "Custom dictionary",
        slangCustomNote: "One per line: word = replacement. Works for any language, overrides the built-in list.",
        slangPlaceholder: "ngl = not going to lie\nbrb = be right back",
        menuChannel: "AutoTranslate: my messages",
        menuDM: "AutoTranslate: my messages in DM",
        chDefault: "Same as settings (%s)",
        chOff: "Don't translate",
        globalOff: "off",
        chSet: "my messages in this chat: %s",
        chDefaultSet: "this chat now follows the general settings",
        catCh: "Per-chat languages",
        chList: "Chats with their own language",
        chNote: "Right-click a channel, DM or group → \"AutoTranslate: my messages\". A chat's own setting overrides the general one.",
        chNone: "None yet. Right-click a channel or DM to set a language.",
        autoPeer: "Auto — match the other person",
        autoShort: "auto",
        noPeer: "couldn't tell the other person's language, sent as is",
        netFail: "Google is not responding (%s) — check your internet/VPN"
    }
};

// Русский сленг, который Google теряет или переводит буквально. Ключи в нижнем регистре.
const SLANG = {
    "хз": "не знаю", "хзз": "не знаю", "мб": "может быть", "кст": "кстати", "имхо": "по-моему",
    "щас": "сейчас", "ща": "сейчас", "щя": "сейчас", "спс": "спасибо", "пасиб": "спасибо", "спасибки": "спасибо",
    "пж": "пожалуйста", "плз": "пожалуйста", "пжлст": "пожалуйста", "нзч": "не за что",
    "норм": "нормально", "ок": "хорошо", "окей": "хорошо", "оч": "очень", "тож": "тоже",
    "ваще": "вообще", "кароч": "короче", "короч": "короче", "чё": "что", "че": "что", "чо": "что", "шо": "что",
    "прив": "привет", "ку": "привет", "бб": "пока", "споки": "спокойной ночи", "сори": "извини", "сорян": "извини",
    "пон": "понятно", "рил": "правда", "лол": "ха-ха", "кек": "ха-ха", "ору": "очень смешно",
    "рофл": "шутка", "рофлишь": "шутишь", "кринж": "стыдоба", "кринжово": "стыдно", "збс": "отлично",
    "изи": "легко", "го": "давай", "гоу": "давай", "гг": "хорошая игра", "афк": "отошёл",
    "катка": "игра", "катку": "игру", "катки": "игры", "каткой": "игрой", "катке": "игре",
    "тиммейт": "товарищ по команде", "тиммейты": "товарищи по команде", "нуб": "новичок", "нубы": "новички",
    "лагает": "тормозит", "лагать": "тормозить", "лаги": "тормоза",
    "комп": "компьютер", "компа": "компьютера", "инет": "интернет", "чел": "человек", "челы": "люди",
    "дс": "дискорд", "тг": "телеграм", "пох": "всё равно", "пофиг": "всё равно", "пофигу": "всё равно"
};

// Куски, которые нельзя отдавать переводчику: код, упоминания/эмодзи/каналы, ссылки, спойлер-маркеры.
const PROTECTED = /(```[\s\S]*?```|`[^`\n]+`|<a?:\w+:\d+>|<[@#][!&]?\d+>|<\/[\w ]+:\d+>|<t:\d+(?::\w)?>|https?:\/\/\S+|\|\|)/g;

// BdApi.Net.fetch идёт мимо CSP Discord'а; обычный fetch — запасной вариант.
async function getJson(url) {
    const resp = await (BdApi.Net?.fetch ?? fetch)(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    try {
        return await resp.json();
    } catch (e) {
        throw new Error("blocked"); // вместо JSON пришла HTML-страница Google «Sorry…»
    }
}

const query = (text, sl, tl) => `&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(text)}`;

// Адреса Google Translate без ключа; оба отдают {text, src}.
const ENDPOINTS = [
    async (text, sl, tl) => {
        const data = await getJson("https://translate.googleapis.com/translate_a/single?client=gtx&dt=t" + query(text, sl, tl));
        return { text: (data[0] || []).map(p => p[0]).join(""), src: data[2] || sl };
    },
    // sl=auto -> [["перевод","язык"]], заданный sl -> ["перевод"]
    async (text, sl, tl) => {
        const data = await getJson("https://clients5.google.com/translate_a/t?client=dict-chrome-ex" + query(text, sl, tl));
        const first = data[0];
        if (Array.isArray(first)) return { text: first[0], src: first[1] || sl };
        if (typeof first === "string") return { text: first, src: sl };
        throw new Error("bad response");
    }
];

const CACHE_FILE = "AutoTranslate.cache"; // -> plugins/AutoTranslate.cache.config.json
const CACHE_MAX = 5000;                     // записей; самые старые вытесняются

const STYLE_ID = "autotranslate-style";
const CSS = `
.at-translation {
    margin-top: 2px; padding: 2px 0 2px 8px;
    border-left: 2px solid var(--brand-500, #5865f2);
    color: var(--text-muted, #949ba4); font-size: 0.95em;
    white-space: pre-wrap; word-wrap: break-word;
}
.at-translation .at-lang { opacity: .6; font-size: .8em; margin-right: 6px; text-transform: uppercase; }
`;

module.exports = class AutoTranslate {
    constructor(meta) {
        this.meta = meta;
        this.cache = new Map();   // "sl|tl|text" -> {text, src}, сохраняется в JSON
        this.outputs = new Set(); // все тексты-результаты перевода (чтобы не переводить их снова)
        this.queue = [];
        this.active = 0;
        this.observer = null;
    }

    start() {
        this.settings = Object.assign({}, DEFAULTS, BdApi.Data.load(this.meta.name, "settings"));
        this.settings.incomingTo ??= this.uiLang();
        // channelId -> код языка или "off"; копия, чтобы не мутировать сохранённый объект по ссылке
        this.settings.channelLangs = Object.assign({}, this.settings.channelLangs);
        this.loadCache();
        this.patchContextMenus();
        BdApi.DOM.addStyle(STYLE_ID, CSS);
        this.patchSend();
        this.observer = new MutationObserver(() => this.scheduleScan());
        this.observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        this.scheduleScan();
    }

    stop() {
        BdApi.Patcher.unpatchAll(this.meta.name);
        this.unpatchMenus?.forEach(u => u());
        this.unpatchMenus = null;
        BdApi.DOM.removeStyle(STYLE_ID);
        this.observer?.disconnect();
        this.observer = null;
        clearTimeout(this.scanTimer);
        if (this.cacheTimer) this.saveCache();
        document.querySelectorAll(".at-translation").forEach(e => e.remove());
        document.querySelectorAll("[data-at-src]").forEach(e => delete e.dataset.atSrc);
    }

    save() {
        BdApi.Data.save(this.meta.name, "settings", this.settings);
    }

    locale() {
        try {
            const l = BdApi.Webpack.getStore("LocaleStore")?.locale;
            if (l) return l;
        } catch (e) { }
        return document.documentElement.lang || navigator.language || "en";
    }

    // Язык интерфейса Discord как код из LANGS ("en-US" -> "en", "zh-CN" остаётся).
    uiLang() {
        const l = this.locale();
        if (l in LANGS) return l;
        const base = l.split("-")[0];
        return base in LANGS ? base : "en";
    }

    t(key, ...args) {
        const table = this.locale().startsWith("ru") ? STRINGS.ru : STRINGS.en;
        return args.reduce((str, a) => str.replace("%s", a), table[key]);
    }

    // ---------- перевод ----------

    async translate(text, sl, tl) {
        const key = `${sl}|${tl}|${text}`;
        if (this.cache.has(key)) return this.cache.get(key);
        const res = await this.enqueue(() => this.request(text, sl, tl));
        this.remember(key, res);
        return res;
    }

    // ---------- постоянный кэш (AutoTranslate.cache.config.json рядом с плагином) ----------

    loadCache() {
        const saved = BdApi.Data.load(CACHE_FILE, "entries") || {};
        for (const [key, res] of Object.entries(saved)) {
            if (res && typeof res.text === "string") {
                this.cache.set(key, res);
                this.outputs.add(res.text.trim());
            }
        }
    }

    remember(key, res) {
        while (this.cache.size >= CACHE_MAX) this.cache.delete(this.cache.keys().next().value);
        this.cache.set(key, res);
        this.outputs.add(res.text.trim());
        clearTimeout(this.cacheTimer);
        this.cacheTimer = setTimeout(() => this.saveCache(), 2000);
    }

    saveCache() {
        clearTimeout(this.cacheTimer);
        this.cacheTimer = null;
        BdApi.Data.save(CACHE_FILE, "entries", Object.fromEntries(this.cache));
    }

    // Текст, который мы сами получили переводом, повторно не переводим.
    isOurTranslation(text) {
        return this.outputs.has(text.trim());
    }

    // Не больше 3 запросов одновременно, чтобы Google не начал резать.
    enqueue(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ fn, resolve, reject });
            this.pump();
        });
    }

    pump() {
        while (this.active < 3 && this.queue.length) {
            const { fn, resolve, reject } = this.queue.shift();
            this.active++;
            fn().then(resolve, reject).finally(() => { this.active--; this.pump(); });
        }
    }

    // Сначала адрес, который сработал последним. Основной (gtx) Google часто блокирует
    // для VPN/хостинговых IP («Sorry… automated queries»), запасной (dict-chrome-ex) — нет.
    async request(text, sl, tl) {
        const order = this.endpoint === 1 ? [1, 0] : [0, 1];
        let lastErr;
        for (const i of order) {
            try {
                const r = await ENDPOINTS[i](text, sl, tl);
                this.endpoint = i;
                this.failNotified = false;
                return r;
            } catch (e) {
                lastErr = e;
            }
        }
        if (!this.failNotified) {
            this.failNotified = true;
            BdApi.UI.showToast(`AutoTranslate: ${this.t("netFail", lastErr.message)}`, { type: "error" });
        }
        throw lastErr;
    }

    // ---------- сленг ----------

    slangMap() {
        if (this._slang) return this._slang;
        const map = Object.assign({}, SLANG);
        for (const line of (this.settings.slangCustom || "").split("\n")) {
            const m = line.match(/^\s*([^=#]+?)\s*=\s*(.*?)\s*$/);
            if (m) map[m[1].toLowerCase()] = m[2];
        }
        const keys = Object.keys(map).sort((a, b) => b.length - a.length)
            .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        // \b не работает с кириллицей, поэтому границы слова через lookaround по буквам/цифрам
        const re = keys.length ? new RegExp(`(?<![\\p{L}\\d])(${keys.join("|")})(?![\\p{L}\\d])`, "giu") : null;
        return this._slang = { map, re };
    }

    expandSlang(text) {
        const { map, re } = this.slangMap();
        if (!re) return text;
        return text.replace(re, w => {
            const r = map[w.toLowerCase()];
            if (r === undefined) return w;
            return w[0] !== w[0].toLowerCase() ? r.charAt(0).toUpperCase() + r.slice(1) : r;
        });
    }

    // Переводит только текстовые куски, защищённые (код, упоминания, ссылки) оставляет как есть.
    async translatePreserving(text, sl, tl, prepare) {
        const parts = text.split(PROTECTED);
        let src = sl;
        const out = await Promise.all(parts.map(async (part, i) => {
            if (i % 2 === 1 || !/\p{L}/u.test(part)) return part;
            if (prepare) part = prepare(part);
            const lead = part.match(/^\s*/)[0], trail = part.match(/\s*$/)[0];
            const r = await this.translate(part.trim(), sl, tl);
            src = r.src;
            return lead + r.text + trail;
        }));
        return { text: out.join(""), src };
    }

    // ---------- исходящие ----------

    patchSend() {
        const MessageActions = BdApi.Webpack.getByKeys("sendMessage", "editMessage");
        if (!MessageActions) {
            BdApi.UI.showToast(`AutoTranslate: ${this.t("noSend")}`, { type: "error" });
            return;
        }
        // sendMessage(channelId, message, ...)
        BdApi.Patcher.instead(this.meta.name, MessageActions, "sendMessage", async (that, args, original) => {
            const msg = args[1];
            if (msg?.content) {
                const content = await this.prepareOutgoing(msg.content, args[0]);
                if (content === null) {
                    this.restoreInput(msg.content);
                    return;
                }
                msg.content = content;
            }
            return original.apply(that, args);
        });
        // editMessage(channelId, messageId, message) — при отмене сообщение просто остаётся старым
        BdApi.Patcher.instead(this.meta.name, MessageActions, "editMessage", async (that, args, original) => {
            const msg = args[2];
            if (msg?.content) {
                const content = await this.prepareOutgoing(msg.content, args[0]);
                if (content === null) return;
                msg.content = content;
            }
            return original.apply(that, args);
        });
    }

    // Текст, который реально уйдёт, или null, если в окне проверки нажали «Исправить».
    async prepareOutgoing(source, channelId) {
        const s = this.settings;
        if (s.skipPrefix && source.startsWith(s.skipPrefix)) return source.slice(s.skipPrefix.length).trimStart();
        const tl = await this.outgoingTarget(channelId);
        if (!tl) return source;
        let r;
        try {
            r = await this.translatePreserving(source, s.outgoingFrom, tl,
                s.slang ? t => this.expandSlang(t) : null);
        } catch (e) {
            BdApi.UI.showToast(`AutoTranslate: ${this.t("sendError", e.message)}`, { type: "warning" });
            return source;
        }
        if (!r.text.trim() || r.text === source) return source;
        if (s.preview && !(await this.confirmSend(source, r, tl))) return null;
        return r.text;
    }

    // Язык исходящих для чата: своя настройка чата важнее общей. null — не переводить.
    // "auto" — язык, на котором в этом чате пишут другие.
    async outgoingTarget(channelId) {
        const own = this.settings.channelLangs[channelId];
        const tl = own === "off" ? null : own || (this.settings.outgoing ? this.settings.outgoingTo : null);
        if (tl !== "auto") return tl;
        const peer = await this.peerLang(channelId);
        if (!peer) BdApi.UI.showToast(`AutoTranslate: ${this.t("noPeer")}`, { type: "info" });
        return peer;
    }

    // Язык последних (до 3) чужих сообщений в чате, определённый Google'ом.
    async peerLang(channelId) {
        try {
            const me = BdApi.Webpack.getStore("UserStore")?.getCurrentUser()?.id;
            const msgs = BdApi.Webpack.getStore("MessageStore")?.getMessages(channelId);
            const list = msgs?.toArray?.() ?? msgs?._array ?? [];
            const texts = [];
            for (let i = list.length - 1; i >= 0 && texts.length < 3; i--) {
                const m = list[i];
                if (m.author?.id === me || m.author?.bot) continue;
                const text = (m.content || "").replace(PROTECTED, " ").trim();
                if (/\p{L}{2}/u.test(text)) texts.push(text);
            }
            if (!texts.length) return null;
            return (await this.translate(texts.join("\n"), "auto", "en")).src;
        } catch (e) {
            return null;
        }
    }

    // ---------- языки по чатам ----------

    patchContextMenus() {
        this.unpatchMenus = ["channel-context", "thread-context", "gdm-context", "user-context"].map(nav =>
            BdApi.ContextMenu.patch(nav, (tree, props) => {
                const id = this.menuChannelId(nav, props);
                if (!id || !tree?.props) return;
                const item = this.channelMenu(id, nav === "user-context");
                const children = tree.props.children;
                tree.props.children = Array.isArray(children) ? [...children, item] : [children, item];
            }));
    }

    // Для меню пользователя — его личка (если она есть), для остальных — сам канал.
    menuChannelId(nav, props) {
        if (nav !== "user-context") return props.channel?.id;
        if (props.channel?.type === 1) return props.channel.id;
        if (!props.user) return null;
        try {
            return BdApi.Webpack.getStore("ChannelStore")?.getDMFromUserId(props.user.id) ?? null;
        } catch (e) {
            return null;
        }
    }

    channelMenu(id, dm) {
        const s = this.settings;
        const cur = s.channelLangs[id];
        const set = (value, label) => {
            if (value === undefined) delete s.channelLangs[id];
            else s.channelLangs[id] = value;
            this.save();
            BdApi.ContextMenu.close();
            BdApi.UI.showToast(`AutoTranslate: ${label}`, { type: "success" });
        };
        const global = !s.outgoing ? this.t("globalOff") : s.outgoingTo === "auto" ? this.t("autoShort") : s.outgoingTo;
        const items = [
            {
                type: "toggle", label: this.t("chDefault", global), checked: cur === undefined,
                action: () => set(undefined, this.t("chDefaultSet"))
            },
            {
                type: "toggle", label: this.t("chOff"), checked: cur === "off",
                action: () => set("off", this.t("chSet", this.t("chOff")))
            },
            {
                type: "toggle", label: this.t("autoPeer"), checked: cur === "auto",
                action: () => set("auto", this.t("chSet", this.t("autoPeer")))
            },
            { type: "separator" },
            ...Object.entries(LANGS).filter(([code]) => code !== "auto").map(([code, name]) => ({
                type: "toggle", label: `${name} (${code})`, checked: cur === code,
                action: () => set(code, this.t("chSet", name))
            }))
        ];
        return BdApi.ContextMenu.buildItem({
            type: "submenu", id: "autotranslate-channel", label: this.t(dm ? "menuDM" : "menuChannel"), items
        });
    }

    channelName(id) {
        try {
            const ch = BdApi.Webpack.getStore("ChannelStore")?.getChannel(id);
            if (!ch) return id;
            const UserStore = BdApi.Webpack.getStore("UserStore");
            const userName = uid => { const u = UserStore?.getUser(uid); return u?.globalName || u?.username || uid; };
            if (ch.type === 1) return "@" + userName(ch.recipients?.[0]);
            if (!ch.guild_id) return ch.name || (ch.recipients || []).map(userName).join(", ");
            const guild = BdApi.Webpack.getStore("GuildStore")?.getGuild(ch.guild_id)?.name;
            return guild ? `${guild} › #${ch.name}` : `#${ch.name}`;
        } catch (e) {
            return id;
        }
    }

    // Окно «что уйдёт» + обратный перевод на язык оригинала, чтобы увидеть искажения смысла.
    async confirmSend(source, r, tl) {
        const s = this.settings;
        const back = s.outgoingFrom !== "auto" ? s.outgoingFrom : r.src;
        let backText;
        try {
            backText = (await this.translatePreserving(r.text, tl, back)).text;
        } catch (e) {
            backText = this.t("backFail", e.message);
        }
        const h = BdApi.React.createElement;
        const block = (title, text, accent) => h("div", { style: { marginBottom: "12px" } },
            h("div", { style: { fontSize: "12px", fontWeight: 600, textTransform: "uppercase", opacity: .7, marginBottom: "4px" } }, title),
            h("div", {
                style: {
                    padding: "8px 10px", borderRadius: "4px", whiteSpace: "pre-wrap", wordWrap: "break-word",
                    background: "var(--background-secondary, #2b2d31)", borderLeft: `3px solid ${accent}`,
                    color: "var(--text-normal, #dbdee1)", userSelect: "text"
                }
            }, text));
        const content = h("div", null,
            block(this.t("willSend", tl), r.text, "var(--brand-500, #5865f2)"),
            block(this.t("backTitle", back), backText, "var(--status-warning, #f0b232)"));
        return new Promise(resolve => {
            BdApi.UI.showConfirmationModal(this.t("checkTitle"), content, {
                confirmText: this.t("send"),
                cancelText: this.t("fix"),
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false)
            });
        });
    }

    // Discord уже очистил поле ввода — возвращаем туда текст, чтобы его можно было поправить.
    restoreInput(text) {
        try {
            const mod = BdApi.Webpack.getByKeys("ComponentDispatch");
            mod.ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", { rawText: text, plainText: text });
        } catch (e) {
            (window.DiscordNative?.clipboard?.copy ?? (t => navigator.clipboard.writeText(t)))(text);
            BdApi.UI.showToast(`AutoTranslate: ${this.t("copied")}`, { type: "info" });
        }
    }

    // ---------- входящие ----------

    scheduleScan() {
        if (this.scanTimer) return;
        this.scanTimer = setTimeout(() => { this.scanTimer = null; this.scan(); }, 150);
    }

    scan() {
        if (!this.settings.incoming) return;
        for (const el of document.querySelectorAll('div[id^="message-content-"]')) {
            if (/repliedTextContent/.test(el.className)) continue; // превью ответа — не трогаем
            if (this.isOwn(el)) continue;
            const text = this.extractText(el);
            if (!text || !/\p{L}/u.test(text)) continue;
            const next = el.nextElementSibling;
            const hasBox = next?.classList.contains("at-translation");
            if (el.dataset.atSrc === text && (hasBox || el.dataset.atSkip === text)) continue;
            if (this.isOurTranslation(text)) { // это уже наш перевод (напр. отправленное переведённое)
                el.dataset.atSrc = el.dataset.atSkip = text;
                if (hasBox) next.remove();
                continue;
            }
            el.dataset.atSrc = text;
            if (hasBox) next.remove();
            this.translateElement(el, text);
        }
    }

    // Строка сообщения имеет id "chat-messages-<channelId>-<messageId>"; автора берём из MessageStore.
    isOwn(el) {
        const m = el.closest('li[id^="chat-messages-"]')?.id.match(/^chat-messages-(\d+)-(\d+)$/);
        if (!m) return false;
        try {
            const me = BdApi.Webpack.getStore("UserStore")?.getCurrentUser()?.id;
            const msg = BdApi.Webpack.getStore("MessageStore")?.getMessage(m[1], m[2]);
            return !!me && msg?.author?.id === me;
        } catch (e) {
            return false;
        }
    }

    extractText(el) {
        const clone = el.cloneNode(true);
        // пометку «(изменено)» убираем: из-за неё Google принимает любой текст за русский
        clone.querySelectorAll("pre, code, time, .at-translation, [class*='timestamp'], [class*='edited']")
            .forEach(n => n.remove());
        // эмодзи-картинки -> их alt, чтобы не терять смысл
        clone.querySelectorAll("img[alt]").forEach(img => img.replaceWith(img.alt));
        return clone.textContent.trim();
    }

    async translateElement(el, text) {
        const tl = this.settings.incomingTo;
        let r;
        try {
            r = await this.translate(text, "auto", tl);
        } catch (e) {
            delete el.dataset.atSrc; // попробуем при следующем скане
            return;
        }
        if (el.dataset.atSrc !== text) return; // сообщение успели отредактировать
        // уже на нужном языке или перевод совпал с оригиналом — ничего не показываем
        if (r.src.toLowerCase().startsWith(tl.toLowerCase().split("-")[0]) || r.text.trim() === text) {
            el.dataset.atSkip = text;
            return;
        }
        el.nextElementSibling?.classList.contains("at-translation") && el.nextElementSibling.remove();
        const box = document.createElement("div");
        box.className = "at-translation";
        if (this.settings.showLang) {
            const lang = document.createElement("span");
            lang.className = "at-lang";
            lang.textContent = r.src;
            box.append(lang);
        }
        box.append(r.text);
        el.after(box);
    }

    // ---------- настройки ----------

    getSettingsPanel() {
        const s = this.settings;
        const langs = allowAuto => Object.entries(LANGS)
            .filter(([code]) => allowAuto || code !== "auto")
            .map(([code, name]) => ({ label: `${name ?? this.t("auto")} (${code})`, value: code }));

        const h = BdApi.React.createElement;
        const ChannelList = () => {
            const [map, setMap] = BdApi.React.useState(() => ({ ...s.channelLangs }));
            const entries = Object.entries(map);
            if (!entries.length) return h("div", { style: { color: "var(--text-muted, #949ba4)" } }, this.t("chNone"));
            const remove = id => {
                delete s.channelLangs[id];
                this.save();
                const next = { ...map };
                delete next[id];
                setMap(next);
            };
            return h("div", { style: { display: "flex", flexDirection: "column", gap: "4px" } },
                entries.map(([id, lang]) => h("div", {
                    key: id,
                    style: {
                        display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", borderRadius: "4px",
                        background: "var(--background-secondary, #2b2d31)", color: "var(--text-normal, #dbdee1)"
                    }
                },
                    h("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, this.channelName(id)),
                    h("span", { style: { color: "var(--text-muted, #949ba4)" } },
                        lang === "off" ? this.t("chOff") : lang === "auto" ? this.t("autoPeer") : `${LANGS[lang] ?? lang} (${lang})`),
                    h("button", {
                        onClick: () => remove(id),
                        style: {
                            background: "none", border: "none", cursor: "pointer", fontSize: "16px", lineHeight: 1,
                            color: "var(--text-muted, #949ba4)"
                        }
                    }, "✕"))));
        };

        return BdApi.UI.buildSettingsPanel({
            settings: [
                {
                    type: "category", id: "in", name: this.t("catIn"), collapsible: true, shown: true, settings: [
                        { type: "switch", id: "incoming", name: this.t("incoming"), value: s.incoming },
                        { type: "dropdown", id: "incomingTo", name: this.t("incomingTo"), value: s.incomingTo, options: langs(false) },
                        { type: "switch", id: "showLang", name: this.t("showLang"), value: s.showLang }
                    ]
                },
                {
                    type: "category", id: "out", name: this.t("catOut"), collapsible: true, shown: true, settings: [
                        { type: "switch", id: "outgoing", name: this.t("outgoing"), value: s.outgoing },
                        { type: "dropdown", id: "outgoingFrom", name: this.t("outgoingFrom"), value: s.outgoingFrom, options: langs(true) },
                        { type: "dropdown", id: "outgoingTo", name: this.t("outgoingTo"), value: s.outgoingTo,
                            options: [{ label: this.t("autoPeer"), value: "auto" }, ...langs(false)]
                        },
                        {
                            type: "text", id: "skipPrefix", name: this.t("skipPrefix"), value: s.skipPrefix,
                            note: this.t("skipPrefixNote")
                        },
                        {
                            type: "switch", id: "preview", name: this.t("preview"), value: s.preview,
                            note: this.t("previewNote")
                        }
                    ]
                },
                {
                    type: "category", id: "ch", name: this.t("catCh"), collapsible: true, shown: true, settings: [
                        { type: "custom", id: "channelLangs", name: this.t("chList"), note: this.t("chNote"), children: h(ChannelList) }
                    ]
                },
                {
                    type: "category", id: "sl", name: this.t("catSlang"), collapsible: true, shown: false, settings: [
                        {
                            type: "switch", id: "slang", name: this.t("slang"), value: s.slang,
                            note: this.t("slangNote", Object.keys(SLANG).length)
                        },
                        {
                            type: "custom", id: "slangCustom", name: this.t("slangCustom"),
                            note: this.t("slangCustomNote"),
                            children: BdApi.React.createElement("textarea", {
                                defaultValue: s.slangCustom, rows: 6, placeholder: this.t("slangPlaceholder"),
                                style: {
                                    width: "100%", boxSizing: "border-box", resize: "vertical", padding: "8px",
                                    background: "var(--input-background, #1e1f22)", color: "var(--text-normal, #dbdee1)",
                                    border: "1px solid var(--background-tertiary, #111)", borderRadius: "4px", fontFamily: "inherit"
                                },
                                onChange: e => { s.slangCustom = e.target.value; this._slang = null; this.save(); }
                            })
                        }
                    ]
                }
            ],
            onChange: (category, id, value) => {
                s[id] = value;
                this.save();
                this.resetIncoming();
            }
        });
    }

    resetIncoming() {
        document.querySelectorAll(".at-translation").forEach(e => e.remove());
        document.querySelectorAll("[data-at-src]").forEach(e => { delete e.dataset.atSrc; delete e.dataset.atSkip; });
        this.scheduleScan();
    }
};
