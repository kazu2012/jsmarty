コミッタ募集中です。

## Description ##
The "JSmarty" is a template engine, written by JavaScript.

## Latest release ##
Release 0.5.1, Feb 03 2008.

### Usage ###
Call JSmarty.js and JSmarty/Compiler.js
```
<script src="JSmarty.js"></script>
<script src="JSmarty/Compiler.js"></script>
```
Script...
```
var jsmarty = new JSmarty();
jsmarty.assign('foo', 'Hello World!!');
jsmarty.display('string:{$foo}'); // Hello World!!
```

## 日本語の説明 ##
JSmartyはSmartyの記法をそのまま利用したいが為に作成したJavaScriptで動くテンプレートエンジンです。

2007/07/15