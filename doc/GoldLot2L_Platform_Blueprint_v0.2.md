# GoldLot2L Platform Blueprint v0.2

วันที่: 11 พ.ย. 2026 | สถานะ: ร่างหลังการปรึกษา (ยังไม่เริ่มพัฒนา)
Repo ปัจจุบัน: vhpknn/GoldLot2L (PWA static: index.html, report.js, sw.js, manifest.json)
หมายเหตุ: เป็นแผนทางเทคนิค ไม่ใช่คำปรึกษากฎหมาย/ภาษี/การลงทุน ราคา/งบเป็นกรอบประเมินจากแหล่งบุคคลที่สาม ต้องตรวจราคาจริงก่อนตัดสินใจ

## Changelog จาก v0.1
- ยืนยันนิยาม "ทุนรวม" ของ Tier และกติกาเกินเพดาน (ข้อ 4.1)
- เพิ่ม Look & Feel Pass ($0.99/เดือน) แทนแนวคิดธีม $1.99 + ธีมเข้าถึงง่ายเป็นของฟรีเสมอ (ข้อ 12)
- โฮสต์: VPS เล็กเป็นค่าเริ่มต้นพร้อมเงื่อนไขบังคับ และเกณฑ์ย้ายไป managed (ข้อ 15)
- เพิ่ม Offline-First Contract ทั้งส่วนใหม่ (ข้อ 11) และแผน Play Store แบบ TWA + หน้าออฟไลน์เนทีฟ (ข้อ 12.3)
- ปรับแผนเฟสและเช็กลิสต์ทดสอบออฟไลน์ (ข้อ 17)

---

## 0. สรุป 1 หน้า
GoldLot2L พัฒนาจากแอปบันทึกทองคนเดียว เป็นแพลตฟอร์ม "สมุดบันทึกสินทรัพย์ส่วนตัว"
- หลายสินทรัพย์/หมวด/ประเทศ/ภาษา
- ปรับหน้าตาและความซับซ้อนตามอายุ/ระดับผู้ใช้ (เด็ก 13-15 ถึงผู้สูงอายุ ถึงขั้นสูง)
- Local-first: ข้อมูลธุรกรรมอยู่ในเครื่อง สำรองเข้ารหัสไป Google Drive/OneDrive ของผู้ใช้
- ใช้งานต่อได้แม้เซิร์ฟเวอร์ล่ม (Offline-First Contract)
- เซิร์ฟเวอร์เก็บแค่บัญชี สิทธิ์ config
- ขยายผ่านโมดูล (modular monolith) ; สมาชิก 4 Tier + Look & Feel Pass ; หน้า Admin ; อัปเดตอัตโนมัติแบบปลอดภัย
จุดยืน: เป็น "สมุดบันทึกและสถิติ" ตามกฎที่ผู้ใช้ตั้งเอง ไม่ใช่คำแนะนำการลงทุน

---

## 1. หลักการออกแบบ
1. สมุดบันทึก ไม่ใช่ผู้แนะนำ: ถ้อยคำเป็นกลาง
2. Local-first และ offline-first: เปิดและบันทึกได้โดยไม่พึ่งเซิร์ฟเวอร์
3. แยกแกน: Tier (จ่าย) / Complexity Level (เลือก) / Theme / Persona
4. ทุกอย่างเป็นข้อมูล/โมดูล ไม่ฝังในแกนกลาง
5. การเข้าถึงใช้งาน (accessibility) ไม่ถูกขาย: ธีมคอนทราสต์สูง ฟอนต์ใหญ่ ปุ่มใหญ่ ฟรีเสมอ
6. ไม่ล็อกข้อมูลผู้ใช้เมื่อหมดสมาชิก ส่งออกได้เสมอ
7. ปลอดภัยก่อนฟีเจอร์ ; เริ่มเล็ก ย้อนกลับได้ทุกเฟส

---

## 2. Decision Log

| # | เรื่อง | ค่าที่เลือก | สถานะ |
|---|---|---|---|
| D1 | ลักษณะแอป | สมุดบันทึก/สถิติ | ยืนยัน |
| D2 | สถาปัตยกรรม | Modular monolith (Express + PostgreSQL) | ยืนยัน |
| D3 | ราคา/ATH | กรอกเอง + ค่าแนะนำ + Google Sheet CSV | ยืนยัน |
| D4 | loan | เฟส 3 (รายการเดิมเรียกเฟส 2 ใน v0.1) | ยืนยัน |
| D5 | ระดับสถาบัน | เฟสหลัง/ไม่อยู่ในเวอร์ชันแรก | ยืนยัน |
| D6 | นิยามทุนรวม Tier | ผลรวมทุนทุกสินทรัพย์ที่ผู้ใช้บันทึก ; เกินเพดาน = ล็อกเฉพาะ "เพิ่มไม้ใหม่" | ยืนยัน (v0.2) |
| D7 | ธีม/ปรับแต่ง | Look & Feel Pass $0.99/เดือน (ยกเลิก = กลับ Basic) + แพ็กซื้อขาดเป็นทางเลือก + รวมใน Tier 3-4 | ยืนยันราคาเบื้องต้น |
| D8 | ธีมเข้าถึงง่าย | ฟรีทุกผู้ใช้ | แนะนำ ยืนยันหลักการ |
| D9 | โฮสต์ | VPS เล็กเครื่องเดียว + เงื่อนไขสำรองข้อมูล ; เกณฑ์ย้ายไป managed | ยืนยัน (v0.2) |
| D10 | Android | TWA + หน้าออฟไลน์เนทีฟ ก่อน ; Capacitor ภายหลังถ้าต้องการ | แนะนำ |
| D11 | iOS | PWA (Add to Home Screen) ก่อน ; สโตร์ภายหลัง | แนะนำ |
| D12 | โฆษณา | เลื่อน ตัดสินใจเมื่อมีผู้ใช้จริง | แนะนำ |
| D13 | WhatsApp | แจ้งเตือน/สรุปเท่านั้น เฟสหลัง (opt-in, template) | แนะนำ |
| D14 | เข้ารหัสสำรอง | รหัสผ่านผู้ใช้ กู้ไม่ได้ถ้าลืม + รหัสกู้คืนผู้ใช้เก็บเอง | แนะนำ |
| D15 | ผู้เยาว์ | บัญชีผูกผู้ปกครอง ผู้ปกครองจ่ายเงิน | แนะนำ ต้องตรวจกฎหมาย |
| D16 | Offline | ทำตาม Offline-First Contract (ข้อ 11) | แนะนำ |

---

## 3. สถาปัตยกรรม
```
[PWA / Android(TWA) / iOS(PWA) / (WhatsApp แจ้งเตือน)]
   |  ข้อมูลธุรกรรม: IndexedDB (เครื่องผู้ใช้)
   |  App shell: Service Worker precache
   |-- Storage Adapter --> local | Google Drive appDataFolder | OneDrive AppFolder
   |
HTTPS API (Express) [เสิร์ฟผ่าน Cloudflare]
   |-- Auth/Accounts | Entitlement Resolver <-- Subscriptions (Stripe webhook)
   |-- Config: plans, limits, assets, categories, themes, labels, country_rules
   |-- Reference data (versioned): suggested ATH, festival themes
   |-- Admin API
   v
PostgreSQL (บัญชี/สิทธิ์/config)  --> pg_dump อัตโนมัติ --> ที่เก็บนอกเครื่อง
```
- Client: คำนวณ grid (analyze), เก็บธุรกรรม, ทำ UI ตาม CL+Theme+ภาษา
- Server: ยืนยันตัวตน, ออก signed entitlement token, เสิร์ฟ config/ข้อมูลอ้างอิง
- CDN/Cloudflare: static, WAF, rate limit

---

## 4. สี่แกนของผู้ใช้
| แกน | ควบคุม | ใครกำหนด |
|---|---|---|
| Tier 1-4 | ฟีเจอร์/โควตาที่จ่าย | ซื้อ (admin ตั้งค่าได้) |
| Complexity Level (CL) 1-5 | ฟีเจอร์ที่เห็น/ภาษาง่าย | ผู้ใช้เลือก ค่าเริ่มต้นตามวัย |
| Theme | สี ฟอนต์ ไอคอน ขนาดปุ่ม | ผู้ใช้เลือก (Basic ฟรี, ตกแต่ง = Look & Feel Pass) |
| Persona | ชุดค่าเริ่มต้น CL+Theme | ระบบแนะนำจากอายุ เปลี่ยนได้ |

### 4.1 Tier (ปรับได้ใน admin)
| Tier | ทุนรวมสูงสุด | ราคา/เดือน | สินทรัพย์ | ตัวอย่างสิทธิ์ |
|---|---|---|---|---|
| 1 | 999 USD | ฟรี | 1 | เฉพาะ Layer 1 |
| 2 | 9,999 USD | 3 USD | 3 | ตั้งใน admin |
| 3 | 99,999 USD | 9 USD | 5 | ตั้งใน admin ; รวม Look & Feel |
| 4 | ไม่จำกัด | 20 USD | ไม่จำกัด | ตั้งใน admin ; รวม Look & Feel |

กติกา (ยืนยันแล้ว)
- ทุนรวม = ผลรวมทุนปัจจุบันของทุกสินทรัพย์ที่ผู้ใช้บันทึก (หลังเพิ่ม/ลด/ย้ายทุน)
- เกินเพดาน: แสดงเตือนอัพเกรด + ล็อกเฉพาะ "เพิ่มไม้ใหม่/เพิ่มทุน" ; ยังดู ขาย ส่งออกข้อมูลเดิมได้
- Downgrade: ข้อมูลไม่หาย ; สินทรัพย์เกินโควตาเป็นอ่านอย่างเดียว ให้ผู้ใช้เลือกคงไว้
- หมายเหตุ: ทุนเป็นค่าที่ผู้ใช้บันทึกเอง ตรวจความจริงไม่ได้ จึงเป็น "เพดานตามที่บันทึก" ไม่ใช่การยืนยันเงินจริง
- ส่งออกข้อมูลของตัวเองได้เสมอทุก Tier

Capability keys ตั้งต้น: max_assets, max_capital, layers_allowed, snowball, report, export_csv, notifications, custom_labels, themes_decor, auto_backup, multi_device_sync, sheet_price_link, modules_allowed

### 4.2 Complexity Level
| CL | เห็นอะไร |
|---|---|
| 1 | บันทึกง่ายสุด หน้าเดียว "ถึงเป้าหรือยัง" ภาษาธรรมดา ไม่มี ATH/Layer |
| 2 | + ประวัติ + ยอดรวม |
| 3 | + 2 Layer + ตั้งค่าพื้นฐาน |
| 4 | + Snowball + ปรับทุน + รายงาน |
| 5 | ทุกฟีเจอร์ + พารามิเตอร์ขั้นสูง + stress test |
CL ซ่อน/แสดงการ์ด ไม่ลบข้อมูล (data-cl) ; "ซ่อนตาม CL" ต่างจาก "ล็อกตาม Tier"

### 4.3 Persona
- เด็ก 13-15: CL1, ธีมสดใส, ปุ่มใหญ่, เป้าหมายการออม/ความคืบหน้า, ตัดศัพท์ ATH/Layer/Snowball, ต้องผู้ปกครองอนุมัติ
- ผู้สูงอายุ 60-80: CL1, ธีม minimal คอนทราสต์สูง, ฟอนต์ >= 16pt ปรับได้ถึง 200%, พื้นที่กด >= 44x44pt, เมนูตำแหน่งคงที่, ไม่พึ่งสีอย่างเดียว (เพิ่ม ▲▼ + ข้อความ กำไร/ขาดทุน)
- ทั่วไป: CL3 ; ขั้นสูง: CL5
เก็บ birth_year (ไม่เก็บวันเกิดเต็ม) ใช้แนะนำค่าเริ่มต้นเท่านั้น

---

## 5. โมเดลข้อมูล (ร่าง)
เซิร์ฟเวอร์ (PostgreSQL)
- users(id, email, locale, country, birth_year, persona, cl_default, guardian_user_id, created_at)
- guardians_consents(id, minor_user_id, guardian_user_id, status, consented_at)
- plans(id, code, price_usd_month, price_usd_year, active) ; plan_limits(plan_id, capability, value_json)
- subscriptions(id, user_id, plan_id, kind[tier|look_feel], status, current_period_end, grace_until, provider, provider_ref)
- entitlement_overrides(user_id, capability, value_json, reason)
- asset_categories(id, code, name_i18n) ; assets(id, category_id, kind, code, name_i18n, currency, unit, decimals, min_step, price_mode, active)
- asset_reference(asset_id, suggested_ath, ath_source, ath_as_of, version)
- themes(id, code, tokens_json, accessibility_flag, tier_required, pack_id, valid_from, valid_to) ; user_themes(user_id, theme_id, source) ; user_theme_prefs(user_id, prefs_json)
- label_registry(key, default_i18n, editable, variables, locked) ; country_rules(country, min_age, guardian_required, languages, currencies, notes)
- audit_log(id, user_id, action, at, meta) ; modules(id, code, version, manifest_json, enabled)
ไคลเอนต์ (IndexedDB)
- user_assets, lots, cap_log, loan_entries/counterparties (เฟส 3), user_labels, snapshots, entitlement_token, offline_queue, meta(schema_version, last_backup_at)
เก็บธุรกรรมแบบ append-only เพื่อรองรับซิงก์ในอนาคต

---

## 6. ระบบโมดูล
modular monolith: โค้ดเดียว deploy เดียว ขอบเขตโมดูลชัด สื่อสารผ่าน interface
Core API ให้โมดูล: getState(), registerCard(), registerSetting(), registerRoute(), can(capability), t(key, vars), storage
manifest ตัวอย่าง
```
{ "id": "stress-test", "version": "1.0.0", "coreApi": ">=1.0 <2.0",
  "name_i18n": {"th": "จำลองราคาตก", "en": "Price drop simulator"},
  "capabilities": ["stress_test"], "minCL": 5,
  "extensionPoints": ["card:home", "route:/stress"], "storage": "own-namespace" }
```
โมดูลตั้งต้น: core-journal, grid-engine, assets-market, assets-manual, assets-loan(เฟส 3), report, themes, notifications, backup, price-sheet-link, stress-test, persona-kids, persona-seniors
ไม่เปิดให้บุคคลที่สามเขียนโมดูลในเวอร์ชันแรก (ถ้าเปิดภายหลัง ต้อง iframe sandbox)

---

## 7. สินทรัพย์ ราคา ATH
ชนิด (asset.kind): market / manual / loan / savings
asset_config: สกุลเงิน, หน่วย, ทศนิยม, ขั้นต่ำ, โหมดราคา (Bid/Ask หรือราคาเดียว)
Price Provider เฟสแรก 3 โหมด: manual (สูงสุด) > sheet_csv > suggested
- ไม่มี Google Finance API ทางการ ; GOOGLEFINANCE ใช้ได้ในชีตเท่านั้น ; ข้อมูลย้อนหลังดึงออกนอกชีตผ่าน API ไม่ได้ ต้องทดสอบจริงว่าเซลล์ MAX อ่านออกมาผ่าน publish CSV ได้หรือไม่ก่อนพึ่งพา
- ข้อมูลหน่วงได้ราว 20 นาที ; ชีตไม่รีเฟรชเองถ้าไม่มี trigger ; OAuth Sheets API เป็น sensitive scope จึงเลื่อนเป็นเฟสหลัง
กติกา ATH: ถามก่อนเปลี่ยน (ยกเว้นผู้ใช้เลือกอัตโนมัติ) ; sanity check เตือนเมื่อต่างเกิน 20% ปฏิเสธ 0/#N/A/ว่าง ; ไม่เขียนทับเมื่ออ่านไม่ได้ ; แสดงแหล่งที่มา/เวลา/สถานะข้อมูลเก่า ; เก็บประวัติ ย้อนกลับได้ ; โหมด ATH: อัตโนมัติ(MAX) / กำหนดเอง / หน้าต่าง N ปี
ผู้ให้บริการข้อมูลภายนอก = โมดูลเฟสหลัง ต้องตรวจสิทธิ์เผยแพร่ต่อก่อน

## 8. loan (เฟส 3)
counterparties(nickname), loan_entries(lend|repay_principal|repay_interest) ; สถานะ: เงินต้นค้าง, ดอกเบี้ยรับ, ทุนว่างจริง, ครบกำหนด ; ตัวอย่าง: ทุน 100 ให้ A ยืม 50 B ยืม 50 A คืน 55 => ดอกเบี้ย 5 ; เก็บช่วงเวลาเพื่อคำนวณอัตราต่อปี ; ใช้ชื่อเล่น เก็บข้อมูลบุคคลที่สามน้อยที่สุด ; เป็นสมุดบันทึกส่วนตัว ไม่ส่งข้อความทวงหนี้แทนผู้ใช้

---

## 9. i18n / ประเทศ / สกุลเงิน
- ข้อความ UI เป็น key เรียก t(key, vars) ; ไฟล์แยกตามฟีเจอร์ ; fallback อังกฤษ ; แสดงภาษาที่ยังไม่แปลเป็นอังกฤษ ไม่แสดงคีย์ดิบ
- ใช้ Intl API (ตัวเลข/วันที่/สกุลเงิน) แทน toLocaleString('th-TH') และ dshow() ตายตัว
- ภาษาเริ่มต้น: ภาษาเบราว์เซอร์ > ที่ผู้ใช้เลือก > IP สำรอง ; ผู้ใช้ตั้งอิสระ: ภาษา / ประเทศ-ภูมิภาค / สกุลเงินแสดงผล
- RTL: CSS logical properties + dir="rtl" ; ไล่แก้ text-align:left / border-left ใน index.html
- disclaimer ล็อก แปลโดยผู้เชี่ยวชาญ ; country_rules เปิดทีละประเทศ
### 9.1 Custom labels
ชั้นความสำคัญ: user_labels > ภาษา > default ; ตัวแปรที่อนุญาต {n} {layer} {price} ; ยาวไม่เกิน ~80 ตัวอักษร ; แสดงด้วย textContent/esc() ห้าม innerHTML ; label_registry กำหนด editable/locked ; capability custom_labels ผูก Tier ; default เป็นกลาง

---

## 10. ที่เก็บข้อมูล สำรอง ซิงก์
- IndexedDB + navigator.storage.persist() ; Storage Adapter เดียวทุกโมดูล
- Google Drive appDataFolder (scope drive.appdata, non-sensitive, โฟลเดอร์ซ่อน) ; OneDrive Apps/{แอป} ผ่าน Files.ReadWrite.AppFolder (บัญชีส่วนตัว ผู้ใช้เห็นไฟล์ได้)
- เข้ารหัสในเครื่องก่อนอัปโหลด (AES-GCM, Web Crypto) ด้วยรหัสผ่านผู้ใช้ + รหัสกู้คืน
- สำรองหลังเปลี่ยนแปลง (debounce) + ตอนเปิดแอป ; ไม่สัญญาว่าสำรองตอนปิดแอป ; แบนเนอร์เตือนเมื่อไม่ได้สำรองเกิน 7 วัน
- ปุ่มส่งออก/นำเข้า JSON คงไว้ (ทางสำรองสำหรับ iPhone) ; ตรวจการรองรับ File System Access ต่อเบราว์เซอร์ก่อนพึ่งพา
- ซิงก์หลายเครื่อง = เฟสหลัง (append-only events) ; ผู้ใช้เดิม: นำเข้า JSON v2 (key goldlot2l.v2) พร้อม migration

---

## 11. Offline-First Contract (ใหม่ใน v0.2)
เป้าหมาย: ถ้า VPS ล่ม แอป (เว็บ/Play Store) ใช้งานหลักต่อได้โดยไม่กระทบ

### 11.1 ต้องทำงานตอนออฟไลน์/เซิร์ฟเวอร์ล่ม
| ความสามารถ | ต้องใช้ได้? | กลไก |
|---|---|---|
| เปิดแอป ดูสถานะ | ต้อง | precache app shell + IndexedDB |
| กรอกราคา, คำนวณ grid, บันทึกซื้อ/ขาย/ปรับทุน | ต้อง | คำนวณฝั่ง client |
| รายงาน/สถิติ/ส่งออก CSV-JSON | ต้อง | ข้อมูลในเครื่อง |
| ธีมที่ผู้ใช้เลือกไว้แล้ว | ต้อง | เก็บ tokens ในเครื่อง |
| ตรวจสิทธิ์ Tier/Look & Feel | ต้อง | signed entitlement token (~30 วัน) ตรวจลายเซ็นออฟไลน์ |
| เปลี่ยนภาษาที่มีไฟล์ในเครื่อง | ต้อง | precache th/en |
| สำรองไป Drive/OneDrive | ถ้ามีเน็ต | คิวรอส่ง |
### 11.2 ใช้ไม่ได้ตอนเซิร์ฟเวอร์ล่ม (ข้อความต้องสุภาพ ไม่ตกใจ)
จ่ายเงิน/สมัคร, ล็อกอินครั้งแรก, ดาวน์โหลดธีม/ATH แนะนำ/ภาษาใหม่, อัปเดตแอป, ต่ออายุ token
ข้อความตัวอย่าง: "ใช้งานต่อได้ตามปกติ ระบบจะอัปเดตเมื่อกลับมาออนไลน์"
### 11.3 กติกาทางเทคนิค
- Service worker: precache เฉพาะสิ่งจำเป็น ครบทุกไฟล์ที่ต้องใช้ (รวม _logic.js ถ้ายังใช้) ; แยกรายการ critical/optional ไม่ให้ addAll ล้มทั้งชุด ; fetch แบบ network-first + fallback cache (ตามเดิม) ; หน้า fallback ออฟไลน์เสมอ
- ครั้งแรกที่เปิดผ่าน TWA service worker ยังไม่ลงทะเบียน: ต้องมีหน้าจอออฟไลน์ฝั่งเนทีฟ (ข้อ 12.3) ไม่ปล่อยให้เห็นหน้า error ของเบราว์เซอร์
- Entitlement token: อายุ ~30 วัน + grace ตอนเซิร์ฟเวอร์ล่ม ; ต่ออายุเงียบๆ เมื่อออนไลน์ ; หมดอายุจริง = ลดเป็นสิทธิ์ฟรีแบบอ่าน/ส่งออกได้ (ไม่ล็อกข้อมูล)
- Offline queue: การกระทำที่ต้องคุยเซิร์ฟเวอร์เข้าคิว ส่งซ้ำเมื่อออนไลน์ แบบ idempotent
- ไม่ให้ UI รอ API ก่อนเรนเดอร์ ; ใช้ stale-while-revalidate สำหรับ config/ข้อมูลอ้างอิง
- start_url ต้องตอบ 200 ตอนออฟไลน์ (ผ่านเกณฑ์ Lighthouse)
### 11.4 เช็กลิสต์ทดสอบ (ทำก่อนปล่อยทุกเวอร์ชัน)
- [ ] ติดตั้งใหม่ -> ปิดเน็ต -> เปิดแอป ผ่าน (ทั้ง PWA และแอป Play) 
- [ ] ติดตั้งใหม่แบบไม่มีเน็ตเลยตั้งแต่ครั้งแรก -> เห็นหน้าออฟไลน์ของเรา
- [ ] หยุด VPS (docker stop) -> บันทึกซื้อ/ขาด/ปรับทุน ได้ ผลคำนวณถูก
- [ ] token หมดอายุระหว่างเซิร์ฟเวอร์ล่ม -> เข้า grace ไม่ล็อกข้อมูล
- [ ] กลับมาออนไลน์ -> คิวส่งครบ ไม่ซ้ำ ไม่หาย
- [ ] เปลี่ยนเวอร์ชันแอปตอนออฟไลน์ -> ไม่ใช้ไฟล์ผสมเวอร์ชัน
- [ ] ทดสอบบน iPhone จริงและ Android จริง

---

## 12. การเรียกเก็บเงินและการเผยแพร่
### 12.1 Stripe Billing
- ขายผ่านเว็บ ; บัตรตัดอัตโนมัติ ; PromptPay ไม่ตัดซ้ำอัตโนมัติ ต้องเตือน 7 วัน/1 วัน
- webhook (ตรวจลายเซ็น + idempotent) อัปเดต subscriptions ; Smart Retries ; invoice.payment_failed -> แจ้งผู้ใช้
- grace period 7-14 วัน (ใช้งานปกติ + เตือนอ่านง่าย) แล้วลดเป็นสิทธิ์ฟรีแบบอ่าน/ส่งออกได้
### 12.2 Look & Feel Pass
- $0.99/เดือน (เสนอ $9.99/ปี) ครอบคลุม: ธีมตกแต่ง, ธีมเทศกาล, ปรับสี/ไอคอน, custom labels (หรือผูกกับ Tier ตามที่ admin ตั้ง) ; รวมฟรีใน Tier 3-4
- ธีมเข้าถึงง่าย (คอนทราสต์สูง/ฟอนต์ใหญ่/ปุ่มใหญ่/Basic) ฟรีเสมอ ไม่ขาย
- ยกเลิก/หมดอายุ: กลับธีม Basic ; เก็บค่าที่ผู้ใช้เลือกไว้ (ไม่ลบ) กลับมาสมัครได้หน้าตาเดิม ; ไม่กระทบข้อมูลการเงิน
- ลดอัตราเลิก: รายปี, ธีมเทศกาลใหม่สม่ำเสมอ, แพ็กซื้อขาดเป็นทางเลือก, ลองใช้ธีมเทศกาลสั้นๆ
- ยอดเล็ก: ค่าธรรมเนียมคงที่ต่อรายการกินสัดส่วนสูง -> คำนวณรายได้สุทธิก่อนเปิดขาย (ยังไม่ได้ตรวจอัตรา Stripe ไทย)
- บัญชีเด็ก: ผู้ปกครองจ่าย + สวิตช์ปิดการซื้อ
### 12.3 ช่องทางเผยแพร่
- PWA ก่อน -> Android ผ่าน TWA (Bubblewrap/PWABuilder) + หน้าจอออฟไลน์เนทีฟ + ปุ่มลองใหม่ + ไม่ขึ้นหน้าขาวเมื่อเน็ตหลุด + assetlinks.json -> iOS ภายหลังเมื่อคุ้ม
- ตรวจนโยบายสโตร์ล่าสุดก่อนส่ง (การจ่ายเงินในแอป, Data safety, เงื่อนไขทดสอบบัญชีนักพัฒนาใหม่) ; ถ้าขายสมาชิกในแอปบนสโตร์ ตรวจกฎการจ่ายเงินของสโตร์เพราะอาจกระทบราคา
- เกณฑ์ที่ควรผ่าน: ติดตั้ง PWA ได้, Lighthouse performance >= 80 (แนวทางที่พบบ่อย), start_url ตอบ 200 ออฟไลน์
- Capacitor (ฝังไฟล์เว็บในแอป) พิจารณาภายหลังหากต้องการรับประกันเปิดแอปเสมอ/ฟีเจอร์เนทีฟ/AdMob
- ไม่ติดโฆษณาเวอร์ชันแรก ; รายได้เสริม: รายปี, ทดลองใช้, lifetime จำกัดเวลา, แพ็กธีมซื้อขาด ; ไม่ใช้ affiliate โบรกเกอร์

---

## 13. หน้า Admin
plans/limits/ราคา/capability ต่อ Tier ; ผู้ใช้, entitlement_overrides, audit log ; assets/categories/asset_reference/country_rules ; themes (tokens, ช่วงเทศกาล, แพ็ก, accessibility_flag) ; label_registry และไฟล์ภาษา ; เปิด/ปิดโมดูล, feature flag, staged rollout ; บทบาท owner/support/content + MFA ; ข้อความ locked แก้ได้เฉพาะ owner และมีประวัติ

## 14. ความปลอดภัย ความเป็นส่วนตัว กฎหมาย (ให้ผู้เชี่ยวชาญตรวจ)
ความปลอดภัย: esc() แก้ XSS (เช่น e.note) + ตรวจไฟล์นำเข้า ; CSP ; rate limit ; hash รหัสผ่านที่เหมาะสม ; MFA admin ; audit log ; สำรอง Postgres + ซ้อมกู้คืนทุกไตรมาส ; ไม่เก็บ secrets ใน repo
ความเป็นส่วนตัว: เก็บน้อยที่สุด ; นโยบายความเป็นส่วนตัว ; ลบ/ส่งออกตามคำขอ ; ข้อมูลบุคคลที่สามใช้ชื่อเล่น
ผู้เยาว์ (PDPA ไทย): ผู้เยาว์ต่ำกว่า 20 ปี ; ต่ำกว่า 10 ปีต้องผู้ปกครองยินยอม ; 10-20 ปีโดยทั่วไปต้องทั้งสองฝ่ายยกเว้นกรณีที่ผู้เยาว์ทำเองได้ตามกฎหมาย ; ใช้บัญชีผูกผู้ปกครอง ; ต่างประเทศใช้ country_rules
กฎหมายการเงิน: ถ้อยคำเป็นกลาง + disclaimer ล็อก ; ไม่เชื่อมบัญชี/ไม่ส่งคำสั่งซื้อขาย ; ปรึกษาผู้เชี่ยวชาญตลาดทุน/ก.ล.ต. ก่อนเก็บเงิน (แนบภาพหน้าจอ+คำอธิบายฟีเจอร์)

---

## 15. โฮสต์ แผนขยาย และงบ
### 15.1 ค่าเริ่มต้น: VPS เล็กเครื่องเดียว (ยืนยันแล้ว)
เหตุผล: local-first ทำให้ DB เล็กและโหลดต่ำ ; offline-first ทำให้ downtime สั้นๆ ไม่กระทบการใช้งานหลัก (กระทบแค่จ่ายเงิน/ต่ออายุ/อัปเดต)
เงื่อนไขบังคับก่อนเปิดเก็บเงิน
1. pg_dump อัตโนมัติ + เก็บ *นอกเครื่อง* เสมอ (ไม่เก็บในเครื่องเดียวกัน)
2. ซ้อมกู้คืนจริงอย่างน้อยทุกไตรมาส (บันทึกผลและเวลาที่ใช้)
3. Cloudflare ด้านหน้า (WAF/DDoS/rate limit)
4. Docker Compose (Express + Postgres) ย้ายเครื่องได้
5. แจ้งเตือนเมื่อระบบล่ม (uptime monitor)
6. Stripe webhook ปลอดภัยและ idempotent
7. อัปเดตความปลอดภัย OS/แพ็กเกจตามรอบ
### 15.2 เกณฑ์ย้ายไป managed Postgres
- ซ้อมกู้คืนล้มเหลว/ใช้เวลานานเกินที่รับได้ หรือไม่ได้ซ้อมตามรอบ
- เวลาดูแลต่อเดือนมีมูลค่ามากกว่าส่วนต่างราคา
- มีผู้ใช้จ่ายเงินจำนวนมากพอที่ downtime ของ DB ไม่ยอมรับได้
- connection พร้อมกันเกินราว 100 (พิจารณา PgBouncer ก่อน)
### 15.3 ขั้นการขยาย (กรอบประเมิน)
| ช่วงผู้ใช้ | สถาปัตยกรรม | งบ/เดือน (ประมาณ) |
|---|---|---|
| หลักร้อย | Express + Postgres 1 เครื่อง + static CDN | ~0-25 USD |
| พัน-หมื่น | + pooling, แคช, worker แยก | ~25-100 USD |
| แสน | หลาย instance + LB, Redis, read replica, queue, monitoring | ~100 USD ขึ้นไป |
เพดานงบเริ่มต้นที่เสนอ: ~10-30 USD/เดือน จนกว่าผู้ใช้จะถึงหลักหลายพัน (ทบทวนทุกไตรมาส)
จุดคุ้มทุน = ต้นทุนคงที่ต่อเดือน / รายได้สุทธิเฉลี่ยต่อผู้จ่ายเงิน (ตัวอย่างสมมติ: 25 / 2.5 = 10 คน)
วิธีประหยัด: คำนวณฝั่ง client ; ธุรกรรมอยู่ในเครื่อง ; static/ภาษา/ธีมผ่าน CDN ; Cloudflare ฟรี ; งานหนักเข้าคิว ; ผู้ให้บริการเดียว ; load test ก่อนเปิด
ไม่รวม: ค่าธรรมเนียม Stripe, ค่าแปล, กฎหมาย/บัญชี, ค่าข้อมูลราคา, WhatsApp (ต่อข้อความ)
Monitoring: error log + uptime + สถิติการชนเพดาน Tier (ใช้ปรับแพ็กเกจ)

---

## 16. การอัปเดตอัตโนมัติ
- ตัวแอป: ตรวจเวอร์ชันตอนเปิดแอป ติดตั้งแล้วรีโหลดตอนเปิดครั้งถัดไป หรือตอนแอปว่างและไม่มีฟอร์มค้าง (ไม่รีโหลดกลางการกรอก) ; ห้ามใช้ไฟล์ผสมเวอร์ชัน
- ธีมเทศกาล: เป็นข้อมูล (tokens + valid_from/to) ดึงตอนเปิดแอป ผู้ใช้เลือกสลับอัตโนมัติหรือไม่ (ต้องมี Look & Feel Pass)
- ATH/ข้อมูลอ้างอิง: stale-while-revalidate + การ์ด "ยอมรับ" ; โหมดยอมรับอัตโนมัติเฉพาะที่ผู้ใช้/ผู้ปกครองเลือก + sanity check + ย้อนกลับได้
- Subscription: Stripe ทำงานฝั่งเซิร์ฟเวอร์เอง
- Periodic Background Sync ไม่รองรับ Safari/Firefox และเบราว์เซอร์กำหนดเวลาเอง จึงไม่พึ่งเป็นกลไกหลัก
- ความปลอดภัย: staged rollout 5% -> 25% -> 100% ; สำรองก่อน migration ; เก็บเวอร์ชันก่อนหน้า ; ทดสอบ iPhone จริง

---

## 17. แผนเฟส (branch แยกต่อเฟส, สำรองก่อนแก้, เปลี่ยนทีละอย่าง)
### เฟส 0 แก้ฐานเดิม (ผลคำนวณต้องเท่าเดิม)
- [ ] รีวิว _logic.js และส่วนท้าย index.html ที่ยังไม่ได้อ่าน
- [ ] esc() แก้ XSS + ตรวจไฟล์นำเข้า
- [ ] storage.persist() + แบนเนอร์เตือนสำรอง > 7 วัน
- [ ] รวมตรรกะ analyze ให้เหลือที่เดียว ; แยก tpPrice ออกจากข้อมูลไม้
- [ ] ปรับถ้อยคำเป็นกลาง + disclaimer ถาวร
- [ ] sw.js: แยก critical/optional precache, ไฟล์ครบ, หน้า fallback ออฟไลน์
### เฟส 1 โครงภายใน (ยังไม่มี backend)
- [ ] localStorage -> IndexedDB + migration + Storage Adapter
- [ ] i18n (th/en) + Intl + CSS logical properties
- [ ] โมเดล asset/หมวด + asset_config (หลายสินทรัพย์ในเครื่อง)
- [ ] ตัวโหลดโมดูล + manifest ; ย้ายรายงาน/ทุนเป็นโมดูล
- [ ] CL + Persona + ระบบธีม (CSS variables ; Basic + ธีมเข้าถึงง่ายฟรี)
- [ ] custom labels (เก็บในเครื่อง)
- [ ] Price provider: manual + suggested (ไฟล์ static) + เท็มเพลตชีต CSV (ทดสอบ MAX ผ่าน publish CSV)
- [ ] stress test (โมดูล)
- [ ] ผ่านเช็กลิสต์ข้อ 11.4 (ส่วนที่ไม่ต้องใช้ backend)
### เฟส 2 Backend และสมาชิก
- [ ] VPS + Docker Compose + Cloudflare + สำรองนอกเครื่อง + ซ้อมกู้คืน + uptime monitor
- [ ] Express + Postgres: users, plans, plan_limits, subscriptions
- [ ] entitlement resolver + signed token ออฟไลน์ + grace
- [ ] หน้า Admin
- [ ] Stripe Billing (โหมดทดสอบก่อน) + webhook + เตือนต่ออายุ ; Look & Feel Pass
- [ ] บัญชีผู้ปกครอง-ผู้เยาว์ (หลังผู้เชี่ยวชาญตรวจ)
- [ ] สำรองอัตโนมัติ Google Drive (appData) + เข้ารหัส ; OneDrive ถัดไป
- [ ] อัปเดตอัตโนมัติ + ธีมเทศกาลแบบข้อมูล + ATH แนะนำแบบการ์ด
- [ ] ผ่านเช็กลิสต์ข้อ 11.4 ครบ (รวมหยุด VPS)
### เฟส 3 ขยาย
- [ ] Play Store ผ่าน TWA + หน้าออฟไลน์เนทีฟ + assetlinks + Data safety ; ทดสอบกลุ่มปิดตามเงื่อนไขสโตร์
- [ ] loan / savings kinds
- [ ] WhatsApp แจ้งเตือน (opt-in, template, ตาม Tier)
- [ ] ขยายภาษา/ประเทศตาม country_rules
- [ ] Sheets OAuth / provider ราคาภายนอก (โมดูล)
### เฟส 4 ระยะยาว
ซิงก์หลายอุปกรณ์ ; iOS สโตร์ ; ระดับสถาบัน ; marketplace โมดูล (ต้อง sandbox)

---

## 18. ความเสี่ยง
| ความเสี่ยง | ผลกระทบ | วิธีลด |
|---|---|---|
| ข้อมูลหายในเครื่อง | สูง | persist(), สำรองอัตโนมัติเข้ารหัส, เตือน, ส่งออกง่าย |
| ถูกตีความเป็นคำแนะนำลงทุน | สูง | ถ้อยคำเป็นกลาง, disclaimer ล็อก, ปรึกษากฎหมายก่อนเก็บเงิน |
| ผู้เยาว์/PDPA | สูง | บัญชีผูกผู้ปกครอง, เก็บน้อย, ตรวจกฎหมาย |
| VPS ล่ม/ข้อมูลบัญชีหาย | สูง | สำรองนอกเครื่อง + ซ้อมกู้คืน + offline-first + เกณฑ์ย้าย managed |
| Play Store ปฏิเสธ wrapper บาง | กลาง | หน้าออฟไลน์เนทีฟ, UX ครบ, อ่านนโยบายล่าสุด, ทดสอบกลุ่มปิด |
| แหล่ง ATH ใช้ไม่ได้/ผิด | กลาง | หลายโหมด, sanity check, ถามก่อน, ย้อนกลับได้ |
| อัปเดตแอปทำพัง | กลาง | staged rollout, migration+สำรอง, ย้อนเวอร์ชัน |
| ลืมรหัสสำรอง | กลาง | แจ้งชัด + รหัสกู้คืน + ส่งออกไฟล์ธรรมดา |
| Look & Feel อัตราเลิกสูง/ค่าธรรมเนียมกินรายได้ | กลาง | รายปี, ธีมใหม่สม่ำเสมอ, ซื้อขาด, รวมใน Tier 3-4, คำนวณรายได้สุทธิ |
| ฟีเจอร์สะสมเกิน scope | กลาง | ทำตามเฟส ปล่อยกลุ่มเล็ก |

## 19. คำถามเปิดที่เหลือ
1. เป้าตลาดแรก (ไทยก่อน?) และลำดับประเทศ/ภาษา
2. ผู้ตรวจกฎหมาย (ตลาดทุน, PDPA, ผู้เยาว์) และกำหนดเวลาก่อนเปิดเก็บเงิน
3. แหล่ง ATH แนะนำ: ใครดูแลข้อมูล แหล่งใดเผยแพร่ซ้ำได้
4. ผลทดสอบจริง: อ่านเซลล์ MAX จากชีต GOOGLEFINANCE ผ่าน publish CSV ได้หรือไม่
5. การรองรับ PWA push/File System Access บน iPhone รุ่นเป้าหมาย
6. ราคารายปีของ Look & Feel ($9.99?) และขอบเขตว่า custom labels อยู่ใน Look & Feel หรือผูกกับ Tier
7. เป้าจำนวนผู้ใช้ 6-12 เดือน เพื่อยืนยันเพดานงบเริ่มต้น
8. ผู้ให้บริการ VPS/ที่เก็บสำรองนอกเครื่อง

## 20. ภาคผนวก
### 20.1 จับคู่คำเดิม -> คำกลาง
| เดิม | แนะนำ (key) |
|---|---|
| ขาย {n} ไม้ | ไม้ที่ถึงเป้ากำไรที่คุณตั้งไว้: {n} ไม้ (today.sell_ready) |
| ซื้อ: Layer {l} จำนวน {n} ไม้ | ถึงระดับราคาที่คุณกำหนดใน Layer {l}: {n} ไม้ (today.buy_ready) |
| ไม่ต้องทำอะไร ปิดแอปได้เลย | ยังไม่มีรายการที่ถึงเงื่อนไข (today.idle) |
| 2) วันนี้ทำอะไร | สถานะตามกฎของคุณ (today.title) |
| ขายเสร็จแล้ว บันทึก | บันทึกรายการขาย (sell.save) |
| ซื้อเสร็จแล้ว บันทึก | บันทึกรายการซื้อ (buy.save) |
### 20.2 ข้อจำกัดของการรีวิวเดิม
- ไม่ได้อ่าน _logic.js (ดึงไฟล์ไม่สำเร็จ) และอ่าน index.html ไม่ครบ (ถูกตัดท้าย) ควรรีวิวก่อนเฟส 0
- sw.js ปัจจุบันเป็น network-first (cache goldlot-v5) ; precache ยังไม่มี _logic.js ; cache.addAll ล้มทั้งชุดถ้ามีไฟล์หาย
