var Typer = {
  text: null,
  accessCountimer: null,
  index: 0,
  speed: 1,   // lines per update
  file: "",
  accessCount: 0,
  deniedCount: 0,
  lines: [],
  autoScroll: true,  // new flag to control auto scroll

  init: function() {
    Typer.accessCountimer = setInterval(function() {
      Typer.updLstChr();
    }, 500);
    $.get(Typer.file, function(data) {
      Typer.text = data;
      Typer.lines = Typer.text.split('\n');
      startTyping();
    });
  },

  content: function() {
    return $("#console").html();
  },

  write: function(str) {
    $("#console").append(str);
    return false;
  },

  addText: function(key) {
    if (key.keyCode == 18) {  // ALT key
      Typer.accessCount++;
      if (Typer.accessCount >= 3) {
        Typer.makeAccess();
      }
    }
    else if (key.keyCode == 20) {  // CAPS LOCK key
      Typer.deniedCount++;
      if (Typer.deniedCount >= 3) {
        Typer.makeDenied();
      }
    }
    else if (key.keyCode == 27) {  // ESC key
      Typer.hidepop();
    }
    else if (Typer.lines.length > 0) {
      var cont = Typer.content();
      if (cont.substring(cont.length - 1, cont.length) == "|") {
        $("#console").html($("#console").html().substring(0, cont.length - 1));
      }
      if (key.keyCode != 8) {  // Not BACKSPACE
        Typer.index += Typer.speed;
      } else {
        if (Typer.index > 0) {
          Typer.index -= Typer.speed;
        }
      }

      if (Typer.index > Typer.lines.length) {
        Typer.index = Typer.lines.length;
      }

      var text = Typer.lines.slice(0, Typer.index).join("<br/>");
      $("#console").html(text);

      // Scroll automatically only if autoScroll is true
      if (Typer.autoScroll) {
        window.scrollTo(0, document.body.scrollHeight);
      }
    }

    if (key.preventDefault && key.keyCode != 122) {
      key.preventDefault();
    }
    if (key.keyCode != 122) {
      key.returnValue = false;
    }
  },

  updLstChr: function() {
    var cont = this.content();
    if (cont.substring(cont.length - 1, cont.length) == "|") {
      $("#console").html($("#console").html().substring(0, cont.length - 1));
    } else {
      this.write("|");
    }
  }
};

function replaceUrls(text) {
  var http = text.indexOf("http://");
  var space = text.indexOf(".me ", http);

  if (space != -1) {
    var url = text.slice(http, space - 1);
    return text.replace(url, '<a href="' + url + '">' + url + '</a>');
  } else {
    return text;
  }
}

function startTyping() {
  var timer = setInterval(function() {
    Typer.addText({ keyCode: 123748 });
    if (Typer.index >= Typer.lines.length) {
      clearInterval(timer);
      Typer.updLstChr();
      Typer.autoScroll = false;  // stop auto scrolling after done typing
    }
  }, 50);
}

Typer.speed = 1;
Typer.file = "KianRanjbar.txt";
Typer.init();