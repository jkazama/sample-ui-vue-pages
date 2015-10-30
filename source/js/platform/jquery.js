/*----------------------------------
 - jquery.js -
 JQueryライブラリの拡張実装
----------------------------------*/

export default function() {
  // 対象となるコントロールを無効化します
  $.fn.enable = function() { this.attr("disabled", false) }

  // 対象となるコントロールを有効化します
  $.fn.disable = function() { this.attr("disabled", true) }

  // jquery.bottom
  // スクロール末端に到達したイベント[bottom]を追加しています。
  $.fn.bottom = function(options) {
    defaults = { proximity: 0 }
    options = $.extend(defaults, options)
    this.each(function(obj) {
      $(obj).bind("scroll", () => {
        if (obj === window) {
          scrollHeight = $(document).height()
        } else {
          scrollHeight = $(obj)[0].scrollHeight
        }
        scrollPosition = $(obj).height() + $(obj).scrollTop()
        if ((scrollHeight - scrollPosition) / scrollHeight <= options.proximity) {
          $(obj).trigger("bottom")
        }
      })
      return false
    })
  }

  // スクロール末端に到達したイベント[bottom]の受信処理
  $.fn.onBottom = function(fn) {
    thisbottom({ proximity: 0.05 })
    this.on("bottom", fn)
  }

  // 指定した正規表現の要素クラスを削除
  $.fn.removeClassRegex = function(regex) {
    this.removeClass((index, css) => (css.match(regex) || []).join(' '))
  }
}