import json
import websockets
import asyncio

'''
https://websockets.readthedocs.io/en/stable/
python websocket Library official documents
'''
async def socket_server(websocket,port):
  request = await websocket.recv()
  print(f"{request}")

  f = open('data.json')
  data = json.load(f)
  
  response = json.dumps(data)
  await websocket.send(response)

start_server = websockets.serve(socket_server,'localhost',8765)
'''
Excerpt from Official documents
loop.run_until_complete(future)
Run until the future (an instance of Future) has completed.
If the argument is a coroutine object it is implicitly scheduled to run as a asyncio.Task.
Return the Future’s result or raise its exception.
'''
asyncio.get_event_loop().run_until_complete(start_server)
'''
Start accepting connections , Until the collaboration is cancelled . Cancel serve_forever The task will cause the server to shut down .
This method can be called if the server is already accepting connections.
Only one serve_forever task can exist per one Server object.
'''
asyncio.get_event_loop().run_forever()