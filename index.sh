npm run compile

rm -rf compiled-asm
mkdir compiled-asm

node compiled/index.js hardware-homeworks/06/add/Add.asm compiled-asm/Add.hack

node compiled/index.js hardware-homeworks/06/max/Max.asm compiled-asm/Max.hack
node compiled/index.js hardware-homeworks/06/max/MaxL.asm compiled-asm/MaxL.hack

node compiled/index.js hardware-homeworks/06/rect/Rect.asm compiled-asm/Rect.hack
node compiled/index.js hardware-homeworks/06/rect/RectL.asm compiled-asm/RectL.hack

node compiled/index.js hardware-homeworks/06/pong/Pong.asm compiled-asm/Pong.hack
node compiled/index.js hardware-homeworks/06/pong/PongL.asm compiled-asm/PongL.hack

echo done
