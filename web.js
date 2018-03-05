function console_init()
{
       websocket = 'ws://127.0.0.1:9000/ws';
               if (window.WebSocket) {
                 ws = new WebSocket(websocket);
               }
               else if (window.MozWebSocket) {
                 ws = MozWebSocket(websocket);
               }
               else {
                 console.log('WebSocket Not Supported');
               }

               window.onbeforeunload = function(e) {
                 ws.close(1000, 'gui quit!');

                 if(!e) e = window.event;
                 e.stopPropagation();
                 e.preventDefault();
               };

               

                function CheckInfo(event) {
                    if (event.keyCode == 13) {
                        input_set = document.querySelectorAll('input');
                        //console.log(input_set[input_set.length-1].value);
                        input_set[input_set.length-1].disabled=true;
                        o = '{"from":"front-end","data":{"type":"input","data":"'+input_set[input_set.length-1].value+'"}}';
                        ws.send(o);
                    }
                }


               ws.onmessage = function (evt) {
                      console.log(evt.data);
                      var obj;
                      try
                      {
                          obj = JSON.parse(evt.data);
                      }
                      catch(err)
                      {
                          return;
                      }
                      if (obj.data.type=='txt'&&obj.from=='back-end')
                      {
                          //c.value=c.value + obj.data.data + '\\n';
                          var parent = document.body;
                          var div = document.createElement("div");
                          div.innerHTML = obj.data.data;
                          parent.appendChild(div);
                          div.scrollIntoView(true)
                      }
                      else if (obj.data.type=='input'&&obj.from=='back-end')
                      {
                          var parent = document.body;
                          var div = document.createElement("div");
                          div.innerHTML = obj.data.data;
                          var input_box = document.createElement("input");
                          input_box.style.width = "100%";
                          input_box.onkeypress = CheckInfo;
                          div.appendChild(input_box);
                          parent.appendChild(div);
                          div.scrollIntoView(true);
                          input_box.focus();
                      }
                      divs = document.querySelectorAll('div');
                      if (divs.length>10)
                      {
                          divs[1].parentNode.removeChild(divs[0]);
                      }
               };
               ws.onopen = function() {
                  ws.send("gui started!");
               };
               ws.onclose = function(evt) {
                      console.log('Connection closed by server: ' + evt.code + ' \"' + evt.reason + '\"\\n');
               };

}
