// ==UserScript==
// @name           ReplaceTextOnWebpages
// @namespace      http://userscripts.org/users/23652
// @description    Replaces text on websites. Now supports wildcards in search queries. Won't replace text in certain tags like links and code blocks
// @include        http://*.hupu.com/*
// @include        https://*.hupu.com/*
// @include        file://*
// @exclude        http://userscripts.org/scripts/review/*
// @exclude        http://userscripts.org/scripts/edit/*
// @exclude        http://userscripts.org/scripts/edit_src/*
// @exclude        https://userscripts.org/scripts/review/*
// @exclude        https://userscripts.org/scripts/edit/*
// @exclude        https://userscripts.org/scripts/edit_src/*
// @copyright      JoeSimmons
// @version        1.1.0
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// ==/UserScript==
(function () {
    'use strict';


    /*
        NOTE:
            You can use \\* to match actual asterisks instead of using it as a wildcard!
            The examples below show a wildcard in use and a regular asterisk replacement.
    */

    var words = {
    ///////////////////////////////////////////////////////


        // Syntax: 'Search word' : 'Replace word',
        '\[' : '',
        '\]' : '',
        '影视区' : '',
        '*》*什么水平*' : '',
        '*颜值*什么水平*' : '',
        '*喜欢谁*' : '',
        '*怎么排*' : '',
        '*李云龙*' : '',
        '*什么水平的*' : '',
        '*刘德华*' : '',
        '*如果你是*' : '',
        '*样的存在*' : '',
        '*张杰*' : '',
        '*景甜*' : '',
        '*吴昕*' : '',
        '*跑男*' : '',
        '*宋茜*' : '',
        '*鲜肉*' : '',
        '*明道*' : '',
        '*谢霆锋*' : '',
        '*陈奕迅*' : '',
        '*脑残粉*' : '',
        '*喜欢哪*' : '',
        '*偶像*' : '',
        '*票房*' : '',
        '*娜扎*' : '',
        '*周杰伦*' : '',
        '*王者荣耀*' : '',
        '*极限挑战*' : '',
        '*我们相爱吧*' : '',
        '*佟丽娅*' : '',
        '*张馨予*' : '',
        '*刘亦菲*' : '',
        '*吴亦凡*' : '',
        '*邓超*' : '',
        '*鹿晗*' : '',
        'your a' : 'you\'re a',
        'imo' : 'in my opinion',
        'im\\*o' : 'matching an asterisk, not a wildcard',
        '/\\bD\\b/g' : '[D]',


    ///////////////////////////////////////////////////////
    '':''};











    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words['']; // so the user can add each entry ending with a comma,
                      // I put an extra empty key/value pair in the object.
                      // so we need to remove it before continuing

    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push( words[word] );
        }
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index] );
            });
        }
    }

}());