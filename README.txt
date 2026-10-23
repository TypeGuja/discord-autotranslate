AutoTranslate — автопереводчик для Discord (плагин BetterDiscord)

Что делает
  - Чужие сообщения: под сообщением показывает перевод на выбранный язык.
    Если сообщение уже на этом языке, ничего не показывает.
  - Свои сообщения (включается в настройках): переводит перед отправкой.
    Код, упоминания, эмодзи и ссылки не трогает.
  - Сленг (хз, го, катку...) расшифровывается перед переводом; свой словарь — в настройках.
  - Перед отправкой окно: перевод + обратный перевод. «Исправить» вернёт текст в поле.
  - Язык для каждого чата: ПКМ по каналу/личке -> «AutoTranslate: мои сообщения».
    Вариант «Авто — как пишет собеседник» сам определяет язык собеседника.
  - Сообщение, начинающееся с !!, уходит без перевода (префикс срезается).
  - Перевод через Google Translate, ключи и аккаунты не нужны.
  - Готовые переводы сохраняются в plugins\AutoTranslate.cache.config.json
    (до 5000 штук) и после перезапуска берутся оттуда, а не из Google.
    Текст, который сам является нашим переводом, повторно не переводится.
    Чтобы сбросить кэш — удали этот файл.

Установка
  1. Установи BetterDiscord: https://betterdiscord.app (аккаунт не нужен).
  2. Скопируй AutoTranslate.plugin.js в папку плагинов:
       Windows: %APPDATA%\BetterDiscord\plugins
       (или Настройки Discord -> BetterDiscord -> Plugins -> "Open Plugins Folder")
  3. В Настройки -> Plugins включи AutoTranslate.
  4. Шестерёнка рядом с плагином — выбор языков.

Замечания
  - Клиентские моды формально против правил Discord (на практике не банят).
  - При очень большом числе запросов Google может временно ограничить перевод.

----------------------------------------------------------------------

AutoTranslate — auto-translator for Discord (BetterDiscord plugin)

The plugin UI is in Russian when Discord is in Russian, English otherwise.

What it does
  - Other people's messages: shows a translation under the message.
    Nothing is shown if the message is already in your language.
    By default it translates into your Discord interface language.
  - Your messages (enable in settings): translated before sending.
    Code, mentions, emoji and links are left untouched.
  - Before sending, a window shows the translation and its back-translation.
    "Edit" cancels and puts the text back into the input box.
  - Custom slang dictionary in settings (word = replacement, one per line).
  - Per-chat language: right-click a channel/DM -> "AutoTranslate: my messages".
    "Auto — match the other person" detects the other person's language.
  - A message starting with !! is sent without translation (prefix removed).
  - Uses Google Translate, no keys or accounts needed.

Install
  1. Install BetterDiscord: https://betterdiscord.app (no account needed).
  2. Copy AutoTranslate.plugin.js into the plugins folder:
       Windows: %APPDATA%\BetterDiscord\plugins
       (or Discord Settings -> BetterDiscord -> Plugins -> "Open Plugins Folder")
  3. Enable AutoTranslate in Settings -> Plugins.
  4. The gear icon next to it opens language settings.

Notes
  - Client mods are technically against Discord's ToS (bans are very rare).
  - With a very high volume of requests Google may rate-limit for a while.
