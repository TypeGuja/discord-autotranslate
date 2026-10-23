# AutoTranslate

Автопереводчик сообщений для Discord — плагин [BetterDiscord](https://betterdiscord.app).
Перевод через Google Translate, ключи и аккаунты не нужны.

*English below.*

## Что делает

- **Чужие сообщения** — под сообщением появляется перевод на выбранный язык. Если сообщение уже на этом языке, ничего не показывается.
- **Свои сообщения** (включается в настройках) — переводятся перед отправкой. Код, упоминания, эмодзи и ссылки не трогаются.
- **Проверка перед отправкой** — окно с переводом и обратным переводом. «Исправить» вернёт текст в поле ввода.
- **Сленг** (хз, го, катку…) расшифровывается перед переводом; свой словарь — в настройках.
- **Язык для каждого чата** — ПКМ по каналу или личке → «AutoTranslate: мои сообщения». Вариант «Авто — как пишет собеседник» сам определяет его язык.
- **Без перевода** — сообщение, начинающееся с `!!`, уходит как есть (префикс срезается).
- **Кэш переводов** — готовые переводы сохраняются в `plugins\AutoTranslate.cache.config.json` (до 5000 штук) и после перезапуска берутся оттуда, а не из Google. Наш собственный перевод повторно не переводится. Чтобы сбросить кэш, удали этот файл.

## Установка

1. Установи [BetterDiscord](https://betterdiscord.app) (аккаунт не нужен).
2. Скачай `AutoTranslate.plugin.js` со страницы [Releases](../../releases/latest) (или `AutoTranslate.zip` и распакуй).
3. Положи файл в папку плагинов: `%APPDATA%\BetterDiscord\plugins`
   (или Настройки Discord → BetterDiscord → Plugins → «Open Plugins Folder»).
4. Включи AutoTranslate в Настройки → Plugins. Шестерёнка рядом с плагином — выбор языков.

## Замечания

- Клиентские моды формально против правил Discord (на практике не банят).
- При очень большом числе запросов Google может временно ограничить перевод.

---

## English

The plugin UI is in Russian when Discord is in Russian, English otherwise.

### What it does

- **Other people's messages** — a translation appears under the message. Nothing is shown if it is already in your language. By default it translates into your Discord interface language.
- **Your messages** (enable in settings) — translated before sending. Code, mentions, emoji and links are left untouched.
- **Check before sending** — a window shows the translation and its back-translation. "Edit" cancels and puts the text back into the input box.
- **Slang** — custom dictionary in settings (`word = replacement`, one per line).
- **Per-chat language** — right-click a channel or DM → "AutoTranslate: my messages". "Auto — match the other person" detects their language.
- **No translation** — a message starting with `!!` is sent as is (prefix removed).
- **Translation cache** — finished translations are stored in `plugins\AutoTranslate.cache.config.json` (up to 5000) and reused after a restart instead of asking Google again. Our own translations are never translated a second time. Delete the file to reset it.

### Install

1. Install [BetterDiscord](https://betterdiscord.app) (no account needed).
2. Download `AutoTranslate.plugin.js` from [Releases](../../releases/latest) (or `AutoTranslate.zip` and unpack it).
3. Put it into the plugins folder: `%APPDATA%\BetterDiscord\plugins`
   (or Discord Settings → BetterDiscord → Plugins → "Open Plugins Folder").
4. Enable AutoTranslate in Settings → Plugins. The gear icon next to it opens language settings.

### Notes

- Client mods are technically against Discord's ToS (bans are very rare).
- With a very high volume of requests Google may rate-limit for a while.
