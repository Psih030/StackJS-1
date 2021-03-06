module.exports = function(net){
    return function(config, port){
        net.createServer(function(socket){
            var buffer = '';
            socket.on('data', function(data){
                buffer+=data;
                var arr = buffer.split('\n');
                if(arr.length==2){
                    var message = arr[0];
                    buffer=arr[1];
                    try {
                        var obj = JSON.parse(message);

                        if(!(function(){
                                for(var i=0; i<config.length; i++){
                                    var handler = config[i];
                                    if(handler.match(obj)){
                                        handler.callback(obj, socket);
                                        return true;
                                    }
                                }
                                return false;
                            })()){
                            socket.write(JSON.stringify({
                                error: "Invalid request"
                            })+'\n');
                        }

                    } catch (e) {
                        socket.write(JSON.stringify({
                            error: "Invalid JSON"
                        })+'\n');
                    }
                }
            });


        }).listen(port);
    }
};