---
layout:     page
title:      Localization
published:  true
order:      /
---

Configuration for localization.

## IsoTranslation
Specifies the ISO translation (like "en-US"). If null, it does not apply a translation to the template.

## IsoFormat
Specifies the ISO code for the international format applied to the DAX template placeholder [@@GETISO](../dax-placeholders.md#vars). The iso code is in the format "en-US" and it is used in the third argument of the [FORMAT](https://dax.guide/format/) function in DAX.

## LocalizationFiles
List of localization files. Each localization file corresponds to a [TranslationDefinition](../definitions/translation-definition.md) object.
