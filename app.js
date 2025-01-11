let user_list = [];

Deno.serve({
    port: 443, //ポート番号を変更
    handler: async (req) => {
        if (req.headers.get("upgrade") != "websocket") {
            return new Response(null, { status: 501 });
        }

        const { socket, response } = Deno.upgradeWebSocket(req);

        const sendToAllClient = value => {
            user_list.forEach(user => {
                user.send(`${value}人目のユーザーが参加しました！`);
            });
        }

        socket.onopen = () => {
            user_list.push(socket);
            const n = user_list.length;
            sendToAllClient(n);
        };
        socket.onmessage = (e) => {
            console.log(`RECEIVED: ${e.data}`);
        };
        socket.onclose = () => {
        };
        socket.onerror = (error) => console.error("ERROR:", error);

        return response;
    },
});