ได้ครับ เปิด Terminal ใน VS Code (Ctrl+`) แล้วรันเซิร์ฟเวอร์จากโฟลเดอร์ `goldlot` ได้เลย ไม่ต้องติดตั้งส่วนเสริม เมื่อเปิดผ่าน `localhost` Service worker จะลงทะเบียนได้ตามปกติ [210]

## วิธีที่ 1: Python

เหมาะถ้าเครื่องมี Python อยู่แล้ว

```
cd goldlot

python -m http.server 8000

```

บน Mac หรือ Linux ให้ใช้ `python3 -m http.server` แทน เมื่อรันแล้วจะขึ้นข้อความ Serving HTTP ... port 8000  จากนั้นเปิด `http://localhost:8000` ในเบราว์เซอร์ [pjbartlein.github](https://pjbartlein.github.io/REarthSysSci/localweb.html)

## วิธีที่ 2: Node (npx)

เหมาะถ้าเครื่องมี Node.js

```
cd goldlot

npx http-server -p 8787


```

ถ้าพิมพ์ `npx -v` แล้วขึ้นเลขเวอร์ชัน แสดงว่าใช้ได้ทันทีโดยไม่ต้องติดตั้งอะไรเพิ่ม  จากนั้นเปิด `http://localhost:8787`  ตัว `http-server` จะใช้โฟลเดอร์ปัจจุบันเป็นรากถ้าไม่มีโฟลเดอร์ `public` [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/CycleTracker/Secure_connection)

## ข้อควรรู้

- ถ้าเปิด Terminal ใน VS Code ที่โฟลเดอร์ `goldlot` อยู่แล้ว ไม่ต้องพิมพ์ `cd`
- หยุดเซิร์ฟเวอร์ด้วย Ctrl+C
- ถ้าเป็นการแก้ไฟล์แล้วทดสอบซ้ำ เบราว์เซอร์อาจใช้ไฟล์เก่าจากแคช ให้กด Ctrl+F5 หรือไปแท็บ Application > Service Workers แล้วติ๊ก Update on reload
- ควรใช้ที่อยู่เดียวให้สม่ำเสมอ (`localhost:8000` กับ `127.0.0.1:8000` มีข้อมูล localStorage แยกกัน ข้อนี้ผมอนุมานจากหลักการทำงานของเบราว์เซอร์)
- ถ้าเปิดจากมือถือด้วยที่อยู่ IP ในเครือข่ายบ้าน Service worker จะไม่ทำงาน เหมือนกรณีเครื่องมืออื่น